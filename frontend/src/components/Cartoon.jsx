// import { useState, useEffect, useRef } from "react";

// export default function Cartoon({ visible, onFinish }) {
//   const posRef = useRef({ x: 200, y: 200 });
//   const targetRef = useRef(null);
//   const [renderPos, setRenderPos] = useState(posRef.current);
//   const [hits, setHits] = useState(0);
//   const [size, setSize] = useState(380);
//   const [isWalking, setIsWalking] = useState(false);

//   const MAX_HITS = 3;  

//   // RESET when visible
//   useEffect(() => {
//     if (visible) {  
//       setHits(0);
//       targetRef.current = null;

//       posRef.current = {
//         x: window.innerWidth / 2 - 200,
//         y: window.innerHeight / 2 - 200,
//       };
//       setRenderPos(posRef.current);

//       setSize(380);
//       setTimeout(() => {
//         if (visible) setSize(160);
//       }, 1000);

//       const s = new Audio("/glassbreak.mp3");
//       s.volume = 0.7;
//       s.play();
//     }
//   }, [visible]);

//   // Mouse click → set target
//   useEffect(() => {
//     if (!visible) return;

//     const handleClick = (e) => {
//       targetRef.current = { x: e.clientX, y: e.clientY };
//     };

//     window.addEventListener("click", handleClick);
//     return () => window.removeEventListener("click", handleClick);
//   }, [visible]);

//   // MAIN MOVEMENT ENGINE (ALWAYS RUNS)
//   useEffect(() => {
//     let lastTime = 0;

//     const move = (time) => {
//       requestAnimationFrame(move);

//       if (!targetRef.current || !visible) return;

//       const dt = time - lastTime;
//       if (dt < 16) return; // Limit FPS to ~60
//       lastTime = time;

//       const speed = 6;
//       const cur = posRef.current;
//       const t = targetRef.current;

//       const dx = t.x - cur.x;
//       const dy = t.y - cur.y;
//       const dist = Math.sqrt(dx * dx + dy * dy);

//       if (dist < 20) {
//         // HIT
//         targetRef.current = null;

//         createBreak(t.x, t.y);

//         setHits((prev) => {
//           if (prev + 1 >= MAX_HITS) {
//             setTimeout(() => onFinish(), 500);
//           }
//           return prev + 1;
//         });

//         return;
//       }

//       // MOVE TOWARD TARGET
//       posRef.current = {
//         x: cur.x + (dx / dist) * speed,
//         y: cur.y + (dy / dist) * speed,
//       };

//       setRenderPos({ ...posRef.current });
//     };

//     requestAnimationFrame(move);
//   }, [visible]);

//   // BREAK EFFECT
//   const createBreak = (x, y) => {
//     const canvas = document.getElementById("crack-layer");
//     const ctx = canvas.getContext("2d");

//     const audio = new Audio("/glassbreak.mp3");
//     audio.volume = 0.7;
//     audio.play();

//     let r = 0;

//     const animate = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       ctx.strokeStyle = "white";
//       ctx.lineWidth = 2;

//       for (let i = 0; i < 12; i++) {
//         const a = (Math.PI * 2 * i) / 12;
//         ctx.beginPath();
//         ctx.moveTo(x, y);
//         ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
//         ctx.stroke();
//       }

//       r += 3;
//       if (r < 100) requestAnimationFrame(animate);
//     };

//     animate();
//   };

//   if (!visible) return null;

//   return (
//     <>
//       <canvas
//         id="crack-layer"
//         width={window.innerWidth}
//         height={window.innerHeight}
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           pointerEvents: "none",
//           zIndex: 3000,
//         }}
//       />

//       <img
//         src="/cartoon.png"
//         alt="cartoon"
//         style={{
//           position: "fixed",
//           left: renderPos.x,
//           top: renderPos.y,
//           width: `${size}px`,
//           zIndex: 4000,
//           pointerEvents: "none",
//           transform: `${
//             targetRef.current && targetRef.current.x < renderPos.x
//               ? "scaleX(-1)"
//               : "scaleX(1)"
//           } scale(${visible ? 1 : 0.1})`, 
//           transition: "transform 0.25s ease-out, width 0.4s ease",
//         }}
//       />
//     </>
//   );
// }


import { useState, useEffect, useRef } from "react";

