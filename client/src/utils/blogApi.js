import api from "./axios";

// Create a new post
export const createPost = async (postData) => {
  try {
    const response = await api.post("/api/posts", postData);
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Get all posts with pagination and filters
export const getPosts = async (params = {}) => {
  try {
    const response = await api.get("/api/posts", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], totalPages: 0, currentPage: 1, total: 0 };
  }
};

// Get user's posts
export const getUserPosts = async () => {
  try {
    const response = await api.get("/api/posts/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
};

// Get a single post
export const getPost = async (postId) => {
  try {
    const response = await api.get(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

// Update a post
export const updatePost = async (postId, postData) => {
  try {
    const response = await api.put(`/api/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
