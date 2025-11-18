// src/pages/Profile.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useFavorites, fetchFavoritesAPI } from "../services/favoriteActions";

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, logout, isAuthenticated } = useAuth();

  const inputRef = useRef(null);

  const initialPreview =
    sessionStorage.getItem("profile_preview") ||
    user?.picture ||
    user?.avatar ||
    "https://i.ibb.co/YT1y9VJ/default-avatar.png";

  const [preview, setPreview] = useState(initialPreview);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // ⭐ Favorites hook
  const { favorites, toggleFavorite, refreshFavorites } = useFavorites();

  // ⭐ Store full favorite game objects separately
  const [favGames, setFavGames] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

  const socialLinks = [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/", icon: "📸" },
    { id: "twitter", label: "Twitter", href: "https://twitter.com/", icon: "🐦" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/", icon: "🔗" },
  ];

  // Update preview when user updates
  useEffect(() => {
    setPreview(user?.picture || user?.avatar || "https://i.ibb.co/YT1y9VJ/default-avatar.png");
  }, [user]);

  // Cleanup Blob URLs
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      sessionStorage.removeItem("profile_preview");
    };
  }, [preview]);

  // ⭐ Load favorite full objects
  const loadFavoriteGames = async () => {
    if (!isAuthenticated) {
      setFavGames([]);
      return;
    }

    setFavLoading(true);
    try {
      const games = await fetchFavoritesAPI(); // returns full objects
      setFavGames(games);
    } catch {
      setFavGames([]);
    } finally {
      setFavLoading(false);
    }
  };

  // Load on login + whenever favorites change
  useEffect(() => {
    loadFavoriteGames();
  }, [favorites, isAuthenticated]);

  const triggerPick = () => inputRef.current?.click();

  const handleFilePick = (e) => {
    setErr("");
    setMsg("");
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      setErr("Please select a valid image file.");
      return;
    }
    if (f.size > 4 * 1024 * 1024) {
      setErr("Max file size allowed: 4MB");
      return;
    }

    const url = URL.createObjectURL(f);
    setFile(f);
    setPreview(url);
    sessionStorage.setItem("profile_preview", url);
  };

  const handleUpload = async () => {
    if (!file) {
      setErr("Please select an image first.");
      return;
    }

    setLoading(true);
    const fd = new FormData();
    fd.append("avatar", file);

    try {
      const res = await axios.post("/api/user/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = res.data?.user || res.data;
      updateUser(updatedUser);
      setMsg("Profile updated successfully.");
      setFile(null);
    } catch (error) {
      setErr(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFav = async (gameId) => {
    const res = await toggleFavorite(gameId);
    if (res.error === "LOGIN_REQUIRED") {
      alert("Please login first.");
      return;
    }
    await refreshFavorites();
    await loadFavoriteGames();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Your Profile</h1>

        {/* ---------------- GRID ---------------- */}
        <div style={styles.grid}>
          {/* LEFT Column */}
          <div style={styles.leftCol}>
            <div style={styles.avatarWrap}>
              <img
                src={preview}
                alt="avatar"
                style={styles.avatar}
                onError={(e) => {
                  e.currentTarget.src = "https://i.ibb.co/YT1y9VJ/default-avatar.png";
                }}
              />
              <button style={styles.editBtn} onClick={triggerPick}>✎</button>
              <input type="file" ref={inputRef} accept="image/*" style={{ display: "none" }} onChange={handleFilePick} />
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 20 }}>
              <button
                onClick={handleUpload}
                disabled={loading || !file}
                style={{ ...styles.primaryBtn, opacity: !file ? 0.6 : 1 }}
              >
                {loading ? "Uploading…" : "Upload"}
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                style={styles.ghostBtn}
              >
                Logout
              </button>
            </div>

            {msg && <div style={styles.success}>{msg}</div>}
            {err && <div style={styles.error}>{err}</div>}
          </div>

          {/* RIGHT Column (User Info) */}
          <div style={styles.rightCol}>
            <div style={styles.infoRow}>
              <div>
                <div style={styles.infoLabel}>Name</div>
                <div style={styles.infoValue}>{user?.name}</div>
              </div>
            </div>

            <div style={styles.infoRow}>
              <div>
                <div style={styles.infoLabel}>Email</div>
                <div style={styles.infoValueSmall}>{user?.email}</div>
              </div>
            </div>
          </div>

          {/* SOCIAL Column */}
          <div style={styles.socialCol}>
            <div style={styles.socialTitle}>Social</div>
            <ul style={styles.socialList}>
              {socialLinks.map((s) => (
                <li key={s.id} style={styles.socialItem}>
                  <a href={s.href} target="_blank" rel="noreferrer" style={styles.socialLink}>
                    <span style={styles.socialIcon}>{s.icon}</span>
                    <span style={styles.socialLabel}>{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------------- FAVORITES SECTION (below grid) ---------------- */}
        <div style={styles.favSectionWrapper}>
          <h3 style={{ color: "#fff", marginBottom: 10 }}>❤️ Your Favorites</h3>

          {favLoading ? (
            <div style={{ color: "#9fb7d9" }}>Loading favorites...</div>
          ) : favGames.length === 0 ? (
            <div style={{ color: "#9fb7d9" }}>No favorites yet.</div>
          ) : (
            <div style={styles.favGrid}>
              {favGames.map((g) => (
                <div key={g._id} style={styles.favCard}>
                  <div style={styles.favImgWrap}>
                    <img
                      src={
                        g.thumbnail?.startsWith("/uploads")
                          ? `http://localhost:5000${g.thumbnail}`
                          : g.thumbnail
                      }
                      style={styles.favImg}
                      alt={g.title}
                    />
                  </div>

                  <div style={styles.favInfo}>
                    <div style={styles.favTitle}>{g.title}</div>
                    <div style={styles.favGenre}>{g.genre}</div>

                    <div style={styles.favBtns}>
                      <button
                        onClick={() => navigate(`/game/${g.slug}`)}
                        style={styles.viewBtn}
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleToggleFav(g._id)}
                        style={styles.removeBtn}
                      >
                        ♥
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#0f172a",
    padding: "30px 20px",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: 900,
    background: "rgba(17,25,40,0.65)",
    borderRadius: 16,
    padding: 26,
    color: "#e6f0ff",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  title: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 20,
  },

  grid: {
    display: "flex",
    gap: 24,
    alignItems: "flex-start",
    marginBottom: 20,
  },

  leftCol: {
    width: 160,
    display: "flex",
    flexDirection: "column",
  },

  rightCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  avatarWrap: {
    width: 110,
    height: 110,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    background: "#071224",
  },

  avatar: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  editBtn: {
    position: "absolute",
    bottom: 8,
    right: 8,
    background: "#3b82f6",
    border: "none",
    color: "#fff",
    padding: "6px 8px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 12,
  },

  primaryBtn: {
    padding: "10px 20px",
    borderRadius: 10,
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },

  ghostBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "#cfe8ff",
    cursor: "pointer",
    fontWeight: 700,
  },

  success: {
    marginTop: 10,
    background: "rgba(16,185,129,0.15)",
    padding: 10,
    borderRadius: 8,
  },

  error: {
    marginTop: 10,
    background: "rgba(239,68,68,0.15)",
    padding: 10,
    borderRadius: 8,
  },

  infoRow: {
    marginBottom: 10,
  },

  infoLabel: {
    color: "#9fb7d9",
    fontSize: 13,
    fontWeight: 700,
  },

  infoValue: {
    fontSize: 18,
    fontWeight: 800,
  },

  infoValueSmall: {
    fontSize: 14,
    fontWeight: 700,
  },

  socialCol: {
    width: 140,
  },

  socialTitle: {
    color: "#9fb7d9",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 10,
  },

  socialList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  socialItem: {},

  socialLink: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(255,255,255,0.03)",
    color: "#fff",
  },

  socialIcon: {
    background: "#3b82f6",
    color: "#fff",
    padding: "6px",
    borderRadius: 8,
    display: "inline-flex",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  favSectionWrapper: {
    marginTop: 30,
  },

  favGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
  },

  favCard: {
    width: 220,
    background: "#0b1220",
    borderRadius: 10,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  favImgWrap: {
    height: 120,
    overflow: "hidden",
  },

  favImg: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
  },

  favInfo: {
    padding: 10,
  },

  favTitle: {
    fontWeight: 800,
    color: "#fff",
    marginBottom: 4,
  },

  favGenre: {
    fontSize: 13,
    color: "#93c5fd",
    marginBottom: 8,
  },

  favBtns: {
    display: "flex",
    gap: 8,
  },

  viewBtn: {
    flex: 1,
    background: "#2563eb",
    border: "none",
    color: "#fff",
    padding: "8px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },

  removeBtn: {
    background: "transparent",
    border: "1px solid rgba(255,0,0,0.3)",
    color: "#ff5b5b",
    padding: "8px",
    borderRadius: 8,
    cursor: "pointer",
    minWidth: 44,
  },
};

