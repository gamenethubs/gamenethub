
// // src/pages/GameDetail.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate, useSearchParams } from "react-router-dom";
// import { getAllGames, getGameBySlug } from "../services/api";
// import { increasePlay, rateGame } from "../services/gameActions";
// import RatingStars from "../components/RatingStars";
// import GamePlayer from "../components/GamePlayer";
// import { useAuth } from "../context/AuthContext";
// import { absoluteUrl } from "../services/api";

// export default function GameDetail() {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const { isAuthenticated, user, updateUser } = useAuth();

//   const [searchParams] = useSearchParams();
//   const autoPlay = searchParams.get("autoPlay") === "true";

//   const [game, setGame] = useState(null);
//   const [allGames, setAllGames] = useState([]);
//   const [userRating, setUserRating] = useState(null);
//   const [animate, setAnimate] = useState(false);
//   const playIncrementedRef = useRef(false);

//   // ⭐ NEW loading state
//   const [loading, setLoading] = useState(true);

//   /* LOAD GAME + LIST */
//   useEffect(() => {
//     async function load() {
//       try {
//         const listRes = await getAllGames();
//         setAllGames(listRes.data.games || []);

//         const gameRes = await getGameBySlug(slug);
//         const found = gameRes.data.game;
//         setGame(found);

//         let rating = null;
//         if (found && isAuthenticated && user) {
//           const uRate = found.ratings?.find(
//             (r) =>
//               String(r.user?._id || r.user) ===
//               String(user.id || user._id)
//           );
//           if (uRate) rating = uRate.stars;
//         }

//         if (!rating && user?.ratedGames) {
//           const fromUser = user.ratedGames.find(
//             (x) => String(x.game) === String(found?._id)
//           );
//           if (fromUser) rating = fromUser.stars;
//         }

//         setUserRating(rating ?? null);
//       } catch (err) {
//         console.log("Error:", err);
//       }
//     }

//     // ⭐ ensure loading ends after fetch
//     load().finally(() => setLoading(false));
//   }, [slug, isAuthenticated, user]);

//   useEffect(() => {
//     setTimeout(() => setAnimate(true), 150);
//   }, []);

//   /* PLAY INCREMENT */
//   const handlePlayerPlay = async () => {
//     if (!game || playIncrementedRef.current) return;
//     try {
//       await increasePlay(game._id);
//       playIncrementedRef.current = true;

//       setGame((prev) =>
//         prev
//           ? { ...prev, playCount: (prev.playCount || 0) + 1 }
//           : prev
//       );
//     } catch {}
//   };

//   /* RATING HANDLER */
//   const handleRating = async (stars) => {
//     if (!isAuthenticated) return alert("Please login to rate!");

//     try {
//       const res = await rateGame(game._id, stars);
//       setUserRating(stars);

//       updateUser({
//         ratedGames: [
//           ...(user.ratedGames || []).filter(
//             (x) => String(x.game) !== String(game._id)
//           ),
//           { game: game._id, stars },
//         ],
//       });

//       setGame((prev) =>
//         prev
//           ? {
//               ...prev,
//               averageRating: res.rating,
//               totalRatings: res.totalRatings,
//             }
//           : prev
//       );
//     } catch {}
//   };

//   // ⭐ FIXED — when loading → return nothing
//   if (loading) return null;

//   // ⭐ Only show "Not Found" when API returned nothing
//   if (!game) {
//     return (
//       <div style={{ padding: 20, color: "#fff" }}>
//         <h2>Game Not Found</h2>
//         <button style={styles.backBtn} onClick={() => navigate(-1)}>
//           Back
//         </button>
//       </div>
//     );
//   }



//   const bannerImg = absoluteUrl(game.thumbnail);
//   const related = allGames.filter(
//     (g) => g.genre === game.genre && g._id !== game._id
//   );

//   const embedUrl = game.embedUrl || game.playUrl || `/play/${game.slug}`;

