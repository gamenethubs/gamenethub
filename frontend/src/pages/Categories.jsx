// // src/pages/Categories.jsx
// import React, { useMemo, useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { getAllGames } from "../services/api";
// import GameCard from "../components/GameCard";
// import SearchBar from "../components/SearchBar";
// import GameModal from "../components/GameModal";

// export default function Categories() {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [games, setGames] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedGame, setSelectedGame] = useState(null);
//   const [animate, setAnimate] = useState(false);

//   const initialGenre = searchParams.get("genre") || "All";

//   const [searchTerm, setSearchTerm] = useState("");
//   const [genreFilter, setGenreFilter] = useState(initialGenre);

//   // ⭐ NEW: Advanced Sorting Options
//   const [sortType, setSortType] = useState("rating_desc");

//   /**********************************************
//    * FETCH GAMES FROM BACKEND
//    **********************************************/
//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await getAllGames();
//         setGames(res.data.games);
//       } catch (err) {
//         console.log("Failed loading games:", err);
//       }
//       setLoading(false);
//     }
//     load();
//   }, []);

//   useEffect(() => {
//     setTimeout(() => setAnimate(true), 120);
//   }, []);

//   /**********************************************
//    * DYNAMIC GENRE LIST
//    **********************************************/
//   const genres = useMemo(() => {
//     const list = ["All"];
//     games.forEach((g) => {
//       if (!list.includes(g.genre)) list.push(g.genre);
//     });
//     return list;
//   }, [games]);

//   /**********************************************
//    * FILTER + SEARCH + SORT + TRENDING/POPULAR
//    **********************************************/
//   const filteredGames = useMemo(() => {
//     let list = [...games];

//     // 🔍 Search Filter
//     if (searchTerm.trim() !== "") {
//       list = list.filter((g) =>
//         g.title.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // 🎭 Genre Filter
//     if (genreFilter !== "All") {
//       list = list.filter((g) => g.genre === genreFilter);
//     }
// // 🔄 Sorting System (FIXED)
// switch (sortType) {
//   case "rating_desc":
//     list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
//     break;

//   case "rating_asc":
//     list.sort((a, b) => (a.averageRating || 0) - (b.averageRating || 0));
//     break;

//   case "plays_desc":
//     list.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
//     break;

//   case "plays_asc":
//     list.sort((a, b) => (a.playCount || 0) - (b.playCount || 0));
//     break;

//   case "trending_desc":
//     list.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
//     break;

//   case "popular_desc":
//     list.sort((a, b) => (b.popularScore || 0) - (a.popularScore || 0));
//     break;

//   default:
//     break;
// }

//     return list;
//   }, [games, searchTerm, genreFilter, sortType]);

//   const handleGenreSelect = (genre) => {
//     setGenreFilter(genre);
//     if (genre === "All") setSearchParams({});
//     else setSearchParams({ genre });
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: 20, color: "#fff" }}>
//         <h2>Loading categories...</h2>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         ...styles.wrapper,
//         opacity: animate ? 1 : 0,
//         transform: animate ? "translateY(0)" : "translateY(20px)",
//       }}
//     >
//       {/* PAGE TITLE */}
//       <h1 style={styles.heading}>Browse Games by Category</h1>
//       <p style={styles.subText}>Explore genres & discover new games 🎮</p>

//       {/* SEARCH + FILTERS */}
//       <div style={styles.topBar}>
//         <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

//         <div style={styles.selectArea}>
//           <select
//             value={genreFilter}
//             onChange={(e) => handleGenreSelect(e.target.value)}
//             style={styles.select}
//           >
//             {genres.map((genre) => (
//               <option value={genre} key={genre} style={styles.option}>
//                 {genre}
//               </option>
//             ))}
//           </select>

//           {/* ⭐ NEW Advanced Sorting Menu */}
//           <select
//             value={sortType}
//             onChange={(e) => setSortType(e.target.value)}
//             style={styles.select}
//           >
//             <option value="rating_desc">Rating: High → Low</option>
//             <option value="rating_asc">Rating: Low → High</option>
//             <option value="plays_desc">Plays: High → Low</option>
//             <option value="plays_asc">Plays: Low → High</option>
//             <option value="trending_desc">🔥 Trending</option>
//             <option value="popular_desc">⭐ Popular</option>
//           </select>
//         </div>
//       </div>

