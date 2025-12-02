import React, { useEffect, useState } from "react";
import { getAllGames } from "../services/api";
import GameCard from "../components/GameCard";
import GameModal from "../components/GameModal";

export default function OnlineMultiplayer() {
  const [games, setGames] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getAllGames();
        const all = res.data.games || [];
        const filtered = all.filter((g) => g.isOnline === true);
        setGames(filtered);
      } catch (err) {
        console.log("Error:", err);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        ...styles.wrapper,
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(15px)",
      }}
    >
      <h1 style={styles.heading}>🌐 Online Multiplayer Games</h1>
      <p style={styles.subText}>Play with friends anywhere in the world!</p>

      <div style={styles.grid}>
        {games.length > 0 ? (
          games.map((game, i) => (
            <div
              key={game._id}
              style={{
                animation: `fadePop 0.45s ease ${(i * 0.07).toFixed(2)}s both`,
              }}
            >
              <GameCard game={game} onPlay={() => setSelectedGame(game)} />
            </div>
          ))
        ) : (
          <div style={styles.noResult}>
            <h2>No Online Multiplayer games found 😢</h2>
            <p style={{ color: "#64748b", marginTop: "6px" }}>
              Try again later.
            </p>
          </div>
        )}
      </div>

      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "20px",
    maxWidth: "1250px",
    margin: "0 auto",
    color: "#fff",
    transition: "all .4s ease",
  },

  heading: {
    marginBottom: "5px",
    fontSize: "32px",
    fontWeight: 700,
    background: "linear-gradient(90deg,#6366f1,#a855f7)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },

  subText: {
    marginBottom: "20px",
    color: "#94a3b8",
    fontSize: "15px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(135px, 1fr))",
    gap: "10px",
    justifyItems: "center",
  },

  "@media (max-width: 600px)": {
    grid: {
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "10px",
    },
  },

  noResult: {
    gridColumn: "1/-1",
    textAlign: "center",
    marginTop: "40px",
  },
};
