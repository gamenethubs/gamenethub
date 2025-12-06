
///////////////src/pages/KidsThemeParkHub.jsx/////////////////
import React, { useState, useEffect } from "react";
import "../assets/css/kidsThemePark.css";

// import themeBg from "./assets/backgrounds/theme-park-bg.png";
import themeBg from "../assets/backgrounds/theme-bg.mp4";

import mascotIdle from "../assets/mascots/mickey-idle.png";
import mascotJump from "../assets/mascots/mickey-jump.png";

import cloudImg from "../assets/clouds/cloud.png";
import balloonImg from "../assets/balloons/balloon.png";

import puzzleIcon from "../assets/worlds/puzzle.png";
import racingIcon from "../assets/worlds/racing.png";
import skillIcon from "../assets/worlds/skill1.png";
import mathIcon from "../assets/worlds/math.png";

import hoverPop from "../assets/sfx/pop.mp3";
import jumpSound from "../assets/sfx/jump1.mp3";
import welcomeVoice from "../assets/sfx/welcome.mp3";
import bgMusic from "../assets/sfx/bg-music.mp3";
import drumRoll from "../assets/sfx/drum-roll.mp3";
import sparkleSound from "../assets/sfx/sparkle.mp3";
import fireworksSound from "../assets/sfx/fireworks.wav";
import brainVideo from "../assets/videos/puzzle.mp4";
import racingVideo from "../assets/videos/racing.mp4";
import skillVideo from "../assets/videos/skill.mp4";
import mathVideo from "../assets/videos/math.mp4";
import { useNavigate } from "react-router-dom";





// ✅ AUDIO OBJECTS
const sfxBg = new Audio(bgMusic);
sfxBg.loop = true;
sfxBg.volume = 0.25;

const sfxDrum = new Audio(drumRoll);
const sfxSparkle = new Audio(sparkleSound);
const sfxHover = new Audio(hoverPop);
const sfxJump = new Audio(jumpSound);
const sfxWelcome = new Audio(welcomeVoice);
const sfxFireworks = new Audio(fireworksSound);


