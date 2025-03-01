import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import BlogPage from "./components/BlogPage";
import RetroTerminalChat from "./components/RetroTerminalChat";
import TopMoviesPage from "./components/TopMoviesPage";
import MovieDetailPage from "./components/MovieDetailPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import CreatePost from "./components/CreatePost";
import PrivateRoute from "./components/PrivateRoute";
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

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App crt-effect min-h-screen bg-black">
          <div className="scan-lines"></div>
          <div className="container mx-auto p-4">
            <ErrorBoundary>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/chat" element={<RetroTerminalChat />} />
                <Route path="/top-movies" element={<TopMoviesPage />} />
                <Route path="/movie/:id" element={<MovieDetailPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/create-post"
                  element={
                    <PrivateRoute>
                      <CreatePost />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute adminOnly>
                      <AdminPanel />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </ErrorBoundary>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
