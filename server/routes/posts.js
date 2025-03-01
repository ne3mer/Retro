const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// Get user's posts
router.get("/user", auth, async (req, res) => {
  try {
    console.log("[Posts] Fetching posts for user:", req.user.userId);

    const posts = await Post.find({ author: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("author", "username");

    res.json(posts);
  } catch (error) {
    console.error("[Posts] Error fetching user posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// ... existing routes ...

module.exports = router;
