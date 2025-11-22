// // src/pages/Home.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { getAllGames } from "../services/api";
// import GameCard from "../components/GameCard";
// import GameModal from "../components/GameModal";

// export default function Home() {
//   const [games, setGames] = useState([]);
//   const [selectedGame, setSelectedGame] = useState(null);
//   const [animate, setAnimate] = useState(false);

//   // -------------------------------------------------
//   // ⭐ Fetch Games Once (correct — averageRating included)
//   // -------------------------------------------------
//   useEffect(() => {
//     async function loadGames() {
//       try {
//         const res = await getAllGames();
//         setGames(res.data.games || []);
//       } catch (err) {
//         console.log("Failed to load games:", err);
//       }
//     }
//     loadGames();
//   }, []);

//   // Page fade animation
//   useEffect(() => {
//     const t = setTimeout(() => setAnimate(true), 100);
//     return () => clearTimeout(t);
//   }, []);

//   // -------------------------------------------------
//   // ⭐ TRENDING (backend trendingScore)
//   // -------------------------------------------------
//   const trending = useMemo(() => {
//     return [...games]
//       .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
//       .slice(0, 7);
//   }, [games]);

//   // -------------------------------------------------
//   // ⭐ POPULAR
//   // -------------------------------------------------
//   const popular = useMemo(() => {
//     return [...games].sort(
//       (a, b) => (b.popularScore || 0) - (a.popularScore || 0)
//     );
//   }, [games]);

//   // -------------------------------------------------
//   // ⭐ NEW RELEASES
//   // -------------------------------------------------
//   const newReleases = useMemo(() => {
//     return [...games].sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     );
//   }, [games]);

//   return (
//     <div style={styles.wrapper}>
//       {/* ---------------- HERO SECTION ---------------- */}
//       <section
//         style={{
//           ...styles.hero,
//           opacity: animate ? 1 : 0,
//           transform: animate ? "translateY(0)" : "translateY(25px)",
//         }}
//       >
//         <div style={styles.heroGlow} />
//         <h1 style={styles.heroTitle}>Welcome to Gamenethub 🎮</h1>
//         <p style={styles.heroSub}>Play amazing online games — fully free!</p>
//       </section>

//       <div style={styles.sectionDivider}></div>

//       {/* ---------------- TRENDING ---------------- */}
//       <section style={styles.section}>
//         <h2 style={styles.sectionTitleGlow}>🔥 Trending Games</h2>

//         <div style={styles.horizontalScroll}>
//           {trending.map((game, i) => (
//             <div
//               key={game._id}
//               style={{
//                 ...styles.horizontalItem,
//                 opacity: animate ? 1 : 0,
//                 transform: animate ? "translateY(0)" : "translateY(20px)",
//                 transition: `all .6s ease ${i * 0.1}s`,
//               }}
//             >
//               <GameCard game={game} onPlay={() => setSelectedGame(game)} />
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ---------------- POPULAR ---------------- */}
//       <section style={styles.section}>
//         <h2 style={styles.sectionTitleGlow}>⭐ Popular Games</h2>

//         <div style={styles.grid}>
//           {popular.map((game, i) => (
//             <div
//               key={game._id}
//               style={{
//                 opacity: animate ? 1 : 0,
//                 transform: animate ? "scale(1)" : "scale(0.92)",
//                 transition: `all .55s ease ${i * 0.07}s`,
//               }}
//             >
//               <GameCard game={game} onPlay={() => setSelectedGame(game)} />
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ---------------- NEW RELEASES ---------------- */}
//       <section style={styles.section}>
//         <h2 style={styles.sectionTitleGlow}>🆕 New Releases</h2>

//         <div style={styles.grid}>
//           {newReleases.map((game, i) => (
//             <div
//               key={game._id}
//               style={{
//                 opacity: animate ? 1 : 0,
//                 transform: animate ? "translateY(0)" : "translateY(25px)",
//                 transition: `all .6s ease ${i * 0.09}s`,
//               }}
//             >
//               <GameCard game={game} onPlay={() => setSelectedGame(game)} />
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ---------------- GAME MODAL ---------------- */}
//       <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
//     </div>
//   );
// }

