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
   mascotSad,   // ✅ ADD THIS
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
const triggerSparkBurst = (e) => {
  const card = e.currentTarget;

  const burst = document.createElement("div");
  burst.className = "spark-burst";

  for (let i = 0; i < 22; i++) {   // 🔥 DENSE BURST

    const spark = document.createElement("span");
    spark.className = "spark";

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 60 + 20;

    spark.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--y", `${Math.sin(angle) * distance}px`);

    spark.style.left = "50%";
    spark.style.top = "50%";

    burst.appendChild(spark);
  }

  card.appendChild(burst);

  setTimeout(() => burst.remove(), 700);
};
const playMagicPop = () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = "sine"; // smooth kid-friendly tone
  oscillator.frequency.setValueAtTime(880, ctx.currentTime); // high pitch ✨
  gainNode.gain.setValueAtTime(0.15, ctx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();

  // quick magical decay
  oscillator.frequency.exponentialRampToValueAtTime(
    220,
    ctx.currentTime + 0.15
  );
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + 0.15
  );

  oscillator.stop(ctx.currentTime + 0.15);
};

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

  return (
    <div className="kids-world-wrapper">

      <button
  onMouseEnter={() => setMascot(mascotSad)}    // 😢 SAD MODE
  onMouseLeave={() => setMascot(mascotIdle)}   // 🙂 NORMAL MODE
  onClick={() => {
    playBackSound();
    setMascot(mascotWin);   // 🎉 CLICK PE HAPPY
    ///new added
      // 🎡 Theme park BG music resume
    if (window.__KIDS_BG_MUSIC__) {
      window.__KIDS_BG_MUSIC__.currentTime = 0;   // ya agar jahan se band hua tha wahi se chahiye to ye line hata sakti ho
      window.__KIDS_BG_MUSIC__.play().catch(() => {});
    }
    setTimeout(() => navigate(backPath), 200);
  }}
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

  // 🏆 HOVER PE MASCOT WIN
  onMouseEnter={() => setMascot(mascotWin)}

  // 🙂 LEAVE PE NORMAL IDLE
  onMouseLeave={() => setMascot(mascotIdle)}

  // ✨ CLICK PE MAGIC
  onClick={(e) => {
    triggerSparkBurst(e);
    playMagicPop();
    setMascot(mascotWin);

    setTimeout(() => {
      navigate(`/kids/game/${game.slug}?autoPlay=true`);
    }, 350);
  }}
>

            <GameCard game={game} />
          </div>
        ))}
      </div>

    </div>
  );
}
