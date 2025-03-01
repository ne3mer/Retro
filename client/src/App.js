import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RetroTerminalChat from "./components/RetroTerminalChat";
import Navbar from "./components/Navbar";
import TopMoviesPage from "./components/TopMoviesPage";
import MovieDetailPage from "./components/MovieDetailPage";
import AdminPanel from "./components/AdminPanel";
import BlogPage from "./components/BlogPage";
import "./App.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <div className="App crt-effect min-h-screen bg-black">
      <div className="scan-lines"></div>
      <div className="container mx-auto p-4">
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <ErrorBoundary>
            <Navbar />
            <Routes>
              <Route path="/" element={<RetroTerminalChat />} />
              <Route path="/top-movies" element={<TopMoviesPage />} />
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/blog/*" element={<BlogPage />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
