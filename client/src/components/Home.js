import React from "react";
import MatrixCodeRain from "./MatrixCodeRain";
import HackerTerminalUI from "./HackerTerminalUI";
import AnonymousMaskAnimation from "./AnonymousMaskAnimation";

const Home = () => {
  return (
    <div className="terminal-container min-h-screen">
      <div className="relative z-10">
        <div className="text-center py-16">
          <h1 className="text-4xl md:text-6xl mb-6 font-bold animate-pulse">
            RETROTERMINAL AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-80">
            Welcome to the future of retro computing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {/* Features */}
          <div className="terminal-card p-6 border border-green-500 rounded-lg backdrop-blur-sm">
            <h2 className="text-2xl mb-4">Blog</h2>
            <p>Explore our retro-themed tech articles and insights</p>
          </div>

          <div className="terminal-card p-6 border border-green-500 rounded-lg backdrop-blur-sm">
            <h2 className="text-2xl mb-4">Chat</h2>
            <p>Experience AI chat with a nostalgic terminal interface</p>
          </div>

          <div className="terminal-card p-6 border border-green-500 rounded-lg backdrop-blur-sm">
            <h2 className="text-2xl mb-4">Top Movies</h2>
            <p>Discover the best cyberpunk and tech movies</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl mb-8">Interactive Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            <div className="relative h-64">
              <MatrixCodeRain />
            </div>
            <div className="relative h-64">
              <HackerTerminalUI />
            </div>
            <div className="relative h-64">
              <AnonymousMaskAnimation />
            </div>
          </div>
        </div>
      </div>

      {/* Background effects */}
      <div className="fixed inset-0 z-0 opacity-20">
        <MatrixCodeRain />
      </div>
    </div>
  );
};

export default Home;
