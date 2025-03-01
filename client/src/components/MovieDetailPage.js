import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MatrixCodeRain from "./MatrixCodeRain";
import axios from "../utils/axios";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching movie details for ID:", id);
        const response = await axios.get(`/api/movies/${id}`);
        console.log("Movie details response:", response.data);
        setMovie(response.data);
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
  }, [id]);

  const getPosterUrl = (path) => {
    if (!path) return "/placeholder-poster.jpg";
    return `https://image.tmdb.org/t/p/w500${path}`;
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
        <Link
          to="/top-movies"
          className="inline-block mb-6 px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors font-mono"
        >
          « RETURN TO DATABASE
        </Link>

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
            <div className="grid grid-cols-2 gap-4">
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
      </div>
    </div>
  );
};

export default MovieDetailPage;
