import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  getTopRatedMovies,
  getFallbackTopMovies,
} from "../components/movieApi";
import MatrixCodeRain from "../components/MatrixCodeRain";

const TopMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showGlitch, setShowGlitch] = useState(false);
  const [glitchText, setGlitchText] = useState("");
  const pageRef = useRef(null);

  // Fetch top rated movies
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const data = await getTopRatedMovies(currentPage);
        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages, 13)); // Limit to first 250 movies (approx 13 pages at 20 per page)
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("CONNECTION LOST. USING LOCAL DATABASE...");
        // Use fallback data if API fails
        const fallbackData = getFallbackTopMovies();
        setMovies(fallbackData.results);
        setTotalPages(fallbackData.total_pages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
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

  // Filter movies based on search term
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top of page
      pageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get poster URL or use placeholder
  const getPosterUrl = (posterPath) => {
    if (posterPath) {
      return `https://image.tmdb.org/t/p/w500${posterPath}`;
    }
    return "/placeholder-poster.jpg"; // Add a placeholder image to your public folder
  };

  return (
    <div ref={pageRef} className="relative">
      {/* Background matrix effect */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{ zIndex: 0, opacity: 0.07, pointerEvents: "none" }}
      >
        <MatrixCodeRain height="100%" />
      </div>

      {/* Glitch overlay */}
      {showGlitch && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-4xl opacity-30 z-10">
          {glitchText}
        </div>
      )}

      <div className="z-10 relative">
        {/* Header */}
        <div className="text-center mb-6 text-green-500 font-mono">
          <h1 className="text-3xl mb-2">TOP 250 MOVIES DATABASE</h1>
          <p>ACCESSING CLASSIFIED ENTERTAINMENT RECORDS...</p>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="flex border border-green-500 bg-black">
            <div className="px-3 py-2 bg-green-900 text-black font-mono">
              SEARCH:
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ENTER MOVIE TITLE..."
              className="flex-1 bg-black text-green-500 outline-none px-3 py-2 font-mono"
            />
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="text-center text-green-500 font-mono my-8">
            <p>ACCESSING MOVIE DATABASE...</p>
            <div className="w-full bg-black border border-green-500 mt-2">
              <div
                className="bg-green-700 h-2"
                style={{ width: `${Math.random() * 100}%` }}
              ></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-mono mb-4">{error}</div>
        ) : null}

        {/* Movie grid */}
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
                  <div className="text-green-500 font-mono text-lg truncate">
                    {movie.title}
                  </div>
                  <div className="text-green-300 font-mono text-sm">
                    {movie.release_date
                      ? movie.release_date.substring(0, 4)
                      : "N/A"}{" "}
                    | {movie.vote_average.toFixed(1)}/10
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {!isLoading && filteredMovies.length > 0 && (
          <div className="flex justify-center mt-8 space-x-2 font-mono text-green-500">
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

        {/* No results */}
        {!isLoading && filteredMovies.length === 0 && (
          <div className="text-center text-green-500 font-mono my-8">
            NO MATCHING RECORDS FOUND IN DATABASE
          </div>
        )}
      </div>
    </div>
  );
};

export default TopMoviesPage;
