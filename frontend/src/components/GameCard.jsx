// src/components/GameCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";
import { increasePlay } from "../services/gameActions";
import { useFavorites } from "../services/favoriteActions";
import { useAuth } from "../context/AuthContext";

export default function GameCard({ game }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const fav = isFavorite(game._id);

  // ⭐ Correct thumbnail
  const imageSrc = game.thumbnail?.startsWith("/uploads")
    ? `http://localhost:5000${game.thumbnail}`
    : game.thumbnail || game.image || "/fallback.png";

  // ⭐ Play spam block (3 sec)
  const canPlay = () => {
    const last = localStorage.getItem(`play_${game._id}`);
    if (!last) return true;
    return Date.now() - Number(last) > 3000;
  };

  // ⭐ Direct Play from GameCard
  const handlePlayClick = async (e) => {
    e.stopPropagation();
    if (!canPlay()) return;

    try {
      await increasePlay(game._id);       // ⭐ COUNT PLAY HERE
      localStorage.setItem(`play_${game._id}`, Date.now());
    } catch (err) {
      console.log("Play count update failed:", err);
    }

    navigate(`/game/${game.slug}?autoPlay=true`);
  };

  // ⭐ Favourite toggle
  const handleFavorite = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Please login first to add favourites ❤️");
      return;
    }

    await toggleFavorite(game._id);
  };

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/game/${game.slug}`)}   // ⭐ NORMAL CLICK
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.5)";
        e.currentTarget.style.background =
          "linear-gradient(145deg, #1e293b, #28334d)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
        e.currentTarget.style.background = "#1e293b";
      }}
    >
      {/* ⭐ Favourite Heart */}
      <div
        style={{
          ...styles.heartBtn,
          color: fav ? "#ff4d6d" : "#ffffffcc",
          transform: fav ? "scale(1.25)" : "scale(1)",
        }}
        onClick={handleFavorite}
      >
        {fav ? "❤️" : "🤍"}
      </div>

      <img src={imageSrc} alt={game.title} style={styles.image} />

      <div style={styles.info}>
        <h3 style={styles.title}>{game.title}</h3>
        <p style={styles.genre}>{game.genre}</p>

        {/* ⭐ Rating */}
        <RatingStars
          rating={game.averageRating || 4.0}
          size={18}
          editable={false}
        />

        <button
          style={styles.playButton}
          onClick={handlePlayClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Play Now
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    position: "relative",
    background: "#1e293b",
    borderRadius: 12,
    overflow: "hidden",
    width: 220,
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
    cursor: "pointer",
  },

  heartBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    fontSize: 24,
    cursor: "pointer",
    zIndex: 10,
    transition: "0.25s",
    userSelect: "none",
  },

  image: {
    width: "100%",
    height: 140,
    objectFit: "cover",
  },

  info: {
    padding: "12px",
  },
  title: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
  genre: {
    fontSize: 13,
    color: "#a5b4fc",
    marginBottom: 6,
  },

  playButton: {
    width: "100%",
    padding: "8px",
    background: "#2563eb",
    border: "none",
    color: "#fff",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: "8px",
    fontWeight: 500,
    transition: "background 0.3s, transform 0.2s",
  },
};
