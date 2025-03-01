const mongoose = require("mongoose");

module.exports = {
  async up() {
    const Post = mongoose.model("Post");

    // Update all posts that don't have a category
    await Post.updateMany(
      { category: { $exists: false } },
      { $set: { category: "OTHER" } }
    );

    // Update all posts that don't have media array
    await Post.updateMany(
      { media: { $exists: false } },
      { $set: { media: [] } }
    );

    // Ensure all tags are uppercase
    const posts = await Post.find({});
    for (const post of posts) {
      if (post.tags && post.tags.length > 0) {
        post.tags = post.tags.map((tag) => tag.toUpperCase());
        await post.save();
      }
    }

    console.log("Posts migration completed");
  },

  async down() {
    // This migration cannot be safely reverted as it would involve data loss
    console.log("This migration cannot be reverted");
  },
};
