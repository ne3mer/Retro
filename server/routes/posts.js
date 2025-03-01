const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// Create a new post
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, tags, category, media } = req.body;

    const post = new Post({
      title,
      content,
      tags: tags || [],
      category,
      media: media || [],
      author: req.user.userId,
    });

    await post.save();

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "-password"
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("[Posts] Error creating post:", error);
    res.status(500).json({ message: "Error creating post" });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, search } = req.query;

    const query = {};
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("author", "-password");

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("[Posts] Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Get user's posts
router.get("/user", auth, async (req, res) => {
  try {
    console.log("[Posts] Fetching posts for user:", req.user.userId);

    const posts = await Post.find({ author: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("author", "-password");

    res.json(posts);
  } catch (error) {
    console.error("[Posts] Error fetching user posts:", error);
    res.status(500).json({ message: "Error fetching user posts" });
  }
});

// Get a single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "-password"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("[Posts] Error fetching post:", error);
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Update a post
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content, tags, category, media } = req.body;

    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user.userId,
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;
    post.category = category || post.category;
    post.media = media || post.media;
    post.updatedAt = Date.now();

    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      "author",
      "-password"
    );

    res.json(updatedPost);
  } catch (error) {
    console.error("[Posts] Error updating post:", error);
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user.userId,
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("[Posts] Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post" });
  }
});

module.exports = router;
