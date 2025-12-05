
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";
import { apiIncreasePlay } from "../services/api";
import { useFavorites } from "../services/favoriteActions";
import { useAuth } from "../context/AuthContext";
import { absoluteUrl } from "../services/api";
import { useMemo } from "react";

import cuteLikeGif from "../assets/cute-like.gif";


// ⭐ NEW ICON IMPORTS
import mobileIcon from "../assets/mobileIcon.png";
import desktopIcon from "../assets/desktopIcon.png";

export default function GameCard({ game }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [hover, setHover] = useState(false);
  const [gifPopup, setGifPopup] = useState(false);

  const fav = isFavorite(game._id);
  const imageSrc = absoluteUrl(game.thumbnail);

  // ⭐ NEW: device compatibility badge logic
  const compatibility = game.deviceCompatibility || "all";

  const getIcon = () => {
    if (compatibility === "mobile") return mobileIcon;
    if (compatibility === "desktop") return desktopIcon;
    return null;
  };

  const badgeIcon = getIcon();

  const canPlay = () => {
    const last = localStorage.getItem(`play_${game._id}`);
    if (!last) return true;
    return Date.now() - Number(last) > 3000;
  };

  const handleCardClick = async () => {
    if (canPlay()) {
      try {
        await apiIncreasePlay(game._id);
        localStorage.setItem(`play_${game._id}`, Date.now());
      } catch {}
    }
    // / ✅ SMART ROUTING FIX
  if (game.isKids) {
    navigate(`/kids/game/${game.slug}?autoPlay=true`);
  } else {
    navigate(`/game/${game.slug}?autoPlay=true`);
  }
  };
 

  //Added
  const imgCache = new Map();
  const finalImage = useMemo(() => {
  if (imgCache.has(imageSrc)) return imgCache.get(imageSrc);
  imgCache.set(imageSrc, imageSrc);
  return imageSrc;
}, [imageSrc]);



  const playTwinkleSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();

      const playTone = (time, freq, gainValue, duration = 0.25) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(gainValue, time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + duration);
      };

      const now = ctx.currentTime;
      playTone(now, 900, 0.4);
      playTone(now + 0.12, 1300, 0.35);
      playTone(now + 0.24, 1800, 0.3);

      setTimeout(() => ctx.close(), 600);
    } catch {}
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Please login first to add favourites ❤️");
      return;
    }

    const wasFav = fav;
    await toggleFavorite(game._id);

    if (!wasFav) {
      playTwinkleSound();
      setGifPopup(true);
      setTimeout(() => setGifPopup(false), 1100);
    }
  };

  return (
    <div
      style={{
        ...styles.card,
        transform: hover ? "scale(1.08) rotate(0.5deg)" : "scale(1)",
        boxShadow: hover
          ? "0 18px 35px rgba(255, 75, 255, 0.35)"
          : "0 4px 10px rgba(0,0,0,0.3)",
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* ⭐ CARD CONTENT WRAPPER → fade only this */}
      <div
        style={{
          ...styles.cardContent,
          opacity: gifPopup ? 0.25 : 1,
          filter: gifPopup ? "blur(1px)" : "none",
        }}
      >
        {/* FAV ICON */}
        <div
          style={{
            ...styles.heartBtn,
            transform: fav ? "scale(1.35)" : "scale(1)",
            color: fav ? "#ff4d6d" : "#ffffffcc",
          }}
          onClick={handleFavorite}
        >
          {fav ? "❤️" : "💛"}
        </div>

        {/* ⭐ DEVICE ICON (HOVER ONLY) */}
        {hover && badgeIcon && (
          <img src={badgeIcon} alt="device-icon" style={styles.deviceIcon} />
        )}


        {/* IMAGE */}
        {/* <img src={imageSrc} alt={game.title} style={styles.image} /> */}

        <img
              src={finalImage.replace(/\.(png|jpg|jpeg)$/i, ".webp")}
              onError={(e) => (e.currentTarget.src = finalImage)}
              loading="lazy"
              alt={game.title}
              srcSet={`
                ${finalImage}?resize=150 150w,
                ${finalImage}?resize=300 300w,
                ${finalImage}?resize=600 600w
              `}
              sizes="(max-width: 600px) 150px, 300px"
              style={{
                width: "100%", 
                height: "100%",
                objectFit: "cover",
                borderRadius: "0",
                filter: "blur(12px)",
                transition: "filter .45s ease",
                background: "#0f172a",
              }}
              onLoad={(e) => {
                e.currentTarget.style.filter = "blur(0px)";
              }}
            />


        {/* HOVER OVERLAY */}
        {hover && (
          <div style={styles.overlay}>
            <div style={styles.titleBox}>
              <h3 style={styles.overlayTitle}>{game.title}</h3>
            </div>

            <div style={styles.overlayBottom}>
              <p style={styles.overlayGenre}>{game.genre}</p>

              <div style={styles.overlayRating}>
                <RatingStars rating={game.averageRating || 4.0} size={18} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ⭐ GIF ALWAYS BRIGHT (no fade) */}
      {gifPopup && (
        <img
          src={cuteLikeGif}
          alt="fav-gif"
          style={styles.gifPopup}
        />
      )}
    </div>
  );
}

/* ================== STYLES ================== */

const styles = {
  card: {
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
    width: "140px",      // SMALL
    height: "140px",
    cursor: "pointer",
    transition: "0.3s ease",
    background: "#0f172a",
  },

  cardContent: {
    width: "100%",
    height: "100%",
    position: "relative",
  },

  heartBtn: {
    position: "absolute",
    right: 8,
    top: 8,
    fontSize: 24,
    cursor: "pointer",
    zIndex: 20,
    width: 30,
    height: 30,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,0.32)",

    transition: "0.3s ease",
    animation: "pulseFloat 3s ease-in-out infinite",

    background: "rgba(255,255,255,0.18)",

    boxShadow:
      "0 0 10px rgba(255,255,255,0.35), 0 0 18px rgba(255,0,150,0.45)",
  },
  deviceIcon: {
  position: "absolute",
  top: 4,        // ⭐ more top
  left: 4,       // ⭐ more left
  width: 44,     // ⭐ slightly bigger
  height: 44,
  zIndex: 20,
  opacity: 0.98,
  objectFit: "contain",
  pointerEvents: "none",
},



  gifPopup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 110,
    transform: "translate(-50%, -50%)",
    zIndex: 999,
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.9))",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "10px",
  },

  titleBox: {
    padding: "4px 6px",
    position: "absolute",
    top: "50%",
    left: "50%",
    maxWidth: "85%",
    transform: "translate(-50%, -50%)",
    background: "rgba(0,0,0,0.55)",
    borderRadius: "6px",
    opacity: 0,
    animation: "fadeInUp 0.4s ease forwards",
  },

  overlayTitle: {
    fontSize: "0.82rem",
    fontWeight: 700,
    lineHeight: "1.1",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#ffffff",
    textAlign: "center",
    maxWidth: "100%",
    letterSpacing: "0.3px",
  },

  overlayBottom: {
    marginTop: 4,
  },

  overlayGenre: {
    color: "#cbd5e1",
    fontSize: "0.7rem",
    marginBottom: 4,
  },

  overlayRating: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },


  /* ⭐ MOBILE FIX */
  "@media (max-width: 600px)": {
    card: {
      width: "140px",
      height: "185px",
    },
    overlayTitle: {
      fontSize: "0.75rem",
    },
    overlayGenre: {
      fontSize: "0.65rem",
    },
  },
};

const keyframes = `
@keyframes fadeInUp {
  0% { opacity: 0; transform: translate(-50%, -40%); }
  100% { opacity: 1; transform: translate(-50%, -50%); }
}
`;

const style = document.createElement("style");
style.innerHTML = keyframes;
document.head.appendChild(style);

