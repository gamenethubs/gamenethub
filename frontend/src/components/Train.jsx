// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Train({ onFinish }) {
//   const navigate = useNavigate();
//   const [x, setX] = useState(-600); // Start off-screen left

//   useEffect(() => {
//     let pos = -600;
 
//     const interval = setInterval(() => {
//       pos += 22;
//       setX(pos);

//       // When train fully leaves the screen
//       if (pos > window.innerWidth + 600) {
//         clearInterval(interval);

//         setTimeout(() => {
//           navigate("/kids");     // redirect to kids page
//           onFinish();            // hide train
//           window.dispatchEvent(new Event("clear-search")); // clear search bar
//         }, 300);
//       }
//     }, 16);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <img
//       src="/Train1.gif"
//       alt="train"
//       style={{
//         position: "fixed",
//         bottom: "40px",
//         left: x,
//         width: "700px",
//         zIndex: 7000,
//         pointerEvents: "none",
//         transition: "left 0.1s linear",
//       }}
//     />
//   );
// }


// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Train({ onFinish }) {
//   const navigate = useNavigate();
//   const [x, setX] = useState(-800);
//   const [shake, setShake] = useState(false);

//   const hornRef = useRef(null);

//   useEffect(() => {
//     // 🎵 Load horn once
//     hornRef.current = new Audio("/train-horn.mp3");
//     hornRef.current.volume = 1.0;
//     hornRef.current.play();

//     let pos = -800;

//     const interval = setInterval(() => {
//       pos += 8; // 🐢 SLOWER SPEED for cinematic movement
//       setX(pos);

//       // 💥 screen shake in center zone
//       if (pos > 200 && pos < window.innerWidth - 300) {
//         setShake(true);
//       } else {
//         setShake(false);
//       }

//       // Train exit
//       if (pos > window.innerWidth + 400) {
//         clearInterval(interval);

//         // 🎵 Fade-out horn smoothly
//         fadeOutHorn();

//         setTimeout(() => {
//           navigate("/kids");
//           onFinish();
//           window.dispatchEvent(new Event("clear-search"));
//         }, 600);
//       } 
//     }, 16);

//     return () => clearInterval(interval);
//   }, []);

//   // ⬇️ Fade-out function for horn sound
//   const fadeOutHorn = () => {
//     let v = 1.0;

//     const fade = setInterval(() => {
//       if (!hornRef.current) return;

//       v -= 0.05;
//       if (v <= 0) {
//         hornRef.current.pause();
//         hornRef.current.currentTime = 0;
//         clearInterval(fade);
//       } else {
//         hornRef.current.volume = v;
//       }
//     }, 80);
//   };


//   return (
//     <>
//       {/* SCREEN SHAKE */}
//       <div
//         style={{
//           position: "fixed",
//           inset: 0,
//           zIndex: 5000,
//           pointerEvents: "none",
//           animation: shake ? "shake 0.15s infinite" : "none",
//         }}
//       />

//       {/* SMOKE EFFECT */}
//       <div
//         style={{
//           position: "fixed",
//           top: "32%",
//           left: x + 400,
//           zIndex: 7000,
//           pointerEvents: "none",
//           animation: "smoke 1s infinite ease-out",
//           opacity: 0.75,
//         }}
//       >
//         {/* <img src="/smoke.png" alt="" style={{ width: "110px" }} /> */}
//       </div>

//       {/* TRACK LIGHTS */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: "20px",
//           left: 0,
//           width: "100%",
//           height: "10px",
//           background:
//             "repeating-linear-gradient(90deg, rgba(255,255,0,0.9) 0px, rgba(255,255,0,0.2) 40px, transparent 80px)",
//           filter: "blur(3px)",
//           animation: "lights 0.4s infinite linear",
//           zIndex: 6500,
//         }}
//       />

//       {/* TRAIN IMAGE */}
//       <img
//         src="/Train1.gif"
//         alt="train"
//         style={{
//           position: "fixed",
//           bottom: "40px",
//           left: x,
//           width: "750px",
//           zIndex: 7000,
//           pointerEvents: "none",
//         }}
//       />

//       {/* LOADING TEXT */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: "10px",
//           width: "100%",
//           textAlign: "center",
//           color: "white",
//           fontWeight: "900",
//           fontSize: "26px",
//           textShadow: "0px 0px 12px #000",
//           zIndex: 7500,
//           animation: "fadeBlink 1s infinite",
//         }}
//       >
//         🚂 Kid Section Loading…
//       </div>

//       {/* ANIMATIONS */}
//       <style>
//         {`
//         @keyframes shake {
//           0% { transform: translate(0px, 0px); }
//           25% { transform: translate(2px, -2px); }
//           50% { transform: translate(-2px, 2px); }
//           75% { transform: translate(2px, 2px); }
//           100% { transform: translate(0px, 0px); }
//         }

