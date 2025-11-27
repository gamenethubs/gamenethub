
// // src/components/GameCard.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import RatingStars from "./RatingStars";
// import { apiIncreasePlay } from "../services/api";
// import { useFavorites } from "../services/favoriteActions";
// import { useAuth } from "../context/AuthContext";
// import { absoluteUrl } from "../services/api";

// import cuteLikeGif from "../assets/cute-like.gif";

// export default function GameCard({ game }) {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();
//   const { isFavorite, toggleFavorite } = useFavorites();

//   const [hover, setHover] = useState(false);
//   const [gifPopup, setGifPopup] = useState(false);

//   const fav = isFavorite(game._id);
//   const imageSrc = absoluteUrl(game.thumbnail);

//   const canPlay = () => {
//     const last = localStorage.getItem(`play_${game._id}`);
//     if (!last) return true;
//     return Date.now() - Number(last) > 3000;
//   };

//   const handleCardClick = async () => {
//     if (canPlay()) {
//       try {
//         await apiIncreasePlay(game._id);
//         localStorage.setItem(`play_${game._id}`, Date.now());
//       } catch {}
//     }
//     navigate(`/game/${game.slug}?autoPlay=true`);
//   };

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
//         gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

//         osc.connect(gain);
//         gain.connect(ctx.destination);

//         osc.start(time);
//         osc.stop(time + duration);
//       };

//       const now = ctx.currentTime;
//       playTone(now, 900, 0.4);
//       playTone(now + 0.12, 1300, 0.35);
//       playTone(now + 0.24, 1800, 0.3);

//       setTimeout(() => ctx.close(), 600);
//     } catch {}
//   };

//   const handleFavorite = async (e) => {
//     e.stopPropagation();

//     if (!isAuthenticated) {
//       alert("Please login first to add favourites ❤️");
//       return;
//     }

//     const wasFav = fav;
//     await toggleFavorite(game._id);

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
//           ? "0 18px 35px rgba(255, 75, 255, 0.35)"
//           : "0 4px 10px rgba(0,0,0,0.3)",
//       }}
//       onClick={handleCardClick}
//       onMouseEnter={() => setHover(true)}
//       onMouseLeave={() => setHover(false)}
//     >
//       {/* ⭐ CARD CONTENT WRAPPER → fade only this */}
//       <div
//         style={{
//           ...styles.cardContent,
//           opacity: gifPopup ? 0.25 : 1,
//           filter: gifPopup ? "blur(1px)" : "none",
//         }}
//       >
//         {/* FAV ICON */}
//         <div
//           style={{
//             ...styles.heartBtn,
//             transform: fav ? "scale(1.35)" : "scale(1)",
//             color: fav ? "#ff4d6d" : "#ffffffcc",
//           }}
//           onClick={handleFavorite}
//         >
//           {fav ? "❤️" : "🤍"}
//         </div>

//         {/* IMAGE */}
//         <img src={imageSrc} alt={game.title} style={styles.image} />

//         {/* HOVER OVERLAY */}
//         {hover && (
//           <div style={styles.overlay}>
//             <div style={styles.titleBox}>
//               <h3 style={styles.overlayTitle}>{game.title}</h3>
//             </div>

//             <div style={styles.overlayBottom}>
//               <p style={styles.overlayGenre}>{game.genre}</p>

//               <div style={styles.overlayRating}>
//                 <RatingStars rating={game.averageRating || 4.0} size={18} />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ⭐ GIF ALWAYS BRIGHT (no fade) */}
//       {gifPopup && (
//         <img
//           src={cuteLikeGif}
//           alt="fav-gif"
//           style={styles.gifPopup}
//         />
//       )}
//     </div>
//   );
// }

// /* ================== STYLES ================== */

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

//   cardContent: {
//     width: "100%",
//     height: "100%",
//     position: "relative",
//     transition: "opacity 0.3s ease, filter 0.3s ease",
//   },

//   heartBtn: {
//     position: "absolute",
//     right: 12,
//     top: 12,
//     fontSize: 32,
//     cursor: "pointer",
//     zIndex: 20,
//     transition: "0.25s ease",
//   },

