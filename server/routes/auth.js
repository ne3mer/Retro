const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Sign up
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    console.log("Signup attempt:", { username, email, name });

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      name,
    });

    await user.save();
    console.log("User created:", user._id);

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("Token cookie set");
    res.status(201).json({ user: user.toPublicProfile() });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt:", { username });

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      console.log("Login failed: User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Login failed: Invalid password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Login successful:", user._id);

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("Token cookie set");
    res.json({ user: user.toPublicProfile() });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  console.log("User logged out");
  res.json({ message: "Logged out successfully" });
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    console.log("Auth check for user:", req.user.userId);

    const user = await User.findById(req.user.userId)
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
      })
      .populate("favoriteMovies")
      .select("-password");

    if (!user) {
      console.log("Auth check failed: User not found");
      return res.status(404).json({
        message: "User not found",
        error: "USER_NOT_FOUND",
      });
    }

    console.log("Auth check successful, returning user data");
    res.json({
      user: user.toPublicProfile(),
      isAuthenticated: true,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      message: "Error fetching user data",
      error: error.message,
      code: "SERVER_ERROR",
    });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json({ user: user.toPublicProfile() });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});

// Toggle favorite movie
router.post("/favorites/:movieId", auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const movieIndex = user.favoriteMovies.indexOf(movieId);
    if (movieIndex > -1) {
      user.favoriteMovies.splice(movieIndex, 1);
    } else {
      user.favoriteMovies.push(movieId);
    }

    await user.save();
    res.json({ user: user.toPublicProfile() });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error toggling favorite", error: error.message });
  }
});

module.exports = router;
