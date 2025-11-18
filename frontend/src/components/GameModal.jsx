// src/components/GameModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";

export default function GameModal({ game, onClose }) {
  const navigate = useNavigate();

  if (!game) return null;

  // ⭐ Backend thumbnail fix
  const imageSrc = game.thumbnail?.startsWith("/uploads")
    ? `http://localhost:5000${game.thumbnail}`
    : game.thumbnail || game.image || "/fallback.png";

  // ⭐ Navigate only (no play count here)
  const handlePlayNow = () => {
    onClose();
    navigate(`/game/${game.slug}?autoPlay=true`);
    setTimeout(() => window.scrollTo(0, 0), 50);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button style={styles.closeBtn} onClick={onClose}>✕</button>

        {/* Thumbnail */}
        <div style={styles.imageWrapper}>
          <img src={imageSrc} alt={game.title} style={styles.image} />
        </div>

        {/* Content */}
        <div style={styles.content}>
          <h2 style={styles.title}>{game.title}</h2>
          <p style={styles.genre}>{game.genre}</p>

          {/* ⭐ FIXED — correct average rating */}
          <RatingStars rating={game.averageRating || 4.0} size={20} editable={false} />

          <p style={styles.description}>
            {game.description || "No description available."}
          </p>

          <button style={styles.playBtn} onClick={handlePlayNow}>
            ▶ Play Now
          </button>
        </div>

      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px",
    zIndex: 2000,
  },
  modal: {
    background: "#1e293b",
    width: "100%",
    maxWidth: "850px",
    borderRadius: "14px",
    overflow: "hidden",
    position: "relative",
    maxHeight: "92vh",
    overflowY: "auto",
    boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
  },
  closeBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "rgba(255,255,255,0.2)",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  imageWrapper: {
    width: "100%",
    height: "260px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  content: {
    padding: "20px 24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "6px",
    color: "#fff",
  },
  genre: {
    fontSize: "15px",
    color: "#93c5fd",
    marginBottom: "12px",
  },
  description: {
    fontSize: "15px",
    lineHeight: "1.5",
    color: "#d1d5db",
    margin: "10px 0 22px",
  },
  playBtn: {
    padding: "12px 20px",
    background: "#10b981",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
    fontWeight: "600",
  },
};
