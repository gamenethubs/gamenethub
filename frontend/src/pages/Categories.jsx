// src/pages/Categories.jsx
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

  // ⭐ NEW: Advanced Sorting Options
  const [sortType, setSortType] = useState("rating_desc");

  /**********************************************
   * FETCH GAMES FROM BACKEND
   **********************************************/
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

  /**********************************************
   * DYNAMIC GENRE LIST
   **********************************************/
  const genres = useMemo(() => {
    const list = ["All"];
    games.forEach((g) => {
      if (!list.includes(g.genre)) list.push(g.genre);
    });
    return list;
  }, [games]);

  /**********************************************
   * FILTER + SEARCH + SORT + TRENDING/POPULAR
   **********************************************/
  const filteredGames = useMemo(() => {
    let list = [...games];

    // 🔍 Search Filter
    if (searchTerm.trim() !== "") {
      list = list.filter((g) =>
        g.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 🎭 Genre Filter
    if (genreFilter !== "All") {
      list = list.filter((g) => g.genre === genreFilter);
    }

    // 🔄 Sorting System
    switch (sortType) {
      case "rating_desc":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "rating_asc":
        list.sort((a, b) => a.rating - b.rating);
        break;
      case "plays_desc":
        list.sort((a, b) => b.playCount - a.playCount);
        break;
      case "plays_asc":
        list.sort((a, b) => a.playCount - b.playCount);
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
      <div style={{ padding: 20, color: "#fff" }}>
        <h2>Loading categories...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.wrapper,
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {/* PAGE TITLE */}
      <h1 style={styles.heading}>Browse Games by Category</h1>
      <p style={styles.subText}>Explore genres & discover new games 🎮</p>

      {/* SEARCH + FILTERS */}
      <div style={styles.topBar}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div style={styles.selectArea}>
          <select
            value={genreFilter}
            onChange={(e) => handleGenreSelect(e.target.value)}
            style={styles.select}
          >
            {genres.map((genre) => (
              <option value={genre} key={genre} style={styles.option}>
                {genre}
              </option>
            ))}
          </select>

          {/* ⭐ NEW Advanced Sorting Menu */}
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            style={styles.select}
          >
            <option value="rating_desc">Rating: High → Low</option>
            <option value="rating_asc">Rating: Low → High</option>
            <option value="plays_desc">Plays: High → Low</option>
            <option value="plays_asc">Plays: Low → High</option>
            <option value="trending_desc">🔥 Trending</option>
            <option value="popular_desc">⭐ Popular</option>
          </select>
        </div>
      </div>

      {/* GENRE CHIPS */}
      <div style={styles.chipContainer}>
        {genres.map((genre, i) => (
          <button
            key={genre}
            onClick={() => handleGenreSelect(genre)}
            style={{
              ...styles.chip,
              ...(genre === genreFilter ? styles.chipActive : {}),
              animation: `fadePop 0.35s ease ${(i * 0.05).toFixed(2)}s both`,
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* GAME GRID */}
      <div style={styles.grid}>
        {filteredGames.length > 0 ? (
          filteredGames.map((game, i) => (
            <div
              key={game._id}
              style={{
                animation: `fadePop 0.45s ease ${(i * 0.07).toFixed(2)}s both`,
              }}
            >
              <GameCard game={game} onPlay={() => setSelectedGame(game)} />
            </div>
          ))
        ) : (
          <div style={styles.noResult}>
            <h2>No games found 😢</h2>
            <p style={{ marginTop: 6, color: "#64748b" }}>
              Try searching something else.
            </p>
          </div>
        )}
      </div>

      {/* GAME MODAL */}
      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}

/**********************************************
 * PREMIUM UI STYLES
 **********************************************/
const styles = {
  wrapper: {
    padding: "20px",
    maxWidth: "1250px",
    margin: "0 auto",
    color: "#fff",
    transition: "all 0.5s ease",
  },

  heading: {
    marginBottom: "5px",
    fontSize: "32px",
    fontWeight: 700,
    background: "linear-gradient(90deg,#60a5fa,#a78bfa)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },

  subText: {
    marginBottom: "20px",
    color: "#94a3b8",
    fontSize: "15px",
  },

  topBar: {
    display: "flex",
    gap: "16px",
    marginBottom: "20px",
    flexWrap: "wrap",
    alignItems: "center",
  },

  selectArea: {
    display: "flex",
    gap: "12px",
    marginLeft: "auto",
  },

  select: {
    padding: "10px 14px",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#e2e8f0",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
  },

  option: {
    background: "#0f172a",
    color: "#e2e8f0",
  },

  chipContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "25px",
  },

  chip: {
    padding: "8px 16px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#cbd5e1",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.25s ease",
  },

  chipActive: {
    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.25)",
    transform: "translateY(-2px) scale(1.03)",
    boxShadow: "0 6px 20px rgba(124,58,237,0.35)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "22px",
    justifyItems: "center",
  },

  noResult: {
    gridColumn: "1/-1",
    textAlign: "center",
    marginTop: "40px",
  },
};