//   gifPopup: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     width: 150,
//     transform: "translate(-50%, -50%) scale(1.1)",
//     zIndex: 200,
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
//     zIndex: 10,
//   },

//   titleBox: {
//     background: "rgba(0,0,0,0.55)",
//     padding: "6px 12px",
//     borderRadius: 8,
//     alignSelf: "center",
//   },

//   overlayTitle: {
//     color: "white",
//     fontSize: "1.25rem",
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



////////////////////////////////new /////////////////////////////

// src/components/GameCard.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import RatingStars from "./RatingStars";
// import { apiIncreasePlay } from "../services/api";
// import { useFavorites } from "../services/favoriteActions";
// import { useAuth } from "../context/AuthContext";
// import { absoluteUrl } from "../services/api";

// import cuteLikeGif from "../assets/cute-like.gif";

// export default function GameCard({ game }) {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();
//   const { isFavorite, toggleFavorite } = useFavorites();

//   const [hover, setHover] = useState(false);
//   const [gifPopup, setGifPopup] = useState(false);

//   const fav = isFavorite(game._id);
//   const imageSrc = absoluteUrl(game.thumbnail);

//   const canPlay = () => {
//     const last = localStorage.getItem(`play_${game._id}`);
//     if (!last) return true;
//     return Date.now() - Number(last) > 3000;
//   };

//   const handleCardClick = async () => {
//     if (canPlay()) {
//       try {
//         await apiIncreasePlay(game._id);
//         localStorage.setItem(`play_${game._id}`, Date.now());
//       } catch {}
//     }
//     navigate(`/game/${game.slug}?autoPlay=true`);
//   };

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
//         gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

//         osc.connect(gain);
//         gain.connect(ctx.destination);

//         osc.start(time);
//         osc.stop(time + duration);
//       };

//       const now = ctx.currentTime;
//       playTone(now, 900, 0.4);
//       playTone(now + 0.12, 1300, 0.35);
//       playTone(now + 0.24, 1800, 0.3);

//       setTimeout(() => ctx.close(), 600);
//     } catch {}
//   };

//   const handleFavorite = async (e) => {
//     e.stopPropagation();

//     if (!isAuthenticated) {
//       alert("Please login first to add favourites ❤️");
//       return;
//     }

//     const wasFav = fav;
//     await toggleFavorite(game._id);

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
//           ? "0 18px 35px rgba(255, 75, 255, 0.35)"
//           : "0 4px 10px rgba(0,0,0,0.3)",
//       }}
//       onClick={handleCardClick}
//       onMouseEnter={() => setHover(true)}
//       onMouseLeave={() => setHover(false)}
//     >
//       {/* ⭐ CARD CONTENT WRAPPER → fade only this */}
//       <div
//         style={{
//           ...styles.cardContent,
//           opacity: gifPopup ? 0.25 : 1,
//           filter: gifPopup ? "blur(1px)" : "none",
//         }}
//       >
//         {/* FAV ICON */}
//         <div
//           style={{
//             ...styles.heartBtn,
//             transform: fav ? "scale(1.35)" : "scale(1)",
//             color: fav ? "#ff4d6d" : "#ffffffcc",
//           }}
//           onClick={handleFavorite}
//         >
//           {fav ? "❤️" : "🤍"}
//         </div>

//         {/* IMAGE */}
//         <img src={imageSrc} alt={game.title} style={styles.image} />

//         {/* HOVER OVERLAY */}
//         {hover && (
//           <div style={styles.overlay}>
//             <div style={styles.titleBox}>
//               <h3 style={styles.overlayTitle}>{game.title}</h3>
//             </div>

//             <div style={styles.overlayBottom}>
//               <p style={styles.overlayGenre}>{game.genre}</p>

//               <div style={styles.overlayRating}>
//                 <RatingStars rating={game.averageRating || 4.0} size={18} />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ⭐ GIF ALWAYS BRIGHT (no fade) */}
//       {gifPopup && (
//         <img
//           src={cuteLikeGif}
//           alt="fav-gif"
//           style={styles.gifPopup}
//         />
//       )}
//     </div>
//   );
// }

// /* ================== STYLES ================== */

