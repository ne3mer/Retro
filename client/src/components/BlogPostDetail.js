import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MatrixCodeRain from "./MatrixCodeRain";
import axios from "../utils/axios";
import { formatDistanceToNow } from "date-fns";

const BlogPostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching blog post:", id);
        const response = await axios.get(`/api/blog/posts/${id}`);
        console.log("Blog post response:", response.data);
        setPost(response.data);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(err.response?.data?.message || "Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-green-500 font-mono my-8">
        <p>ACCESSING BLOG DATABASE...</p>
        <div className="w-full bg-black border border-green-500 mt-2">
          <div
            className="bg-green-700 h-2 animate-pulse"
            style={{ width: "60%" }}
          ></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-mono my-8">
        <p>{error}</p>
        <p className="mt-4">ERROR CODE: POST_NOT_FOUND</p>
        <Link
          to="/blog"
          className="inline-block mt-4 px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors"
        >
          « RETURN TO BLOG
        </Link>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <MatrixCodeRain />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/blog"
          className="inline-block mb-6 px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors font-mono"
        >
          « RETURN TO BLOG
        </Link>

        <article className="bg-black bg-opacity-80 border border-green-500 p-6 rounded-lg shadow-lg">
          <header className="mb-8">
            <h1 className="text-4xl font-mono text-green-500 mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-green-400 font-mono text-sm">
              <p>
                AUTHOR:{" "}
                {post.author?.name || post.author?.username || "UNKNOWN"}
              </p>
              <p>
                POSTED:{" "}
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                }).toUpperCase()}
              </p>
            </div>
          </header>

          {post.tags && post.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 border border-green-500 rounded-full text-green-500 text-sm font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="prose prose-lg prose-invert max-w-none">
            <div
              className="text-green-400 font-mono leading-relaxed whitespace-pre-wrap"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {post.content}
            </div>
          </div>

          {post.category && (
            <footer className="mt-8 pt-6 border-t border-green-500">
              <p className="text-green-500 font-mono">
                CATEGORY: {post.category.toUpperCase()}
              </p>
            </footer>
          )}
        </article>
      </div>
    </div>
  );
};

export default BlogPostDetail;
