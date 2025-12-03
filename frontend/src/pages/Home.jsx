/////////////src/pages/Home.jsx///////////

import React, { useState, useEffect, useMemo, useRef } from "react";
import { getAllGames } from "../services/api";
import GameCard from "../components/GameCard";
import GameModal from "../components/GameModal";

// 🔹 NEW: Multiplayer banner icons
import localImg from "../assets/local.png";
import onlineImg from "../assets/online.png";

// 🔹 NEW: Friends GIF + preview videos
import friendsGif from "../assets/friends.gif";
import localVideo from "../assets/localVideo.mp4";
import onlineVideo from "../assets/onlineVideo.mp4";

export default function Home() {
  
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // NEW → Arrow auto-hide
  const [showArrow, setShowArrow] = useState(true);
  const trendingRef = useRef(null);

  // 🔹 NEW: which multiplayer card is hovered? ("local" | "online" | null)
  const [hoverCard, setHoverCard] = useState(null);

  useEffect(() => {
    async function loadGames() {
      try {
        const res = await getAllGames();
        setGames(res.data.games || []);
      } catch (err) {
        console.log("Failed to load games:", err);
      }
    }
    loadGames();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function onSearch(e) {
      const term = (e?.detail || "").toString();
      setSearchTerm(term);
    }
    window.addEventListener("games-search", onSearch);
    return () => window.removeEventListener("games-search", onSearch);
  }, []);

  // AUTO-HIDE ARROW LOGIC
  useEffect(() => {
    const scroller = trendingRef.current;
    if (!scroller) return;

    function handleScroll() {
      if (scroller.scrollLeft > 20) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    }

    scroller.addEventListener("scroll", handleScroll);
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, []);

  // const filteredGames = useMemo(() => {
  //   if (!searchTerm.trim()) return games;
  //   const t = searchTerm.toLowerCase();
  //   return games.filter((g) => (g.title || "").toLowerCase().includes(t));
  // }, [games, searchTerm]);

  const filteredGames = useMemo(() => {
    const term = searchTerm.toLowerCase().trim().replace(/\s+/g, " ");

    const noFilterWords = ["ding dong", "hello ding dong"];

    if (noFilterWords.includes(term)) {
      return games;
    }

    if (!term) return games;

    return games.filter((g) =>
      (g.title || "").toLowerCase().includes(term)
    );
  }, [games, searchTerm]); 


  const trending = useMemo(() => {
    return [...filteredGames]
      .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
      .slice(0, 10);
  }, [filteredGames]);

  const popular = useMemo(() => {
    return [...filteredGames]
      .sort((a, b) => (b.popularScore || 0) - (a.popularScore || 0))
      .slice(0, 16); // ⭐ Limit to top 16 only
  }, [filteredGames]);


  const newReleases = useMemo(() => {
    return [...filteredGames].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [filteredGames]);

  return (
    <div style={styles.wrapper}>
      {/* HERO */}
      <section
        data-hero-box     // ✅ ADD THIS
        style={{
          ...styles.hero,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(25px)",
        }}
      >

        <div style={styles.heroGlow} />
        {/* SINGLE BACKGROUND VIDEO */}
            <video
              autoPlay
              muted
              loop
              playsInline
              style={styles.heroVideo}
            >
              <source src="/hero-gaming3.mp4" type="video/mp4" />
            </video>

        <div
          id="footstep-track"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            overflow: "visible",
            zIndex: 3,
          }}
        ></div>
        {/* <div id="dragon-portal" style={styles.portal}></div>

        <img src="/dragon.png" alt="dragon" style={styles.dragon} /> */}

        <h1 style={styles.heroTitle}>Welcome to Gamenethub</h1>
        <p style={styles.heroSub}>Play amazing online games — fully free!</p>
      </section>

      <div style={styles.sectionDivider}></div>

      {/* TRENDING */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitleGlow}>🔥 Trending Games</h2>

        <div style={{ position: "relative" }}>
          
          {/* AUTO-HIDE ARROW */}
          {showArrow && (
            <div style={styles.scrollRightHint}>
              <span style={{ fontSize: "22px", opacity: 0.9 }}>❯</span>
            </div>
          )}

          <div
            ref={trendingRef}
            style={styles.horizontalScroll}
            className="modern-scroll"
          >
            {trending.map((game, i) => (
              <div
                key={game._id}
                style={{
                  ...styles.horizontalItem,
                  opacity: animate ? 1 : 0,
                  transform: animate ? "translateY(0)" : "translateY(20px)",
                  transition: `all .6s ease ${i * 0.1}s, transform .25s ease`,
                }}
                onMouseEnter={(e) => {
                  Object.assign(
                    e.currentTarget.style,
                    styles.horizontalItemHover
                  );
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <GameCard game={game} onPlay={() => setSelectedGame(game)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FRIENDS MULTIPLAYER BANNER */}
      <section style={styles.friendsSection}>
        <div style={styles.friendsWrapper} className="friends-wrapper">

          {/* LEFT Illustration */}
          <div style={styles.friendsLeft} className="friends-left">
            {/* 🔹 Friends GIF on top */}
            <img
              src={friendsGif}
              alt="friends"
              style={styles.friendsGif}
            />
            <h2 className="main-title" style={styles.friendsTitle}>Play with friends!</h2>
            <p style={styles.friendsSub}>Choose how you want to play</p>
          </div>

          {/* LOCAL MULTIPLAYER CARD */}
          <div
  style={styles.friendsCard}
  className="friends-card"
  onMouseEnter={(e) => {
    setHoverCard("local");
    e.currentTarget.querySelector("video").play().catch(()=>{});
  }}
  onMouseLeave={() => setHoverCard(null)}
>

            {/* 🔹 Thumbnail / Video full background */}
            <img
              src={localImg}
              alt="local"
              style={{
                ...styles.cardThumb,
                opacity: hoverCard === "local" ? 0 : 1,
              }}
            />

            <video
              src={localVideo}
              muted
              loop
              autoPlay
              playsInline
              style={{
                ...styles.cardVideo,
                opacity: hoverCard === "local" ? 1 : 0,
              }}
            />

            {/* Gradient overlay for readability */}
            <div style={styles.cardGradient} />

            {/* Text + Button overlay */}
            <div style={styles.cardContent}>
              <h3 
                style={{
                  ...styles.cardTitle,
                  opacity: hoverCard === "local" ? 0 : 1,
                }}
              >
                Local Multiplayer
              </h3>

              <p  className="friends-card-desc"
                style={{
                  ...styles.cardDesc,
                  opacity: hoverCard === "local" ? 0 : 1,
                }}
              >
                Play together on the same device
              </p>

              {/* Button ALWAYS visible */}
              <button className="friends-card-btn"
                style={styles.cardButton}
                onClick={() => (window.location.href = "/local-multiplayer")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(99,102,241,0.65)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(99,102,241,0.45)";
                }}
              >
                Explore games
              </button>
            </div>
          </div>

          {/* ONLINE MULTIPLAYER CARD */}
          <div
  style={styles.friendsCard}
  className="friends-card"
  onMouseEnter={(e) => {
    setHoverCard("online");
    e.currentTarget.querySelector("video").play().catch(()=>{});
  }}
  onMouseLeave={() => setHoverCard(null)}
>

            {/* 🔹 Thumbnail / Video full background */}
            <img
              src={onlineImg}
              alt="online"
              style={{
                ...styles.cardThumb,
                opacity: hoverCard === "online" ? 0 : 1,
              }}
            />

            <video
              src={onlineVideo}
              muted
              loop
              autoPlay
              playsInline
              style={{
                ...styles.cardVideo,
                opacity: hoverCard === "online" ? 1 : 0,
              }}
            />

            <div style={styles.cardGradient} />

            <div style={styles.cardContent}>
              <h3 
                style={{
                  ...styles.cardTitle,
                  opacity: hoverCard === "online" ? 0 : 1,
                }}
              >
                Online Multiplayer
              </h3>

              <p
                style={{
                  ...styles.cardDesc,
                  opacity: hoverCard === "online" ? 0 : 1,
                }}
              >
                Play with friends anywhere
              </p>

              <button
                style={styles.cardButton}
                onClick={() => (window.location.href = "/online-multiplayer")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(99,102,241,0.65)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(99,102,241,0.45)";
                }}
              >
                Explore games
              </button>
            </div>
          </div>
          


        </div>
      </section>

      {/* POPULAR */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitleGlow}>⭐ Popular Games</h2>

        <div style={styles.grid} className="game-grid-fix">
          {popular.map((game, i) => (
            <div
              key={game._id}
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "scale(1)" : "scale(0.92)",
                transition: `all .55s ease ${i * 0.07}s`,
              }}
            >
              <GameCard game={game} onPlay={() => setSelectedGame(game)} />
            </div>
          ))}
        </div>
      </section>

      {/* NEW RELEASES */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitleGlow}>🎮 All Games</h2>

        <div style={styles.grid} className="game-grid-fix">
          {newReleases.map((game, i) => (
            <div
              key={game._id}
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(25px)",
                transition: `all .6s ease ${i * 0.09}s`,
              }}
            >
              <GameCard game={game} onPlay={() => setSelectedGame(game)} />
            </div>
          ))}
        </div>
        <style>
{`
  @media (max-width: 500px) {
    .game-grid-fix {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      justify-content: center !important;   /* center full grid */
      justify-items: center !important;     /* center grid items */
      width: 100% !important;
      gap: 14px !important;
    }

    .game-grid-fix > div {
      width: 100% !important;
      margin: 0 auto !important
    }

    
  }
`}
</style>

<style>
{`
/* Fix for tablets (iPad + small laptops) */
@media (max-width: 900px) {
  .friends-wrapper {
    flex-direction: column !important;
    align-items: center !important;
  }

  .friends-card {
    width: 100% !important;
    max-width: 420px !important;
  }
  
  
}

/* Fix for mobile screens */
@media (max-width: 500px) {
  .friends-card {
    width: 100% !important;
    max-width: 350px !important;
  }

  .friends-left img {
    width: 140px !important;
    height: 140px !important;
  }
}
`}
</style>
<style>
{`
  @media (max-width: 420px) {

    /* shrink the entire multiplayer cards */
    .friends-card {
      transform: scale(0.92) !important;
      transform-origin: top center !important;
    }

    /* shrink text */
    .friends-card-title {
      font-size: 10px !important;
      line-height: 20px !important;
    }
    
    .main-title {
    font-size: 22px !important;
}

    .friends-card-desc {
      font-size: 13px !important;
    }

    /* shrink button */
    .friends-card-btn {
      font-size: 14px !important;
      padding: 8px 14px !important;
      border-radius: 10px !important;
    }

    /* shrink the video/image height */
    .friends-card-media {
      height: 160px !important;
    }
  }

  @media (max-width: 360px) {
    .friends-card {
      transform: scale(0.85) !important;
      margin-left: -30px !important;
    }

    .friends-card-title {
      font-size: 10px !important;
    }

    .main-title {
    font-size: 18px !important;
}

    .friends-card-desc {
      font-size: 12px !important;
    }

    .friends-card-btn {
      font-size: 13px !important;
      padding: 6px 12px !important;
    }
  }
`}
</style>

      </section>

      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  wrapper: {
    padding: "20px",
    color: "#fff",
    maxWidth: "1350px",
    margin: "0 auto",
  },

  hero: {
     position: "relative",
  textAlign: "center",
  padding: "20px",
  borderRadius: "22px",
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  overflow: "hidden",
  },

  heroGlow: {
    position: "absolute",
    top: "-45%",
    left: "-35%",
    width: "200%",
    height: "200%",
    background:
      "radial-gradient(circle, rgba(96,165,250,0.17), transparent 70%)",
    filter: "blur(120px)",
  },

  heroTitle: {
     fontSize: "clamp(30px, 6vw, 42px)",
  fontWeight: 800,
  marginBottom: "10px",
  position: "relative",
  zIndex: 5,
  },

  heroSub: {
    fontSize: "clamp(10px, 6vw,18px)",
  color: "#9ca3af",
  position: "relative",
  zIndex: 5,
  },

  sectionDivider: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
    margin: "20px 0 30px",
    opacity: 0.6,
  },

  section: { marginBottom: "30px" },

  sectionTitleGlow: {
    fontSize: "26px",
    fontWeight: 700,
    marginBottom: "18px",
    textShadow: "0 0 12px rgba(59,130,246,0.55)",
  },

  /* ------- Horizontal Scroll Modern ------- */
  horizontalScroll: {
    display: "flex",
    gap: "2px",
    overflowX: "auto",
    padding: "10px 4px 14px",
    scrollSnapType: "x mandatory",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },

  horizontalItem: {
    minWidth: "150px",
    scrollSnapAlign: "start",
    transition: "transform .25s ease, box-shadow .25s ease",
    borderRadius: "14px",
    overflow: "visible",
  },

  horizontalItemHover: {
    transform: "translateY(-6px) scale(1.03)",
    boxShadow: "0 8px 32px rgba(59,130,246,0.25)",
  },

  /* ------- MODERN AUTO-HIDE ARROW ------- */
  scrollRightHint: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 22px rgba(0,0,0,0.45)",
    border: "1px solid rgba(255,255,255,0.12)",
    cursor: "pointer",
    zIndex: 10,
    transition: "all 0.35s ease",
    opacity: 1,
  },

  grid: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fill, 130px)", // ✅ FIXED width columns
    // justifyContent: "center",                        // ✅ centers the row
    justifyItems: "center",
    width: "100%",
  },

  "@media (maxWidth: 600px)": {
    grid: {
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "12px",
    },
  },

  dragon: {
    position: "absolute",
    top: "-45px", // ✅ Sits perfectly ON TOP of the box
    left: "-120px", // ✅ Starts outside the screen
    width: "70px",
    height: "70px",
    zIndex: 50,
    animation:
      "dragonWalk 4.2s ease-out forwards 0.6s, dragonBob 0.6s infinite ease-in-out 0.6s",
    pointerEvents: "none",
  },

  footstep: {
    position: "absolute",
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "rgba(0,255,255,0.8)",
    boxShadow:
      "0 0 12px rgba(0,255,255,0.9), 0 0 22px rgba(0,180,255,0.8)",
    filter: "brightness(1.5)",
    opacity: 0,
    animation: "stepFade 1s ease-out forwards",
    pointerEvents: "none",
    zIndex: 2,
  },

  burnTrail: {
    position: "absolute",
    width: "55px",
    height: "18px",
    borderRadius: "60px",
    background:
      "radial-gradient(rgba(255,150,0,1), rgba(255,70,0,0.6), rgba(80,0,0,0))",
    filter: "blur(3px)",
    boxShadow: `
    0 0 14px rgba(255,120,0,1),
    0 0 32px rgba(255,60,0,0.9),
    0 0 60px rgba(255,40,0,0.6)
  `,
    opacity: 0,
    transform: "rotate(-12deg)",
    animation: "burnFade 1.1s ease-out forwards, heatWave 0.35s infinite",
    pointerEvents: "none",
    zIndex: 3,
  },

  portal: {
    position: "absolute",
    top: "-38px",
    left: "-90px",
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    filter: "blur(12px)",
    opacity: 0,
    transform: "scale(0.2)",
    zIndex: 40,
    pointerEvents: "none",
    animation: "portalOpen 1.2s ease-out forwards",
  },

  // 🔹 Multiplayer banner styles
  friendsSection: {
    margin: "40px 0",
    width: "100%",
  },

  friendsWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    padding: "26px 30px",
    borderRadius: "24px",
    background: "linear-gradient(135deg, #020617, #111827)",
    alignItems: "stretch",
    justifyContent: "center",
  },

  friendsLeft: {
    flex: "1 1 260px",
    minWidth: "240px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  friendsGif: {
    width: "160px",
    height: "160px",
    objectFit: "cover",
    borderRadius: "999px",
    marginBottom: "10px",
    boxShadow: "0 0 25px rgba(59,130,246,0.7)",
  },

  friendsTitle: {
    fontSize: "26px",
    fontWeight: 800,
    marginBottom: "6px",
  },

  friendsSub: {
    fontSize: "15px",
    color: "#9ca3af",
  },

  friendsCard: {
    flex: "1 1 260px",
    minWidth: "240px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "18px",
    padding: "0",           // content padding handled in cardContent
    textAlign: "center",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 4px 22px rgba(0,0,0,0.35)",
    transition: "all .25s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    overflow: "hidden",
    position: "relative",
  },

  // Media background (thumbnail + video)
  cardMedia: {
  position: "relative",
  width: "100%",
  height: "210px",    // bigger height for premium look
  overflow: "hidden",
  borderRadius: "18px 18px 0 0",
},


  cardThumb: {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  filter: "brightness(0.75)",
  transition: "opacity .3s ease",
},


  cardVideo: {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: 0,
  transition: "opacity .35s ease",
  pointerEvents: "none",
},