export default function KidsThemeParkHub() {
  const [activeWorld, setActiveWorld] = useState(null);
  const [mascotImg, setMascotImg] = useState(mascotIdle);
  const [soundUnlocked, setSoundUnlocked] = useState(false);
  const [showBigMickey, setShowBigMickey] = useState(true);
  const [isTalking, setIsTalking] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const navigate = useNavigate();




  // ✅ SOUND UNLOCK ON FIRST USER TAP
  useEffect(() => {
    const unlockSound = () => {
      if (!soundUnlocked) {
        setSoundUnlocked(true);

        sfxSparkle.currentTime = 0;
        sfxSparkle.play().catch(() => {});

        sfxWelcome.currentTime = 0;
        sfxWelcome.volume = 0.9;
       setIsTalking(true);
sfxWelcome.play().catch(() => {});

sfxWelcome.onended = () => {
  setIsTalking(false);
};


        setTimeout(() => {
          sfxBg.play().catch(() => {});
        }, 1000);
      }

      window.removeEventListener("click", unlockSound);
      window.removeEventListener("touchstart", unlockSound);
    };

    window.addEventListener("click", unlockSound);
    window.addEventListener("touchstart", unlockSound);

    return () => {
      window.removeEventListener("click", unlockSound);
      window.removeEventListener("touchstart", unlockSound);
    };
  }, [soundUnlocked]);
  useEffect(() => {
  return () => {
    // ✅ Page leave hote hi saari sounds band
    sfxBg.pause();
    sfxBg.currentTime = 0;

    sfxDrum.pause();
    sfxDrum.currentTime = 0;

    sfxWelcome.pause();
    sfxWelcome.currentTime = 0;

    sfxSparkle.pause();
    sfxSparkle.currentTime = 0;
  };
}, []);
useEffect(() => {
  if (showBigMickey) {
    document.body.style.overflow = "hidden"; // ✅ SCROLL LOCK
  } else {
    document.body.style.overflow = "auto";   // ✅ SCROLL UNLOCK
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showBigMickey]);


  return (
    
    <div
      className={`kids-theme-park-wrapper ${
        activeWorld ? "world-zoom-active" : ""
      }`}
    >
      <a href="/" className="floating-home-logo">
  <img src="/GamenetHub.png" alt="Home" />
</a>

      <video className="theme-video-bg" autoPlay muted loop playsInline>
  <source src={themeBg} type="video/mp4" />
</video>

      {showBigMickey && (
  <div
    className="big-mickey-overlay"
    onClick={() => {
      setShowBigMickey(false);

      sfxSparkle.currentTime = 0;
      sfxSparkle.play().catch(() => {});

      setTimeout(() => {
        sfxWelcome.currentTime = 0;
        sfxWelcome.play().catch(() => {});
      }, 500);

      setTimeout(() => {
        sfxBg.play().catch(() => {});
      }, 1400);
      setTimeout(() => {
      sfxFireworks.currentTime = 0;
      sfxFireworks.play().catch(() => {});   // ✅ FIREWORK BLAST
    }, 350);
    }}
  >
    <img
  src={mascotIdle}
  alt="Mickey"
 className={`mascot-fly  ${!showBigMickey ? "fly-to-park" : ""}`}

/>

    <div className="tap-glow">
      ✨ TAP TO ENTER MAGIC PARK ✨
    </div>
  </div>
)}


      {/* ☁️ SKY */}
      <div className="sky-layer">
        <div className="cloud cloud-1" style={{ backgroundImage: `url(${cloudImg})` }} />
        <div className="cloud cloud-2" style={{ backgroundImage: `url(${cloudImg})` }} />
        <div className="cloud cloud-3" style={{ backgroundImage: `url(${cloudImg})` }} />

        <div className="balloon balloon-1" style={{ backgroundImage: `url(${balloonImg})` }} />
        <div className="balloon balloon-2" style={{ backgroundImage: `url(${balloonImg})` }} />
      </div>

      {/* 🎭 MASCOT */}
      {!activeWorld && (
        <div className="kids-mascot-bar">
          <div
  className={`mascot-character `}

            style={{ backgroundImage: `url(${mascotImg})` }}
            onClick={() => setShowBubble(prev => !prev)}   // ✅ TAP TO TOGGLE
            onMouseEnter={() => {
              setMascotImg(mascotJump);
              if (soundUnlocked) {
                sfxJump.currentTime = 0;
                sfxJump.play().catch(() => {});
              }
            }}
            onMouseLeave={() => {
              setMascotImg(mascotIdle);
            }}
          />
          <div className={`mascot-speech magical-bubble ${showBubble ? "show-bubble" : ""}`}>
            ⭐ Hey Super Star! ⭐ <br />
            Tap a world & enter the Magic Adventure! 🎡✨
          </div>
        </div>
      )}

      {/* 🌍 WORLD MAP */}
      <div className="theme-park-map">
        {[
  { 
    id: "puzzle", 
    title: "🧠 Brain Lab", 
    desc: "Smart puzzles & logic", 
    icon: puzzleIcon,
    video: brainVideo
  },
  { 
    id: "racing", 
    title: "🚗 Racing City", 
    desc: "Speed & fun", 
    icon: racingIcon,
    video: racingVideo
  },
  { 
    id: "skill", 
    title: "🎯 Skill Circus", 
    desc: "Reflex games", 
    icon: skillIcon,
    video: skillVideo
  },
  { 
    id: "math", 
    title: "🔢 Candy Math Land", 
    desc: "Sweet equations", 
    icon: mathIcon,
    video: mathVideo
  },
]
.map((world) => (
          <div
  className={`world-node ${activeWorld === world.id ? "world-fullscreen" : ""}`}
  onMouseEnter={(e) => {
    if (soundUnlocked) {
      sfxHover.currentTime = 0;
      sfxHover.play().catch(() => {});
    }
    const video = e.currentTarget.querySelector("video");
    if (video) video.play();
  }}
  onMouseLeave={(e) => {
    const video = e.currentTarget.querySelector("video");
    if (video) video.pause();
  }}
  onClick={(e) => {
  if (soundUnlocked) {
    sfxJump.currentTime = 0;
    sfxJump.play().catch(() => {});
    sfxDrum.currentTime = 0;
    sfxDrum.play().catch(() => {});
  }

  const video = e.currentTarget.querySelector("video");
  if (video) video.pause(); // ✅ click par band ho jaye

  setActiveWorld(world.id); // ✅ existing zoom logic bhi chale

  // ✅ ✅ NEW PAGE OPEN (SAFE)
  if (world.id === "puzzle") navigate("/kids/brain-lab");
  if (world.id === "racing") navigate("/kids/racing-city");
  if (world.id === "skill") navigate("/kids/skill-circus");
  if (world.id === "math") navigate("/kids/math-land");
}}

  style={{ backgroundImage: `url(${world.icon})` }}
>
           <video className="world-hover-video" muted loop playsInline>
  <source src={world.video} type="video/mp4" />
</video>


            <div className="world-glow" />
            <div className="world-info">
              <h2>{world.title}</h2>
              <p>{world.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔙 BACK BUTTON */}
      {activeWorld && (
        <button
  className="back-to-park"
  onClick={() => {
    if (soundUnlocked) {
      sfxHover.currentTime = 0;
      sfxHover.play().catch(() => {});
   sfxBg.pause();
sfxBg.currentTime = 0;

setTimeout(() => {
  sfxBg.play().catch(() => {});
}, 400);

    }
    setActiveWorld(null);
  }}
>
  ⬅ Back to Magic Park
</button>

      )}

      {/* 👨‍👩‍👧 PARENTS BAR */}
     
    </div>
  );
}
