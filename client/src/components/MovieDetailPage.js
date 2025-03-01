import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getMovieDetails,
  getFallbackMovieDetails,
} from "../components/movieApi";
import MatrixCodeRain from "../components/MatrixCodeRain";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGlitch, setShowGlitch] = useState(false);
  const [glitchText, setGlitchText] = useState("");

  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error(`Error fetching details for movie ID ${id}:`, error);
        setError("ACCESSING SECURE FILM DATABASE... CONNECTION FAILED");
        // Use fallback data when API fails
        const fallbackData = getFallbackMovieDetails(parseInt(id));
        setMovie(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

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

  // Helper function to format runtime
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}H ${mins}M`;
  };

  // Get backdrop URL or use fallback
  const getBackdropUrl = (backdropPath) => {
    if (backdropPath) {
      return `https://image.tmdb.org/t/p/original${backdropPath}`;
    }
    return "/placeholder-backdrop.jpg"; // Add a placeholder to your public folder
  };

  // Get poster URL or use placeholder
  const getPosterUrl = (posterPath) => {
    if (posterPath) {
      return `https://image.tmdb.org/t/p/w500${posterPath}`;
    }
    return "/placeholder-poster.jpg";
  };

  // Get YouTube trailer if available
  const getTrailerKey = () => {
    if (movie?.videos?.results && movie.videos.results.length > 0) {
      // Find first YouTube trailer
      const trailer = movie.videos.results.find(
        (video) => video.site === "YouTube" && video.type === "Trailer"
      );
      return trailer ? trailer.key : null;
    }
    return null;
  };

  // Get cast members (first 6)
  const getCast = () => {
    if (movie?.credits?.cast && movie.credits.cast.length > 0) {
      return movie.credits.cast.slice(0, 6);
    }
    return [];
  };

  return (
    <div className="relative">
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
        {/* Back button */}
        <Link
          to="/top-movies"
          className="inline-block mb-6 px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors font-mono"
        >
          « RETURN TO DATABASE
        </Link>

        {/* Loading state */}
        {isLoading ? (
          <div className="text-center text-green-500 font-mono my-8">
            <p>ACCESSING SECURE FILE #{id}...</p>
            <div className="w-full bg-black border border-green-500 mt-2">
              <div
                className="bg-green-700 h-2 transition-all duration-300"
                style={{ width: `${Math.random() * 100}%` }}
              ></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-mono mb-4">{error}</div>
        ) : movie ? (
          <>
            {/* Movie header with backdrop */}
            <div className="relative mb-8">
              <div className="w-full h-64 md:h-96 overflow-hidden relative">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${getBackdropUrl(
                      movie.backdrop_path
                    )})`,
                    filter: "brightness(0.3) contrast(1.2)",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row items-end md:items-center">
                  <img
                    src={getPosterUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-32 md:w-48 h-auto shadow-lg border border-green-500 hidden md:block"
                  />
                  <div className="md:ml-8 w-full">
                    <h1 className="text-3xl md:text-4xl text-green-500 font-mono mb-2">
                      {movie.title}
                    </h1>
                    <div className="text-green-300 font-mono mb-2">
                      {movie.release_date
                        ? movie.release_date.substring(0, 4)
                        : "N/A"}{" "}
                      |{movie.runtime ? " " + formatRuntime(movie.runtime) : ""}{" "}
                      | RATING: {movie.vote_average.toFixed(1)}/10
                    </div>
                    <div className="flex flex-wrap">
                      {movie.genres &&
                        movie.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="mr-2 mb-2 px-2 py-1 bg-green-900 text-green-300 text-xs font-mono"
                          >
                            {genre.name}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left column: Poster for mobile + Info */}
              <div className="md:col-span-1">
                <img
                  src={getPosterUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-full h-auto shadow-lg border border-green-500 mb-6 md:hidden"
                />

                <div className="border border-green-500 bg-black bg-opacity-70 p-4 mb-6">
                  <h2 className="text-xl text-green-500 font-mono mb-3 border-b border-green-500 pb-2">
                    FILM INFORMATION
                  </h2>
                  <div className="space-y-2 font-mono text-green-300">
                    <div>
                      <span className="text-green-500">STATUS:</span>{" "}
                      {movie.status || "UNKNOWN"}
                    </div>
                    {movie.budget > 0 && (
                      <div>
                        <span className="text-green-500">BUDGET:</span> $
                        {movie.budget.toLocaleString()}
                      </div>
                    )}
                    {movie.revenue > 0 && (
                      <div>
                        <span className="text-green-500">REVENUE:</span> $
                        {movie.revenue.toLocaleString()}
                      </div>
                    )}
                    {movie.original_language && (
                      <div>
                        <span className="text-green-500">LANGUAGE:</span>{" "}
                        {movie.original_language.toUpperCase()}
                      </div>
                    )}
                    {movie.production_companies &&
                      movie.production_companies.length > 0 && (
                        <div>
                          <span className="text-green-500">PRODUCTION:</span>{" "}
                          {movie.production_companies[0].name}
                        </div>
                      )}
                  </div>
                </div>

                {/* Cast */}
                <div className="border border-green-500 bg-black bg-opacity-70 p-4">
                  <h2 className="text-xl text-green-500 font-mono mb-3 border-b border-green-500 pb-2">
                    MAIN CAST
                  </h2>
                  <div className="space-y-3 font-mono">
                    {getCast().length > 0 ? (
                      getCast().map((person) => (
                        <div key={person.id} className="text-green-300">
                          <div className="text-green-400">{person.name}</div>
                          <div className="text-sm">{person.character}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-green-300">
                        CAST DATA UNAVAILABLE
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column: Overview + Trailer */}
              <div className="md:col-span-2">
                <div className="border border-green-500 bg-black bg-opacity-70 p-4 mb-6">
                  <h2 className="text-xl text-green-500 font-mono mb-3 border-b border-green-500 pb-2">
                    SYNOPSIS
                  </h2>
                  <p className="text-green-300 font-mono leading-relaxed">
                    {movie.overview || "NO SYNOPSIS AVAILABLE IN DATABASE"}
                  </p>
                </div>

                {/* Trailer */}
                <div className="border border-green-500 bg-black bg-opacity-70 p-4">
                  <h2 className="text-xl text-green-500 font-mono mb-3 border-b border-green-500 pb-2">
                    OFFICIAL TRAILER
                  </h2>
                  {getTrailerKey() ? (
                    <div className="aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${getTrailerKey()}`}
                        title={`${movie.title} Trailer`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="border border-green-700"
                      ></iframe>
                    </div>
                  ) : (
                    <div className="text-green-300 font-mono text-center py-8">
                      TRAILER DATA NOT AVAILABLE IN DATABASE
                    </div>
                  )}
                </div>

                {/* Similar movies section could be added here */}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-red-500 font-mono my-8">
            ERROR: MOVIE DATA NOT FOUND. POSSIBLE DATABASE CORRUPTION.
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
