//////////////////src/pages/kids/KidsGamePlayer.jsx///////////////////////
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllGames, absoluteUrl } from "../../services/api";
import GamePlayer from "../../components/GamePlayer";
import RatingStars from "../../components/RatingStars";
import "../../assets/css/kidsGamePlayer.css";
import GameDetail  from "../GameDetail.jsx";


import {  useRef } from "react";
export default function KidsGamePlayer() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const autoPlay = search.get("autoPlay") === "true";
  const bgRef = useRef(null);
const statCard = {
  background: "rgba(255,255,255,0.12)",
  padding: "16px 30px",
  borderRadius: "18px",
  textAlign: "center",
  minWidth: "120px",
  boxShadow: "inset 0 0 18px rgba(255,255,255,0.15)",
  color: "white",
};



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









      {/* ✅ BACK */}
      <button
        className="kids-player-back"
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

        {/* ✅ GAME DETAILS (NEECHE) */}
   {/* ✅ HERO + DETAILS */}
{/* ✅ HERO + DETAILS (FULL IMAGE VISIBLE) */}
<div
  style={{
    width: "95%",
    maxWidth: "1250px",
    minHeight: "230px",
    marginTop: "80px",
    borderRadius: "28px",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    padding: "40px",
    background: "rgba(0,0,0,0.75)"
  }}
>

  {/* ✅ ACTUAL BACKGROUND IMAGE (REAL FIX) */}
  <img
    src={absoluteUrl(game.thumbnail)}
    alt="bg"
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",   // ✅ FULL IMAGE – NO CUT
      opacity: 0.45,
      zIndex: 0
    }}
  />

  {/* ✅ LEFT CONTENT */}
  <div style={{ 
    display: "flex", 
    gap: "26px", 
    alignItems: "center", 
    zIndex: 2 
  }}>

    <div style={{ color: "white" }}>
      <h1 style={{ fontSize: "34px", fontWeight: "900" }}>
        {game.title}
      </h1>

      <p style={{ color: "#38bdf8", marginBottom: "6px" }}>
        {game.genre}
      </p>

      <RatingStars 
        rating={Number(game.averageRating || 4)} 
        size={22} 
      />

      <p style={{ opacity: ".7", marginTop: "6px" }}>
        Please rate this game
      </p>
    </div>
  </div>


</div>



{/* ✅ CENTER STATS */}
<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "28px",
    marginTop: "26px",
    flexWrap: "wrap",
  }}
>
  <div style={statCard}>
    <b>{game.playCount || 0}</b>
    <span>Plays</span>
  </div>

  <div style={statCard}>
    <b>{(game.averageRating || 0).toFixed(1)}</b>
    <span>Rating</span>
  </div>

  <div style={statCard}>
    <b>{new Date(game.updatedAt).getFullYear()}</b>
    <span>Updated</span>
  </div>
</div>

{/* ✅ SAME ABOUT SECTION AS NORMAL GAME PAGE */}
<div style={{ width: "95%", maxWidth: "1250px", marginTop: "38px" }}>
  <div
    style={{
      background: "rgba(255,255,255,0.03)",
      padding: "20px",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.05)",
      color: "white",
    }}
  >
    <h3 style={{ fontSize: 20, marginBottom: 8 }}>About This Game</h3>

    <p
      style={{
        fontSize: 15,
        lineHeight: 1.6,
        color: "#e2e8f0",
        whiteSpace: "pre-line",
        wordBreak: "break-word",
      }}
    >
      {game.description}
    </p>
  </div>
</div>



    </div>
  );
}
