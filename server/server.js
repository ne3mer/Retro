require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

// Import routes
const movieRoutes = require("./routes/movieRoutes");
const blogRoutes = require("./routes/blog");
const postsRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("[MongoDB] Connected successfully"))
  .catch((err) => console.error("[MongoDB] Connection error:", err));

// CORS configuration
const allowedOrigins = [
  "https://retro-ebon.vercel.app",
  "https://retro.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["set-cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Origin:", req.headers.origin);
  next();
});

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/posts", postsRoutes);
app.use("/auth", authRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    environment: process.env.NODE_ENV,
    port: process.env.PORT || 5001,
    mongoConnection: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString(),
  });
});

// Add CORS error handler before other error handlers
app.use((err, req, res, next) => {
  if (err.message.includes("CORS")) {
    console.error("CORS Error:", {
      origin: req.headers.origin,
      method: req.method,
      path: req.path,
      error: err.message,
    });
    return res.status(403).json({
      error: "CORS Error",
      message: "Origin not allowed",
      allowedOrigins,
    });
  }
  next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[ERROR]", err);
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.url,
    method: req.method,
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `[SERVER] Running on port ${PORT} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
});
