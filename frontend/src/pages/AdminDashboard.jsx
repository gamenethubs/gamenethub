// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin");
    }

    const t = setTimeout(() => setAnimate(true), 70);
    return () => clearTimeout(t);
  }, [user, navigate]);

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
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>Welcome, {user?.email}</p>

        <div style={styles.grid}>
          <div
            style={styles.box}
            onClick={() => navigate("/admin/add-game")}
          >
            <div style={styles.icon}>➕</div>
            <h3 style={styles.boxTitle}>Add New Game</h3>
            <p style={styles.boxSub}>Upload thumbnail, zip & details</p>
          </div>

          <div
            style={styles.box}
            onClick={() => navigate("/admin/games")}
          >
            <div style={styles.icon}>📂</div>
            <h3 style={styles.boxTitle}>Manage Games</h3>
            <p style={styles.boxSub}>Edit or delete existing games</p>
          </div>
        </div>
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
    alignItems: "center",
    padding: "40px 20px",
    position: "relative",
  },

  bigGlow: {
    position: "absolute",
    top: "-35%",
    right: "-20%",
    width: "180%",
    height: "180%",
    background: "radial-gradient(circle, rgba(239,68,68,0.18), transparent 70%)",
    filter: "blur(130px)",
    zIndex: -1,
  },

  card: {
    background: "rgba(255,255,255,0.06)",
    padding: "35px 30px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.07)",
    backdropFilter: "blur(10px)",
    width: "100%",
    maxWidth: "600px",
    textAlign: "center",
    boxShadow: "0 0 40px rgba(0,0,0,0.4)",
    transition: "0.4s ease",
  },

  title: { fontSize: 32, fontWeight: "800", marginBottom: 5 },
  subtitle: { color: "#fca5a5", opacity: 0.9, marginBottom: 25 },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "20px",
  },

  box: {
    background: "rgba(255,255,255,0.08)",
    padding: "20px",
    borderRadius: "14px",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "0.25s",
  },

  icon: {
    fontSize: 35,
    marginBottom: 10,
  },

  boxTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  boxSub: {
    fontSize: 14,
    opacity: 0.75,
  },
};