//       {/* GENRE CHIPS */}
//       <div style={styles.chipContainer}>
//         {genres.map((genre, i) => (
//           <button
//             key={genre}
//             onClick={() => handleGenreSelect(genre)}
//             style={{
//               ...styles.chip,
//               ...(genre === genreFilter ? styles.chipActive : {}),
//               animation: `fadePop 0.35s ease ${(i * 0.05).toFixed(2)}s both`,
//             }}
//           >
//             {genre}
//           </button>
//         ))}
//       </div>

//       {/* GAME GRID */}
//       <div style={styles.grid}>
//         {filteredGames.length > 0 ? (
//           filteredGames.map((game, i) => (
//             <div
//               key={game._id}
//               style={{
//                 animation: `fadePop 0.45s ease ${(i * 0.07).toFixed(2)}s both`,
//               }}
//             >
//               <GameCard game={game} onPlay={() => setSelectedGame(game)} />
//             </div>
//           ))
//         ) : (
//           <div style={styles.noResult}>
//             <h2>No games found 😢</h2>
//             <p style={{ marginTop: 6, color: "#64748b" }}>
//               Try searching something else.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* GAME MODAL */}
//       <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
//     </div>
//   );
// }

// /**********************************************
//  * PREMIUM UI STYLES
//  **********************************************/
// const styles = {
//   wrapper: {
//     padding: "20px",
//     maxWidth: "1250px",
//     margin: "0 auto",
//     color: "#fff",
//     transition: "all 0.5s ease",
//   },

//   heading: {
//     marginBottom: "5px",
//     fontSize: "32px",
//     fontWeight: 700,
//     background: "linear-gradient(90deg,#60a5fa,#a78bfa)",
//     WebkitBackgroundClip: "text",
//     color: "transparent",
//   },

//   subText: {
//     marginBottom: "20px",
//     color: "#94a3b8",
//     fontSize: "15px",
//   },

//   topBar: {
//     display: "flex",
//     gap: "16px",
//     marginBottom: "20px",
//     flexWrap: "wrap",
//     alignItems: "center",
//   },

//   selectArea: {
//     display: "flex",
//     gap: "12px",
//     marginLeft: "auto",
//   },

//   select: {
//     padding: "10px 14px",
//     background: "#1e293b",
//     border: "1px solid #334155",
//     borderRadius: "8px",
//     color: "#e2e8f0",
//     fontSize: "14px",
//     cursor: "pointer",
//     outline: "none",
//   },

//   option: {
//     background: "#0f172a",
//     color: "#e2e8f0",
//   },

//   chipContainer: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "10px",
//     marginBottom: "25px",
//   },

//   chip: {
//     padding: "8px 16px",
//     background: "rgba(255,255,255,0.03)",
//     borderRadius: "20px",
//     border: "1px solid rgba(255,255,255,0.08)",
//     color: "#cbd5e1",
//     cursor: "pointer",
//     fontSize: "14px",
//     transition: "all 0.25s ease",
//   },

//   chipActive: {
//     background: "linear-gradient(135deg,#2563eb,#7c3aed)",
//     color: "#fff",
//     border: "1px solid rgba(255,255,255,0.25)",
//     transform: "translateY(-2px) scale(1.03)",
//     boxShadow: "0 6px 20px rgba(124,58,237,0.35)",
//   },

//   // grid: {
//   //   display: "grid",
//   //   gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
//   //   gap: "22px",
//   //   justifyItems: "center",

//   // },
//   grid: {
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fill, minmax(135px, 1fr))",
//   gap: "10px",
//   justifyItems: "center",
// }
// ,
// "@media (max-width: 600px)": {
//   grid: {
//     gridTemplateColumns: "repeat(3, 1fr)",
//     gap: "10px",
//   }
// },

//   noResult: {
//     gridColumn: "1/-1",
//     textAlign: "center",
//     marginTop: "40px",
//   },
// };


