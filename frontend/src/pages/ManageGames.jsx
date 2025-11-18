// src/pages/ManageGames.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ManageGames() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState("");
  const [error, setError] = useState("");

  // Fetch all games
  const fetchGames = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/games");
      setGames(res.data.games);
    } catch (err) {
      setError("Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin");
      return;
    }
    fetchGames();
  }, [user]);

  // Delete a game
  const deleteGame = async (id) => {
    if (!window.confirm("Are you sure? This game will be permanently deleted.")) {
      return;
    }

    try {
      setDeleting(id);

      await axios.delete(`http://localhost:5000/api/games/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // remove deleted item from UI
      setGames((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      alert("Delete failed!");
    } finally {
      setDeleting("");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Manage Games</h1>

        <button style={styles.addBtn} onClick={() => navigate("/admin/add-game")}>
          ➕ Add New Game
        </button>

        {error && <p style={styles.error}>{error}</p>}

        {loading ? (
          <p style={styles.loading}>Loading games…</p>
        ) : games.length === 0 ? (
          <p style={styles.noGames}>No games added yet.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: "120px", padding: "14px 10px", textAlign: "left" }}>Thumbnail</th>
                  <th style={styles.thead}>Title</th>
                  <th style={styles.thead}>Genre</th>
                  <th style={styles.thead}>Rating</th>
                  <th style={styles.thead}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {games.map((game) => (
                  <tr key={game._id} style={styles.row}>
                    <td style={{ padding: "10px", verticalAlign: "middle" }}>
                     <img src={ game.thumbnail?.startsWith("/uploads")
        ? `http://localhost:5000${game.thumbnail}`
        : game.thumbnail
    }
    alt={game.title}
    style={styles.thumb}
  />
                    </td>
                    <td style={styles.text}>{game.title}</td>
                    <td style={styles.text}>{game.genre}</td>
                    <td style={styles.text}>{game.rating}</td>

                    <td style={styles.actions}>
                      {/* Edit */}
                      <button
                        style={styles.editBtn}
                        onClick={() =>
                          navigate(`/admin/games/${game._id}/edit`)
                        }
                      >
                        ✏️ Edit
                      </button>

                      {/* Delete */}
                      <button
                        style={styles.deleteBtn}
                        onClick={() => deleteGame(game._id)}
                        disabled={deleting === game._id}
                      >
                        {deleting === game._id ? "Deleting…" : "🗑️ Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "calc(100vh - 70px)",
    background: "#0f172a",
    display: "flex",
    justifyContent: "center",
    padding: "30px 10px",
  },

  card: {
    width: "100%",
    maxWidth: "1100px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "25px",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
  },

  title: {
    fontSize: "30px",
    fontWeight: 800,
    marginBottom: "15px",
    textAlign: "center",
  },

  addBtn: {
    padding: "10px 16px",
    background: "linear-gradient(90deg,#10b981,#059669)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "18px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
},
thead: {
  padding: "14px 10px",
  textAlign: "left",
},


  row: {
    background: "rgba(255,255,255,0.04)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },

  thumb: {
    width: "70px",
    height: "70px",
    borderRadius: "8px",
    objectFit: "cover",
  },

  text: {
  padding: "14px 10px",
  verticalAlign: "middle",
},

  actions: {
    display: "flex",
    gap: "8px",
    padding: "10px",
  },

  editBtn: {
    padding: "6px 12px",
    background: "#3b82f6",
    border: "none",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "6px 12px",
    background: "#ef4444",
    border: "none",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },

  loading: { textAlign: "center", marginTop: 20 },
  noGames: { textAlign: "center", marginTop: 20 },
  error: { color: "#f87171", textAlign: "center" },
};
