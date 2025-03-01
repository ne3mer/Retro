const express = require("express");
const router = express.Router();
const axios = require("axios");

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Validate TMDB API key
if (!TMDB_API_KEY) {
  console.error("TMDB_API_KEY is not set in environment variables");
}

// Get top rated movies
router.get("/top-rated", async (req, res) => {
  try {
    const page = req.query.page || 1;
    console.log("Fetching top rated movies, page:", page);

    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      params: {
        api_key: TMDB_API_KEY,
        page,
      },
    });

    if (!response.data || !response.data.results) {
      console.error("Invalid response from TMDB API:", response.data);
      return res.status(500).json({
        message: "Invalid response from movie database",
        error: "INVALID_RESPONSE",
      });
    }

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching top rated movies:",
      error.response?.data || error.message
    );

    if (error.response?.status === 404) {
      return res.status(404).json({
        message: "Movies not found",
        error: "NOT_FOUND",
      });
    }

    res.status(500).json({
      message: "Error fetching movies",
      error: "SERVER_ERROR",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get movie details
router.get("/:id", async (req, res) => {
  try {
    console.log("Fetching movie details for ID:", req.params.id);

    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${req.params.id}`,
      {
        params: {
          api_key: TMDB_API_KEY,
          append_to_response: "credits,videos",
        },
      }
    );

    if (!response.data) {
      console.error("Invalid response from TMDB API:", response.data);
      return res.status(500).json({
        message: "Invalid response from movie database",
        error: "INVALID_RESPONSE",
      });
    }

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching movie details:",
      error.response?.data || error.message
    );

    if (error.response?.status === 404) {
      return res.status(404).json({
        message: "Movie not found",
        error: "NOT_FOUND",
      });
    }

    res.status(500).json({
      message: "Error fetching movie details",
      error: "SERVER_ERROR",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
