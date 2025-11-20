// // src/components/GameCard.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import RatingStars from "./RatingStars";
// import { increasePlay } from "../services/gameActions";
// import { useFavorites } from "../services/favoriteActions";
// import { useAuth } from "../context/AuthContext";

// export default function GameCard({ game }) {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();
//   const { isFavorite, toggleFavorite } = useFavorites();

//   const fav = isFavorite(game._id);

//   // ⭐ Correct thumbnail
//   const imageSrc = game.thumbnail?.startsWith("/uploads")
//     ? `http://localhost:5000${game.thumbnail}`
//     : game.thumbnail || game.image || "/fallback.png";

//   // ⭐ Play spam block (3 sec)
//   const canPlay = () => {
//     const last = localStorage.getItem(`play_${game._id}`);
//     if (!last) return true;
//     return Date.now() - Number(last) > 3000;
//   };

//   // ⭐ Direct Play from GameCard
//   const handlePlayClick = async (e) => {
//     e.stopPropagation();
//     if (!canPlay()) return;

//     try {
//       await increasePlay(game._id);       // ⭐ COUNT PLAY HERE
//       localStorage.setItem(`play_${game._id}`, Date.now());
//     } catch (err) {
//       console.log("Play count update failed:", err);
//     }

//     navigate(`/game/${game.slug}?autoPlay=true`);
//   };

//   // ⭐ Favourite toggle
//   const handleFavorite = async (e) => {
//     e.stopPropagation();

//     if (!isAuthenticated) {
//       alert("Please login first to add favourites ❤️");
//       return;
//     }

//     await toggleFavorite(game._id);
//   };

//   return (
//     <div
//       style={styles.card}
//       onClick={() => navigate(`/game/${game.slug}`)}   // ⭐ NORMAL CLICK
//       onMouseEnter={(e) => {
//         e.currentTarget.style.transform = "scale(1.05)";
//         e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.5)";
//         e.currentTarget.style.background =
//           "linear-gradient(145deg, #1e293b, #28334d)";
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.transform = "scale(1)";
//         e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
//         e.currentTarget.style.background = "#1e293b";
//       }}
//     >
//       {/* ⭐ Favourite Heart */}
//       <div
//         style={{
//           ...styles.heartBtn,
//           color: fav ? "#ff4d6d" : "#ffffffcc",
//           transform: fav ? "scale(1.25)" : "scale(1)",
//         }}
//         onClick={handleFavorite}
//       >
//         {fav ? "❤️" : "🤍"}
//       </div>

//       <img src={imageSrc} alt={game.title} style={styles.image} />

//       <div style={styles.info}>
//         <h3 style={styles.title}>{game.title}</h3>
//         <p style={styles.genre}>{game.genre}</p>

//         {/* ⭐ Rating */}
//         <RatingStars
//           rating={game.averageRating || 4.0}
//           size={18}
//           editable={false}
//         />

