import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllGames, absoluteUrl } from "../../services/api";
import GamePlayer from "../../components/GamePlayer";
import RatingStars from "../../components/RatingStars";
import "../../assets/css/kidsGamePlayer.css";

import mascotHappy from "../../assets/mascots/tj-win.png";
import mascotSad from "../../assets/mascots/tj-sad.png";
import {  useRef } from "react";
export default function KidsGamePlayer() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const autoPlay = search.get("autoPlay") === "true";
  const bgRef = useRef(null);
   const [mascotMood, setMascotMood] = useState(mascotHappy);


  const [game, setGame] = useState(null);
useEffect(() => {
  const move = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;

    if (bgRef.current) {
      bgRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    }
  };

  window.addEventListener("mousemove", move);
  return () => window.removeEventListener("mousemove", move);
}, []);

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
    <div className="kids-player-page">
           {/* 🌌 GALAXY PARALLAX */}
<div className="kids-galaxy-parallax" ref={bgRef}></div>







      {/* ✅ FLOATING MASCOT */}
      <img src={mascotMood} className="kids-player-mascot" alt="mascot" />

      {/* ✅ BACK */}
      <button
        className="kids-player-back"
         onMouseEnter={() => setMascotMood(mascotSad)}
        onMouseLeave={() => setMascotMood(mascotHappy)}
        onClick={() => navigate("/kids/brain-lab")}
      >
        ⬅ Back to Kids World
      </button>

      {/* ✅ PLAYER */}
      <div className="kids-player-stage">
        <GamePlayer
          gameUrl={game.playUrl}
          embedUrl={game.embedUrl}
          autoPlay={autoPlay}
          mobileFullScreen={false}
          gameData={game}
        />
      </div>

      {/* ✅ HUD */}
      <div className="kids-game-hud">

        <div className="kids-game-thumb">
          <img src={absoluteUrl(game.thumbnail)} alt={game.title} />
        </div>

        <div className="kids-game-info">
          <h2>{game.title}</h2>
          <p className="kids-genre">🎯 {game.genre}</p>

          <RatingStars rating={game.averageRating || 4} size={22} />

          <div className="kids-game-stats">
            <div><b>{game.playCount || 0}</b><span>Plays</span></div>
            <div><b>{(game.averageRating || 0).toFixed(1)}</b><span>Rating</span></div>
            <div><b>{new Date(game.updatedAt).getFullYear()}</b><span>Updated</span></div>
          </div>
        </div>

        <div className="kids-game-desc">
          {game.description}
        </div>

      </div>
    </div>
  );
}
