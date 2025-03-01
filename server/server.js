require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

// Import routes
const movieRoutes = require("./routes/movieRoutes");
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

// Import models
require("./models/Movie");
require("./models/User");

const app = express();

// CORS configuration - MUST be before other middleware
const allowedOrigins = [
  "https://retro-ebon.vercel.app",
  "https://retro.vercel.app",
  "https://retro-bi0zcrnlx-ne3mers-projects.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://retro-64h4.onrender.com",
];

// Configure CORS first, before any routes or other middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
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
      "Cookie",
    ],
    exposedHeaders: ["set-cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Handle OPTIONS requests explicitly
app.options("*", cors());

// Other middleware
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("[MongoDB] Connected successfully"))
  .catch((err) => console.error("[MongoDB] Connection error:", err));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Origin:", req.headers.origin);
  console.log("Headers:", JSON.stringify(req.headers));
  next();
});

// Cookie settings middleware
app.use((req, res, next) => {
  res.cookie = res.cookie.bind(res);
  const originalCookie = res.cookie;
  res.cookie = function (name, value, options = {}) {
    return originalCookie.call(this, name, value, {
      ...options,
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });
  };
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({
    status: "online",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      auth: {
        base: "/auth",
        routes: ["/signup", "/login", "/logout", "/me"],
      },
      movies: {
        base: "/api/movies",
        routes: ["/top-rated", "/:id"],
      },
      blog: {
        base: "/api/blog",
        routes: ["/posts", "/posts/:id"],
      },
    },
  });
});

app.use("/api/movies", movieRoutes);
app.use("/api/blog", blogRoutes);
app.use("/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    environment: process.env.NODE_ENV,
    port: process.env.PORT || 5001,
    mongoConnection: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString(),
    corsConfig: {
      allowedOrigins,
    },
  });
});

// CORS error handler
app.use((err, req, res, next) => {
  if (err.message.includes("CORS")) {
    console.error("CORS Error:", {
      origin: req.headers.origin,
      method: req.method,
      path: req.path,
      headers: req.headers,
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
  console.log(`[CORS] Allowed origins: ${allowedOrigins.join(", ")}`);
});