cardDarkOverlay: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: "60%",
  background: "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.0))",
  zIndex: 1,
  transition: "opacity .3s ease",
  pointerEvents: "none",
},

  cardGradient: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(15,23,42,0.95), rgba(15,23,42,0.15))",
  },

  // Text + button area
  cardContent: {
  position: "absolute",
  bottom: "12px",
  left: "0",
  right: "0",
  padding: "0 16px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  zIndex: 3,
  transition: "opacity .35s ease",
},


  cardIcon: {
    width: "70px",
    marginBottom: "12px",
  },

  cardTitle: {
    fontSize: "20px",
    fontWeight: 700,
  },

  cardDesc: {
    color: "#9ca3af",
    marginTop: "4px",
    marginBottom: "12px",
    fontSize: "14px",
  },

  cardButton: {
    padding: "10px 18px",
    borderRadius: "12px",
    border: "none",
    fontWeight: 600,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    cursor: "pointer",
    marginTop: "10px",
    transition: "all .25s ease",
    boxShadow: "0 4px 16px rgba(99,102,241,0.45)",
  },
  heroVideo: {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: 1,
  pointerEvents: "none",

  /* ✅ STRONG CORNERS + SOFT FADED CENTER */
  maskImage:
    "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,1) 100%)",
  WebkitMaskImage:
    "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,1) 100%)",

  filter: "brightness(0.75) contrast(1.05) saturate(1.05)"
},



};

