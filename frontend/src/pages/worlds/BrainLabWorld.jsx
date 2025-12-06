///////////////////src/pages/worlds/BrainLabWorld.jsx/////////////////

// import React, { useEffect, useState } from "react";
// import "../../css/brainLab.css";

// import bgVideo from "../../assets/videos/puzzle.mp4";
// import brainMusic from "../../assets/sfx/brain.mp3";

// import tjIdle from "../../assets/mascots/tj-idle.png";
// import tjWin from "../../assets/mascots/tj-win.png";
// import tjJump from "../../assets/mascots/tj-jump.png";

// import { useNavigate } from "react-router-dom";
// import { getAllGames, absoluteUrl } from "../../services/api";

// import GameCard from "../../components/GameCard";
// import GamePlayer from "../../components/GamePlayer";
// import RatingStars from "../../components/RatingStars";

// // ✅ Music
// const brainBgMusic = new Audio(brainMusic);
// brainBgMusic.loop = true;
// brainBgMusic.volume = 0.4;

// export default function BrainLab() {
//   const navigate = useNavigate();

//   const [mascot, setMascot] = useState(tjIdle);
//   const [showIntro, setShowIntro] = useState(true);

//   const [games, setGames] = useState([]);
//   const [activeGame, setActiveGame] = useState(null); // ✅ PLAYER HERE

//   useEffect(() => {
//     setTimeout(() => {
//       brainBgMusic.play().catch(() => {});
//       setShowIntro(false);
//     }, 800);

//     return () => {
//       brainBgMusic.pause();
//       brainBgMusic.currentTime = 0;
//     };
//   }, []);

//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await getAllGames();
//         const all = res.data.games || [];

//         const filtered = all.filter(
//           (g) => g.isKids === true && g.kidsArenas?.includes("brainlab")
//         );

//         setGames(filtered);
//       } catch (err) {
//         console.log("BrainLab Fetch Error:", err);
//       }
//     }
//     load();
//   }, []);

//   return (
//     <div className="brain-lab-wrapper">

//       {/* 🌌 FX */}
//       <div className="galaxy-layer layer-1" />
//       <div className="galaxy-layer layer-2" />
//       <div className="galaxy-layer layer-3" />

//       {showIntro && (
//         <div className="brain-intro-overlay">
//           <div className="brain-intro-text">🧠 ENTERING BRAIN LAB...</div>
//         </div>
//       )}

//       <video className="brain-bg-video" autoPlay muted loop playsInline>
//         <source src={bgVideo} type="video/mp4" />
//       </video>

//       <button className="brain-back-btn" onClick={() => navigate("/kids")}>
//         ⬅ Back to Park
//       </button>

//       <div className="brain-mascot-area">
//         <img
//           src={mascot}
//           className="brain-mascot"
//           onMouseEnter={() => setMascot(tjJump)}
//           onMouseLeave={() => setMascot(tjIdle)}
//           onClick={() => setMascot(tjWin)}
//         />
//       </div>

//       <div className="brain-title">
//         🧠 Brain Lab <br />
//         <span>Train your Brain with Fun!</span>
//       </div>

//       {/* ✅ ✅ ✅ GAME GRID WITH NAVIGATION OVERRIDE */}
//       <div className="brain-game-grid">
//         {games.map((game, i) => (
//           <div key={game._id} style={{ position: "relative" }}>

//             {/* ✅ CLICK-CATCHER LAYER (STOPS NAVIGATION) */}
//             <div
//               className="brain-click-catcher"
//               onClick={() => setActiveGame(game)}
//             ></div>

//             <GameCard game={game} />
//           </div>
//         ))}
//       </div>

//       {/* ✅ ✅ ✅ PLAYER + DETAIL INSIDE BRAINLAB */}
//      {activeGame && (
//   <div className="brain-player-overlay">

//     <button
//       className="brain-player-close"
//       onClick={() => setActiveGame(null)}
//     >
//       ✖ Close
//     </button>

//     {/* ✅ FIXED PLAYER WRAPPER */}
//    <div className="brain-player-wrapper">
//   <GamePlayer
//     gameUrl={activeGame.playUrl}
//     embedUrl={activeGame.embedUrl}
//     autoPlay={true}
//     mobileFullScreen={false}
//     gameData={activeGame}
//   />
// </div>


//     {/* ✅ DETAIL */}
// {/* ✅ CLEAN GAME DETAIL */}
// <div className="brain-detail-box clean-detail">

//   {/* LEFT: THUMB */}
//   <div className="brain-detail-left">
//     <img
//       src={absoluteUrl(activeGame.thumbnail)}
//       className="brain-detail-thumb"
//       alt={activeGame.title}
//     />
//   </div>

//   {/* CENTER: INFO */}
//   <div className="brain-detail-center">
//     <h2 className="brain-detail-title">{activeGame.title}</h2>
//     <p className="brain-detail-genre">🎯 {activeGame.genre}</p>

//     <RatingStars
//       rating={activeGame.averageRating || 4}
//       size={22}
//       editable={false}
//     />

//     <div className="brain-stats-row">
//       <div>
//         <b>{activeGame.playCount || 0}</b>
//         <span>Plays</span>
//       </div>

//       <div>
//         <b>{(activeGame.averageRating || 0).toFixed(1)}</b>
//         <span>Rating</span>
//       </div>

//       <div>
//         <b>{activeGame.updatedAt
//           ? new Date(activeGame.updatedAt).getFullYear()
//           : "---"}
//         </b>
//         <span>Updated</span>
//       </div>
//     </div>
//   </div>

//   {/* RIGHT: ✅ ORIGINAL GAME DESCRIPTION */}
//   <div className="brain-detail-right clean-desc">
//     {activeGame.description || "No description available."}
//   </div>

// </div>




//   </div>
// )}

//     </div>
//   );
// }

import "../../assets/css/brainLab.css";

import KidsWorldLayout from "../../components/KidsWorldLayout.jsx";

import bgVideo from "../../assets/videos/puzzle.mp4";
import brainMusic from "../../assets/sfx/brain.mp3";

import tjIdle from "../../assets/mascots/tj-idle.png";
import tjWin from "../../assets/mascots/tj-win.png";
import tjJump from "../../assets/mascots/tj-jump.png";

export default function BrainLabWorld() {
  return (
    <KidsWorldLayout
      title="🧠 Brain Lab"
      subtitle="Train your Brain with Fun!"
      mascotIdle={tjIdle}
      mascotJump={tjJump}
      mascotWin={tjWin}
      bgVideo={bgVideo}
      music={brainMusic}
      filterArena="brainlab"
    />
  );
}
