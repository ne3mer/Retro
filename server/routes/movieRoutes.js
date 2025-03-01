const express = require("express");
const router = express.Router();
const axios = require("axios");

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Get top rated movies
router.get("/top-rated", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      params: {
        api_key: TMDB_API_KEY,
        page,
      },
    });

    if (!response.data) {
      return res.status(404).json({ message: "No movies found" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Movies not found" });
    }
    res.status(500).json({
      message: "Error fetching movies",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get movie details
router.get("/:id", async (req, res) => {
  try {
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
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(500).json({
      message: "Error fetching movie details",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
