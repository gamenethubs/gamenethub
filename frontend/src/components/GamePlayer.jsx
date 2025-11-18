// src/components/GamePlayer.jsx
import React, { useEffect, useRef, useState } from "react";

export default function GamePlayer({ gameUrl }) {
  // ⭐ Always load from backend static folder
  const src = `http://localhost:5000${gameUrl}`;

  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const timeoutRef = useRef(null);

  // -----------------------------------------
  // LOAD TIMEOUT HANDLER
  // -----------------------------------------
  useEffect(() => {
    setLoading(true);
    setFailed(false);

    timeoutRef.current = setTimeout(() => {
      setFailed(true);
      setLoading(false);
    }, 15000); // Unity needs more time (15 sec)

    return () => clearTimeout(timeoutRef.current);
  }, [gameUrl]);

  // -----------------------------------------
  // IFRAME LOAD SUCCESS
  // -----------------------------------------
  const handleLoad = () => {
    clearTimeout(timeoutRef.current);
    setLoading(false);
    setFailed(false);
  };

  // -----------------------------------------
  // FULLSCREEN
  // -----------------------------------------
  const handleFullscreen = () => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    if (iframe.requestFullscreen) iframe.requestFullscreen();
    else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
    else if (iframe.mozRequestFullScreen) iframe.mozRequestFullScreen();
    else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen();
  };

  // -----------------------------------------
  // RELOAD
  // -----------------------------------------
  const handleReload = () => {
    setLoading(true);
    setFailed(false);
    iframeRef.current.src = iframeRef.current.src; // force reload
  };

  // -----------------------------------------
  // UI
  // -----------------------------------------
  return (
    <div
      style={{
        ...styles.container,
        height: expanded ? "85vh" : "70vh",
      }}
    >
      {/* TOP BAR */}
      <div style={styles.topBar}>
        <span style={styles.gameTitle}>🎮 Playing Game</span>

        <div style={styles.controlsRight}>
          <button style={styles.btn} onClick={handleReload}>🔄 Reload</button>
          <button style={styles.btn} onClick={handleFullscreen}>⛶ Fullscreen</button>
          <button style={styles.btn} onClick={() => setExpanded(!expanded)}>
            {expanded ? "🔽 Shrink" : "🔼 Expand"}
          </button>
        </div>
      </div>

      {/* GAME AREA */}
      <div style={styles.playerArea}>
        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.glowSpinner}></div>
            <p style={styles.loadingText}>Loading game…</p>
          </div>
        )}

        {failed && (
          <div style={styles.errorOverlay}>
            <h3 style={{ color: "#fff", marginBottom: 4 }}>Failed to load game</h3>
            <p style={{ color: "#94a3b8" }}>Check if /public/games folder contains index.html</p>
          </div>
        )}

        {!failed && (
          <iframe
            ref={iframeRef}
            title="game-player"
            src={src}
            onLoad={handleLoad}
            style={{
              ...styles.iframe,
              opacity: loading ? 0 : 1,
            }}
            allow="fullscreen; autoplay; encrypted-media"
            sandbox="
              allow-scripts
              allow-same-origin
              allow-pointer-lock
              allow-orientation-lock
              allow-popups
              allow-downloads
            "
          ></iframe>
        )}
      </div>
    </div>
  );
}

/* ------------------ STYLE ------------------ */

const styles = {
  container: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    background: "#000",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 25px rgba(0,0,0,0.35)",
  },

  topBar: {
    padding: "10px 16px",
    background: "rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  gameTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
  },

  controlsRight: {
    display: "flex",
    gap: "10px",
  },

  btn: {
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.20)",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
  },

  playerArea: {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: 350,
    background: "#000",
  },

  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    transition: "opacity 0.45s ease",
  },

  loadingOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(6px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },

  glowSpinner: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    border: "6px solid rgba(255,255,255,0.15)",
    borderTopColor: "#38bdf8",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: 12,
    color: "#cbd5e1",
    fontSize: 14,
  },

  errorOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, #0f172a, #1e293b)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
};
