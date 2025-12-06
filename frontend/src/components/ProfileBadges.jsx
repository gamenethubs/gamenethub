import React from "react";

export default function ProfileBadges({ badges = [], badgeProgress = [] }) {
  // 1️⃣ Pick only the highest progress locked badge
  let nextBadge = null;

  if (badgeProgress.length > 0) {
    nextBadge = badgeProgress.reduce((max, b) =>
      b.progress > max.progress ? b : max
    , badgeProgress[0]);
  }

  // 2️⃣ Build final list to display
  const finalList = [...badges];

  if (nextBadge && !badges.some((b) => b.name === nextBadge.name)) {
    finalList.push({ ...nextBadge, unlocked: false });
  }

  // 3️⃣ If nothing to show
  if (!finalList.length) {
    return (
      <div style={styles.emptyBox}>
        🏅 No badges yet — keep playing to earn your first badge!
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <h3 style={styles.title}>🏅 Your Badges</h3>

      <div style={styles.grid} className="badge-grid">
        {finalList.map((b, i) => (
          <div
            key={i}
            style={{
              ...styles.card,
              opacity: b.unlocked === false ? 0.55 : 1,
              border: b.unlocked
                ? "1px solid rgba(255,215,0,0.45)"
                : "1px solid rgba(255,255,255,0.08)",
              boxShadow: b.unlocked
                ? "0 0 12px rgba(255,215,0,0.35)"
                : "none",
            }}
          >
            <img
              src={b.icon || "/badges/default.png"}
              alt={b.name}
              style={styles.icon}
            />

            <div style={styles.info}>
              <div style={styles.name}>{b.name}</div>

              <div style={styles.desc}>{b.description}</div>

              {b.unlocked ? (
                <div style={styles.date}>
                  Unlocked: {new Date(b.unlockedAt).toLocaleDateString()}
                </div>
              ) : (
                <>
                  <div style={styles.progressOuter}>
                    <div
                      style={{
                        ...styles.progressInner,
                        width: `${b.progress}%`,
                      }}
                    />
                  </div>
                  <div style={styles.progressText}>
                    {Math.round(b.progress)}% to unlock
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------- STYLES ---------------------- */

const styles = {
  wrap: {
    marginTop: 25,
    padding: 20,
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  title: {
    color: "#fff",
    marginBottom: 15,
    fontSize: 18,
    fontWeight: 800,
  },

  grid: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  },

  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#0b1220",
    padding: 15,
    borderRadius: 12,
    textAlign: "center",
    transition: "0.2s ease",
  },

  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
    objectFit: "contain",
  },

  info: { color: "#cfe8ff" },

  name: { fontWeight: 800, color: "#fff", marginBottom: 4 },

  desc: { fontSize: 12, opacity: 0.8, marginBottom: 8 },

  date: { fontSize: 11, color: "#9fb7d9" },

  emptyBox: {
    marginTop: 25,
    padding: "20px 15px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    textAlign: "center",
    color: "#9fb7d9",
    fontSize: 14,
  },

  progressOuter: {
    width: "100%",
    height: 6,
    background: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    overflow: "hidden",
  },

  progressInner: {
    height: "100%",
    background: "linear-gradient(90deg, #3b82f6, #22d3ee)",
    transition: "width 0.3s ease",
  },

  progressText: {
    marginTop: 6,
    fontSize: 12,
    color: "#e6f0ff",
  },
};
