const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      maxLength: [200, "Title cannot be more than 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        uppercase: true,
      },
    ],
    category: {
      type: String,
      required: true,
      trim: true,
    },
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        caption: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // This will automatically handle createdAt and updatedAt
    versionKey: false, // This will remove the __v field
  }
);

// Middleware to handle tags formatting
postSchema.pre("save", function (next) {
  // Ensure tags are unique and non-empty
  if (this.tags) {
    this.tags = [...new Set(this.tags)].filter((tag) => tag.trim().length > 0);
  }
  next();
});

// Create the model
const Post = mongoose.model("Post", postSchema);

// Export the model
module.exports = Post;
