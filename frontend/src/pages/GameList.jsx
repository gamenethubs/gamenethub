// src/pages/GameList.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllGames, deleteGame } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function GameList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/admin");

    loadGames();
  }, [user, navigate]);

  const loadGames = async () => {
    try {
      const res = await getAllGames();
      setGames(res.data.games || []);
      setFilteredGames(res.data.games || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSearch = (val) => {
    setSearch(val);
    const q = val.toLowerCase();

    const filtered = games.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.genre.toLowerCase().includes(q)
    );

    setFilteredGames(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this game permanently?")) return;

    try {
      await deleteGame(id);
      setGames(games.filter((g) => g._id !== id));
      setFilteredGames(filteredGames.filter((g) => g._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>🎮 All Games</h1>

      {/* SEARCH BOX */}
      <div style={styles.searchBox}>
        <input
          style={styles.searchInput}
          placeholder="Search games…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading…</p>
      ) : (
        <div style={styles.list}>
          {filteredGames.map((game) => (
            <div key={game._id} style={styles.card}>
              <img src={game.thumbnail} style={styles.thumb} />

              <div style={{ flex: 1 }}>
                <h3 style={styles.cardTitle}>{game.title}</h3>
                <p style={styles.genre}>{game.genre}</p>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.editBtn}
                  onClick={() => navigate(`/admin/edit/${game._id}`)}
                >
                  ✏️ Edit
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(game._id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}

          {filteredGames.length === 0 && (
            <p style={{ marginTop: 20, opacity: 0.7 }}>No games found.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- STYLES ----------
const styles = {
  wrapper: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    color: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 20,
    textShadow: "0 0 10px rgba(59,130,246,0.4)",
  },
  searchBox: {
    marginBottom: 20,
  },
  searchInput: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: 15,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 12,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 0 18px rgba(0,0,0,0.3)",
  },
  thumb: {
    width: 80,
    height: 70,
    borderRadius: 8,
    objectFit: "cover",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
  },
  genre: {
    fontSize: 14,
    opacity: 0.75,
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  editBtn: {
    background: "#3b82f6",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#fff",
  },
  deleteBtn: {
    background: "#ef4444",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#fff",
  },
};
