const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

// Get all movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort("rank");
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single movie by ID
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new movie
router.post("/", async (req, res) => {
  const movie = new Movie({
    title: req.body.title,
    year: req.body.year,
    rating: req.body.rating,
    rank: req.body.rank,
    plot: req.body.plot,
    director: req.body.director,
    stars: req.body.stars,
    genre: req.body.genre,
    imageUrl: req.body.imageUrl,
  });

  try {
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a movie
router.put("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    Object.assign(movie, req.body);
    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a movie
router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    await movie.remove();
    res.json({ message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
