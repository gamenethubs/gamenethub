// // src/pages/GameDetail.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useSearchParams } from "react-router-dom";
// import { getAllGames, getGameBySlug } from "../services/api";
// import { increasePlay, rateGame } from "../services/gameActions";
// import RatingStars from "../components/RatingStars";
// import GamePlayer from "../components/GamePlayer";
// import { useAuth } from "../context/AuthContext";

// export default function GameDetail() {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const { isAuthenticated, user, updateUser } = useAuth();

//   const [searchParams] = useSearchParams();
//   const autoPlay = searchParams.get("autoPlay") === "true";

//   const [game, setGame] = useState(null);
//   const [allGames, setAllGames] = useState([]);
//   const [startGame, setStartGame] = useState(false);
//   const [animate, setAnimate] = useState(false);

//   const [userRating, setUserRating] = useState(null);

//   /**************************************************
//    * LOAD GAME
//    **************************************************/
//   useEffect(() => {
//     async function load() {
//       try {
//         const listRes = await getAllGames();
//         const list = listRes.data.games || [];
//         setAllGames(list);

//         const gameRes = await getGameBySlug(slug);
//         const found = gameRes.data.game;
//         setGame(found);

//         let rating = null;

//         /**************************************************
//          * 1) Check game.ratings[]
//          **************************************************/
//         if (found && isAuthenticated && user) {
//           const uRate = found.ratings?.find((r) => {
//             const id =
//               r.user?._id ||
//               r.user?.toString?.() ||
//               r.user;

//             return String(id) === String(user.id || user._id);
//           });

//           if (uRate) rating = uRate.stars;
//         }

//         /**************************************************
//          * 2) Fallback → user.ratedGames
//          **************************************************/
//         if (!rating && user?.ratedGames) {
//           const fromUser = user.ratedGames.find(
//             (x) => String(x.game) === String(found._id)
//           );
//           if (fromUser) rating = fromUser.stars;
//         }

//         setUserRating(rating ?? null);

//       } catch (err) {
//         console.log("Error loading game:", err);
//       }
//     }
//     load();
//   }, [slug, isAuthenticated, user]);

//   useEffect(() => {
//     setTimeout(() => setAnimate(true), 120);
//   }, []);

//   /**************************************************
//    * PLAY COUNT — UPDATED (NO DOUBLE COUNT)
//    **************************************************/
//   const handleStartGame = async (isAuto = false) => {
//     setStartGame(true);

//     // ⭐ AutoPlay case → already counted in GameCard → skip
//     if (!isAuto) {
//       try {
//         const r = await increasePlay(game._id);
//         if (!r?.ignored) {
//           setGame((prev) => ({ ...prev, playCount: prev.playCount + 1 }));
//         }
//       } catch (err) {
//         console.log("Play error:", err);
//       }
//     }

//     // scroll to game frame
//     setTimeout(() => {
//       window.scrollTo({ top: 330, behavior: "smooth" });
//     }, 200);
//   };

//   /**************************************************
//    * AUTO START GAME
//    **************************************************/
//   useEffect(() => {
//     if (autoPlay) {
//       handleStartGame(true); // ⭐ auto flag
//     }
//   }, [autoPlay]);

//   /**************************************************
//    * ⭐ RATE GAME
//    **************************************************/
//   const handleRating = async (stars) => {
//     if (!isAuthenticated) {
//       alert("Please login to rate this game.");
//       return;
//     }

//     try {
//       const res = await rateGame(game._id, stars);

//       if (!res.success) {
//         alert(res.message || "Rating failed");
//         return;
//       }

//       setUserRating(stars);

//       /**************************************************
//        * Update user.ratedGames
//        **************************************************/
//       const updatedRatedGames = [
//         ...(user.ratedGames || []).filter(
//           (x) => String(x.game) !== String(game._id)
//         ),
//         { game: game._id, stars },
//       ];

//       updateUser({ ratedGames: updatedRatedGames });

//       /**************************************************
//        * Update game.ratings[] inside component
//        **************************************************/
//       setGame((prev) => ({
//         ...prev,
//         averageRating: res.rating,
//         totalRatings: res.totalRatings,

//         ratings: (() => {
//           const arr = [...prev.ratings];
//           const index = arr.findIndex((r) => {
//             const id =
//               r.user?._id ||
//               r.user?.toString?.() ||
//               r.user;
//             return String(id) === String(user.id || user._id);
//           });