//   return (
//     <div style={styles.pageFrame}>
//       {/* BACK BUTTON — NAVBAR SE CHIPKA */}
//       <button style={styles.backBtn} onClick={() => navigate(-1)}>
//         ← Back
//       </button>

//       {/* CONTENT WRAPPER */}
//       <div
//         style={{
//           ...styles.pageWrapper,
//           opacity: animate ? 1 : 0,
//           transition: "0.5s ease",
//         }}
//       >
//         {/* ===== GAME PLAYER (centered) ===== */}
//         <div style={styles.playerWrapper}>
//           <GamePlayer
//             embedUrl={embedUrl}
//             gameUrl={game.playUrl}
//             title={game.title}
//             autoPlay={autoPlay}
//             onPlay={handlePlayerPlay}
//           />
//         </div>

//         {/* ===== BANNER ===== */}
//         <div style={styles.bannerWrapper}>
//           <img src={bannerImg} style={styles.bannerImg} alt={game.title} />

//           <div style={styles.bannerGradient}></div>

//           {/* TRANSPARENT GLASS CARD */}
//           <div style={styles.bannerContent}>
//             <h1 style={styles.gameTitle}>{game.title}</h1>
//             <p style={styles.genre}>{game.genre}</p>

//             <RatingStars
//               rating={game.averageRating}
//               userRating={userRating}
//               onRate={handleRating}
//               size={26}
//               editable={true}
//               showUserTag={true}
//             />
//           </div>
//         </div>

//         {/* ===== STATS ===== */}
//         <div style={styles.statsRow}>
//           <div style={styles.statBox}>
//             <span style={styles.statValue}>{game.playCount || 0}</span>
//             <span style={styles.statLabel}>Plays</span>
//           </div>

//           <div style={styles.statBox}>
//             <span style={styles.statValue}>
//               {(game.averageRating || 0).toFixed(1)}
//             </span>
//             <span style={styles.statLabel}>Rating</span>
//           </div>

//           <div style={styles.statBox}>
//             <span style={styles.statValue}>
//               {game.updatedAt
//                 ? new Date(game.updatedAt).getFullYear()
//                 : ""}
//             </span>
//             <span style={styles.statLabel}>Updated</span>
//           </div>
//         </div>

//         {/* ===== DESCRIPTION ===== */}
//         <div style={styles.descriptionBox}>
//           <h3 style={styles.aboutTitle}>About This Game</h3>
//           <p style={styles.description}>{game.description}</p>
//         </div>

//         {/* ===== RELATED ===== */}
//         {related.length > 0 && (
//           <div style={styles.relatedSection}>
//             <h3 style={styles.relatedTitle}>You Might Also Like</h3>

//             <div style={styles.slider}>
//               {related.map((g) => (
//                 <div
//                   key={g._id}
//                   style={styles.sliderCard}
//                   onClick={() => navigate(`/game/${g.slug}`)}
//                 >
//                   <img
//                     src={absoluteUrl(g.thumbnail)}
//                     style={styles.sliderImg}
//                     alt={g.title}
//                   />
//                   <p style={styles.sliderName}>{g.title}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ========================= STYLES (PREMIUM + RESPONSIVE) ========================= */

// const styles = {
//   pageFrame: {
//     padding: "10px 18px",
//     maxWidth: "1250px",
//     margin: "0 auto",
//     color: "#fff",
//   },

//   /* BACK BUTTON TOP */
//   backBtn: {
//   padding: "7px 14px",
//   background: "#2563eb",
//   borderRadius: 8,
//   border: "none",
//   color: "#fff",
//   fontWeight: 600,
//   cursor: "pointer",

//   /* ⭐ Navbar se chipka hua, sabse upar */
//   marginTop: "-6px",
//   marginBottom: "12px",

//   boxShadow: "0 6px 14px rgba(37,99,235,0.25)",
// },


//   pageWrapper: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "28px",
//   },

