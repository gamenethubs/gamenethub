////////////////src/components/KidsWorldLayout.jsx///////////////////
import React, { useEffect, useState } from "react";
import "../assets/css/kidsWorldLayout.css";
import { getAllGames } from "../services/api";
import { useNavigate } from "react-router-dom";
import GameCard from "./GameCard";

export default function KidsWorldLayout({
  title,
  subtitle,
  mascotIdle,
  mascotJump,
  mascotWin,
  bgVideo,
  music,
  filterArena,
  backPath = "/kids",
}) {
  const [mascot, setMascot] = useState(mascotIdle);
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (music) {
      const bg = new Audio(music);
      bg.loop = true;
      bg.volume = 0.4;
      bg.play().catch(() => {});
      return () => {
        bg.pause();
        bg.currentTime = 0;
      };
    }
  }, [music]);

  useEffect(() => {
    async function load() {
      const res = await getAllGames();
      const all = res.data.games || [];

      const filtered = all.filter(
        (g) => g.isKids && g.kidsArenas?.includes(filterArena)
      );

      setGames(filtered);
    }
    load();
  }, [filterArena]);

  return (
    <div className="kids-world-wrapper">

      <button
        onClick={() => navigate(backPath)}
        className="kids-world-back-btn"
      >
        ⬅ Back to Magic Park
      </button>

      <video className="kids-world-bg" autoPlay muted loop playsInline>
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="kids-world-mascot">
        <img
          src={mascot}
          onMouseEnter={() => setMascot(mascotJump)}
          onMouseLeave={() => setMascot(mascotIdle)}
          onClick={() => setMascot(mascotWin)}
          alt="Mascot"
        />
      </div>

      <div className="kids-world-title">
        {title}
        <span>{subtitle}</span>
      </div>

      <div className="kids-world-grid">
        {games.map((game) => (
          <div
            key={game._id}
            className="world-game-wrap"
            onClick={() =>
              navigate(`/kids/game/${game.slug}?autoPlay=true`)
            }
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>

    </div>
  );
}
