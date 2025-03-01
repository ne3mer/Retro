import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="terminal-container crt-effect">
      <div className="dashboard">
        <h2>USER DASHBOARD</h2>

        <div className="dashboard-section">
          <h3>PROFILE</h3>
          <div className="profile-info">
            <p>
              <span>USERNAME:</span> {user.username}
            </p>
            <p>
              <span>NAME:</span> {user.name}
            </p>
            <p>
              <span>EMAIL:</span> {user.email}
            </p>
            <p>
              <span>MEMBER SINCE:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="dashboard-section">
          <h3>ACTIVITY</h3>
          <div className="activity-stats">
            <div className="stat-box">
              <h4>BLOG POSTS</h4>
              <p className="stat-number">{user.posts?.length || 0}</p>
            </div>
            <div className="stat-box">
              <h4>FAVORITE MOVIES</h4>
              <p className="stat-number">{user.favoriteMovies?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h3>MY BLOG POSTS</h3>
          <Link to="/create-post" className="terminal-button create-post-btn">
            CREATE NEW BLOG POST
          </Link>
          <div className="posts-list">
            {user.posts && user.posts.length > 0 ? (
              user.posts.map((post) => (
                <div key={post._id} className="dashboard-post">
                  <h4>{post.title}</h4>
                  <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                  <Link to={`/blog/${post._id}`} className="terminal-button">
                    VIEW POST
                  </Link>
                </div>
              ))
            ) : (
              <p>No blog posts yet</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h3>FAVORITE MOVIES</h3>
          <div className="movies-list">
            {user.favoriteMovies && user.favoriteMovies.length > 0 ? (
              user.favoriteMovies.map((movie) => (
                <div key={movie._id} className="dashboard-movie">
                  <h4>{movie.title}</h4>
                  <p>Rating: {movie.rating}</p>
                  <Link to={`/top-movies`} className="terminal-button">
                    VIEW MOVIE
                  </Link>
                </div>
              ))
            ) : (
              <p>No favorite movies yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
