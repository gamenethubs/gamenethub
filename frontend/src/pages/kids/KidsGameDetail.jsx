// src/pages/kids/KidsGameDetail.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllGames, absoluteUrl } from "../../services/api";
import RatingStars from "../../components/RatingStars";

export default function KidsGameDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await getAllGames();
      const found = res.data.games.find(
        (g) => g.slug === slug && g.isKids
      );
      setGame(found);
    }
    load();
  }, [slug]);

  if (!game) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #020617, #000)",
        color: "white",
        paddingBottom: "80px",
      }}
    >

      {/* ✅ BACK BUTTON */}
      <button
        onClick={() => navigate("/kids/brain-lab")}
        style={{
          position: "fixed",
          top: 18,
          left: 18,
          zIndex: 9999,
          background: "linear-gradient(135deg, #ffe066, #ff6ad5)",
          border: "none",
          padding: "12px 26px",
          borderRadius: 999,
          fontWeight: 900,
          cursor: "pointer",
          boxShadow: "0 0 30px hotpink",
        }}
      >
        ⬅ Back to Kids World
      </button>

      {/* ✅ HERO BANNER */}
      <div
        style={{
          height: 320,
          width: "100%",
          backgroundImage: `url(${absoluteUrl(game.thumbnail)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* ✅ DARK OVERLAY */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.85), rgba(0,0,0,0.4))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "40px 60px",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          {/* ✅ LEFT INFO */}
          <div>
            <h1 style={{ fontSize: 34, fontWeight: 900 }}>{game.title}</h1>

            <p style={{ color: "#38bdf8", marginBottom: 10 }}>
              🎮 {game.genre}
            </p>

            {/* ✅ RATING – NOW WORKING */}
            <RatingStars
              rating={Number(game.averageRating || 4)}
              size={22}
            />
          </div>

          {/* ✅ STATS ROW */}
          <div style={{ display: "flex", gap: 18 }}>
            {[{
              label: "Plays",
              value: game.playCount || 0
            }, {
              label: "Rating",
              value: (game.averageRating || 0).toFixed(1)
            }, {
              label: "Updated",
              value: new Date(game.updatedAt).getFullYear()
            }].map((stat, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "16px 22px",
                  borderRadius: 14,
                  textAlign: "center",
                  minWidth: 90,
                }}
              >
                <b style={{ fontSize: 20, display: "block" }}>
                  {stat.value}
                </b>
                <span style={{ fontSize: 12, opacity: 0.8 }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ ABOUT SECTION */}
      <div
        style={{
          maxWidth: 1200,
          margin: "60px auto 0",
          padding: "0 24px",
        }}
      >
        <h2 style={{ fontSize: 26, marginBottom: 16 }}>
          About This Game
        </h2>

        <p style={{ fontSize: 18, color: "#38bdf8", marginBottom: 16 }}>
          {game.title}: Play Smart, Win Fast! ⚡🎯
        </p>

        <div style={{ fontSize: 16, lineHeight: 1.9, opacity: 0.9 }}>
          {game.description}
        </div>
      </div>
    </div>
  );
}