//         <button
//           style={styles.playButton}
//           onClick={handlePlayClick}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.background = "#3b82f6";
//             e.currentTarget.style.transform = "translateY(-2px)";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.background = "#2563eb";
//             e.currentTarget.style.transform = "translateY(0)";
//           }}
//         >
//           Play Now
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   card: {
//     position: "relative",
//     background: "#1e293b",
//     borderRadius: 12,
//     overflow: "hidden",
//     width: 220,
//     boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
//     transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
//     cursor: "pointer",
//   },

//   heartBtn: {
//     position: "absolute",
//     right: 10,
//     top: 10,
//     fontSize: 24,
//     cursor: "pointer",
//     zIndex: 10,
//     transition: "0.25s",
//     userSelect: "none",
//   },

//   image: {
//     width: "100%",
//     height: 140,
//     objectFit: "cover",
//   },

//   info: {
//     padding: "12px",
//   },
//   title: {
//     fontSize: 16,
//     color: "#fff",
//     marginBottom: 4,
//   },
//   genre: {
//     fontSize: 13,
//     color: "#a5b4fc",
//     marginBottom: 6,
//   },

//   playButton: {
//     width: "100%",
//     padding: "8px",
//     background: "#2563eb",
//     border: "none",
//     color: "#fff",
//     borderRadius: 6,
//     cursor: "pointer",
//     marginTop: "8px",
//     fontWeight: 500,
//     transition: "background 0.3s, transform 0.2s",
//   },
// };


// // src/components/GameCard.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import RatingStars from "./RatingStars";
// import { apiIncreasePlay } from "../services/api";
// import { useFavorites } from "../services/favoriteActions";
// import { useAuth } from "../context/AuthContext";
// import { absoluteUrl } from "../services/api";

// export default function GameCard({ game }) {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();
//   const { isFavorite, toggleFavorite } = useFavorites();

//   const [hover, setHover] = useState(false);
//   const [gifPopup, setGifPopup] = useState(false); // GIF popup

//   const fav = isFavorite(game._id);
//   const imageSrc = absoluteUrl(game.thumbnail);

//   /** ⭐ Stop spam play */
//   const canPlay = () => {
//     const last = localStorage.getItem(`play_${game._id}`);
//     if (!last) return true;
//     return Date.now() - Number(last) > 3000;
//   };

//   /** ⭐ Full card click play */
//   const handleCardClick = async () => {
//     if (canPlay()) {
//       try {
//         await apiIncreasePlay(game._id);
//         localStorage.setItem(`play_${game._id}`, Date.now());
//       } catch (err) {}
//     }
//     navigate(`/game/${game.slug}?autoPlay=true`);
//   };

//   /** ⭐ Twinkle sound (works always) */
//   const playTwinkleSound = () => {
//     try {
//       const AudioContext = window.AudioContext || window.webkitAudioContext;
//       const ctx = new AudioContext();

//       const playTone = (time, freq, gainValue, duration = 0.25) => {
//         const osc = ctx.createOscillator();
//         const gain = ctx.createGain();

//         osc.type = "sine";
//         osc.frequency.setValueAtTime(freq, time);

//         gain.gain.setValueAtTime(0, time);
//         gain.gain.linearRampToValueAtTime(gainValue, time + 0.03);
//         gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

//         osc.connect(gain);
//         gain.connect(ctx.destination);

//         osc.start(time);
//         osc.stop(time + duration);
//       };

//       const now = ctx.currentTime;
//       playTone(now, 900, 0.4, 0.22);
//       playTone(now + 0.12, 1300, 0.35, 0.18);
//       playTone(now + 0.22, 1800, 0.30, 0.18);

//       setTimeout(() => ctx.close(), 600);
//     } catch (e) {}
//   };

//   /** ⭐ Favourite with GIF popup */
//   const handleFavorite = async (e) => {
//     e.stopPropagation();

//     if (!isAuthenticated) {
//       alert("Please login first to add favourites ❤️");
//       return;
//     }

//     const wasFav = isFavorite(game._id);
//     await toggleFavorite(game._id);

//     // Only on ADD
//     if (!wasFav) {
//       playTwinkleSound();

//       setGifPopup(true);
//       setTimeout(() => setGifPopup(false), 1100);
//     }
//   };

//   return (
//     <div
//       style={{
//         ...styles.card,
//         transform: hover ? "scale(1.08) rotate(0.5deg)" : "scale(1)",
//         boxShadow: hover
//           ? "0 15px 35px rgba(255, 75, 255, 0.35)"
//           : "0 4px 10px rgba(0,0,0,0.3)",
//         filter: hover ? "brightness(1.08)" : "brightness(1)",
//       }}
//       onClick={handleCardClick}
//       onMouseEnter={() => setHover(true)}
//       onMouseLeave={() => setHover(false)}
//     >
//       {/* ❤️ / 😍 ICON */}
//       <div
//         style={{
//           ...styles.heartBtn,
//           transform: fav ? "scale(1.4)" : "scale(1)",
//           color: fav ? "#ff4d6d" : "#ffffffcc",
//         }}
//         onClick={handleFavorite}
//       >
//         {fav ? "😍" : "🤍"}
//       </div>

//       {/* WORKING GIF POPUP */}
//       {gifPopup && (
//         <img
//           src="https://media.tenor.com/YNy7WOlJnmgAAAAM/hearts-love.gif"
//           alt="fav-gif"
//           style={styles.gifPopup}
//         />
//       )}

//       {/* THUMBNAIL */}
//       <img src={imageSrc} alt={game.title} style={styles.image} />

//       {/* HOVER OVERLAY */}
//       {hover && (
//         <div style={styles.overlay}>
//           <div style={styles.titleBox}>
//             <h3 style={styles.overlayTitle}>{game.title}</h3>
//           </div>

//           <div style={styles.overlayBottom}>
//             <p style={styles.overlayGenre}>{game.genre}</p>

//             <div style={styles.overlayRating}>
//               <RatingStars rating={game.averageRating || 4.0} size={18} />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ====================== STYLES ========================= */

// const styles = {
//   card: {
//     position: "relative",
//     borderRadius: 16,
//     overflow: "hidden",
//     width: 240,
//     height: 240,
//     cursor: "pointer",
//     transition: "0.3s ease",
//   },

//   heartBtn: {
//     position: "absolute",
//     right: 12,
//     top: 12,
//     fontSize: 32,
//     cursor: "pointer",
//     zIndex: 50,
//     transition: "0.25s ease",
//     userSelect: "none",
//   },

//   /** GIF ALWAYS VISIBLE */
//   gifPopup: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     width: 150,
//     height: "auto",
//     transform: "translate(-50%, -50%)",
//     zIndex: 60,
//     animation: "fadePop 1s ease forwards",
//     pointerEvents: "none",
//   },

//   image: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//   },

//   overlay: {
//     position: "absolute",
//     inset: 0,
//     background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.85))",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     padding: 20,
//     zIndex: 20,
//   },

//   titleBox: {
//     background: "rgba(0,0,0,0.55)",
//     padding: "6px 12px",
//     borderRadius: 8,
//     alignSelf: "center",
//   },

//   overlayTitle: {
//     color: "white",
//     fontSize: "1.3rem",
//     fontWeight: 700,
//     textAlign: "center",
//   },

//   overlayBottom: {
//     position: "absolute",
//     bottom: 20,
//     left: 20,
//     right: 20,
//   },

//   overlayGenre: {
//     color: "#d1d5db",
//     fontSize: "0.95rem",
//     marginBottom: 6,
//   },

//   overlayRating: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//   },
// };


// src/components/GameCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";
import { apiIncreasePlay } from "../services/api";
import { useFavorites } from "../services/favoriteActions";
import { useAuth } from "../context/AuthContext";
import { absoluteUrl } from "../services/api";

import cuteLikeGif from "../assets/cute-like.gif";

export default function GameCard({ game }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [hover, setHover] = useState(false);
  const [gifPopup, setGifPopup] = useState(false);

  const fav = isFavorite(game._id);
  const imageSrc = absoluteUrl(game.thumbnail);

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
    navigate(`/game/${game.slug}?autoPlay=true`);
  };

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
          {fav ? "❤️" : "🤍"}
        </div>

        {/* IMAGE */}
        <img src={imageSrc} alt={game.title} style={styles.image} />

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
    borderRadius: 16,
    overflow: "hidden",
    width: 240,
    height: 240,
    cursor: "pointer",
    transition: "0.3s ease",
  },

  cardContent: {
    width: "100%",
    height: "100%",
    position: "relative",
    transition: "opacity 0.3s ease, filter 0.3s ease",
  },

  heartBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    fontSize: 32,
    cursor: "pointer",
    zIndex: 20,
    transition: "0.25s ease",
  },

  gifPopup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 150,
    transform: "translate(-50%, -50%) scale(1.1)",
    zIndex: 200,
    pointerEvents: "none",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.85))",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
    zIndex: 10,
  },

  titleBox: {
    background: "rgba(0,0,0,0.55)",
    padding: "6px 12px",
    borderRadius: 8,
    alignSelf: "center",
  },

  overlayTitle: {
    color: "white",
    fontSize: "1.25rem",
    fontWeight: 700,
    textAlign: "center",
  },

  overlayBottom: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },

  overlayGenre: {
    color: "#d1d5db",
    fontSize: "0.95rem",
    marginBottom: 6,
  },

  overlayRating: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
};
