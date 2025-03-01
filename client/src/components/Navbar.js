import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/");
    }
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar crt-effect">
      <div className="navbar-brand">
        <Link to="/" className="nav-logo" onClick={handleLinkClick}>
          RETROTERMINAL
        </Link>
      </div>

      <button className="burger-menu" onClick={toggleMenu}>
        <div className={`burger-bar ${isOpen ? "open" : ""}`}></div>
        <div className={`burger-bar ${isOpen ? "open" : ""}`}></div>
        <div className={`burger-bar ${isOpen ? "open" : ""}`}></div>
      </button>

      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link to="/" onClick={handleLinkClick}>
          HOME
        </Link>
        <Link to="/blog" onClick={handleLinkClick}>
          BLOG
        </Link>
        <Link to="/top-movies" onClick={handleLinkClick}>
          TOP 250 MOVIES
        </Link>
        <Link to="/chat" onClick={handleLinkClick}>
          CHAT
        </Link>
        {user ? (
          <>
            <Link to="/dashboard" onClick={handleLinkClick}>
              DASHBOARD
            </Link>
            {user.isAdmin && (
              <Link to="/admin" onClick={handleLinkClick}>
                ADMIN
              </Link>
            )}
            <button onClick={handleLogout} className="nav-button">
              LOGOUT
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={handleLinkClick}>
              SIGN IN
            </Link>
            <Link to="/signup" onClick={handleLinkClick}>
              SIGN UP
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
