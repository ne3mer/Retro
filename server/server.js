require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

// Import routes
const movieRoutes = require("./routes/movies");
const blogRoutes = require("./routes/blog");
const postsRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("[MongoDB] Connected successfully"))
  .catch((err) => console.error("[MongoDB] Connection error:", err));

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://retroterminal-ai.vercel.app"
      : "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  console.log(`[HEADERS] ${JSON.stringify(req.headers)}`);
  console.log(`[ENV] NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`[ENV] PORT: ${process.env.PORT}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[RESPONSE] ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`
    );
  });

  next();
});

// Health check route
app.get("/health", (req, res) => {
  console.log("[HEALTH] Health check requested");
  res.json({
    status: "healthy",
    environment: process.env.NODE_ENV,
    port: process.env.PORT || 5001,
    mongoConnection: mongoose.connection.readyState === 1,
  });
});

// Root route for API verification
app.get("/", (req, res) => {
  console.log("[ROOT] Serving root endpoint");
  res.json({
    message: "RetroTerminal API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    mongodb_status:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    routes: {
      health: "/health",
      blog: "/api/blog/posts",
      movies: "/api/movies",
      posts: "/api/posts",
    },
  });
});

// Routes
console.log("[SETUP] Registering /api/blog routes");
app.use("/api/blog", blogRoutes);
console.log("[SETUP] Registering /api/movies routes");
app.use("/api/movies", movieRoutes);
console.log("[SETUP] Registering /api/posts routes");
app.use("/api/posts", postsRoutes);
console.log("[SETUP] Registering /api/auth routes");
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    message: "Route not found",
    path: req.url,
    method: req.method,
    availableRoutes: {
      root: "/",
      health: "/health",
      blog: "/api/blog/*",
      movies: "/api/movies/*",
      posts: "/api/posts/*",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
    path: req.url,
    method: req.method,
  });
});

// Use the PORT provided by Render or fall back to 5001
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`[SERVER] Server is running on port ${PORT}`);
  console.log(
    `[SERVER] Server address: ${server.address().address}:${
      server.address().port
    }`
  );
  console.log("[SERVER] Available routes:");
  console.log("[SERVER] - GET /");
  console.log("[SERVER] - GET /health");
  console.log("[SERVER] - GET /api/blog/posts");
  console.log("[SERVER] - GET /api/movies");
  console.log("[SERVER] - GET /api/posts");
});