const dragonCSS = `
@keyframes dragonWalk {
  0% {
    left: -120px;
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  30% {
    left: 25%;
    transform: scale(1.03) rotate(2deg);
  }
  60% {
    left: 70%;
    transform: scale(0.97) rotate(-3deg);
  }
  85% {
    left: 95%;
    opacity: 1;
    transform: scale(0.9) rotate(-6deg);
  }
  100% {
    left: 130%;
    opacity: 0;         /* ✅ disappears smoothly */
    transform: scale(0.75) rotate(-10deg);
  }
}

/* ✅ subtle realistic body bounce — NOT cartoonish */
@keyframes dragonBob {
  0% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0); }
}

/* ✅ MOBILE PERFECT — smaller, faster exit */
@media (max-width: 600px) {
  @keyframes dragonWalk {
    0% { left: -100px; opacity: 1; transform: scale(0.7); }
    60% { left: 80%; opacity: 1; transform: scale(0.7); }
    100% { left: 130%; opacity: 0; transform: scale(0.6); }
  }
}
`;

const dragonStyle = document.createElement("style");
dragonStyle.innerHTML = dragonCSS;
document.head.appendChild(dragonStyle);
setTimeout(() => {
  const dragonEl = document.querySelector('img[alt="dragon"]');
  const track = document.querySelector('#footstep-track');
  const hero = document.querySelector('[data-hero-box]');

  if (!dragonEl || !track || !hero) return;

  const drop = setInterval(() => {
    const rect = dragonEl.getBoundingClientRect();
    const parentRect = track.parentElement.getBoundingClientRect();

    const x = rect.left - parentRect.left + 20;
    const y = rect.bottom - parentRect.top - 6;

    // 🔥 BURNING TRAIL
    const burn = document.createElement("div");
    Object.assign(burn.style, styles.burnTrail, {
      top: y + "px",
      left: x + "px",
    });
    track.appendChild(burn);
    setTimeout(() => burn.remove(), 1800);

  }, 240);

  setTimeout(() => clearInterval(drop), 4200);
}, 200);

