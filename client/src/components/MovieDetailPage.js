import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MatrixCodeRain from "./MatrixCodeRain";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import { checkFavoriteStatus, toggleFavorite } from "./movieApi";

const MovieDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching movie details for ID:", id);
        const response = await axios.get(`/api/movies/${id}`);
        console.log("Movie details response:", response.data);
        setMovie(response.data);

        // Set the first YouTube trailer as selected if available
        const youtubeTrailer = response.data.videos?.results?.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setSelectedTrailer(youtubeTrailer);

        // Check favorite status if user is logged in
        if (user) {
          const favoriteStatus = await checkFavoriteStatus(id);
          setIsFavorite(favoriteStatus);
        }
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError(err.response?.data?.message || "Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id, user]);

  const handleFavoriteClick = async () => {
    if (!user) {
      // Redirect to login page
      window.location.href = `/login?redirect=/movie/${id}`;
      return;
    }

    try {
      setFavoriteLoading(true);
      await toggleFavorite(id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const getPosterUrl = (path) => {
    if (!path) return "/placeholder-poster.jpg";
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const getProfileUrl = (path) => {
    if (!path) return "/placeholder-profile.jpg";
    return `https://image.tmdb.org/t/p/w185${path}`;
  };

  if (loading) {
    return (
      <div className="text-center text-green-500 font-mono my-8">
        <p>ACCESSING MOVIE DATABASE...</p>
        <div className="w-full bg-black border border-green-500 mt-2">
          <div
            className="bg-green-700 h-2 animate-pulse"
            style={{ width: "60%" }}
          ></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-mono my-8">
        <p>{error}</p>
        <p className="mt-4">ERROR CODE: MOVIE_NOT_FOUND</p>
        <Link
          to="/top-movies"
          className="inline-block mt-4 px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors"
        >
          « RETURN TO DATABASE
        </Link>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <MatrixCodeRain />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/top-movies"
            className="inline-block px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors font-mono"
          >
            « RETURN TO DATABASE
          </Link>

          <button
            onClick={handleFavoriteClick}
            disabled={favoriteLoading}
            className={`px-4 py-2 border font-mono transition-colors ${
              isFavorite
                ? "border-green-500 bg-green-500 text-black"
                : "border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
            }`}
          >
            {favoriteLoading
              ? "PROCESSING..."
              : isFavorite
              ? "✓ ADDED TO FAVORITES"
              : "ADD TO FAVORITES"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Movie Poster */}
          <div className="relative">
            <img
              src={getPosterUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full rounded-lg border-2 border-green-500 shadow-lg"
              onError={(e) => {
                e.target.src = "/placeholder-poster.jpg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30"></div>
          </div>

          {/* Movie Details */}
          <div className="font-mono text-green-500">
            <h1 className="text-4xl mb-4">{movie.title}</h1>
            <div className="mb-6">
              <p className="text-xl mb-2">RELEASE DATE: {movie.release_date}</p>
              <p className="text-xl mb-2">RATING: {movie.vote_average}/10</p>
              <p className="text-xl">VOTES: {movie.vote_count}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl mb-2">OVERVIEW:</h2>
              <p className="text-green-400 leading-relaxed">{movie.overview}</p>
            </div>

            {movie.genres && (
              <div className="mb-6">
                <h2 className="text-2xl mb-2">GENRES:</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 border border-green-500 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional movie details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-xl mb-2">RUNTIME:</h3>
                <p>{movie.runtime} minutes</p>
              </div>
              <div>
                <h3 className="text-xl mb-2">LANGUAGE:</h3>
                <p>{movie.original_language?.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trailer Section */}
        {selectedTrailer && (
          <div className="mt-12">
            <h2 className="text-2xl font-mono text-green-500 mb-4">
              OFFICIAL TRAILER:
            </h2>
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full border-2 border-green-500"
                src={`https://www.youtube.com/embed/${selectedTrailer.key}`}
                title="Movie Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Cast Section */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-mono text-green-500 mb-4">
              CAST MEMBERS:
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.credits.cast.slice(0, 12).map((actor) => (
                <div
                  key={actor.id}
                  className="border border-green-500 p-2 text-center bg-black bg-opacity-60"
                >
                  <img
                    src={getProfileUrl(actor.profile_path)}
                    alt={actor.name}
                    className="w-full h-48 object-cover mb-2"
                    onError={(e) => {
                      e.target.src = "/placeholder-profile.jpg";
                    }}
                  />
                  <p className="text-green-500 font-mono text-sm truncate">
                    {actor.name}
                  </p>
                  <p className="text-green-400 font-mono text-xs truncate">
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