// const styles = {
//   wrapper: {
//     padding: "20px",
//     color: "#fff",
//     maxWidth: "1350px",
//     margin: "0 auto",
//   },
//   hero: {
//     position: "relative",
//     textAlign: "center",
//     padding: "20px",
//     marginBottom: "60px",
//     borderRadius: "22px",
//     background: "linear-gradient(135deg, #0f172a, #1e293b)",
//   },
//   heroGlow: {
//     position: "absolute",
//     top: "-45%",
//     left: "-35%",
//     width: "200%",
//     height: "200%",
//     background:
//       "radial-gradient(circle, rgba(96,165,250,0.17), transparent 70%)",
//     filter: "blur(120px)",
//   },
//   heroTitle: {
//     fontSize: "42px",
//     fontWeight: 800,
//     marginBottom: "10px",
//   },
//   heroSub: {
//     fontSize: "18px",
//     color: "#9ca3af",
//   },
//   sectionDivider: {
//     height: "2px",
//     background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
//     margin: "20px 0 30px",
//     opacity: 0.6,
//   },
//   section: { marginBottom: "50px" },
//   sectionTitleGlow: {
//     fontSize: "26px",
//     fontWeight: 700,
//     marginBottom: "18px",
//     textShadow: "0 0 12px rgba(59,130,246,0.55)",
//   },
//   horizontalScroll: {
//     display: "flex",
//     gap: "20px",
//     overflowX: "auto",
//     paddingBottom: "10px",
//   },
//   horizontalItem: {
//     minWidth: "230px",
//   },
//   grid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
//     gap: "24px",
//   },
// };
// src/pages/Home.jsx





// import React, { useState, useEffect, useMemo } from "react";
// import { getAllGames } from "../services/api";
// import GameCard from "../components/GameCard";
// import GameModal from "../components/GameModal";

// export default function Home() {
//   const [games, setGames] = useState([]);
//   const [selectedGame, setSelectedGame] = useState(null);
//   const [animate, setAnimate] = useState(false);

