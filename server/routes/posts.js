const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Get all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all unique tags
router.get("/tags", async (req, res) => {
  try {
    const tags = await Post.distinct("tags");
    res.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new post
router.post("/posts", async (req, res) => {
  try {
    console.log("[POST CREATE] Received request body:", req.body);

    // Validate required fields
    if (!req.body.title || !req.body.title.trim()) {
      return res.status(400).json({
        message: "Post title is required",
        receivedData: req.body,
      });
    }

    if (!req.body.content || !req.body.content.trim()) {
      return res.status(400).json({
        message: "Post content is required",
        receivedData: req.body,
      });
    }

    // Create post object
    const postData = {
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      tags: Array.isArray(req.body.tags)
        ? req.body.tags.filter((tag) => tag && tag.trim())
        : [],
    };

    console.log("[POST CREATE] Processed post data:", postData);

    // Create and save the post
    const post = new Post(postData);
    console.log("[POST CREATE] Created post instance:", post);

    const savedPost = await post.save();
    console.log("[POST CREATE] Saved post successfully:", savedPost);

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("[POST CREATE] Error details:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    console.error("Validation errors:", error.errors);

    // Send appropriate error response
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        details: Object.values(error.errors).map((err) => err.message),
        receivedData: req.body,
      });
    }

    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
      receivedData: req.body,
    });
  }
});

// Update a post
router.put("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update fields
    if (req.body.title) post.title = req.body.title.trim();
    if (req.body.content) post.content = req.body.content.trim();
    if (req.body.tags) {
      post.tags = Array.isArray(req.body.tags)
        ? req.body.tags.filter((tag) => tag && tag.trim())
        : [];
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(400).json({
      message: error.message,
      details: error.errors || {},
    });
  }
});

// Delete a post
router.delete("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
