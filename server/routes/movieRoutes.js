const express = require("express");
const router = express.Router();
const axios = require("axios");

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

module.exports = router;
