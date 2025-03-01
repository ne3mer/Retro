import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Form submitted with data:", {
        ...formData,
        password: "[REDACTED]",
      });

      const result = await signup(formData);
      console.log("Signup result:", result);

      if (result.success) {
        console.log("Signup successful, navigating to dashboard");
        navigate("/dashboard");
      } else {
        console.error("Signup failed with error:", result.error);
        setError(result.error || "Unknown error occurred during signup");
      }
    } catch (error) {
      console.error("Exception during signup:", error);
      setError("An unexpected error occurred: " + error.message);
    }
  };

  return (
    <div className="terminal-container crt-effect">
      <div className="auth-form">
        <h2>SIGN UP</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">USERNAME:</label>
            <input
              type="text"
              id="username"
              name="username"
              className="terminal-input"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">EMAIL:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="terminal-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">NAME:</label>
            <input
              type="text"
              id="name"
              name="name"
              className="terminal-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">PASSWORD:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="terminal-input"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="terminal-button">
            SIGN UP <span className="blinking-cursor">_</span>
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
