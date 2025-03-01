const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Movie title is required"],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, "Release year is required"],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: 0,
    max: 10,
  },
  rank: {
    type: Number,
    required: [true, "Rank is required"],
    unique: true,
  },
  plot: {
    type: String,
    required: [true, "Plot summary is required"],
  },
  director: {
    type: String,
    required: [true, "Director name is required"],
  },
  stars: [
    {
      type: String,
      required: [true, "At least one star is required"],
    },
  ],
  genre: [
    {
      type: String,
      required: [true, "At least one genre is required"],
    },
  ],
  imageUrl: {
    type: String,
    required: [true, "Movie poster URL is required"],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
movieSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Movie", movieSchema);
