// // src/services/api.js
// import axios from "axios";

// // Base axios instance
// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

// // Auto attach token
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// /**************************************
//  *  AUTH API
//  **************************************/
// export const loginUser = (data) => API.post("/auth/login", data);
// export const registerUser = (data) => API.post("/auth/register", data);

// /**************************************
//  *  GAMES API
//  **************************************/

// export const getAllGames = () => API.get("/games");

// // ⭐ Fully populated game (correct endpoint)
// export const getGameBySlug = (slug) => API.get(`/games/slug/${slug}`);

// export const getGameById = (id) => API.get(`/games/id/${id}`);

// export const createGame = (formData) =>
//   API.post("/games", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

// export const updateGame = (id, formData) =>
//   API.put(`/games/${id}`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

// export const deleteGame = (id) => API.delete(`/games/${id}`);

// /**************************************
//  *  GAME ACTIONS
//  **************************************/

// // ⭐ Only used by internal services, name simplified:
// export const apiIncreasePlay = (id) => API.post(`/games/${id}/play`);

// // ⭐ Used by gameActions.js internally
// export const apiRateGame = (id, stars) =>
//   API.post(`/games/${id}/rate`, { stars });

// /**************************************
//  *  TEST
//  **************************************/
// export const getTestData = () => API.get("/test");

// export default API;

// src/services/api.js
import axios from "axios";

// Use environment variable when available; fallback to Render URL
const API_BASE = (process.env.REACT_APP_API_BASE || "https://gamenethub.onrender.com").replace(/\/+$/, "");
const API = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true, // backend allows credentials; optional but usually safe
});

// Auto attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Helper to convert server-returned relative paths into absolute public URLs.
 * Example: game.thumbnail === "/uploads/thumbnails/123.png"
 * absoluteUrl(game.thumbnail) -> "https://gamenethub.onrender.com/uploads/thumbnails/123.png"
 */
export const absoluteUrl = (relativePath) => {
  if (!relativePath) return "";
  // If it's already absolute (http/https), return as-is
  if (/^https?:\/\//i.test(relativePath)) return relativePath;
  return `${API_BASE}${relativePath}`;
};

/**************************************
 *  AUTH API
 **************************************/
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

/**************************************
 *  GAMES API
 **************************************/

export const getAllGames = () => API.get("/games");

// Fully populated game (correct endpoint)
export const getGameBySlug = (slug) => API.get(`/games/slug/${slug}`);

export const getGameById = (id) => API.get(`/games/id/${id}`);

export const createGame = (formData) =>
  API.post("/games", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateGame = (id, formData) =>
  API.put(`/games/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteGame = (id) => API.delete(`/games/${id}`);

/**************************************
 *  GAME ACTIONS
 **************************************/
// Increase play count (no auth required)
export const apiIncreasePlay = (id) => API.post(`/games/${id}/play`);

// Rate game (auth required)
export const apiRateGame = (id, stars) =>
  API.post(`/games/${id}/rate`, { stars });

/**************************************
 *  TEST
 **************************************/
export const getTestData = () => API.get("/test");

export default API;