//           if (index >= 0) {
//             arr[index].stars = stars;
//           } else {
//             arr.push({ user: { _id: user._id }, stars });
//           }

//           return arr;
//         })(),
//       }));
//     } catch (err) {
//       console.log("Rating error:", err);
//     }
//   };

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

//   const bannerImg = game.thumbnail?.startsWith("/uploads")
//     ? `http://localhost:5000${game.thumbnail}`
//     : game.thumbnail;

//   const related = allGames.filter(
//     (g) => g.genre === game.genre && g._id !== game._id
//   );

//   return (
//     <div style={styles.pageFrame}>
//       <button style={styles.backBtn} onClick={() => navigate(-1)}>
//         ← Back
//       </button>

//       <div
//         style={{
//           ...styles.pageWrapper,
//           opacity: animate ? 1 : 0,
//           transition: "opacity .6s ease",
//         }}
//       >
//         <div style={styles.bannerWrapper}>
//           <img src={bannerImg} style={styles.bannerImg} />
//           <div style={styles.bannerGradient}></div>

//           <div style={styles.bannerContent}>
//             <h1 style={styles.gameTitle}>{game.title}</h1>
//             <p style={styles.genre}>{game.genre}</p>

//             <RatingStars
//               rating={game.averageRating}
//               userRating={userRating}
//               onRate={handleRating}
//               size={26}
//               showUserTag={true}
//               editable={true}
//             />

//             {!startGame && (
//               <button style={styles.playBtn} onClick={() => handleStartGame(false)}>
//                 ▶ Play Now
//               </button>
//             )}
//           </div>
//         </div>

//         <div style={styles.statsRow}>
//           <div style={styles.statBox}>
//             <span style={styles.statValue}>{game.playCount}</span>
//             <span style={styles.statLabel}>Plays</span>
//           </div>

//           <div style={styles.statBox}>
//             <span style={styles.statValue}>
//               {game.averageRating?.toFixed(1)}
//             </span>
//             <span style={styles.statLabel}>Rating</span>
//           </div>

//           <div style={styles.statBox}>
//             <span style={styles.statValue}>
//               {new Date(game.updatedAt).getFullYear()}
//             </span>
//             <span style={styles.statLabel}>Updated</span>
//           </div>
//         </div>

//         <div style={styles.descriptionBox}>
//           <h3 style={styles.aboutTitle}>About This Game</h3>
//           <p style={styles.description}>
//             {game.description || "No description available."}
//           </p>
//         </div>

//         {startGame && (
//           <div style={styles.playerWrapper}>
//             <GamePlayer gameUrl={game.playUrl} />
//           </div>
//         )}

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
//                     src={
//                       g.thumbnail?.startsWith("/uploads")
//                         ? `http://localhost:5000${g.thumbnail}`
//                         : g.thumbnail
//                     }
//                     style={styles.sliderImg}
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