//   // NEW: searchTerm listens to navbar broadcast
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     async function loadGames() {
//       try {
//         const res = await getAllGames();
//         setGames(res.data.games || []);
//       } catch (err) {
//         console.log("Failed to load games:", err);
//       }
//     }
//     loadGames();
//   }, []);

//   // Page fade animation
//   useEffect(() => {
//     const t = setTimeout(() => setAnimate(true), 100);
//     return () => clearTimeout(t);
//   }, []);

//   // Listen for search broadcasts from Navbar
//   useEffect(() => {
//     function onSearch(e) {
//       const term = (e?.detail || "").toString();
//       setSearchTerm(term);
//     }
//     window.addEventListener("games-search", onSearch);
//     return () => window.removeEventListener("games-search", onSearch);
//   }, []);

//   // Filtered list shared by all sections (live)
//   const filteredGames = useMemo(() => {
//     if (!searchTerm || searchTerm.trim() === "") return games;
//     const t = searchTerm.toLowerCase();
//     return games.filter((g) => (g.title || "").toLowerCase().includes(t));
//   }, [games, searchTerm]);

//   // TRENDING (from filtered)
//   const trending = useMemo(() => {
//     return [...filteredGames]
//       .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
//       .slice(0, 10);
//   }, [filteredGames]);

//   // POPULAR (from filtered)
//   const popular = useMemo(() => {
//     return [...filteredGames].sort((a, b) => (b.popularScore || 0) - (a.popularScore || 0));
//   }, [filteredGames]);

//   // NEW RELEASES (from filtered)
//   const newReleases = useMemo(() => {
//     return [...filteredGames].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//   }, [filteredGames]);

//   return (
//     <div style={styles.wrapper}>
//       {/* HERO */}
//       <section
//         style={{
//           ...styles.hero,
//           opacity: animate ? 1 : 0,
//           transform: animate ? "translateY(0)" : "translateY(25px)",
//         }}
//       >
//         <div style={styles.heroGlow} />
//         <h1 style={styles.heroTitle}>Welcome to Gamenethub 🎮</h1>
//         <p style={styles.heroSub}>Play amazing online games — fully free!</p>
//       </section>

//       <div style={styles.sectionDivider}></div>

//       {/* TRENDING */}
//       <section style={styles.section}>
//         <h2 style={styles.sectionTitleGlow}>🔥 Trending Games</h2>
//         <div style={{position:"relative"}}>
//           <div style={styles.scrollRightHint}>➡️</div>
//         <div style={styles.horizontalScroll} className="modern-scroll">
//           {trending.map((game, i) => (
//             // <div
//             //   key={game._id}
//             //   style={{
//             //     ...styles.horizontalItem,
//             //     opacity: animate ? 1 : 0,
//             //     transform: animate ? "translateY(0)" : "translateY(20px)",
//             //     transition: `all .6s ease ${i * 0.1}s`,
//             //   }}
//             // >

//             <div
//                   key={game._id}
//                   style={{
//                     ...styles.horizontalItem,
//                     opacity: animate ? 1 : 0,
//                     transform: animate ? "translateY(0)" : "translateY(20px)",
//                     transition: `all .6s ease ${i * 0.1}s, transform .25s ease`,
//                   }}
//                   onMouseEnter={(e) => {
//                     Object.assign(e.currentTarget.style, styles.horizontalItemHover);
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "none";
//                     e.currentTarget.style.boxShadow = "none";
//                   }}
//                 >       

//               <GameCard game={game} onPlay={() => setSelectedGame(game)} />
//             </div>
//           ))}
//         </div>
//         </div>
//       </section>

//       {/* POPULAR */}
//       <section style={styles.section}>
//         <h2 style={styles.sectionTitleGlow}>⭐ Popular Games</h2>

//         <div style={styles.grid}>
//           {popular.map((game, i) => (
//             <div
//               key={game._id}
//               style={{
//                 opacity: animate ? 1 : 0,
//                 transform: animate ? "scale(1)" : "scale(0.92)",
//                 transition: `all .55s ease ${i * 0.07}s`,
//               }}
//             >
//               <GameCard game={game} onPlay={() => setSelectedGame(game)} />
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* NEW RELEASES */}
//       <section style={styles.section}>
//         <h2 style={styles.sectionTitleGlow}>🆕 New Releases</h2>

//         <div style={styles.grid}>
//           {newReleases.map((game, i) => (
//             <div
//               key={game._id}
//               style={{
//                 opacity: animate ? 1 : 0,
//                 transform: animate ? "translateY(0)" : "translateY(25px)",
//                 transition: `all .6s ease ${i * 0.09}s`,
//               }}
//             >
//               <GameCard game={game} onPlay={() => setSelectedGame(game)} />
//             </div>
//           ))}
//         </div>
//       </section>

//       <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
//     </div>
//   );
// }

// const styles = {
//   wrapper: {
//     padding: "20px",
//     color: "#fff",
//     maxWidth: "1350px",
//     margin: "0 auto",
//   },
//   hero: {
//     position: "relative",
//     textAlign: "center",
//     padding: "20px",
//     marginBottom: "60px",
//     borderRadius: "22px",
//     background: "linear-gradient(135deg, #0f172a, #1e293b)",
//   },
//   heroGlow: {
//     position: "absolute",
//     top: "-45%",
//     left: "-35%",
//     width: "200%",
//     height: "200%",
//     background: "radial-gradient(circle, rgba(96,165,250,0.17), transparent 70%)",
//     filter: "blur(120px)",
//   },
//   heroTitle: {
//     fontSize: "42px",
//     fontWeight: 800,
//     marginBottom: "10px",
//   },
//   heroSub: {
//     fontSize: "18px",
//     color: "#9ca3af",
//   },
//   sectionDivider: {
//     height: "2px",
//     background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
//     margin: "20px 0 30px",
//     opacity: 0.6,
//   },
//   section: { marginBottom: "30px" }, 
//   sectionTitleGlow: {
//     fontSize: "26px",
//     fontWeight: 700,
//     marginBottom: "18px",
//     textShadow: "0 0 12px rgba(59,130,246,0.55)",
//   },
//   // horizontalScroll: {
//   //   display: "flex",
//   //   gap: "20px",
//   //   overflowX: "auto",
//   //   paddingBottom: "10px",
//   // },
//     horizontalScroll: {
//     display: "flex",
//     gap: "18px",
//     overflowX: "auto",
//     padding: "10px 4px 14px",
//     scrollSnapType: "x mandatory",
//     scrollbarWidth: "none",  // Firefox
//     msOverflowStyle: "none", // IE
//   },

