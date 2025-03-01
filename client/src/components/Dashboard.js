import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { getFavoriteMovies } from "./movieApi";
import MatrixCodeRain from "./MatrixCodeRain";
import axios from "../utils/axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          setLoading(true);
          setError(null);

          // Fetch favorite movies
          const movies = await getFavoriteMovies();
          setFavoriteMovies(movies);

          // Fetch user's blog posts
          const postsResponse = await axios.get("/api/posts/user");
          setUserPosts(postsResponse.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to load user data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center text-green-500 font-mono my-8">
        <p>ACCESS DENIED: USER NOT AUTHENTICATED</p>
        <Link
          to="/login"
          className="inline-block mt-4 px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
        >
          PROCEED TO LOGIN
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center text-green-500 font-mono my-8">
        <p>ACCESSING USER DATA...</p>
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
        <p className="mt-4">ERROR CODE: DATA_FETCH_FAILED</p>
      </div>
    );
  }

  const getPosterUrl = (path) => {
    if (!path) return "/placeholder-poster.jpg";
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="relative min-h-screen bg-black text-green-500 font-mono p-8">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <MatrixCodeRain />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-3xl mb-8 border-b border-green-500 pb-2">
          USER DASHBOARD
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Profile Section */}
          <div className="border border-green-500 p-6 bg-black bg-opacity-60">
            <h3 className="text-xl mb-4 border-b border-green-500 pb-2">
              PROFILE
            </h3>
            <div className="space-y-2">
              <p>
                <span className="text-green-400">USERNAME:</span>{" "}
                {user.username}
              </p>
              <p>
                <span className="text-green-400">EMAIL:</span> {user.email}
              </p>
              <p>
                <span className="text-green-400">MEMBER SINCE:</span>{" "}
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="border border-green-500 p-6 bg-black bg-opacity-60">
            <h3 className="text-xl mb-4 border-b border-green-500 pb-2">
              STATISTICS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-4xl mb-2">{userPosts.length}</p>
                <p className="text-green-400">BLOG POSTS</p>
              </div>
              <div className="text-center">
                <p className="text-4xl mb-2">{favoriteMovies.length}</p>
                <p className="text-green-400">FAVORITE MOVIES</p>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl">MY BLOG POSTS</h3>
            <Link
              to="/create-post"
              className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
            >
              CREATE NEW POST
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div
                  key={post._id}
                  className="border border-green-500 p-4 bg-black bg-opacity-60 hover:border-green-300 transition-colors"
                >
                  <h4 className="text-lg mb-2 truncate">{post.title}</h4>
                  <p className="text-green-400 text-sm mb-2 truncate">
                    {post.content}
                  </p>
                  <p className="text-green-400 text-xs mb-4">
                    {formatDate(post.createdAt)}
                  </p>
                  <Link
                    to={`/blog/${post._id}`}
                    className="inline-block px-3 py-1 border border-green-500 hover:bg-green-500 hover:text-black transition-colors text-sm"
                  >
                    VIEW POST
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-3 border border-green-500 p-4 bg-black bg-opacity-60 text-center">
                <p className="text-green-400 mb-4">
                  NO BLOG POSTS FOUND IN DATABASE
                </p>
                <Link
                  to="/create-post"
                  className="inline-block px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
                >
                  CREATE YOUR FIRST POST
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Favorite Movies Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl">FAVORITE MOVIES</h3>
            <Link
              to="/top-movies"
              className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
            >
              BROWSE MOVIES
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favoriteMovies.length > 0 ? (
              favoriteMovies.map((movie) => (
                <Link
                  to={`/movie/${movie.id}`}
                  key={movie.id}
                  className="border border-green-500 bg-black bg-opacity-60 hover:border-green-300 transition-colors"
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
                      <div className="text-green-500 text-sm truncate">
                        {movie.title}
                      </div>
                      <div className="text-green-400 text-xs">
                        {movie.release_date?.substring(0, 4)} |{" "}
                        {movie.vote_average?.toFixed(1)}/10
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-5 border border-green-500 p-4 bg-black bg-opacity-60 text-center">
                <p className="text-green-400 mb-4">
                  NO FAVORITE MOVIES FOUND IN DATABASE
                </p>
                <Link
                  to="/top-movies"
                  className="inline-block px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
                >
                  BROWSE MOVIES TO ADD
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
