const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("../middleware/auth");
const User = require("../models/User");

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Validate TMDB API key
if (!TMDB_API_KEY) {
  console.error("[CRITICAL] TMDB_API_KEY is not set in environment variables");
  throw new Error("TMDB_API_KEY must be set in environment variables");
}

// Helper function to validate TMDB response
const validateTMDBResponse = (response, context) => {
  if (!response.data) {
    console.error(`Invalid TMDB response for ${context}:`, response);
    throw new Error("Invalid response from TMDB API");
  }
  return response.data;
};

// Get top rated movies
router.get("/top-rated", async (req, res) => {
  try {
    const page = req.query.page || 1;
    console.log("[Movies] Fetching top rated movies, page:", page);

    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      params: {
        api_key: TMDB_API_KEY,
        page,
      },
    });

    const data = validateTMDBResponse(response, "top rated movies");
    res.json(data);
  } catch (error) {
    console.error("[Movies] Error fetching top rated movies:", {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    if (error.response?.status === 404) {
      return res.status(404).json({
        message: "Movies not found",
        error: "NOT_FOUND",
      });
    }

    res.status(500).json({
      message: "Error fetching movies",
      error: error.response?.data?.status_message || "SERVER_ERROR",
    });
  }
});

// Get movie details
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("[Movies] Fetching movie details for ID:", id);

    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: "credits,videos",
      },
    });

    const data = validateTMDBResponse(response, `movie ${id}`);
    res.json(data);
  } catch (error) {
    console.error("[Movies] Error fetching movie details:", {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
      movieId: req.params.id,
    });

    if (error.response?.status === 404) {
      return res.status(404).json({
        message: "Movie not found",
        error: "NOT_FOUND",
      });
    }

    res.status(500).json({
      message: "Error fetching movie details",
      error: error.response?.data?.status_message || "SERVER_ERROR",
    });
  }
});

// Get user's favorite movies
router.get("/favorites", auth, async (req, res) => {
  try {
    console.log("[Movies] Fetching favorite movies for user:", req.user.userId);

    const user = await User.findById(req.user.userId).populate(
      "favoriteMovies"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get detailed movie info for each favorite
    const favoriteMovies = await Promise.all(
      user.favoriteMovies.map(async (movieId) => {
        try {
          const response = await axios.get(
            `${TMDB_BASE_URL}/movie/${movieId}`,
            {
              params: {
                api_key: TMDB_API_KEY,
              },
            }
          );
          return response.data;
        } catch (error) {
          console.error(`Error fetching movie ${movieId}:`, error);
          return null;
        }
      })
    );

    // Filter out any null values from failed requests
    const validMovies = favoriteMovies.filter((movie) => movie !== null);
    res.json(validMovies);
  } catch (error) {
    console.error("[Movies] Error fetching favorites:", error);
    res.status(500).json({ message: "Error fetching favorite movies" });
  }
});

// Toggle favorite movie status
router.post("/favorites/:movieId", auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    console.log(
      `[Movies] Toggling favorite status for movie ${movieId} by user ${req.user.userId}`
    );

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if movie exists in TMDB
    try {
      await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: TMDB_API_KEY,
        },
      });
    } catch (error) {
      return res.status(404).json({ message: "Movie not found in database" });
    }

    const movieIndex = user.favoriteMovies.indexOf(movieId);
    if (movieIndex > -1) {
      // Remove from favorites
      user.favoriteMovies.splice(movieIndex, 1);
      await user.save();
      res.json({ message: "Movie removed from favorites", isFavorite: false });
    } else {
      // Add to favorites
      user.favoriteMovies.push(movieId);
      await user.save();
      res.json({ message: "Movie added to favorites", isFavorite: true });
    }
  } catch (error) {
    console.error("[Movies] Error toggling favorite:", error);
    res.status(500).json({ message: "Error updating favorite status" });
  }
});

// Check if a movie is in user's favorites
router.get("/favorites/:movieId/check", auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFavorite = user.favoriteMovies.includes(movieId);
    res.json({ isFavorite });
  } catch (error) {
    console.error("[Movies] Error checking favorite status:", error);
    res.status(500).json({ message: "Error checking favorite status" });
  }
});

module.exports = router;
