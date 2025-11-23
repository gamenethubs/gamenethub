// import React, { useEffect } from "react";
// import { useAuth } from "../context/AuthContext";

// export default function GreetingCartoon({ onFinish }) {
//   const { user } = useAuth();

//   const username =
//     user?.name ||
//     user?.email?.split("@")[0] ||
//     "User";

//   // Auto hide after 4 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onFinish();
//     }, 4000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div
//       style={{
//         position: "fixed",
//         bottom: "80px",
//         right: "50px",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         zIndex: 6000,
//         pointerEvents: "none",
//         animation: "popIn 0.4s ease-out",
//       }}
//     >
//       {/* Cartoon GIF */}
//       <img
//         src="/cartoon-walk.gif"
//         alt="hello"
//         style={{
//           width: "180px",
//           height: "auto",
//         }}
//       />

//       {/* Chat bubble */}
//       <div
//         style={{
//           marginTop: "10px",
//           padding: "12px 18px",
//           borderRadius: "14px",
//           background: "white",
//           color: "#111",
//           fontWeight: "700",
//           fontSize: "16px",
//           boxShadow: "0px 6px 20px rgba(0,0,0,0.4)",
//           animation: "fadeInUp 0.5s ease",
//         }}
//       >
//         👋 Hello, {username}!
//       </div>

//       {/* Animations */}
//       <style>
//         {`
//           @keyframes popIn {
//             0% { transform: scale(0.4) translateY(40px); opacity: 0; }
//             100% { transform: scale(1) translateY(0); opacity: 1; }
//           }

//           @keyframes fadeInUp {
//             0% { opacity: 0; transform: translateY(10px); }
//             100% { opacity: 1; transform: translateY(0); }
//           }
//         `}
//       </style>
//     </div>
//   );
// }

import React, { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function GreetingCartoon({ onFinish }) {
  const { user } = useAuth();
  const spokenOnce = useRef(false);

  const username =
    user?.name ||
    user?.email?.split("@")[0] ||
    "User";

  useEffect(() => {
    spokenOnce.current = false;

    const speakHello = () => {
      if (spokenOnce.current) return; // ❌ Prevent double voice

      spokenOnce.current = true;

      // 🚫 Stop any previous queued speeches
      window.speechSynthesis.cancel();

      const text = `Hello ${username}`;
      const utter = new SpeechSynthesisUtterance(text);

      utter.pitch = 1;
      utter.rate = 1;
      utter.volume = 1;

      // Pick best voice
      const voices = speechSynthesis.getVoices();
      utter.voice =
        voices.find((v) => v.name.toLowerCase().includes("google")) ||
        voices.find((v) => v.name.toLowerCase().includes("natural")) ||
        voices[0];

      speechSynthesis.speak(utter);
    };

    // 🔥 Ensure voices are loaded before speaking
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = () => speakHello();
    } else {
      speakHello();
    }

    // Hide after 3 sec
    const timer = setTimeout(() => onFinish(), 3000);

    return () => {
      clearTimeout(timer);
      speechSynthesis.cancel(); // Stop speaking on unmount
    };
  }, [username, onFinish]);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 6000,
        animation: "popIn 0.4s ease-out",
        pointerEvents: "none",
      }}
    >
      {/* Cartoon GIF */}
      <img
        src="/cartoon-walk.gif"
        alt="hello"
        style={{
          width: "220px",
        }}
      />

      {/* Speech bubble */}
      <div
        style={{
          marginTop: "12px",
          padding: "14px 22px",
          borderRadius: "16px",
          background: "white",
          color: "#111",
          fontWeight: "700",
          fontSize: "18px",
          boxShadow: "0px 6px 30px rgba(0,0,0,0.35)",
          animation: "fadeInUp 0.5s ease",
          textAlign: "center",
        }}
      >
        👋 Hello, {username}!
      </div>

      <style>
        {`
          @keyframes popIn {
            0% { transform: translate(-50%, -60%) scale(0.4); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(12px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