// /* ------------------ STYLES ------------------ */
// /* (same as your original file) */
// const styles = {
//   pageFrame: {
//     padding: "20px",
//     color: "#fff",
//     maxWidth: "1200px",
//     margin: "0 auto",
//   },
//   backBtn: {
//     padding: "8px 12px",
//     background: "#2563eb",
//     borderRadius: 6,
//     border: "none",
//     color: "#fff",
//     cursor: "pointer",
//     marginBottom: "14px",
//   },
//   pageWrapper: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "22px",
//   },
//   bannerWrapper: {
//     position: "relative",
//     borderRadius: "18px",
//     overflow: "hidden",
//     height: "320px",
//   },
//   bannerImg: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     filter: "brightness(0.55)",
//   },
//   bannerGradient: {
//     position: "absolute",
//     inset: 0,
//     background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.7))",
//   },
//   bannerContent: {
//     position: "absolute",
//     bottom: "18px",
//     left: "18px",
//     background: "rgba(0,0,0,0.45)",
//     backdropFilter: "blur(8px)",
//     padding: "16px 20px",
//     borderRadius: "12px",
//     border: "1px solid rgba(255,255,255,0.1)",
//   },
//   gameTitle: {
//     fontSize: "32px",
//     fontWeight: 800,
//     marginBottom: 6,
//   },
//   genre: {
//     color: "#93c5fd",
//     marginBottom: 6,
//   },
//   playBtn: {
//     marginTop: 12,
//     padding: "12px 20px",
//     background: "linear-gradient(135deg,#059669,#10b981)",
//     border: "none",
//     borderRadius: "10px",
//     color: "#fff",
//     fontSize: "16px",
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   statsRow: {
//     display: "flex",
//     gap: "20px",
//     justifyContent: "center",
//   },
//   statBox: {
//     textAlign: "center",
//     padding: "10px 16px",
//     background: "rgba(255,255,255,0.05)",
//     borderRadius: "10px",
//     border: "1px solid rgba(255,255,255,0.1)",
//     minWidth: "100px",
//   },
//   statValue: {
//     fontSize: "20px",
//     fontWeight: 700,
//   },
//   statLabel: {
//     color: "#94a3b8",
//     fontSize: "12px",
//   },
//   descriptionBox: {
//     background: "rgba(255,255,255,0.05)",
//     padding: "18px",
//     borderRadius: "12px",
//   },
//   aboutTitle: {
//     marginBottom: 10,
//     fontSize: "20px",
//   },
//   description: {
//     color: "#cbd5e1",
//     lineHeight: 1.7,
//     marginBottom: 14,
//   },
//   playerWrapper: {
//     marginTop: 10,
//   },
//   relatedSection: {
//     marginTop: 30,
//   },
//   relatedTitle: {
//     fontSize: "22px",
//     marginBottom: "12px",
//   },
//   slider: {
//     display: "flex",
//     gap: "18px",
//     overflowX: "auto",
//     paddingBottom: "10px",
//   },
//   sliderCard: {
//     minWidth: "150px",
//     borderRadius: "12px",
//     overflow: "hidden",
//     background: "#1e293b",
//     cursor: "pointer",
//     transition: "0.25s",
//   },
//   sliderImg: {
//     width: "100%",
//     height: "110px",
//     objectFit: "cover",
//   },
//   sliderName: {
//     textAlign: "center",
//     color: "#e2e8f0",
//     padding: "8px",
//     fontSize: "14px",
//   },
// };


// // src/pages/GameDetail.jsx
// import React, { useState, useEffect } from "react";
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
//   const [startGame, setStartGame] = useState(false);
//   const [animate, setAnimate] = useState(false);

//   const [userRating, setUserRating] = useState(null);

//   /**************************************************
//    * LOAD GAME
//    **************************************************/
//   useEffect(() => {
//     async function load() {
//       try {
//         const listRes = await getAllGames();
//         const list = listRes.data.games || [];
//         setAllGames(list);

//         const gameRes = await getGameBySlug(slug);
//         const found = gameRes.data.game;
//         setGame(found);

//         let rating = null;

//         // ⭐ Check rating inside game.ratings
//         if (found && isAuthenticated && user) {
//           const uRate = found.ratings?.find((r) => {
//             const id =
//               r.user?._id ||
//               r.user?.toString?.() ||
//               r.user;
//             return String(id) === String(user.id || user._id);
//           });

//           if (uRate) rating = uRate.stars;
//         }

//         // ⭐ Fallback to user.ratedGames
//         if (!rating && user?.ratedGames) {
//           const fromUser = user.ratedGames.find(
//             (x) => String(x.game) === String(found._id)
//           );
//           if (fromUser) rating = fromUser.stars;
//         }

//         setUserRating(rating ?? null);

//       } catch (err) {
//         console.log("Error loading game:", err);
//       }
//     }
//     load();
//   }, [slug, isAuthenticated, user]);

//   useEffect(() => {
//     setTimeout(() => setAnimate(true), 120);
//   }, []);

//   /**************************************************
//    * PLAY COUNT (No double count)
//    **************************************************/
//   const handleStartGame = async (isAuto = false) => {
//     setStartGame(true);

//     if (!isAuto) {
//       try {
//         const r = await increasePlay(game._id);
//         setGame((prev) => ({ ...prev, playCount: prev.playCount + 1 }));
//       } catch (err) {
//         console.log("Play error:", err);
//       }
//     }

//     setTimeout(() => {
//       window.scrollTo({ top: 330, behavior: "smooth" });
//     }, 200);
//   };

//   /**************************************************
//    * AUTO START
//    **************************************************/
//   useEffect(() => {
//     if (autoPlay) handleStartGame(true);
//   }, [autoPlay]);

//   /**************************************************
//    * RATE GAME
//    **************************************************/
//   const handleRating = async (stars) => {
//     if (!isAuthenticated) {
//       alert("Please login to rate this game.");
//       return;
//     }

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

//       setGame((prev) => ({
//         ...prev,
//         averageRating: res.rating,
//         totalRatings: res.totalRatings,
//         ratings: (() => {
//           const arr = [...prev.ratings];
//           const index = arr.findIndex((r) => {
//             const id =
//               r.user?._id ||
//               r.user?.toString?.() ||
//               r.user;
//             return String(id) === String(user._id);
//           });

//           if (index >= 0) arr[index].stars = stars;
//           else arr.push({ user: { _id: user._id }, stars });

//           return arr;
//         })(),
//       }));
//     } catch (err) {
//       console.log("Rating error:", err);
//     }
//   };

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

//   // ⭐ Correct banner image URL
//   const bannerImg = absoluteUrl(game.thumbnail);

//   const related = allGames.filter(
//     (g) => g.genre === game.genre && g._id !== game._id
//   );

//   return (
//     <div style={styles.pageFrame}>
//       <button style={styles.backBtn} onClick={() => navigate(-1)}>
//         ← Back
//       </button>

//       <div
//         style={{
//           ...styles.pageWrapper,
//           opacity: animate ? 1 : 0,
//           transition: "opacity .6s ease",
//         }}
//       >
//         <div style={styles.bannerWrapper}>
//           <img src={bannerImg} style={styles.bannerImg} />
//           <div style={styles.bannerGradient}></div>

//           <div style={styles.bannerContent}>
//             <h1 style={styles.gameTitle}>{game.title}</h1>
//             <p style={styles.genre}>{game.genre}</p>

//             <RatingStars
//               rating={game.averageRating}
//               userRating={userRating}
//               onRate={handleRating}
//               size={26}
//               showUserTag={true}
//               editable={true}
//             />

//             {!startGame && (
//               <button style={styles.playBtn} onClick={() => handleStartGame(false)}>
//                 ▶ Play Now
//               </button>
//             )}
//           </div>
//         </div>

//         <div style={styles.statsRow}>
//           <div style={styles.statBox}>
//             <span style={styles.statValue}>{game.playCount}</span>
//             <span style={styles.statLabel}>Plays</span>
//           </div>

//           <div style={styles.statBox}>
//             <span style={styles.statValue}>
//               {game.averageRating?.toFixed(1)}
//             </span>
//             <span style={styles.statLabel}>Rating</span>
//           </div>

//           <div style={styles.statBox}>
//             <span style={styles.statValue}>
//               {new Date(game.updatedAt).getFullYear()}
//             </span>
//             <span style={styles.statLabel}>Updated</span>
//           </div>
//         </div>

//         <div style={styles.descriptionBox}>
//           <h3 style={styles.aboutTitle}>About This Game</h3>
//           <p style={styles.description}>
//             {game.description || "No description available."}
//           </p>
//         </div>

//         {startGame && (
//           <div style={styles.playerWrapper}>
//             <GamePlayer gameUrl={game.playUrl} />
//           </div>
//         )}

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
// /* ------------------ STYLES ------------------ */
// /* (same as your original file) */
// const styles = {
//   pageFrame: {
//     padding: "20px",
//     color: "#fff",
//     maxWidth: "1200px",
//     margin: "0 auto",
//   },
//   backBtn: {
//     padding: "8px 12px",
//     background: "#2563eb",
//     borderRadius: 6,
//     border: "none",
//     color: "#fff",
//     cursor: "pointer",
//     marginBottom: "14px",
//   },
//   pageWrapper: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "22px",
//   },
//   bannerWrapper: {
//     position: "relative",
//     borderRadius: "18px",
//     overflow: "hidden",
//     height: "320px",
//   },
//   bannerImg: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     filter: "brightness(0.55)",
//   },
//   bannerGradient: {
//     position: "absolute",
//     inset: 0,
//     background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.7))",
//   },
//   bannerContent: {
//     position: "absolute",
//     bottom: "18px",
//     left: "18px",
//     background: "rgba(0,0,0,0.45)",
//     backdropFilter: "blur(8px)",
//     padding: "16px 20px",
//     borderRadius: "12px",
//     border: "1px solid rgba(255,255,255,0.1)",
//   },
//   gameTitle: {
//     fontSize: "32px",
//     fontWeight: 800,
//     marginBottom: 6,
//   },
//   genre: {
//     color: "#93c5fd",
//     marginBottom: 6,
//   },
//   playBtn: {
//     marginTop: 12,
//     padding: "12px 20px",
//     background: "linear-gradient(135deg,#059669,#10b981)",
//     border: "none",
//     borderRadius: "10px",
//     color: "#fff",
//     fontSize: "16px",
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   statsRow: {
//     display: "flex",
//     gap: "20px",
//     justifyContent: "center",
//   },
//   statBox: {
//     textAlign: "center",
//     padding: "10px 16px",
//     background: "rgba(255,255,255,0.05)",
//     borderRadius: "10px",
//     border: "1px solid rgba(255,255,255,0.1)",
//     minWidth: "100px",
//   },
//   statValue: {
//     fontSize: "20px",
//     fontWeight: 700,
//   },
//   statLabel: {
//     color: "#94a3b8",
//     fontSize: "12px",
//   },
//   descriptionBox: {
//     background: "rgba(255,255,255,0.05)",
//     padding: "18px",
//     borderRadius: "12px",
//   },
//   aboutTitle: {
//     marginBottom: 10,
//     fontSize: "20px",
//   },
//   description: {
//     color: "#cbd5e1",
//     lineHeight: 1.7,
//     marginBottom: 14,
//   },
//   playerWrapper: {
//     marginTop: 10,
//   },
//   relatedSection: {
//     marginTop: 30,
//   },
//   relatedTitle: {
//     fontSize: "22px",
//     marginBottom: "12px",
//   },
//   slider: {
//     display: "flex",
//     gap: "18px",
//     overflowX: "auto",
//     paddingBottom: "10px",
//   },
//   sliderCard: {
//     minWidth: "150px",
//     borderRadius: "12px",
//     overflow: "hidden",
//     background: "#1e293b",
//     cursor: "pointer",
//     transition: "0.25s",
//   },
//   sliderImg: {
//     width: "100%",
//     height: "110px",
//     objectFit: "cover",
//   },
//   sliderName: {
//     textAlign: "center",
//     color: "#e2e8f0",
//     padding: "8px",
//     fontSize: "14px",
//   },
// };




// src/pages/GameDetail.jsx
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
            (x) => String(x.game) === String(found._id)
          );
          if (fromUser) rating = fromUser.stars;
        }

        setUserRating(rating ?? null);
      } catch (err) {
        console.log("Error:", err);
      }
    }
    load();
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
        prev
          ? { ...prev, playCount: (prev.playCount || 0) + 1 }
          : prev
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
      {/* BACK BUTTON — NAVBAR SE CHIPKA */}
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* CONTENT WRAPPER */}
      <div
        style={{
          ...styles.pageWrapper,
          opacity: animate ? 1 : 0,
          transition: "0.5s ease",
        }}
      >
        {/* ===== GAME PLAYER (centered) ===== */}
        <div style={styles.playerWrapper}>
          <GamePlayer
            embedUrl={embedUrl}
            gameUrl={game.playUrl}
            title={game.title}
            autoPlay={autoPlay}
            onPlay={handlePlayerPlay}
          />
        </div>

        {/* ===== BANNER ===== */}
        <div style={styles.bannerWrapper}>
          <img src={bannerImg} style={styles.bannerImg} alt={game.title} />

          <div style={styles.bannerGradient}></div>

          {/* TRANSPARENT GLASS CARD */}
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

  /* BACK BUTTON TOP */
  backBtn: {
  padding: "7px 14px",
  background: "#2563eb",
  borderRadius: 8,
  border: "none",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",

  /* ⭐ Navbar se chipka hua, sabse upar */
  marginTop: "-6px",
  marginBottom: "12px",

  boxShadow: "0 6px 14px rgba(37,99,235,0.25)",
},


  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },

  /* GAME PLAYER — CENTER */
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

  /* BANNER (original size preserved) */
  bannerWrapper: {
  position: "relative",
  borderRadius: "16px",
  overflow: "hidden",

  /* ⭐ Desktop */
  height: "240px",

  /* ⭐ Mobile responsive */
  width: "100%",
  maxHeight: "45vh",
  minHeight: "160px",
},


  bannerImg: {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",

  /* ⭐ Mobile par image crop correct hoti hai */
  '@media (max-width: 520px)': {
    objectFit: "cover",
  },
},


  bannerGradient: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.65))",
  },

  /* TRANSPARENT GLASS CARD */
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

  /* STATS */
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

  /* DESCRIPTION */
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

  /* RELATED GAMES */
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
