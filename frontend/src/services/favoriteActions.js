// src/services/favoriteActions.js
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api/favorites";

/*************************************************
 * ⭐ Backend API Calls
 *************************************************/
export async function fetchFavoritesAPI() {
  try {
    const res = await axios.get(`${API}/my-favorites`);
    return res.data.favorites || [];
  } catch (err) {
    console.log("FAV FETCH ERROR:", err);
    return [];
  }
}

export async function toggleFavoriteAPI(gameId) {
  try {
    const res = await axios.post(`${API}/toggle/${gameId}`);
    return res.data;
  } catch (err) {
    console.log("FAV TOGGLE ERROR:", err);
    return { error: true };
  }
}

/*************************************************
 * ⭐ useFavorites Hook
 *************************************************/
export function useFavorites() {
  const {
    isAuthenticated,
    favorites: globalFavs,
    setInitialFavorites,
    toggleFavoriteLocal,
  } = useAuth();

  // Local state (full sync with global state)
  const [favorites, setFavorites] = useState(globalFavs || []);

  /*************************************************
   * ⭐ Refresh favorites from backend
   *************************************************/
  const refreshFavorites = async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      if (setInitialFavorites) setInitialFavorites([]);
      return [];
    }

    const favGames = await fetchFavoritesAPI();
    const ids = favGames.map((g) => g._id);

    setFavorites(ids);
    if (setInitialFavorites) setInitialFavorites(ids);

    return favGames;
  };

  /*************************************************
   * ⭐ Toggle Favorite
   *************************************************/
  const toggleFavorite = async (gameId) => {
    if (!isAuthenticated) return { error: "LOGIN_REQUIRED" };

    const res = await toggleFavoriteAPI(gameId);
    if (res.error) return res;

    // Update UI instantly (local + AuthContext)
    setFavorites((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId]
    );

    if (toggleFavoriteLocal) toggleFavoriteLocal(gameId);

    return res;
  };

  /*************************************************
   * ⭐ Check if favorite
   *************************************************/
  const isFavorite = (gameId) => favorites.includes(gameId);

  /*************************************************
   * ⭐ Auto-load when login state changes
   *************************************************/
  useEffect(() => {
    refreshFavorites();
  }, [isAuthenticated]);

  /*************************************************
   * ⭐ Auto-sync with AuthContext favorites
   *************************************************/
  useEffect(() => {
    setFavorites(globalFavs || []);
  }, [globalFavs]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    refreshFavorites,
  };
}
