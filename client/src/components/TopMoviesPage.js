import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  getTopRatedMovies,
  getFallbackTopMovies,
} from "../components/movieApi";
import MatrixCodeRain from "../components/MatrixCodeRain";
import axios from "axios";

const TopMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showGlitch, setShowGlitch] = useState(false);
  const [glitchText, setGlitchText] = useState("");
  const pageRef = useRef(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedDirector, setSelectedDirector] = useState("");
  const [selectedActor, setSelectedActor] = useState("");
  const [sortBy, setSortBy] = useState("rating"); // rating, year, title

  // Available filter options
  const [genres, setGenres] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [actors, setActors] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    fetchMovies();
    fetchFilterOptions();
  }, [currentPage]);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>/?\\`~";
        let result = "";
        for (let i = 0; i < 10; i++) {
          result += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        setGlitchText(result);
        setShowGlitch(true);

        setTimeout(() => {
          setShowGlitch(false);
        }, 150);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const data = await getTopRatedMovies(currentPage);
      if (data && data.results) {
        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages || 1, 13));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("CONNECTION LOST. USING LOCAL DATABASE...");
      const fallbackData = getFallbackTopMovies();
      setMovies(fallbackData.results || []);
      setTotalPages(fallbackData.total_pages || 1);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get("/api/movies/filters");
      const { genres, directors, actors, years } = response.data;
      setGenres(genres || []);
      setDirectors(directors || []);
      setActors(actors || []);
      setYears(years || []);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      pageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getPosterUrl = (posterPath) => {
    if (posterPath) {
      return `https://image.tmdb.org/t/p/w500${posterPath}`;
    }
    return "/placeholder-poster.jpg";
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedGenre("");
    setSelectedYear("");
    setSelectedRating("");
    setSelectedDirector("");
    setSelectedActor("");
    setSortBy("rating");
  };

  // Filter and sort movies
  const filteredMovies = movies
    .filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesGenre =
        !selectedGenre ||
        (movie.genres &&
          movie.genres.some((g) => g.id === parseInt(selectedGenre)));
      const matchesYear =
        !selectedYear || movie.release_date?.startsWith(selectedYear);
      const matchesRating =
        !selectedRating || movie.vote_average >= parseFloat(selectedRating);
      const matchesDirector =
        !selectedDirector ||
        (movie.credits?.crew &&
          movie.credits.crew.some(
            (c) => c.job === "Director" && c.id === parseInt(selectedDirector)
          ));
      const matchesActor =
        !selectedActor ||
        (movie.credits?.cast &&
          movie.credits.cast.some((a) => a.id === parseInt(selectedActor)));

      return (
        matchesSearch &&
        matchesGenre &&
        matchesYear &&
        matchesRating &&
        matchesDirector &&
        matchesActor
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.vote_average - a.vote_average;
        case "year":
          return b.release_date?.localeCompare(a.release_date);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen bg-black text-green-500 font-mono"
    >
      {/* Background matrix effect */}
      <div className="fixed inset-0 z-0 opacity-10">
        <MatrixCodeRain />
      </div>

      {/* Glitch overlay */}
      {showGlitch && (
        <div className="fixed inset-0 flex items-center justify-center text-4xl opacity-30 z-20">
          {glitchText}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4">TOP 250 MOVIES DATABASE</h1>
          <p className="text-green-400">
            ACCESSING CLASSIFIED ENTERTAINMENT RECORDS...
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8 border border-green-500 p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="filter-group">
              <label className="block mb-2">SEARCH:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ENTER MOVIE TITLE..."
                className="w-full bg-black border border-green-500 p-2 text-green-500 focus:outline-none focus:border-green-400"
              />
            </div>

            {/* Genre Filter */}
            <div className="filter-group">
              <label className="block mb-2">GENRE:</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full bg-black border border-green-500 p-2 text-green-500 focus:outline-none focus:border-green-400"
              >
                <option value="">ALL GENRES</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="filter-group">
              <label className="block mb-2">YEAR:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-black border border-green-500 p-2 text-green-500 focus:outline-none focus:border-green-400"
              >
                <option value="">ALL YEARS</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <label className="block mb-2">MINIMUM RATING:</label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full bg-black border border-green-500 p-2 text-green-500 focus:outline-none focus:border-green-400"
              >
                <option value="">ANY RATING</option>
                <option value="9">9+ ★★★★★</option>
                <option value="8">8+ ★★★★☆</option>
                <option value="7">7+ ★★★☆☆</option>
                <option value="6">6+ ★★☆☆☆</option>
              </select>
            </div>

            {/* Director Filter */}
            <div className="filter-group">
              <label className="block mb-2">DIRECTOR:</label>
              <select
                value={selectedDirector}
                onChange={(e) => setSelectedDirector(e.target.value)}
                className="w-full bg-black border border-green-500 p-2 text-green-500 focus:outline-none focus:border-green-400"
              >
                <option value="">ALL DIRECTORS</option>
                {directors.map((director) => (
                  <option key={director.id} value={director.id}>
                    {director.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Actor Filter */}
            <div className="filter-group">
              <label className="block mb-2">ACTOR:</label>
              <select
                value={selectedActor}
                onChange={(e) => setSelectedActor(e.target.value)}
                className="w-full bg-black border border-green-500 p-2 text-green-500 focus:outline-none focus:border-green-400"
              >
                <option value="">ALL ACTORS</option>
                {actors.map((actor) => (
                  <option key={actor.id} value={actor.id}>
                    {actor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort and Reset */}
          <div className="flex flex-wrap justify-between items-center">
            <div className="filter-group">
              <label className="mr-2">SORT BY:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black border border-green-500 p-2 text-green-500 focus:outline-none focus:border-green-400"
              >
                <option value="rating">RATING</option>
                <option value="year">YEAR</option>
                <option value="title">TITLE</option>
              </select>
            </div>
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
            >
              RESET FILTERS
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center my-8">
            <p>ACCESSING MOVIE DATABASE...</p>
            <div className="w-full bg-black border border-green-500 mt-2">
              <div
                className="bg-green-700 h-2 animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 my-8">{error}</div>
        ) : null}

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="movie-card border border-green-500 bg-black bg-opacity-60 hover:border-green-300 transition-colors"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={getPosterUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-poster.jpg";
                  }}
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-full p-3">
                  <div className="text-green-500 text-lg truncate">
                    {movie.title}
                  </div>
                  <div className="text-green-400 text-sm">
                    {movie.release_date?.substring(0, 4)} |{" "}
                    {movie.vote_average.toFixed(1)}/10
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {!isLoading && filteredMovies.length === 0 && (
          <div className="text-center my-8">
            NO MATCHING RECORDS FOUND IN DATABASE
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredMovies.length > 0 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 border border-green-500 ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-500 hover:text-black"
              }`}
            >
              PREV
            </button>
            <div className="px-4 py-2 border border-green-500">
              PAGE {currentPage} OF {totalPages}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border border-green-500 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-500 hover:text-black"
              }`}
            >
              NEXT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopMoviesPage;
