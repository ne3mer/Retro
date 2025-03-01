import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import "./BlogPage.css";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/api/blog/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        navigate("/blog");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  if (loading) {
    return <div className="loading-message">LOADING POST DATA...</div>;
  }

  if (!post) {
    return <div className="error-message">POST NOT FOUND IN DATABASE</div>;
  }

  return (
    <div className="post-detail crt-effect">
      <div className="terminal-header">
        <h1>{post.title}</h1>
        <div className="status-line">
          TIMESTAMP: {new Date(post.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="post-metadata">
        <p>CATEGORY: {post.category}</p>
        <p>TAGS: {post.tags.join(", ")}</p>
      </div>

      <div className="post-content">
        {post.content.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {post.media && post.media.length > 0 && (
        <div className="post-media">
          <h2>ATTACHED MEDIA:</h2>
          <div className="media-grid">
            {post.media.map((media, index) => (
              <div key={index} className="media-item">
                {media.type === "image" ? (
                  <img src={media.url} alt={media.caption || "Post image"} />
                ) : (
                  <video src={media.url} controls />
                )}
                {media.caption && (
                  <p className="media-caption">{media.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => navigate("/blog")} className="terminal-btn">
        RETURN TO LOGS
      </button>
    </div>
  );
};

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    fetchPosts();
    fetchTags();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/blog/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axiosInstance.get("/api/blog/tags");
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/api/blog/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    const matchesCategory =
      !selectedCategory || post.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesCategory && matchesSearch;
  });

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="blog-page crt-effect">
      <div className="terminal-header">
        <h1>TERMINAL LOGS</h1>
        <div className="status-line">
          {loading
            ? "ACCESSING DATABASE..."
            : "DATABASE CONNECTION ESTABLISHED"}
        </div>
      </div>

      <div className="blog-controls">
        <div className="search-box">
          <label>SEARCH LOGS:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="terminal-input"
            placeholder="ENTER SEARCH QUERY..."
          />
        </div>

        <div className="filter-controls">
          <div className="tag-filter">
            <label>FILTER BY TAG:</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="terminal-input"
            >
              <option value="">ALL TAGS</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div className="category-filter">
            <label>FILTER BY CATEGORY:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="terminal-input"
            >
              <option value="">ALL CATEGORIES</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="blog-posts">
        {loading ? (
          <div className="loading-message">LOADING DATABASE ENTRIES...</div>
        ) : currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <article key={post._id} className="blog-post">
              <header>
                <div className="post-header">
                  <h2>
                    <Link to={`/blog/post/${post._id}`} className="post-link">
                      {post.title}
                    </Link>
                  </h2>
                  <div className="post-meta">
                    <span className="date">
                      TIMESTAMP: {new Date(post.createdAt).toLocaleString()}
                    </span>
                    <span className="category">CATEGORY: {post.category}</span>
                    <div className="tags">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="tag"
                          onClick={() => setSelectedTag(tag)}
                        >
                          [{tag}]
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </header>
              <div className="post-preview">
                {post.content.substring(0, 200)}...
                <Link to={`/blog/post/${post._id}`} className="read-more">
                  [READ MORE]
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="no-results">
            NO MATCHING RECORDS FOUND IN DATABASE
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="terminal-btn"
          >
            PREV
          </button>
          <span className="page-info">
            PAGE {currentPage} OF {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="terminal-btn"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
};

const BlogPage = () => {
  return (
    <Routes>
      <Route path="/" element={<BlogList />} />
      <Route path="/post/:id" element={<PostDetail />} />
    </Routes>
  );
};

export default BlogPage;
