import React from "react";

export default function ProfileXPCard({ xp, level, xpNeeded, progress }) {

  const rounded = Math.round(progress); // 👈 round once and reuse

  return (
    <div style={card} className="xp-card-root">
      <div style={topRow}>
        <span style={levelText}>Level {level}</span>
        <span style={xpText}>{xp} / {xpNeeded} XP</span>
      </div>

      <div style={progressWrapper}>
        <div  className="xp-progress-bar" style={{ ...progressFill, width: `${rounded}%` }}></div>
      </div>

      <div style={percentText}>{rounded}% Complete</div>
    </div>
  );
}


/* ---------- STYLES ---------- */

const card = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "16px 18px",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 6,
};

const levelText = {
  color: "#fff",
  fontWeight: 800,
  fontSize: 18,
};

const xpText = {
  color: "#93c5fd",
  fontWeight: 600,
  fontSize: 14,
};

const progressWrapper = {
  width: "100%",
  height: 12,
  background: "rgba(255,255,255,0.08)",
  borderRadius: 10,
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  background: "linear-gradient(45deg, #3b82f6, #06b6d4)",
  borderRadius: 10,
  transition: "width 0.5s ease",
};

const percentText = {
  marginTop: 4,
  color: "#cbd5e1",
  fontSize: 12,
  textAlign: "right",
};