export default function Cartoon({ visible, onFinish }) {
  const posRef = useRef({ x: 200, y: 200 });
  const targetRef = useRef(null);

  const [renderPos, setRenderPos] = useState(posRef.current);
  const [hits, setHits] = useState(0);
  const [size, setSize] = useState(380);
  const [isWalking, setIsWalking] = useState(false);

  const MAX_HITS = 3;

  // RESET when visible
  useEffect(() => {
    if (visible) {
      setHits(0);
      targetRef.current = null;

      // Spawn center big
      posRef.current = {
        x: window.innerWidth / 2 - 200,
        y: window.innerHeight / 2 - 200,
      };
      setRenderPos(posRef.current);

      // Big → small after 1 second
      setSize(380);
      setTimeout(() => {
        if (visible) setSize(160);
      }, 1000);

      // Spawn sound
      const s = new Audio("/glassbreak.mp3");
      s.volume = 0.6;
      s.play();
    }
  }, [visible]);

  // CLICK sets target
  useEffect(() => {
    if (!visible) return;

    const handleClick = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [visible]);

  // MAIN MOVEMENT ENGINE
  useEffect(() => {
    let lastTime = 0;

    const move = (time) => {
      requestAnimationFrame(move);

      if (!targetRef.current || !visible) return;

      const dt = time - lastTime;
      if (dt < 16) return; // ~60 FPS limit
      lastTime = time;

      const speed = 6;
      const cur = posRef.current;
      const t = targetRef.current;

      const dx = t.x - cur.x;
      const dy = t.y - cur.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Reached target
      if (dist < 20) {
        targetRef.current = null;
        setIsWalking(false); // stop walking when hitting

        createBreak(t.x, t.y);

        setHits((prev) => {
          if (prev + 1 >= MAX_HITS) {
            setTimeout(() => onFinish(), 600);
          }
          return prev + 1;
        });

        return;
      }

      // Walk mode
      setIsWalking(true);

      // Move toward target
      posRef.current = {
        x: cur.x + (dx / dist) * speed,
        y: cur.y + (dy / dist) * speed,
      };

      setRenderPos({ ...posRef.current });
    };

    requestAnimationFrame(move);
  }, [visible]);

  // BREAK EFFECT

  const createBreak = (x, y) => {
  const overlay = document.createElement("img");
  overlay.src = "/glassbreak.png";
  overlay.style.position = "fixed";
  overlay.style.left = x - 250 + "px";
  overlay.style.top = y - 250 + "px";
  overlay.style.width = "500px";
  overlay.style.height = "500px";
  overlay.style.zIndex = 3500;
  overlay.style.pointerEvents = "none";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 0.25s ease-out";

  document.body.appendChild(overlay);

  // Fade in
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
  });

  // Play sound
  const audio = new Audio("/glassbreak.mp3");
  audio.volume = 0.8;
  audio.play();

  // Remove after 1 second fade-out
  setTimeout(() => {
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 300);
  }, 900);
};





//   const createBreak = (x, y) => {
//     const canvas = document.getElementById("crack-layer");
//     const ctx = canvas.getContext("2d");

//     const audio = new Audio("/glassbreak.mp3");
//     audio.volume = 0.7;
//     audio.play();

//     let r = 0;

//     const animate = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       ctx.strokeStyle = "white";
//       ctx.lineWidth = 2;

//       for (let i = 0; i < 12; i++) {
//         const a = (Math.PI * 2 * i) / 12;
//         ctx.beginPath();
//         ctx.moveTo(x, y);
//         ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
//         ctx.stroke();
//       }

//       r += 3;
//       if (r < 110) requestAnimationFrame(animate);
//     };

//     animate();
//   };

  if (!visible) return null;

  return (
    <>
      <canvas
        id="crack-layer"
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 3000,
        }}
      />

      <img
        src={isWalking ? "/cartoon-walk.gif" : "/cartoon.png"}
        alt="cartoon"
        style={{
          position: "fixed",
          left: renderPos.x,
          top: renderPos.y,
          width: `${size}px`,
          zIndex: 4000,
          pointerEvents: "none",
          transform: `${
            targetRef.current && targetRef.current.x < renderPos.x
              ? "scaleX(-1)"
              : "scaleX(1)"
          } scale(${visible ? 1 : 0.1})`,
          transition: "transform 0.25s ease-out, width 0.4s ease",
        }}
      />
    </>
  );
}