///////////////////new/////////////////

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllGames } from "../services/api";
import GameCard from "../components/GameCard";
import SearchBar from "../components/SearchBar";
import GameModal from "../components/GameModal";

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [animate, setAnimate] = useState(false);
  const initialGenre = searchParams.get("genre") || "All";
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState(initialGenre);
  const [sortType, setSortType] = useState("rating_desc");

  useEffect(() => {
    async function load() {
      try {
        const res = await getAllGames();
        setGames(res.data.games);
      } catch (err) {
        console.log("Failed loading games:", err);
      }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 120);
  }, []);

  const genres = useMemo(() => {
    const list = ["All"];
    games.forEach((g) => {
      if (!list.includes(g.genre)) list.push(g.genre);
    });
    return list;
  }, [games]);

  const filteredGames = useMemo(() => {
    let list = [...games];
    if (searchTerm.trim() !== "") {
      list = list.filter((g) =>
        g.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (genreFilter !== "All") {
      list = list.filter((g) => g.genre === genreFilter);
    }
    switch (sortType) {
      case "rating_desc":
        list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case "rating_asc":
        list.sort((a, b) => (a.averageRating || 0) - (b.averageRating || 0));
        break;
      case "plays_desc":
        list.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
        break;
      case "plays_asc":
        list.sort((a, b) => (a.playCount || 0) - (b.playCount || 0));
        break;
      case "trending_desc":
        list.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
        break;
      case "popular_desc":
        list.sort((a, b) => (b.popularScore || 0) - (a.popularScore || 0));
        break;
      default:
        break;
    }
    return list;
  }, [games, searchTerm, genreFilter, sortType]);

  const handleGenreSelect = (genre) => {
    setGenreFilter(genre);
    if (genre === "All") setSearchParams({});
    else setSearchParams({ genre });
  };

  if (loading) {
    return (
      <div style={s.loadingContainer}>
        <div className="loading-orb-container">
          <div className="loading-orb"></div>
          <div className="loading-ring"></div>
          <div className="loading-ring-2"></div>
        </div>
        <h2 style={s.loadingText}>Initializing Gaming Universe</h2>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <style>{`
          @keyframes orbPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.8; } }
          @keyframes ringRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes dotBounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } }
          .loading-orb-container { position: relative; width: 120px; height: 120px; margin-bottom: 32px; }
          .loading-orb { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: radial-gradient(circle, #8b5cf6, #3b82f6); border-radius: 50%; animation: orbPulse 2s ease-in-out infinite; box-shadow: 0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(59, 130, 246, 0.4); }
          .loading-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100px; height: 100px; border: 2px solid transparent; border-top-color: #8b5cf6; border-right-color: #3b82f6; border-radius: 50%; animation: ringRotate 1.5s linear infinite; }
          .loading-ring-2 { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 120px; height: 120px; border: 2px solid transparent; border-bottom-color: #ec4899; border-left-color: #8b5cf6; border-radius: 50%; animation: ringRotate 2s linear infinite reverse; }
          .loading-dots { display: flex; gap: 8px; margin-top: 20px; }
          .loading-dots span { width: 8px; height: 8px; background: linear-gradient(135deg, #8b5cf6, #3b82f6); border-radius: 50%; animation: dotBounce 1.4s ease-in-out infinite; }
          .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
          .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        `}</style>
      </div>
    );
  }

  return (
    <div style={s.mainWrapper}>
      <div className="animated-background"></div>

      <div style={s.heroSection}>
        <div className="hero-particles"></div>
        <div style={s.heroGlow}></div>
        <div className="hero-glow-secondary"></div>

        <div style={s.heroContent}>
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            PREMIUM COLLECTION
          </div>

          <h1
            style={{
              ...s.heroTitle,
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(30px)",
            }}
          >
            Discover Your Next
            <br />
            <span style={s.heroAccent}>Gaming Adventure</span>
          </h1>
          <p
            style={{
              ...s.heroSubtitle,
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Explore thousands of premium games across every genre
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{games.length}+</span>
              <span className="stat-label">Games</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{genres.length - 1}</span>
              <span className="stat-label">Genres</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">4.8★</span>
              <span className="stat-label">Avg Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div style={s.contentWrapper}>
        <div className="control-panel-wrapper">
          <div style={s.controlPanel}>
            <div style={s.searchWrapper}>
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
            <div style={s.sortControls}>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="sort-select"
                style={s.sortSelect}
              >
                <option value="rating_desc">⭐ Rating: High → Low</option>
                <option value="rating_asc">⭐ Rating: Low → High</option>
                <option value="plays_desc">🎮 Plays: High → Low</option>
                <option value="plays_asc">🎮 Plays: Low → High</option>
                <option value="trending_desc">🔥 Trending</option>
                <option value="popular_desc">💎 Popular</option>
              </select>
            </div>
          </div>
        </div>

        <div style={s.genreScrollWrapper}>
          <div className="genre-label-header">
            <span className="genre-icon">🎯</span>BROWSE BY GENRE
          </div>
          <div style={s.genreScroller} className="genre-scroller">
            {genres.map((genre, i) => (
              <button
                key={genre}
                onClick={() => handleGenreSelect(genre)}
                className={`genre-card ${
                  genre === genreFilter ? "genre-active" : ""
                }`}
                style={{
                  ...s.genreCard,
                  opacity: animate ? 1 : 0,
                  transform: animate
                    ? "translateX(0)"
                    : `translateX(${-50 + i * 10}px)`,
                  transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${
                    i * 0.05
                  }s`,
                }}
              >
                <div style={s.genreCardInner}>
                  <div className="genre-glow"></div>
                  <span style={s.genreLabel}>{genre}</span>
                  {genre === genreFilter && (
                    <div className="genre-active-indicator"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={s.gridSection}>
          <div className="grid-header">
            <h2 className="grid-title">
              {filteredGames.length}{" "}
              {filteredGames.length === 1 ? "Game" : "Games"} Found
            </h2>
            <div className="grid-line"></div>
          </div>

          {filteredGames.length > 0 ? (
            <div style={s.gameGrid} className="game-grid">
              {filteredGames.map((game, i) => (
                <div
                  key={game._id}
                  className="game-grid-item"
                  style={{
                    ...s.gameGridItem,
                    opacity: animate ? 1 : 0,
                    transform: animate ? "scale(1)" : "scale(0.9)",
                    transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${
                      i * 0.03
                    }s`,
                  }}
                >
                  <GameCard game={game} onPlay={() => setSelectedGame(game)} />
                </div>
              ))}
            </div>
          ) : (
            <div style={s.emptyState} className="empty-state">
              <div className="empty-glow"></div>
              <div style={s.emptyIcon}>🎮</div>
              <h2 style={s.emptyTitle}>No Games Found</h2>
              <p style={s.emptySubtitle}>
                Try adjusting your search or explore different genres
              </p>
              <button
                className="empty-reset-btn"
                onClick={() => {
                  setSearchTerm("");
                  setGenreFilter("All");
                  setSearchParams({});
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes gradientFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animated-background { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.05) 0%, transparent 50%); pointer-events: none; z-index: 0; }
        .hero-glow-secondary { position: absolute; bottom: -30%; right: 10%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(236, 72, 153, 0.2), transparent 60%); filter: blur(100px); pointer-events: none; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 20px; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 50px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #a78bfa; margin-bottom: 24px; backdrop-filter: blur(10px); }
        .hero-badge-dot { width: 6px; height: 6px; background: linear-gradient(135deg, #8b5cf6, #ec4899); border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
      .hero-stats { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 32px; 
  margin-top: 48px; 
  padding: 24px 48px; 
  background: rgba(15, 23, 42, 0.6); 
  backdrop-filter: blur(20px); 
  border: 1px solid rgba(255, 255, 255, 0.08); 
  border-radius: 20px; 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); 
}


        .stat-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
       .stat-number {
  font-size: 30px;
  font-weight: 900;
  letter-spacing: 0.5px;

  background: linear-gradient(
    135deg,
    #60a5fa,
    #8b5cf6,
    #ec4899
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  text-shadow:
    0 0 16px rgba(139, 92, 246, 0.55),
    0 0 32px rgba(59, 130, 246, 0.35);
}

       .stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;

  color: rgba(255, 255, 255, 0.65);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

        .stat-divider { width: 1px; height: 40px; background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.2), transparent); }
        .control-panel-wrapper { position: relative; }
        .control-panel-wrapper::before { content: ''; position: absolute; inset: -2px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3), rgba(236, 72, 153, 0.3)); border-radius: 18px; opacity: 0; transition: opacity 0.3s ease; pointer-events: none; }
        .control-panel-wrapper:hover::before { opacity: 1; }
        .sort-select { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .sort-select:hover { background: rgba(30, 41, 59, 1) !important; border-color: rgba(139, 92, 246, 0.5) !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(139, 92, 246, 0.25); }
        .genre-label-header { display: flex; align-items: center; gap: 12px; font-size: 13px; font-weight: 700; letter-spacing: 2px; color: rgba(255, 255, 255, 0.4); margin-bottom: 16px; padding: 0 4px; }
        .genre-icon { font-size: 16px; }
        .genre-scroller {
  -ms-overflow-style: none;  /* IE & Edge */
  scrollbar-width: none;     /* Firefox */
}

.genre-scroller::-webkit-scrollbar {
  display: none;             /* Chrome, Safari */
}

       
       
        .genre-card { position: relative; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .genre-card:hover { transform: translateY(-6px) scale(1.05) !important; }
        .genre-card:hover .genre-glow { opacity: 1; }
        .genre-glow { position: absolute; inset: -2px; background: linear-gradient(135deg, #8b5cf6, #3b82f6, #ec4899); border-radius: 14px; opacity: 0; transition: opacity 0.4s ease; filter: blur(8px); z-index: -1; }
        .genre-active .genre-glow { opacity: 1; filter: blur(12px); }
        .genre-active { transform: translateY(-6px) scale(1.05) !important; }
        .genre-active div { background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3)) !important; border-color: rgba(139, 92, 246, 0.5) !important; box-shadow: 0 12px 32px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1); }
        .genre-active span { color: #ffffff !important; font-weight: 700; }
        
        .grid-header { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; }
        .grid-title { font-size: 20px; font-weight: 700; color: rgba(255, 255, 255, 0.9); white-space: nowrap; }
        .grid-line { flex: 1; height: 2px; background: linear-gradient(90deg, rgba(139, 92, 246, 0.5), transparent); }
        .game-grid-item { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .game-grid-item:hover { transform: translateY(-8px) scale(1.03) !important; filter: brightness(1.1); z-index: 10; }
        .empty-state { position: relative; overflow: hidden; }
        .empty-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; height: 300px; background: radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 70%); filter: blur(60px); animation: pulse 3s ease-in-out infinite; }
        .empty-reset-btn { margin-top: 24px; padding: 14px 32px; background: linear-gradient(135deg, #8b5cf6, #3b82f6); border: none; border-radius: 12px; color: #ffffff; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3); position: relative; overflow: hidden; }
        .empty-reset-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent); transition: left 0.5s ease; }
        .empty-reset-btn:hover { transform: translateY(-2px) scale(1.05); box-shadow: 0 12px 32px rgba(139, 92, 246, 0.5); }
        .empty-reset-btn:hover::before { left: 100%; }
        .empty-reset-btn:active { transform: translateY(0) scale(1); }
        // @media (max-width: 768px) { .hero-stats { gap: 16px; padding: 16px 24px; } .stat-number { font-size: 20px; } .stat-label { font-size: 10px; } .grid-header { flex-direction: column; align-items: flex-start; gap: 12px; } }
        /* ✅ Tablet and below */
@media (max-width: 768px) {
  .hero-stats {
    gap: 16px;
    padding: 16px 24px;
  }

  .stat-number {
    font-size: 20px;
  }

  .stat-label {
    font-size: 10px;
  }

  .grid-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .game-grid {
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 12px !important;
  }
}

/* ✅ Mobile phones */
@media (max-width: 600px) {
  .hero-stats {
    gap: 12px;
    padding: 12px 16px;
  }

  .stat-number {
    font-size: 18px;
  }

  .stat-label {
    font-size: 9px;
  }

  .grid-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .game-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 10px !important;
  }
}

/* ✅ Very small phones */
@media (max-width: 480px) {
  .game-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 8px !important;
  }

  .game-grid-item {
    transform: scale(0.96);
  }
}

}

      `}</style>
    </div>
  );
}

const s = {
  mainWrapper: {
    minHeight: "100vh",
    background:
      "linear-gradient(to bottom, #0a0e1a 0%, #050810 50%, #0a0e1a 100%)",
    position: "relative",
    overflow: "hidden",
  },
  heroSection: {
    position: "relative",
    height: "50vh",
    minHeight: "450px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    background:
      "radial-gradient(ellipse at top, rgba(59, 130, 246, 0.12), transparent 70%)",
  },
  heroGlow: {
    position: "absolute",
    top: "-50%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "1000px",
    height: "1000px",
    background:
      "radial-gradient(circle, rgba(139, 92, 246, 0.25), rgba(59, 130, 246, 0.15), transparent 70%)",
    filter: "blur(100px)",
    pointerEvents: "none",
    animation: "float 8s ease-in-out infinite",
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: "clamp(36px, 7vw, 72px)",
    fontWeight: 900,
    lineHeight: 1.1,
    color: "#ffffff",
    marginBottom: "20px",
    transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
    letterSpacing: "-0.03em",
    textShadow: "0 4px 20px rgba(139, 92, 246, 0.3)",
  },
  heroAccent: {
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
    backgroundSize: "200% 200%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "inline-block",
    animation: "gradientFlow 4s ease infinite",
  },
  heroSubtitle: {
    fontSize: "clamp(15px, 2vw, 20px)",
    color: "rgba(255, 255, 255, 0.65)",
    fontWeight: 400,
    transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s",
    maxWidth: "600px",
    lineHeight: 1.6,
  },
  contentWrapper: {
    position: "relative",
    zIndex: 10,
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px 80px",
  },
  controlPanel: {
    display: "flex",
    gap: "20px",
    marginBottom: "40px",
    flexWrap: "wrap",
    background: "rgba(15, 23, 42, 0.5)",
    backdropFilter: "blur(30px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow:
      "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
    transition: "all 0.3s ease",
  },
  searchWrapper: { flex: "1 1 300px" },
  sortControls: { display: "flex", gap: "12px" },
  sortSelect: {
    padding: "14px 24px",
    background: "rgba(30, 41, 59, 0.9)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "12px",
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    outline: "none",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
  genreScrollWrapper: { marginBottom: "48px", position: "relative" },
  genreScroller: {
    display: "flex",
    gap: "14px",
    overflowX: "auto",
    overflowY: "hidden",
    padding: "13px",
  
  },
  genreCard: {
    position: "relative",
    padding: "0",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    flexShrink: 0,
    outline: "none",
  },
  genreCardInner: {
    position: "relative",
    padding: "16px 32px",
    background: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    backdropFilter: "blur(15px)",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
  },
  genreLabel: {
    fontSize: "15px",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.75)",
    whiteSpace: "nowrap",
    display: "block",
    transition: "all 0.3s ease",
    position: "relative",
    zIndex: 1,
  },
  gridSection: { minHeight: "400px" },
  gameGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(135px, 1fr))",
    gap: "16px",
    justifyItems: "center",
  },
  gameGridItem: { width: "100%" },
  emptyState: {
    textAlign: "center",
    padding: "120px 20px",
    background: "rgba(15, 23, 42, 0.4)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(30px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  },
  emptyIcon: {
    fontSize: "80px",
    marginBottom: "24px",
    opacity: 0.7,
    filter: "drop-shadow(0 4px 12px rgba(139, 92, 246, 0.3))",
  },
  emptyTitle: {
    fontSize: "32px",
    fontWeight: 800,
    color: "#ffffff",
    marginBottom: "12px",
    letterSpacing: "-0.02em",
  },
  emptySubtitle: {
    fontSize: "16px",
    color: "rgba(255, 255, 255, 0.55)",
    lineHeight: 1.6,
  },
  loadingContainer: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  width: "100%",
  textAlign: "center",
  background: "linear-gradient(to bottom, #0a0e1a 0%, #050810 100%)",
  padding: "20px",
},
loadingText: {
  fontSize: "clamp(16px, 4vw, 22px)",
  fontWeight: 700,
  color: "rgba(255, 255, 255, 0.8)",
  letterSpacing: "0.5px",
  marginTop: "12px",
  textAlign: "center",
},

};
