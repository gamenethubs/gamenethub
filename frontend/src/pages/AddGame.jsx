// src/pages/AddGame.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createGame } from "../services/api";

export default function AddGame() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [animate, setAnimate] = useState(false);

  // TEXT FIELDS
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(4.0);

  // FILES
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);

  // MESSAGES
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/admin");
    setTimeout(() => setAnimate(true), 80);
  }, [user, navigate]);

  /************************************************
   * HANDLE FILE CHANGE (instant & stable)
   ************************************************/
  const handleThumbnail = (e) => {
    const file = e.target.files?.[0] || null;
    setThumbnailFile(file);
  };

  const handleZipFile = (e) => {
    const file = e.target.files?.[0] || null;
    setZipFile(file);
  };

  /************************************************
   * SUBMIT FORM (100% stable)
   ************************************************/
  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!title.trim() || !genre.trim()) {
      setErrorMsg("Title and Genre are required.");
      return;
    }

    if (!thumbnailFile || !zipFile) {
      setErrorMsg("Please select both Thumbnail and ZIP file.");
      return;
    }

    try {
      setLoading(true);

      // ⏳ FIX: Ensure React has fully set file state before submit
      await new Promise((resolve) => setTimeout(resolve, 50));

      if (!thumbnailFile || !zipFile) {
        setErrorMsg("File selection failed — pick again.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("genre", genre);
      formData.append("description", description);
      formData.append("rating", Number(rating));

      // FILES (IMPORTANT: filename included!)
      formData.append("thumbnail", thumbnailFile, thumbnailFile.name);
      formData.append("gameZip", zipFile, zipFile.name);

      const res = await createGame(formData);

      if (res.data.success) {
        setSuccessMsg("Game added successfully!");
        setTimeout(() => navigate("/admin/games"), 1200);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to add game");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.bigGlow}></div>

      <div
        style={{
          ...styles.card,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <h1 style={styles.title}>➕ Add New Game</h1>

        {errorMsg && <div style={styles.error}>{errorMsg}</div>}
        {successMsg && <div style={styles.success}>{successMsg}</div>}

        {/* TITLE */}
        <div style={styles.field}>
          <label style={styles.label}>Game Title *</label>
          <input
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Space Runner"
          />
        </div>

        {/* GENRE */}
        <div style={styles.field}>
          <label style={styles.label}>Genre *</label>
          <input
            style={styles.input}
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g. Action / Puzzle"
          />
        </div>

        {/* THUMBNAIL */}
        <div style={styles.field}>
          <label style={styles.label}>Thumbnail Image *</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            style={styles.input}
            onChange={handleThumbnail}
          />
          {thumbnailFile && (
            <p style={styles.fileName}>Selected: {thumbnailFile.name}</p>
          )}
        </div>

        {/* ZIP FILE */}
        <div style={styles.field}>
          <label style={styles.label}>Game ZIP File *</label>
          <input
            type="file"
            accept=".zip"
            style={styles.input}
            onChange={handleZipFile}
          />
          {zipFile && (
            <p style={styles.fileName}>Selected: {zipFile.name}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description…"
          />
        </div>

        {/* BUTTON */}
        <button disabled={loading} style={styles.btn} onClick={handleSubmit}>
          {loading ? "Adding…" : "Add Game"}
        </button>
      </div>
    </div>
  );
}

/****************************************
 *  PREMIUM UI (unchanged)
 ****************************************/
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
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "35px 30px",
    borderRadius: "18px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 0 40px rgba(0,0,0,0.4)",
    transition: "0.4s",
  },
  title: {
    fontSize: 30,
    fontWeight: 800,
    marginBottom: 20,
    textAlign: "center",
  },
  label: { marginBottom: 5, fontSize: 14, color: "#cbd5e1" },
  field: { marginBottom: 18 },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    minHeight: 80,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
  },
  fileName: {
    color: "#93c5fd",
    marginTop: 5,
    fontSize: 13,
  },
  btn: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    background: "linear-gradient(90deg,#3b82f6,#6366f1)",
    color: "#fff",
    border: "none",
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
};
