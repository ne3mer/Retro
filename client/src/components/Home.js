import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MatrixCodeRain from "./MatrixCodeRain";
import HackerTerminalUI from "./HackerTerminalUI";
import AnonymousMaskAnimation from "./AnonymousMaskAnimation";

const Home = () => {
  const [glitchText, setGlitchText] = useState("");
  const [showGlitch, setShowGlitch] = useState(false);

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

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono relative">
      {/* Background Matrix Effect */}
      <div className="fixed inset-0 z-0 opacity-10">
        <MatrixCodeRain />
      </div>

      {/* Glitch Effect */}
      {showGlitch && (
        <div className="fixed inset-0 flex items-center justify-center text-4xl opacity-30 z-20">
          {glitchText}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-pulse text-neon tracking-wider">
            RETROTERMINAL AI
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            EXPERIENCE THE CONVERGENCE OF RETRO COMPUTING AND MODERN AI
            TECHNOLOGY
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/top-movies"
              className="px-8 py-4 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-all duration-300 text-lg tracking-wider"
            >
              EXPLORE MOVIES
            </Link>
            <Link
              to="/blog"
              className="px-8 py-4 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-all duration-300 text-lg tracking-wider"
            >
              READ BLOG
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="feature-card p-8 border border-green-500 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300">
            <h2 className="text-2xl mb-4 border-b border-green-500 pb-2">
              MOVIE DATABASE
            </h2>
            <p className="text-green-400 mb-6">
              Access our curated collection of top-rated movies, complete with
              detailed information, trailers, and cast details.
            </p>
            <Link
              to="/top-movies"
              className="text-green-300 hover:text-green-500 transition-colors"
            >
              BROWSE COLLECTION →
            </Link>
          </div>

          <div className="feature-card p-8 border border-green-500 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300">
            <h2 className="text-2xl mb-4 border-b border-green-500 pb-2">
              TECH BLOG
            </h2>
            <p className="text-green-400 mb-6">
              Dive into our collection of articles covering retro computing, AI
              developments, and cybersecurity insights.
            </p>
            <Link
              to="/blog"
              className="text-green-300 hover:text-green-500 transition-colors"
            >
              READ ARTICLES →
            </Link>
          </div>

          <div className="feature-card p-8 border border-green-500 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300">
            <h2 className="text-2xl mb-4 border-b border-green-500 pb-2">
              AI CHAT
            </h2>
            <p className="text-green-400 mb-6">
              Engage with our AI assistant through a nostalgic terminal
              interface for a unique retro experience.
            </p>
            <Link
              to="/chat"
              className="text-green-300 hover:text-green-500 transition-colors"
            >
              START CHAT →
            </Link>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div className="mb-20">
          <h2 className="text-3xl text-center mb-12 border-b border-green-500 pb-4 inline-block">
            INTERACTIVE TERMINAL
          </h2>
          <div className="relative h-96 border border-green-500">
            <HackerTerminalUI />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          <div className="stat-card text-center p-6 border border-green-500 backdrop-blur-sm">
            <div className="text-4xl mb-2">250+</div>
            <div className="text-green-400">MOVIES</div>
          </div>
          <div className="stat-card text-center p-6 border border-green-500 backdrop-blur-sm">
            <div className="text-4xl mb-2">100+</div>
            <div className="text-green-400">BLOG POSTS</div>
          </div>
          <div className="stat-card text-center p-6 border border-green-500 backdrop-blur-sm">
            <div className="text-4xl mb-2">24/7</div>
            <div className="text-green-400">AI SUPPORT</div>
          </div>
          <div className="stat-card text-center p-6 border border-green-500 backdrop-blur-sm">
            <div className="text-4xl mb-2">1000+</div>
            <div className="text-green-400">USERS</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl mb-8">JOIN THE RETRO REVOLUTION</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/signup"
              className="px-8 py-4 bg-green-500 text-black hover:bg-green-600 transition-colors duration-300 text-lg tracking-wider"
            >
              CREATE ACCOUNT
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-all duration-300 text-lg tracking-wider"
            >
              LOGIN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
