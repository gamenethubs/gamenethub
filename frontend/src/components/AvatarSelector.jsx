// src/components/AvatarSelector.jsx
import React from "react";

/**
 * AvatarSelector
 * Props:
 *  - visible (bool)
 *  - onClose (fn)
 *  - onSelect(avatarPath) -> called with string like "/avatars/avatar07.png"
 *  - selected (string) current selected path
 *
 * Avatars are expected to be in public/avatars/avatar01.png ... avatar20.png
 */
export default function AvatarSelector({ visible, onClose, onSelect, selected }) {
  if (!visible) return null;

  const avatars = Array.from({ length: 20 }, (_, i) => {
    const idx = String(i + 1).padStart(2, "0");
    return `/avatars/avatar${idx}.png`;
  });

  return (
    <div style={backdrop}>
      <div style={modal}>
        <div style={header}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#e6f0ff" }}>Choose an avatar</div>
          <button onClick={onClose} style={closeBtn} aria-label="Close avatar selector">✕</button>
        </div>

        <div style={grid}>
          {avatars.map((a) => (
            <button
              key={a}
              onClick={() => onSelect(a)}
              style={{
                ...avatarBtn,
                boxShadow: a === selected ? "0 6px 20px rgba(37,99,235,0.28)" : "none",
                border: a === selected ? "2px solid rgba(37,99,235,0.18)" : "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <img
                src={a}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </button>
          ))}
        </div>

        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* Styles */
const backdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(2,6,23,0.6)",
  zIndex: 2200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 18,
};

const modal = {
  width: "min(760px, 96vw)",
  maxHeight: "80vh",
  overflow: "auto",
  background: "#071224",
  borderRadius: 12,
  padding: 16,
  boxShadow: "0 20px 60px rgba(2,6,23,0.6)",
  border: "1px solid rgba(255,255,255,0.04)",
};

const header = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 12,
};

const closeBtn = {
  background: "transparent",
  color: "#9fb7d9",
  border: "none",
  fontSize: 18,
  cursor: "pointer",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
  gap: 12,
};

const avatarBtn = {
  width: 72,
  height: 72,
  padding: 0,
  borderRadius: 10,
  overflow: "hidden",
  cursor: "pointer",
  background: "transparent",
};

const cancelBtn = {
  padding: "8px 12px",
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.06)",
  color: "#cfe8ff",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 700,
};