//   /* GAME PLAYER — CENTER */
//   playerWrapper: {
//     width: "100%",
//     maxWidth: "1150px",
//     margin: "0 auto",
//     borderRadius: "18px",
//     overflow: "hidden",
//     minHeight: "52vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
//   },

//   /* BANNER (original size preserved) */
//   bannerWrapper: {
//   position: "relative",
//   borderRadius: "16px",
//   overflow: "hidden",

//   /* ⭐ Desktop */
//   height: "240px",

//   /* ⭐ Mobile responsive */
//   width: "100%",
//   maxHeight: "45vh",
//   minHeight: "160px",
// },


//   bannerImg: {
//   width: "100%",
//   height: "100%",
//   objectFit: "cover",
//   objectPosition: "center",

//   /* ⭐ Mobile par image crop correct hoti hai */
//   '@media (max-width: 520px)': {
//     objectFit: "cover",
//   },
// },


//   bannerGradient: {
//     position: "absolute",
//     inset: 0,
//     background:
//       "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.65))",
//   },

//   /* TRANSPARENT GLASS CARD */
//   bannerContent: {
//     position: "absolute",
//     bottom: 18,
//     left: 18,
//     background: "rgba(0,0,0,0.38)",
//     backdropFilter: "blur(12px)",
//     borderRadius: "14px",
//     padding: "16px 20px",
//     width: "420px",
//   },

//   gameTitle: {
//     fontSize: 26,
//     fontWeight: 800,
//     margin: 0,
//   },

//   genre: {
//     color: "#93c5fd",
//     fontSize: 14,
//     marginBottom: 6,
//   },

//   /* STATS */
//   statsRow: {
//     display: "flex",
//     justifyContent: "center",
//     gap: "20px",
//     flexWrap: "wrap",
//   },

//   statBox: {
//     background: "rgba(255,255,255,0.04)",
//     borderRadius: 12,
//     padding: "12px 20px",
//     border: "1px solid rgba(255,255,255,0.08)",
//     textAlign: "center",
//   },

//   statValue: {
//     fontSize: 20,
//     fontWeight: 800,
//   },

//   statLabel: {
//     fontSize: 12,
//     color: "#94a3b8",
//   },

//   /* DESCRIPTION */
//   descriptionBox: {
//     background: "rgba(255,255,255,0.03)",
//     padding: "20px",
//     borderRadius: 14,
//     border: "1px solid rgba(255,255,255,0.05)",
//   },

//   aboutTitle: {
//     fontSize: 20,
//     marginBottom: 8,
//   },

//   description: {
//     fontSize: 15,
//     lineHeight: 1.6,
//     color: "#e2e8f0",
//   },

//   /* RELATED GAMES */
//   relatedSection: {
//     marginTop: 10,
//   },

//   relatedTitle: {
//     fontSize: 22,
//     marginBottom: 12,
//   },

//   slider: {
//     display: "flex",
//     gap: 16,
//     overflowX: "auto",
//   },

//   sliderCard: {
//     minWidth: "150px",
//     background: "#0f172a",
//     borderRadius: 12,
//     overflow: "hidden",
//     cursor: "pointer",
//   },

//   sliderImg: {
//     width: "100%",
//     height: 110,
//     objectFit: "cover",
//   },

//   sliderName: {
//     padding: 10,
//     textAlign: "center",
//     color: "#e2e8f0",
//     fontWeight: 600,
//   },
// };


import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getAllGames, getGameBySlug } from "../services/api";
import { increasePlay, rateGame } from "../services/gameActions";
import RatingStars from "../components/RatingStars";
import GamePlayer from "../components/GamePlayer";
import { useAuth } from "../context/AuthContext";
import { absoluteUrl } from "../services/api";

