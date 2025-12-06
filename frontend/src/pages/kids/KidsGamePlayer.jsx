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

  // 🔹 Split description into intro + bullet points
 const rawDesc = game.description || "";

// 🔹 Split by bullet symbol, trim parts
let parts = rawDesc
  .split("•")
  .map((p) => p.trim())
  .filter(Boolean);

// 🔹 The first part is intro paragraph.
// BUT if it contains "How to play", push it into bullet list.
let intro = parts[0] || "";
let bullets = [];

// If first part contains early how-to text move to bullets
if (/how to play/i.test(intro)) {
  bullets = parts;
  intro = "";
} else {
  bullets = parts.slice(1);
}



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

        {/* ✅ GAME DETAILS (NEECHE) */}
   {/* ✅ HERO + DETAILS */}
{/* ✅ HERO + DETAILS (FULL IMAGE VISIBLE) */}
<div
  style={{
    width: "95%",
    maxWidth: "1250px",
    minHeight: "320px",
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
      objectFit: "contain",   // ✅ FULL IMAGE – NO CUT
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

  {/* ✅ RIGHT MASCOT */}
  <img
    src={mascotHappy}
    alt="mascot"
    style={{
      position: "absolute",
      right: "80px",
      bottom: "0",
      width: "190px",
      filter: "drop-shadow(0 0 40px cyan)",
      zIndex: 2
    }}
  />

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

{/* ✅ ABOUT GAME */}
<div
  style={{
    marginTop: "38px",
    width: "95%",
    maxWidth: "1250px",
    background:
      "linear-gradient(180deg, rgba(12,20,48,.95), rgba(4,8,25,.98))",
    borderRadius: "30px",
    padding: "40px",
    color: "white",
  }}
>
  <h2 style={{ fontSize: "26px", marginBottom: "10px" }}>
    🧠 About This Game
  </h2>

  {/* 🔹 subtitle */}
  <p
    style={{
      color: "#38bdf8",
      marginBottom: "14px",
      fontWeight: 600,
    }}
  >
    {game.title}: Play Smart, Win Fast! ⚡🎯
  </p>

  {/* 🔹 clean intro paragraph */}
  {intro && (
    <p
      style={{
        fontSize: "16px",
        lineHeight: "1.9",
        opacity: 0.95,
        marginBottom: "20px",
      }}
    >
      {intro}
    </p>
  )}

  {/* 🔹 HOW TO PLAY section */}
  {bullets.length > 0 && (
    <>
      <h3
        style={{
          marginTop: "4px",
          fontSize: "20px",
          color: "#facc15",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        🎯 How to Play
      </h3>

      <ul
        style={{
          paddingLeft: "26px",
          lineHeight: "1.9",
          fontSize: "16px",
          opacity: 0.95,
        }}
      >
        {bullets.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
    </>
  )}
</div>




    </div>
  );
}