// //   horizontalItem: {
// //   minWidth: "130px",
// // },

//   horizontalItem: {
//     minWidth: "150px",
//     scrollSnapAlign: "start",
//     transition: "transform .25s ease, box-shadow .25s ease",
//     borderRadius: "14px",
//     overflow: "visible",
//   },

//   horizontalItemHover: {
//   transform: "translateY(-6px) scale(1.03)",
//   boxShadow: "0 8px 32px rgba(59,130,246,0.25)",
// },

// scrollRightHint: {
//   position: "absolute",
//   right: "10px",
//   top: "50%",
//   transform: "translateY(-50%)",
//   background: "rgba(0,0,0,0.45)",
//   backdropFilter: "blur(6px)",
//   color: "#fff",
//   padding: "8px 10px",
//   borderRadius: "50%",
//   fontSize: "18px",
//   cursor: "pointer",
//   zIndex: 5,
//   transition: "opacity .3s",
//   opacity: 0.8,
// },






// grid: {
//   display: "grid",
//   gap: "10px",
//   width: "100%",
//   gridTemplateColumns: "repeat(auto-fit, minmax(139px, 1fr))",
//   justifyItems: "center",
// },

// };

// // Hide scrollbar for Chrome/Safari/Edge
// const css = `
//   .modern-scroll::-webkit-scrollbar {
//     display: none;
//   }
// `;
// const styleTag = document.createElement("style");
// styleTag.innerHTML = css;
// document.head.appendChild(styleTag);



import React, { useState, useEffect, useMemo, useRef } from "react";
import { getAllGames } from "../services/api";
import GameCard from "../components/GameCard";
import GameModal from "../components/GameModal";

