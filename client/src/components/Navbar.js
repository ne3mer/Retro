import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar crt-effect">
      <div className="navbar-brand">
        <Link to="/" className="nav-logo">
          RETROTERMINAL
        </Link>
        <button className="burger-menu" onClick={toggleMenu}>
          <div className={`burger-bar ${isOpen ? "open" : ""}`}></div>
          <div className={`burger-bar ${isOpen ? "open" : ""}`}></div>
          <div className={`burger-bar ${isOpen ? "open" : ""}`}></div>
        </button>
      </div>

      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>
          HOME
        </Link>
        <Link to="/blog" onClick={() => setIsOpen(false)}>
          BLOG
        </Link>
        <Link to="/admin" onClick={() => setIsOpen(false)}>
          ADMIN
        </Link>
        <Link to="/chat" onClick={() => setIsOpen(false)}>
          CHAT
        </Link>
        <Link to="/top-movies" onClick={() => setIsOpen(false)}>
          TOP 250 MOVIES
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