const fx = `
@keyframes stepFade {
  0% { transform: scale(0.4); opacity: 1; }
  60% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(0.8); opacity: 0; }
}

}
`;

const fxTag = document.createElement("style");
fxTag.innerHTML = fx;
document.head.appendChild(fxTag);

const chaosFX = `
@keyframes burnFade {
  0% { transform: scale(0.4); opacity: 1; }
  40% { transform: scale(1.3); opacity: 0.9; }
  100% { transform: scale(0.8); opacity: 0; }
}

    @keyframes heatWave {
  0% { filter: blur(3px) brightness(1); }
  50% { filter: blur(5px) brightness(1.4); }
  100% { filter: blur(3px) brightness(1); }
}
}

}
`;

const chaosTag = document.createElement("style");
chaosTag.innerHTML = chaosFX;
document.head.appendChild(chaosTag);

const portalFX = `
@keyframes portalOpen {
  0% {
    opacity: 0;
    transform: scale(0.2);
    filter: blur(18px);
  }
  40% {
    opacity: 1;
    transform: scale(1.1);
    filter: blur(6px);
  }
  70% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.4);
    transform: scale(0.9);
  }

}
`;






const portalTag = document.createElement("style");
portalTag.innerHTML = portalFX;
document.head.appendChild(portalTag);
