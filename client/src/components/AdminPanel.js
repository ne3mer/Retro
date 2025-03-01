import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: "",
    category: "",
    media: [],
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [categories] = useState([
    "TECHNOLOGY",
    "PROGRAMMING",
    "AI",
    "RETRO",
    "GAMING",
    "OTHER",
  ]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/api/blog/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      alert("ERROR: FAILED TO FETCH POSTS");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("ACCESS DENIED: INCORRECT PASSWORD");
    }
  };

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
      };

      console.log("Submitting post data:", postData);

      if (isEditing && editingPost) {
        const response = await axiosInstance.put(
          `/api/blog/posts/${editingPost._id}`,
          postData
        );
        console.log("Post updated successfully:", response.data);
        alert("POST SUCCESSFULLY UPDATED");
      } else {
        const response = await axiosInstance.post("/api/blog/posts", postData);
        console.log("Post created successfully:", response.data);
        alert("POST SUCCESSFULLY ADDED TO DATABASE");
      }

      setNewPost({ title: "", content: "", tags: "", category: "", media: [] });
      setIsEditing(false);
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error("Error saving post:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.message || "Unknown error occurred";
      alert(
        isEditing
          ? `ERROR: FAILED TO UPDATE POST - ${errorMessage}`
          : `ERROR: FAILED TO CREATE POST - ${errorMessage}`
      );
    }
  };

  const handleEdit = (post) => {
    setIsEditing(true);
    setEditingPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      tags: post.tags.join(", "),
      category: post.category,
      media: post.media,
    });
  };

  const handleDelete = async (postId) => {
    if (window.confirm("CONFIRM DELETE OPERATION? [Y/N]")) {
      try {
        await axiosInstance.delete(`/api/blog/posts/${postId}`);
        fetchPosts();
        alert("POST DELETED FROM DATABASE");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("ERROR: FAILED TO DELETE POST");
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPost(null);
    setNewPost({ title: "", content: "", tags: "", category: "", media: [] });
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-panel crt-effect">
        <div className="terminal-header">
          <h1>ADMIN TERMINAL ACCESS</h1>
          <div className="status-line">SECURITY CLEARANCE REQUIRED</div>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>ENTER ACCESS CODE:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="terminal-input"
            />
          </div>
          <button type="submit" className="terminal-btn">
            AUTHENTICATE
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel crt-effect">
      <div className="terminal-header">
        <h1>BLOG CONTROL TERMINAL</h1>
        <div className="status-line">ADMIN ACCESS GRANTED</div>
      </div>

      <form onSubmit={handleSubmit} className="post-form">
        <div className="input-group">
          <label>POST TITLE:</label>
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
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
            placeholder="TECH, AI, RETRO"
          />
        </div>

        <div className="input-group">
          <label>MEDIA:</label>
          <input
            type="file"
            onChange={handleMediaUpload}
            className="terminal-input"
            accept="image/*,video/*"
            multiple
          />
          <div className="media-preview">
            {newPost.media.map((media, index) => (
              <div key={index} className="media-item">
                {media.type === "image" ? (
                  <img src={media.url} alt="Preview" />
                ) : (
                  <video src={media.url} controls />
                )}
                <input
                  type="text"
                  placeholder="Caption"
                  value={media.caption}
                  onChange={(e) =>
                    handleMediaCaptionChange(index, e.target.value)
                  }
                  className="terminal-input"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(index)}
                  className="terminal-btn delete-btn"
                >
                  REMOVE
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="terminal-btn">
            {isEditing ? "UPDATE POST" : "SUBMIT POST"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="terminal-btn cancel-btn"
            >
              CANCEL EDIT
            </button>
          )}
        </div>
      </form>

      <div className="posts-list">
        <h2>EXISTING POSTS</h2>
        {posts.map((post) => (
          <div key={post._id} className="post-item">
            <h3>{post.title}</h3>
            <p className="post-date">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className="post-category">CATEGORY: {post.category}</p>
            <p className="post-tags">TAGS: {post.tags.join(", ")}</p>
            <div className="post-actions">
              <button
                onClick={() => handleEdit(post)}
                className="terminal-btn edit-btn"
              >
                EDIT
              </button>
              <button
                onClick={() => handleDelete(post._id)}
                className="terminal-btn delete-btn"
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
