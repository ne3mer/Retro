const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Category = require("../models/Category");
const auth = require("../middleware/auth");

// Get all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Get a single post
router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username name"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Create a new post - requires authentication
router.post("/posts", auth, async (req, res) => {
  try {
    console.log("Creating post with author:", req.user.userId);

    // Create the post with the authenticated user as author
    const post = new Post({
      ...req.body,
      author: req.user.userId,
    });

    // Save the post
    const savedPost = await post.save();

    // Add the post to the user's posts array
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { posts: savedPost._id },
    });

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update a post - requires authentication and ownership
router.put("/posts/:id", auth, async (req, res) => {
  try {
    // Find the post
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    // Update the post
    Object.keys(req.body).forEach((key) => {
      if (key !== "author") {
        // Don't allow changing the author
        post[key] = req.body[key];
      }
    });

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post - requires authentication and ownership
router.delete("/posts/:id", auth, async (req, res) => {
  try {
    // Find the post
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // Delete the post
    await post.deleteOne();

    // Remove the post from the user's posts array
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { posts: req.params.id },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post" });
  }
});

// Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories.map((cat) => cat.name));
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// Get all tags
router.get("/tags", async (req, res) => {
  try {
    const posts = await Post.find({}, { tags: 1 });
    const allTags = posts.reduce((tags, post) => {
      return [...tags, ...post.tags];
    }, []);
    const uniqueTags = [...new Set(allTags)].sort();
    res.json(uniqueTags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ message: "Error fetching tags" });
  }
});

module.exports = router;
