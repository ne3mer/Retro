require("dotenv").config();
const mongoose = require("mongoose");
const Post = require("../models/Post");
const Movie = require("../models/Movie");

// Sample blog posts
const samplePosts = [
  {
    title: "WELCOME TO RETROTERMINAL",
    content:
      "INITIALIZING RETROTERMINAL BLOG SYSTEM...\n\nWELCOME TO THE RETROTERMINAL BLOG. THIS SPACE WILL BE USED TO SHARE UPDATES, THOUGHTS, AND INTERESTING DISCOVERIES IN A CLASSIC TERMINAL STYLE.\n\nSTAY TUNED FOR MORE UPDATES.",
    tags: ["WELCOME", "SYSTEM", "INTRO"],
  },
  {
    title: "SYSTEM CAPABILITIES",
    content:
      "ANALYZING SYSTEM CAPABILITIES...\n\nRETROTERMINAL FEATURES:\n- BLOG POSTING\n- TAG CATEGORIZATION\n- MOVIE DATABASE\n- RETRO STYLING\n\nALL SYSTEMS OPERATIONAL.",
    tags: ["SYSTEM", "FEATURES", "TECH"],
  },
];

// Sample movies (Top 5 from IMDB)
const sampleMovies = [
  {
    title: "The Shawshank Redemption",
    year: 1994,
    rating: 9.3,
    rank: 1,
    plot: "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.",
    director: "Frank Darabont",
    stars: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    genre: ["Drama"],
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
  },
  {
    title: "The Godfather",
    year: 1972,
    rating: 9.2,
    rank: 2,
    plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    director: "Francis Ford Coppola",
    stars: ["Marlon Brando", "Al Pacino", "James Caan"],
    genre: ["Crime", "Drama"],
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
  },
  {
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    rank: 3,
    plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    director: "Christopher Nolan",
    stars: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    genre: ["Action", "Crime", "Drama"],
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
  },
];

async function migrate() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/retroterminal",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("[MIGRATION] Connected to MongoDB");

    // Clear existing data
    await Post.deleteMany({});
    await Movie.deleteMany({});
    console.log("[MIGRATION] Cleared existing data");

    // Insert sample posts
    await Post.insertMany(samplePosts);
    console.log("[MIGRATION] Sample posts created");

    // Insert sample movies
    await Movie.insertMany(sampleMovies);
    console.log("[MIGRATION] Sample movies created");

    console.log("[MIGRATION] All migrations completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("[MIGRATION ERROR]", error);
    process.exit(1);
  }
}

migrate();