// const styles = {
//   card: {
//     position: "relative",
//     borderRadius: 14,
//     overflow: "hidden",
//      width: "140px",      // SMALL
//   height: "140px",
//     cursor: "pointer",
//     transition: "0.3s ease",
//     background: "#0f172a",
//   },

//   cardContent: {
//     width: "100%",
//     height: "100%",
//     position: "relative",
//   },

//   heartBtn: {
//     position: "absolute",
//     right: 8,
//     top: 8,
//     fontSize: 24,
//     cursor: "pointer",
//     zIndex: 20,
//     // transition: "0.25s",
//     width: 30,
//   height: 30,
//   borderRadius: "50%",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
  
//   backdropFilter: "blur(6px)",
//   border: "1px solid rgba(255,255,255,0.32)",

//   /* smoothness */
//   transition: "0.3s ease",

//   /* floating animation */
//   animation: "pulseFloat 3s ease-in-out infinite",

//   background: "rgba(255,255,255,0.18)",
  
//   boxShadow:
//     "0 0 10px rgba(255,255,255,0.35), 0 0 18px rgba(255,0,150,0.45)",

//   },

//   gifPopup: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     width: 110,
//     transform: "translate(-50%, -50%)",
//     zIndex: 999,
//   },

//   image: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//   },

//   overlay: {
//     position: "absolute",
//     inset: 0,
//     background: "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.9))",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "flex-end",
//     padding: "10px",
//   },

//   titleBox: {
//     // width: "100%",
//     padding: "4px 6px",
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   maxWidth: "85%", 
//   transform: "translate(-50%, -50%)",
//     // background: "rgba(0,0,0,0.45)",
//      background: "rgba(0,0,0,0.55)",
//       // background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.85))",
//     borderRadius: "6px",
//   // backdropFilter: "blur(4px)",
//   // boxShadow: "0 0 18px rgba(0, 200, 255, 0.55)",
//   opacity: 0,
//   animation: "fadeInUp 0.4s ease forwards",
//   },

//   overlayTitle: {
//     // color: "white",
//     // fontSize: "0.95rem",
//     fontSize: "0.82rem", 
//     fontWeight: 700,
//     lineHeight: "1.1",
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     color: "#ffffff",
//   // fontSize: "1.3rem",
//   // fontWeight: "800",
//   textAlign: "center",
//    maxWidth: "100%",
//   letterSpacing: "0.3px",
//   // textShadow:
//     // "0 0 6px rgba(0,255,255,0.8), 0 0 18px rgba(0,255,255,0.4), 0 0 30px rgba(0,255,255,0.25)",
//   },

//   overlayBottom: {
//     marginTop: 4,
//   },

//   overlayGenre: {
//     color: "#cbd5e1",
//     fontSize: "0.7rem",
//     marginBottom: 4,
//   },

//   overlayRating: {
//     display: "flex",
//     alignItems: "center",
//     gap: 4,
//   },

//   /* ⭐ MOBILE FIX */
//   "@media (max-width: 600px)": {
//     card: {
//       width: "140px",
//       height: "185px",
//     },
//     overlayTitle: {
//       fontSize: "0.75rem",
//     },
//     overlayGenre: {
//       fontSize: "0.65rem",
//     },
//   },
  
// };
// const keyframes = `
// @keyframes fadeInUp {
//   0% { opacity: 0; transform: translate(-50%, -40%); }
//   100% { opacity: 1; transform: translate(-50%, -50%); }
// }
// `;

// const style = document.createElement("style");
// style.innerHTML = keyframes;
// document.head.appendChild(style);


// src/components/GameCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";
import { apiIncreasePlay } from "../services/api";
import { useFavorites } from "../services/favoriteActions";
import { useAuth } from "../context/AuthContext";
import { absoluteUrl } from "../services/api";

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

        {/* ⭐ DEVICE ICON (HOVER ONLY) */}
        {hover && badgeIcon && (
          <img src={badgeIcon} alt="device-icon" style={styles.deviceIcon} />
        )}


        {/* IMAGE */}
        {/* <img src={imageSrc} alt={game.title} style={styles.image} /> */}
        {/* changes */}
        <img
  src={imageSrc}
  alt={game.title}
  style={styles.image}
  loading="lazy"
  decoding="async"
/>
{/* changes end */}

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

