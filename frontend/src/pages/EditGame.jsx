// src/pages/EditGame.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getGameById, updateGame } from "../services/api";

export default function EditGame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [animate, setAnimate] = useState(false);

  // TEXT FIELDS
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(4.0);

  // EXISTING (from backend)
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [zipURL, setZipURL] = useState("");

  // NEW FILES
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);

  // UI STATE
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ✔ FIXED filename extractor
  const getFileName = (value) => {
    if (!value || typeof value !== "string") return "No file";

    const clean = value.trim().replace(/\\/g, "/");
    const file = clean.split("/").pop();

    if (!file || !file.includes(".")) return "No file";

    return file;
  };

  // LOAD EXISTING GAME
  const fetchGame = async () => {
    try {
      setLoading(true);

      const res = await getGameById(id);
      const g = res.data.game;

      setTitle(g.title);
      setGenre(g.genre);
      setDescription(g.description || "");

      // ✔ Never modify backend paths!
      setThumbnailURL(g.thumbnail || "");
      setZipURL(g.gameZip || "");

    } catch (err) {
      setErrorMsg("Failed to load game details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin");
      return;
    }

    fetchGame();
    setTimeout(() => setAnimate(true), 80);
  }, [user]);

  // FILE HANDLERS
  const handleThumbnail = (e) => {
    const file = e.target.files?.[0] || null;
    setThumbnailFile(file);
  };

  const handleZipFile = (e) => {
    const file = e.target.files?.[0] || null;
    setZipFile(file);
  };

  // UPDATE GAME API
  const handleUpdate = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!title.trim() || !genre.trim()) {
      setErrorMsg("Title and Genre are required.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("genre", genre);
      formData.append("description", description);

      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
      if (zipFile) formData.append("gameZip", zipFile);

      const res = await updateGame(id, formData);

      if (res.data.success) {
        setSuccessMsg("Game updated successfully!");
        setTimeout(() => navigate("/admin/games"), 1200);
      }
    } catch (err) {
      setErrorMsg("Failed to update game");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.bigGlow}></div>

      <div
        style={{
          ...styles.card,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(25px)",
        }}
      >
        <h1 style={styles.title}>✏️ Edit Game</h1>

        {loading ? (
          <p style={styles.loading}>Loading game...</p>
        ) : (
          <>
            {errorMsg && <div style={styles.error}>{errorMsg}</div>}
            {successMsg && <div style={styles.success}>{successMsg}</div>}

            {/* TITLE */}
            <div style={styles.field}>
              <label style={styles.label}>Game Title *</label>
              <input
                style={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* GENRE */}
            <div style={styles.field}>
              <label style={styles.label}>Genre *</label>
              <input
                style={styles.input}
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>

            {/* THUMBNAIL */}
            <div style={styles.field}>
              <label style={styles.label}>Thumbnail Image</label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                style={styles.input}
                onChange={handleThumbnail}
              />

              {thumbnailFile ? (
                <p style={styles.fileName}>New: {thumbnailFile.name}</p>
              ) : (
                <p style={styles.fileName}>
                  Current: {getFileName(thumbnailURL)}
                </p>
              )}
            </div>

            {/* ZIP FILE */}
            <div style={styles.field}>
              <label style={styles.label}>Game ZIP File</label>
              <input
                type="file"
                accept=".zip"
                style={styles.input}
                onChange={handleZipFile}
              />

              {zipFile ? (
                <p style={styles.fileName}>New: {zipFile.name}</p>
              ) : (
                <p style={styles.fileName}>Current: {getFileName(zipURL)}</p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button style={styles.btn} disabled={saving} onClick={handleUpdate}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// styles remain unchanged...


// --------------------- UI STYLES ---------------------
const styles = {
  wrapper: {
    minHeight: "calc(100vh - 70px)",
    background: "#0f172a",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    position: "relative",
  },

  bigGlow: {
    position: "absolute",
    top: "-40%",
    left: "-20%",
    width: "200%",
    height: "200%",
    background: "radial-gradient(circle, rgba(96,165,250,0.15), transparent 70%)",
    filter: "blur(140px)",
    zIndex: -1,
  },

  card: {
    width: "100%",
    maxWidth: "600px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "18px",
    padding: "35px",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 0 40px rgba(0,0,0,0.4)",
  },

  title: {
    fontSize: 30,
    fontWeight: 800,
    textAlign: "center",
    marginBottom: 15,
  },

  field: { marginBottom: 18 },
  label: { fontSize: 14, marginBottom: 6, color: "#cbd5e1" },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
  },

  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    minHeight: 80,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
  },

  fileName: {
    color: "#93c5fd",
    marginTop: 5,
    fontSize: 13,
  },

  btn: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    background: "linear-gradient(90deg,#3b82f6,#6366f1)",
    border: "none",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 10,
  },

  error: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.35)",
    padding: 10,
    borderRadius: 8,
    color: "#fca5a5",
    marginBottom: 15,
  },

  success: {
    background: "rgba(16,185,129,0.15)",
    border: "1px solid rgba(16,185,129,0.35)",
    padding: 10,
    borderRadius: 8,
    color: "#bbf7d0",
    marginBottom: 15,
  },

  loading: { textAlign: "center", color: "#cbd5e1" },
};
