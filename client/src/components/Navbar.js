import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="border-b border-green-500 pb-2 mb-4 flex justify-between items-center">
      <div className="text-2xl text-green-500 font-mono">TERMINALX-9000</div>

      <div className="flex space-x-4">
        <Link
          to="/"
          className="px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors font-mono"
        >
          HOME
        </Link>

        <Link
          to="/blog"
          className="px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors font-mono"
        >
          TERMINAL LOGS
        </Link>

        <Link
          to="/admin"
          className="px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors font-mono"
        >
          ADMIN TERMINAL
        </Link>

        <Link
          to="/top-movies"
          className="px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors font-mono"
        >
          TOP 250 MOVIES
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
