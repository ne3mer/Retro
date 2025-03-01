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

    // Fetch additional details for each movie in parallel
    const moviesWithDetails = await Promise.all(
      data.results.map(async (movie) => {
        try {
          const detailsResponse = await axios.get(
            `${TMDB_BASE_URL}/movie/${movie.id}`,
            {
              params: {
                api_key: TMDB_API_KEY,
                append_to_response: "credits",
              },
            }
          );
          const details = validateTMDBResponse(
            detailsResponse,
            `movie ${movie.id}`
          );
          return {
            ...movie,
            genres: details.genres,
            credits: {
              cast: details.credits.cast.slice(0, 5),
              crew: details.credits.crew.filter(
                (person) => person.job === "Director"
              ),
            },
          };
        } catch (error) {
          console.error(`Error fetching details for movie ${movie.id}:`, error);
          return movie;
        }
      })
    );

    res.json({
      ...data,
      results: moviesWithDetails,
    });
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

// Get user's favorite movies
router.get("/favorites", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch details for each favorite movie from TMDB
    const moviePromises = user.favoriteMovies.map(async (movieId) => {
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
        );
        return validateTMDBResponse(response, "favorite movie details");
      } catch (error) {
        console.error(`Error fetching movie ${movieId}:`, error);
        return null;
      }
    });

    const movies = (await Promise.all(moviePromises)).filter(Boolean);
    res.json(movies);
  } catch (error) {
    console.error("Error fetching favorite movies:", error);
    res.status(500).json({ message: "Error fetching favorite movies" });
  }
});

// Toggle favorite movie
router.post("/favorites/:movieId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const movieId = parseInt(req.params.movieId, 10);
    if (isNaN(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    // Verify movie exists in TMDB
    try {
      await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: { api_key: TMDB_API_KEY },
      });
    } catch (error) {
      return res
        .status(404)
        .json({ message: "Movie not found in TMDB database" });
    }

    const movieIndex = user.favoriteMovies.indexOf(movieId);
    if (movieIndex > -1) {
      user.favoriteMovies.splice(movieIndex, 1);
    } else {
      user.favoriteMovies.push(movieId);
    }

    await user.save();
    res.json({
      message: "Favorite status updated",
      isFavorite: movieIndex === -1,
      favoriteMovies: user.favoriteMovies,
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ message: "Error updating favorite status" });
  }
});

// Check if a movie is in user's favorites
router.get("/favorites/:movieId/check", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const movieId = parseInt(req.params.movieId, 10);
    if (isNaN(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    const isFavorite = user.favoriteMovies.includes(movieId);
    res.json({ isFavorite });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    res.status(500).json({ message: "Error checking favorite status" });
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
        append_to_response: "credits,videos,similar,recommendations",
      },
    });

    const data = validateTMDBResponse(response, `movie ${id}`);

    // Add additional processing for cast and crew
    if (data.credits) {
      // Limit cast to main actors
      data.credits.cast = data.credits.cast.slice(0, 10);

      // Extract director from crew
      data.director = data.credits.crew.find(
        (person) => person.job === "Director"
      );
    }

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

// Get filter options
router.get("/filters", async (req, res) => {
  try {
    // Fetch genres
    const genresResponse = await axios.get(
      `${TMDB_BASE_URL}/genre/movie/list`,
      {
        params: { api_key: TMDB_API_KEY },
      }
    );
    const genres = validateTMDBResponse(genresResponse, "genres").genres;

    // Get popular people (both actors and directors)
    const peopleResponse = await axios.get(`${TMDB_BASE_URL}/person/popular`, {
      params: { api_key: TMDB_API_KEY },
    });
    const people = validateTMDBResponse(peopleResponse, "people").results;

    // Get years (from 1900 to current year)
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: currentYear - 1900 + 1 },
      (_, i) => currentYear - i
    );

    // Split people into actors and directors based on known_for_department
    const actors = people
      .filter((person) => person.known_for_department === "Acting")
      .slice(0, 20);
    const directors = people
      .filter((person) => person.known_for_department === "Directing")
      .slice(0, 20);

    res.json({
      genres,
      actors,
      directors,
      years,
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({ message: "Error fetching filter options" });
  }
});

module.exports = router;
