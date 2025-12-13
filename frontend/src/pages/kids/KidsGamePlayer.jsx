//////////////////src/pages/kids/KidsGamePlayer.jsx///////////////////////
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllGames, absoluteUrl } from "../../services/api";
import GamePlayer from "../../components/GamePlayer";
import RatingStars from "../../components/RatingStars.jsx";
import { rateGame } from "../../services/gameActions";
import { useAuth } from "../../context/AuthContext";

import "../../assets/css/kidsGamePlayer.css";



import {  useRef } from "react";
export default function KidsGamePlayer() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const autoPlay = search.get("autoPlay") === "true";
  // const world  = search.get("world"); 
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

// WORLD FIX — game cannot override this
const worldRef = useRef(null);

useEffect(() => {
  const w = search.get("world");
  if (w) {
    // console.log("INITIAL WORLD:", w);
    worldRef.current = w;   // store forever
  }
}, []); // only ONCE — URL change won't matter


const { isAuthenticated, user, updateUser } = useAuth();
const [userRating, setUserRating] = useState(null);
const handleRating = async (stars) => {
  if (!isAuthenticated) return alert("Please login to rate!");

  // ✅ ✅ UI KO TURANT UPDATE KARO (MOST IMPORTANT LINE)
  setUserRating(stars);

  try {
    const res = await rateGame(game._id, stars);

    updateUser({
      ratedGames: [
        ...(user?.ratedGames || []).filter(
          (x) => String(x.game) !== String(game._id)
        ),
        { game: game._id, stars },
      ],
    });

    setGame((prev) =>
      prev
        ? {
            ...prev,
            averageRating: res.rating,
            totalRatings: res.totalRatings,
          }
        : prev
    );
  } catch (err) {
    console.log("Rating error:", err);
  }
};


  const [game, setGame] = useState(null);
  useEffect(() => {
  const interval = setInterval(() => {
    const buttons = document.querySelectorAll("button");

    buttons.forEach(btn => {
      const text = btn.innerText?.toLowerCase() || "";
      const label = btn.getAttribute("aria-label")?.toLowerCase() || "";

      if (text.includes("reload") || label.includes("reload")) {
        btn.remove(); // ✅ PERMANENT DELETE
      }
    });
  }, 300);

  return () => clearInterval(interval);
}, []);

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
  useEffect(() => {
  if (!game || !isAuthenticated || !user) return;

  // ✅ ✅ ✅ THIS LINE BLOCKS OLD OVERRIDE
  if (userRating !== null) return;

  let rating = null;

  const uRate = game.ratings?.find(
    (r) =>
      String(r.user?._id || r.user) ===
      String(user.id || user._id)
  );
  if (uRate) rating = uRate.stars;

  if (!rating && user?.ratedGames) {
    const fromUser = user.ratedGames.find(
      (x) => String(x.game) === String(game._id)
    );
    if (fromUser) rating = fromUser.stars;
  }

  setUserRating(rating ?? null);
}, [game, isAuthenticated, user, userRating]);


  if (!game) return null;

const playBackSound = () => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = "triangle";
  osc2.type = "sine";

  osc1.frequency.value = 420;
  osc2.frequency.value = 160;

  gain.gain.value = 0.18;

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start();
  osc2.start();

  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
  osc1.stop(ctx.currentTime + 0.35);
  osc2.stop(ctx.currentTime + 0.35);
};

const w = worldRef.current;
const backPath = 
  w === "candymath" ? "/kids/math-land" :
  w === "brainlab" ? "/kids/brain-lab" :
  w === "racingcity" ? "/kids/racing-city" :
  w === "skillcircus" ? "/kids/skill-circus" :
  "/kids";


  return (
    <div className="kids-player-page">
           {/* 🌌 GALAXY PARALLAX */}
<div className="kids-galaxy-parallax" ref={bgRef}></div>
      {/* ✅ BACK */}
      <button
        className="kids-player-back"
        onClick={() => {
          playBackSound();
          setTimeout(() => navigate(backPath), 200);
          // console.log("BackPath : ", backPath);
        }}
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
  flexDirection: "column",
  gap: "14px",
  alignItems: "flex-start",
  zIndex: 2,
  padding: "22px 26px",
  borderRadius: "20px",
  background: "rgba(2, 6, 23, 0.55)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 0 20px rgba(0,0,0,0.6)"
}}>


    <div style={{ color: "white" }}>
      <h1 style={{ fontSize: "34px", fontWeight: "900" }}>
        {game.title}
      </h1>

      <p style={{ color: "#38bdf8", marginBottom: "6px" }}>
        {game.genre}
      </p>
<RatingStars
  rating={game.averageRating}
  userRating={userRating}
  onRate={handleRating}
  size={26}
  editable={true}
  showUserTag={true}
/>




{userRating && (
  <p style={{
    marginTop: "6px",
    fontSize: "14px",
    color: "#22c55e",
    fontWeight: 600,
    animation: "fadeIn 0.5s ease"
  }}>
    ✅ Thanks for rating {userRating} stars!
  </p>
)}


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
