// src/services/movieApi.js
import axios from "axios";

// Using TMDB (The Movie Database) API
const API_KEY = "a48263c4c028a8de6a15f323f065057a"; // Replace with your actual API key
const BASE_URL = "https://api.themoviedb.org/3";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

// Get top rated movies (closest to "top 250" concept)
export const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await api.get("/movie/top_rated", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    throw error;
  }
};

// Get movie details
export const getMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: "videos,credits",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    throw error;
  }
};

// Fallback function to get movies if API is not available
export const getFallbackTopMovies = () => {
  return {
    results: [
      {
        id: 1,
        title: "THE SHAWSHANK REDEMPTION",
        poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        release_date: "1994-09-23",
        vote_average: 8.7,
      },
      {
        id: 2,
        title: "THE GODFATHER",
        poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        release_date: "1972-03-14",
        vote_average: 8.7,
      },
      {
        id: 3,
        title: "THE DARK KNIGHT",
        poster_path: "/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg",
        release_date: "2008-07-16",
        vote_average: 8.5,
      },
      {
        id: 4,
        title: "THE GODFATHER PART II",
        poster_path: "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
        release_date: "1974-12-18",
        vote_average: 8.6,
      },
      {
        id: 5,
        title: "12 ANGRY MEN",
        poster_path: "/ppd84D2i9W8jXmsyInGyihiSyqz.jpg",
        release_date: "1957-04-10",
        vote_average: 8.5,
      },
      // Add more fallback movies as needed
    ],
    total_pages: 1,
    total_results: 5,
  };
};

// Fallback function for movie details
export const getFallbackMovieDetails = (movieId) => {
  const movies = {
    1: {
      id: 1,
      title: "THE SHAWSHANK REDEMPTION",
      poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
      release_date: "1994-09-23",
      vote_average: 8.7,
      runtime: 142,
      overview:
        "FRAMED IN THE 1940S FOR THE DOUBLE MURDER OF HIS WIFE AND HER LOVER, UPSTANDING BANKER ANDY DUFRESNE BEGINS A NEW LIFE AT THE SHAWSHANK PRISON, WHERE HE PUTS HIS ACCOUNTING SKILLS TO WORK FOR AN AMORAL WARDEN. DURING HIS LONG STRETCH IN PRISON, DUFRESNE COMES TO BE ADMIRED BY THE OTHER INMATES -- INCLUDING AN OLDER PRISONER NAMED RED -- FOR HIS INTEGRITY AND UNQUENCHABLE SENSE OF HOPE.",
      genres: [
        { id: 18, name: "DRAMA" },
        { id: 80, name: "CRIME" },
      ],
      credits: {
        cast: [
          { id: 504, name: "TIM ROBBINS", character: "ANDY DUFRESNE" },
          {
            id: 192,
            name: "MORGAN FREEMAN",
            character: 'ELLIS BOYD "RED" REDDING',
          },
        ],
      },
      videos: {
        results: [
          {
            id: "5a9428dc9251412a9c0010f4",
            key: "NmzuHjWmXOc",
            site: "YouTube",
            type: "Trailer",
          },
        ],
      },
    },
    // Add more fallback movie details as needed
  };

  return (
    movies[movieId] || {
      id: movieId,
      title: "MOVIE DETAILS UNAVAILABLE",
      overview: "UNABLE TO RETRIEVE MOVIE DATA FROM DATABASE.",
      poster_path: null,
      backdrop_path: null,
      release_date: "UNKNOWN",
      vote_average: 0,
      runtime: 0,
      genres: [],
      videos: { results: [] },
      credits: { cast: [] },
    }
  );
};
