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
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[ERROR]", err);
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS not allowed" });
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
