require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import routes
const movieRoutes = require("./routes/movies");
const blogRoutes = require("./routes/blog");
const postsRoutes = require("./routes/posts");

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://retro-ebon.vercel.app",
    "https://retro.vercel.app",
    "https://retroterminal.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Root route for API verification
app.get("/", (req, res) => {
  res.json({
    message: "RetroTerminal API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/blog", blogRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/posts", postsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`[SERVER] Server is running on port ${PORT}`);
});