export default function Home() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // NEW → Arrow auto-hide
  const [showArrow, setShowArrow] = useState(true);
  const trendingRef = useRef(null);

  useEffect(() => {
    async function loadGames() {
      try {
        const res = await getAllGames();
        setGames(res.data.games || []);
      } catch (err) {
        console.log("Failed to load games:", err);
      }
    }
    loadGames();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function onSearch(e) {
      const term = (e?.detail || "").toString();
      setSearchTerm(term);
    }
    window.addEventListener("games-search", onSearch);
    return () => window.removeEventListener("games-search", onSearch);
  }, []);

  // AUTO-HIDE ARROW LOGIC
  useEffect(() => {
    const scroller = trendingRef.current;
    if (!scroller) return;

    function handleScroll() {
      if (scroller.scrollLeft > 20) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    }

    scroller.addEventListener("scroll", handleScroll);
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredGames = useMemo(() => {
    if (!searchTerm.trim()) return games;
    const t = searchTerm.toLowerCase();
    return games.filter((g) => (g.title || "").toLowerCase().includes(t));
  }, [games, searchTerm]);

  const trending = useMemo(() => {
    return [...filteredGames]
      .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
      .slice(0, 10);
  }, [filteredGames]);

  const popular = useMemo(() => {
    return [...filteredGames].sort((a, b) => (b.popularScore || 0) - (a.popularScore || 0));
  }, [filteredGames]);

  const newReleases = useMemo(() => {
    return [...filteredGames].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [filteredGames]);

  return (
    <div style={styles.wrapper}>
      {/* HERO */}
      <section
        style={{
          ...styles.hero,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(25px)",
        }}
      >
        <div style={styles.heroGlow} />
        <h1 style={styles.heroTitle}>Welcome to Gamenethub 🎮</h1>
        <p style={styles.heroSub}>Play amazing online games — fully free!</p>
      </section>

      <div style={styles.sectionDivider}></div>

      {/* TRENDING */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitleGlow}>🔥 Trending Games</h2>

        <div style={{ position: "relative" }}>
          
          {/* AUTO-HIDE ARROW */}
          {showArrow && (
            <div style={styles.scrollRightHint}>
              <span style={{ fontSize: "22px", opacity: 0.9 }}>❯</span>
            </div>
          )}

          <div
            ref={trendingRef}
            style={styles.horizontalScroll}
            className="modern-scroll"
          >
            {trending.map((game, i) => (
              <div
                key={game._id}
                style={{
                  ...styles.horizontalItem,
                  opacity: animate ? 1 : 0,
                  transform: animate ? "translateY(0)" : "translateY(20px)",
                  transition: `all .6s ease ${i * 0.1}s, transform .25s ease`,
                }}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, styles.horizontalItemHover);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <GameCard game={game} onPlay={() => setSelectedGame(game)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitleGlow}>⭐ Popular Games</h2>

        <div style={styles.grid}>
          {popular.map((game, i) => (
            <div
              key={game._id}
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "scale(1)" : "scale(0.92)",
                transition: `all .55s ease ${i * 0.07}s`,
              }}
            >
              <GameCard game={game} onPlay={() => setSelectedGame(game)} />
            </div>
          ))}
        </div>
      </section>

      {/* NEW RELEASES */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitleGlow}>🆕 New Releases</h2>

        <div style={styles.grid}>
          {newReleases.map((game, i) => (
            <div
              key={game._id}
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(25px)",
                transition: `all .6s ease ${i * 0.09}s`,
              }}
            >
              <GameCard game={game} onPlay={() => setSelectedGame(game)} />
            </div>
          ))}
        </div>
      </section>

      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  wrapper: {
    padding: "20px",
    color: "#fff",
    maxWidth: "1350px",
    margin: "0 auto",
  },

  hero: {
    position: "relative",
    textAlign: "center",
    padding: "20px",
    // marginBottom: "0px",
    borderRadius: "22px",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
  },

  heroGlow: {
    position: "absolute",
    top: "-45%",
    left: "-35%",
    width: "200%",
    height: "200%",
    background: "radial-gradient(circle, rgba(96,165,250,0.17), transparent 70%)",
    filter: "blur(120px)",
  },

  heroTitle: {
    fontSize: "42px",
    fontWeight: 800,
    marginBottom: "10px",
  },

  heroSub: {
    fontSize: "18px",
    color: "#9ca3af",
  },

  sectionDivider: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
    margin: "20px 0 30px",
    opacity: 0.6,
  },

  section: { marginBottom: "30px" },

  sectionTitleGlow: {
    fontSize: "26px",
    fontWeight: 700,
    marginBottom: "18px",
    textShadow: "0 0 12px rgba(59,130,246,0.55)",
  },

  /* ------- Horizontal Scroll Modern ------- */
  horizontalScroll: {
    display: "flex",
    gap: "18px",
    overflowX: "auto",
    padding: "10px 4px 14px",
    scrollSnapType: "x mandatory",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },

  horizontalItem: {
    minWidth: "150px",
    scrollSnapAlign: "start",
    transition: "transform .25s ease, box-shadow .25s ease",
    borderRadius: "14px",
    overflow: "visible",
  },

  horizontalItemHover: {
    transform: "translateY(-6px) scale(1.03)",
    boxShadow: "0 8px 32px rgba(59,130,246,0.25)",
  },

  /* ------- MODERN AUTO-HIDE ARROW ------- */
  scrollRightHint: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 22px rgba(0,0,0,0.45)",
    border: "1px solid rgba(255,255,255,0.12)",
    cursor: "pointer",
    zIndex: 10,
    transition: "all 0.35s ease",
    opacity: 1,
  },

  grid: {
    display: "grid",
    gap: "10px",
    width: "100%",
    gridTemplateColumns: "repeat(auto-fit, minmax(139px, 1fr))",
    justifyItems: "center",
  },
};

/* Hide scrollbar (Chrome / Safari / Edge) */
const css = `
  .modern-scroll::-webkit-scrollbar {
    display: none;
  }
`;
const styleTag = document.createElement("style");
styleTag.innerHTML = css;
document.head.appendChild(styleTag);
        