export default function GameDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, updateUser } = useAuth();

  const [searchParams] = useSearchParams();
  const autoPlay = searchParams.get("autoPlay") === "true";

  const [game, setGame] = useState(null);
  const [allGames, setAllGames] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [animate, setAnimate] = useState(false);
  const playIncrementedRef = useRef(false);
  const [loading, setLoading] = useState(true);

  // ⭐ 1. Mobile Detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* LOAD GAME + LIST */
  useEffect(() => {
    async function load() {
      try {
        const listRes = await getAllGames();
        setAllGames(listRes.data.games || []);

        const gameRes = await getGameBySlug(slug);
        const found = gameRes.data.game;
        setGame(found);

        let rating = null;
        if (found && isAuthenticated && user) {
          const uRate = found.ratings?.find(
            (r) =>
              String(r.user?._id || r.user) ===
              String(user.id || user._id)
          );
          if (uRate) rating = uRate.stars;
        }

        if (!rating && user?.ratedGames) {
          const fromUser = user.ratedGames.find(
            (x) => String(x.game) === String(found?._id)
          );
          if (fromUser) rating = fromUser.stars;
        }

        setUserRating(rating ?? null);
      } catch (err) {
        console.log("Error:", err);
      }
    }
    load().finally(() => setLoading(false));
  }, [slug, isAuthenticated, user]);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 150);
  }, []);

  /* PLAY INCREMENT */
  const handlePlayerPlay = async () => {
    if (!game || playIncrementedRef.current) return;
    try {
      await increasePlay(game._id);
      playIncrementedRef.current = true;
      setGame((prev) =>
        prev ? { ...prev, playCount: (prev.playCount || 0) + 1 } : prev
      );
    } catch {}
  };

  /* RATING HANDLER */
  const handleRating = async (stars) => {
    if (!isAuthenticated) return alert("Please login to rate!");
    try {
      const res = await rateGame(game._id, stars);
      setUserRating(stars);
      updateUser({
        ratedGames: [
          ...(user.ratedGames || []).filter(
            (x) => String(x.game) !== String(game._id)
          ),
          { game: game._id, stars },
        ],
      });
      setGame((prev) =>
        prev
          ? {
              ...prev,
              averageRating: res.rating,
              totalRatings: res.totalRatings,
            }
          : prev
      );
    } catch {}
  };

  if (loading) return null;

  if (!game) {
    return (
      <div style={{ padding: 20, color: "#fff" }}>
        <h2>Game Not Found</h2>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  const bannerImg = absoluteUrl(game.thumbnail);
  const related = allGames.filter(
    (g) => g.genre === game.genre && g._id !== game._id
  );

  const embedUrl = game.embedUrl || game.playUrl || `/play/${game.slug}`;

  return (
    <div style={styles.pageFrame}>
      
      {/* ⭐ HIDE BACK BUTTON ON MOBILE */}
      {!isMobile && (
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
      )}

      <div
        style={{
          ...styles.pageWrapper,
          opacity: animate ? 1 : 0,
          transition: "0.5s ease",
        }}
      >
        {/* ===== GAME PLAYER ===== */}
        {/* ⭐ Logic: If isMobile, we allow GamePlayer to use Fixed Positioning 
           to cover the existing Navbar and Footer using z-index 99999.
        */}
        <div style={isMobile ? {} : styles.playerWrapper}>
          <GamePlayer
            embedUrl={embedUrl}
            gameUrl={game.playUrl}
            title={game.title}
            autoPlay={autoPlay}
            onPlay={handlePlayerPlay}
            mobileFullScreen={isMobile} // ⭐ Pass the trigger
          />
        </div>

        {/* ⭐ IF MOBILE, DO NOT RENDER ANYTHING ELSE BELOW */}
        {!isMobile && (
          <>
            {/* ===== BANNER ===== */}
            <div style={styles.bannerWrapper}>
              <img src={bannerImg} style={styles.bannerImg} alt={game.title} />
              <div style={styles.bannerGradient}></div>
              <div style={styles.bannerContent}>
                <h1 style={styles.gameTitle}>{game.title}</h1>
                <p style={styles.genre}>{game.genre}</p>
                <RatingStars
                  rating={game.averageRating}
                  userRating={userRating}
                  onRate={handleRating}
                  size={26}
                  editable={true}
                  showUserTag={true}
                />
              </div>
            </div>

            {/* ===== STATS ===== */}
            <div style={styles.statsRow}>
              <div style={styles.statBox}>
                <span style={styles.statValue}>{game.playCount || 0}</span>
                <span style={styles.statLabel}>Plays</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statValue}>
                  {(game.averageRating || 0).toFixed(1)}
                </span>
                <span style={styles.statLabel}>Rating</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statValue}>
                  {game.updatedAt
                    ? new Date(game.updatedAt).getFullYear()
                    : ""}
                </span>
                <span style={styles.statLabel}>Updated</span>
              </div>
            </div>

            {/* ===== DESCRIPTION ===== */}
            <div style={styles.descriptionBox}>
              <h3 style={styles.aboutTitle}>About This Game</h3>
              <p style={styles.description}>{game.description}</p>
            </div>

            {/* ===== RELATED ===== */}
            {related.length > 0 && (
              <div style={styles.relatedSection}>
                <h3 style={styles.relatedTitle}>You Might Also Like</h3>
                <div style={styles.slider}>
                  {related.map((g) => (
                    <div
                      key={g._id}
                      style={styles.sliderCard}
                      onClick={() => navigate(`/game/${g.slug}`)}
                    >
                      <img
                        src={absoluteUrl(g.thumbnail)}
                        style={styles.sliderImg}
                        alt={g.title}
                      />
                      <p style={styles.sliderName}>{g.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ========================= STYLES (PREMIUM + RESPONSIVE) ========================= */

const styles = {
  pageFrame: {
    padding: "10px 18px",
    maxWidth: "1250px",
    margin: "0 auto",
    color: "#fff",
  },

  backBtn: {
    padding: "7px 14px",
    background: "#2563eb",
    borderRadius: 8,
    border: "none",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "-6px",
    marginBottom: "12px",
    boxShadow: "0 6px 14px rgba(37,99,235,0.25)",
  },

  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },

  playerWrapper: {
    width: "100%",
    maxWidth: "1150px",
    margin: "0 auto",
    borderRadius: "18px",
    overflow: "hidden",
    minHeight: "52vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
  },

  bannerWrapper: {
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    height: "240px",
    width: "100%",
    maxHeight: "45vh",
    minHeight: "160px",
  },

  bannerImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    "@media (max-width: 520px)": {
      objectFit: "cover",
    },
  },

  bannerGradient: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.65))",
  },

  bannerContent: {
    position: "absolute",
    bottom: 18,
    left: 18,
    background: "rgba(0,0,0,0.38)",
    backdropFilter: "blur(12px)",
    borderRadius: "14px",
    padding: "16px 20px",
    width: "420px",
  },

  gameTitle: {
    fontSize: 26,
    fontWeight: 800,
    margin: 0,
  },

  genre: {
    color: "#93c5fd",
    fontSize: 14,
    marginBottom: 6,
  },

  statsRow: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  statBox: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: "12px 20px",
    border: "1px solid rgba(255,255,255,0.08)",
    textAlign: "center",
  },

  statValue: {
    fontSize: 20,
    fontWeight: 800,
  },

  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },

  descriptionBox: {
    background: "rgba(255,255,255,0.03)",
    padding: "20px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.05)",
  },

  aboutTitle: {
    fontSize: 20,
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    lineHeight: 1.6,
    color: "#e2e8f0",
  },

  relatedSection: {
    marginTop: 10,
  },

  relatedTitle: {
    fontSize: 22,
    marginBottom: 12,
  },

  slider: {
    display: "flex",
    gap: 16,
    overflowX: "auto",
  },

  sliderCard: {
    minWidth: "150px",
    background: "#0f172a",
    borderRadius: 12,
    overflow: "hidden",
    cursor: "pointer",
  },

  sliderImg: {
    width: "100%",
    height: 110,
    objectFit: "cover",
  },

  sliderName: {
    padding: 10,
    textAlign: "center",
    color: "#e2e8f0",
    fontWeight: 600,
  },
};