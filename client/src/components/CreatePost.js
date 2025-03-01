import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import "./CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: "",
    category: "",
    media: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    "TECHNOLOGY",
    "PROGRAMMING",
    "AI",
    "RETRO",
    "GAMING",
    "OTHER",
  ];

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newMedia = await Promise.all(
      files.map(async (file) => {
        // In a real app, you would upload to a cloud service here
        // For now, we'll use local URLs
        const url = URL.createObjectURL(file);
        return {
          type: file.type.startsWith("image/") ? "image" : "video",
          url: url,
          caption: "",
        };
      })
    );
    setNewPost({
      ...newPost,
      media: [...newPost.media, ...newMedia],
    });
  };

  const handleMediaCaptionChange = (index, caption) => {
    const updatedMedia = [...newPost.media];
    updatedMedia[index] = { ...updatedMedia[index], caption };
    setNewPost({ ...newPost, media: updatedMedia });
  };

  const handleRemoveMedia = (index) => {
    const updatedMedia = newPost.media.filter((_, i) => i !== index);
    setNewPost({ ...newPost, media: updatedMedia });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const tags = newPost.tags
        ? newPost.tags.split(",").map((tag) => tag.trim().toUpperCase())
        : [];

      const postData = {
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        tags: tags,
        category: newPost.category,
        media: newPost.media,
        author: user._id, // Link post to current user
      };

      console.log("Submitting post data:", postData);

      const response = await axiosInstance.post("/api/blog/posts", postData);
      console.log("Post created successfully:", response.data);

      setSuccess(true);
      setNewPost({ title: "", content: "", tags: "", category: "", media: [] });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error saving post:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.message || "Unknown error occurred";
      setError(`ERROR: FAILED TO CREATE POST - ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-container crt-effect">
      <div className="terminal-header">
        <h1>CREATE NEW BLOG POST</h1>
        <div className="status-line">USER: {user?.username}</div>
      </div>

      {success ? (
        <div className="success-message">
          POST SUCCESSFULLY ADDED TO DATABASE
          <p>Redirecting to dashboard...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="post-form">
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label>POST TITLE:</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="terminal-input"
              required
            />
          </div>

          <div className="input-group">
            <label>CATEGORY:</label>
            <select
              value={newPost.category}
              onChange={(e) =>
                setNewPost({ ...newPost, category: e.target.value })
              }
              className="terminal-input"
              required
            >
              <option value="">SELECT CATEGORY</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>POST CONTENT:</label>
            <textarea
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              className="terminal-input"
              rows="10"
              required
            />
          </div>

          <div className="input-group">
            <label>TAGS (COMMA SEPARATED):</label>
            <input
              type="text"
              value={newPost.tags}
              onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
              className="terminal-input"
              placeholder="AI, RETRO, GAMING"
            />
          </div>

          <div className="input-group">
            <label>MEDIA (OPTIONAL):</label>
            <input
              type="file"
              onChange={handleMediaUpload}
              className="terminal-input"
              multiple
            />
          </div>

          {newPost.media.length > 0 && (
            <div className="media-preview">
              <h3>MEDIA PREVIEW:</h3>
              <div className="media-grid">
                {newPost.media.map((media, index) => (
                  <div key={index} className="media-item">
                    {media.type === "image" ? (
                      <img src={media.url} alt="Preview" />
                    ) : (
                      <video src={media.url} controls />
                    )}
                    <input
                      type="text"
                      placeholder="Caption (optional)"
                      value={media.caption}
                      onChange={(e) =>
                        handleMediaCaptionChange(index, e.target.value)
                      }
                      className="terminal-input"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="terminal-btn remove-btn"
                    >
                      REMOVE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="button-group">
            <button
              type="submit"
              className="terminal-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "PROCESSING..." : "SUBMIT POST"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="terminal-btn cancel-btn"
            >
              CANCEL
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreatePost;