//         @keyframes smoke {
//           0% { transform: scale(0.5) translateY(0px); opacity: 0.9; }
//           100% { transform: scale(1.4) translateY(-40px); opacity: 0; }
//         }

//         @keyframes lights {
//           from { filter: brightness(1); }
//           to { filter: brightness(2); }
//         }

//         @keyframes fadeBlink {
//           0% { opacity: 0.4; }
//           50% { opacity: 1; }
//           100% { opacity: 0.4; }
//         }
//         `}
//       </style>
//     </>
//   );
// }


import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Train({ onFinish }) {
  const navigate = useNavigate();
  const [x, setX] = useState(-800);
  const [shake, setShake] = useState(false);

  const hornRef = useRef(null);

  // ⭐ MOBILE DETECTOR
  const isMobile = window.innerWidth <= 768;

  // ⭐ Device-based dynamic settings
  const SPEED = isMobile ? 4 : 8; // mobile slower
  const TRAIN_WIDTH = isMobile ? 380 : 750; // mobile smaller
  const EXIT_OFFSET = isMobile ? 300 : 400; // mobile earlier exit
  const BOTTOM_OFFSET = isMobile ? "25%" : "12%"; // mobile bottom adjust

  useEffect(() => {
    // 🎵 Load horn once
    hornRef.current = new Audio("/train-horn.mp3");
    hornRef.current.volume = 1.0;
    hornRef.current.play();

    let pos = -TRAIN_WIDTH;

    const interval = setInterval(() => {
      pos += SPEED;
      setX(pos);

      // 💥 screen shake in center
      if (pos > 200 && pos < window.innerWidth - 300) {
        setShake(true);
      } else {
        setShake(false);
      }

      // ⭐ Train exit condition
      if (pos > window.innerWidth + EXIT_OFFSET) {
        clearInterval(interval);

        fadeOutHorn(); // fade audio now

        setTimeout(() => {
          navigate("/kids");
          onFinish();
          window.dispatchEvent(new Event("clear-search"));
        }, 500);
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);

  // ⭐ FAST fade-out (1 second max)
  const fadeOutHorn = () => {
    let v = 1.0;

    const fade = setInterval(() => {
      if (!hornRef.current) return;

      v -= 0.1;
      if (v <= 0) {
        hornRef.current.volume = 0;
        hornRef.current.pause();
        hornRef.current.currentTime = 0;
        clearInterval(fade);
      } else {
        hornRef.current.volume = v;
      }
    }, 100);
  };


  return (
    <>
      {/* SCREEN SHAKE */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 5000,
          pointerEvents: "none",
          animation: shake ? "shake 0.15s infinite" : "none",
        }}
      />

      {/* SMOKE */}
      {/* <div
        style={{
          position: "fixed",
          top: "32%",
          left: x + (TRAIN_WIDTH / 2),
          zIndex: 7000,
          pointerEvents: "none",
          animation: "smoke 1s infinite ease-out",
          opacity: 0.75,
        }}
      ></div> */}

      {/* TRACK LIGHTS */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: 0,
          width: "100%",
          height: "10px",
          background:
            "repeating-linear-gradient(90deg, rgba(255,255,0,0.9) 0px, rgba(255,255,0,0.2) 40px, transparent 80px)",
          filter: "blur(3px)",
          animation: "lights 0.4s infinite linear",
          zIndex: 6500,
        }}
      />

      {/* TRAIN IMAGE */}
      <img
        src="/Train1.gif"
        alt="train"
        style={{
          position: "fixed",
          bottom: BOTTOM_OFFSET, // MOBILE ADJUST
          left: x,
          width: TRAIN_WIDTH, // MOBILE ADJUST
          zIndex: 7000,
          pointerEvents: "none",
        }}
      />

      {/* LOADING TEXT */}
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          width: "100%",
          textAlign: "center",
          color: "white",
          fontWeight: "900",
          fontSize: isMobile ? "18px" : "26px", // mobile text smaller
          textShadow: "0px 0px 12px #000",
          zIndex: 7500,
          animation: "fadeBlink 1s infinite",
        }}
      >
        🚂 Kid Section Loading…
      </div>

      {/* ANIMATIONS */}
      <style>
        {`
        @keyframes shake {
          0% { transform: translate(0px, 0px); }
          25% { transform: translate(2px, -2px); }
          50% { transform: translate(-2px, 2px); }
          75% { transform: translate(2px, 2px); }
          100% { transform: translate(0px, 0px); }
        }

        @keyframes smoke {
          0% { transform: scale(0.5) translateY(0px); opacity: 0.9; }
          100% { transform: scale(1.4) translateY(-40px); opacity: 0; }
        }

        @keyframes lights {
          from { filter: brightness(1); }
          to { filter: brightness(2); }
        }

        @keyframes fadeBlink {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        `}
      </style>
    </>
  );
}
