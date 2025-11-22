

// import React, { useEffect, useRef, useState } from "react";
// import { absoluteUrl } from "../services/api";

// /* GLOBAL CSS */
// (function injectCSS() {
//   if (document.getElementById("gnh-loader-css")) return;
//   const style = document.createElement("style");
//   style.id = "gnh-loader-css";
//   style.textContent = `
//     @keyframes spinAnim {
//       from { transform: rotate(0deg); }
//       to   { transform: rotate(360deg); }
//     }
//   `;
//   document.head.appendChild(style);
// })();

// /* ================================
//    GAME PLAYER
// ================================ */
// export default function GamePlayer({ gameUrl, embedUrl, onPlay, autoPlay }) {
//   const finalSrc = absoluteUrl(embedUrl || gameUrl);
//   const iframeRef = useRef(null);

//   const [loading, setLoading] = useState(true);
//   const [failed, setFailed] = useState(false);
//   const [expanded, setExpanded] = useState(false);

//   const timeoutRef = useRef(null);

//   /* TIMEOUT */
//   useEffect(() => {
//     setLoading(true);
//     setFailed(false);

//     timeoutRef.current = setTimeout(() => {
//       setFailed(true);
//       setLoading(false);
//     }, 15000);

//     return () => clearTimeout(timeoutRef.current);
//   }, [finalSrc]);

//   /* ONLOAD */
//   const handleLoad = () => {
//     clearTimeout(timeoutRef.current);
//     setLoading(false);
//     setFailed(false);

//     if (typeof onPlay === "function") {
//       onPlay({ autoPlay });
//     }
//   };

//   /* FULLSCREEN */
//   const handleFullscreen = () => {
//     const iframe = iframeRef.current;
//     if (!iframe) return;

//     if (iframe.requestFullscreen) iframe.requestFullscreen();
//     else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
//   };

//   /* RELOAD */
//   const handleReload = () => {
//     setLoading(true);
//     setFailed(false);
//     iframeRef.current.src = finalSrc;
//   };

//   return (
//     <div
//       style={{
//         ...styles.container,
//         height: expanded ? "90vh" : "75vh",
//       }}
//     >
//       {/* TOP BAR */}
//       <div style={styles.topBar}>
//         <span style={styles.title}>🎮 Game Player</span>

//         <div style={styles.rightBtns}>
//           <button style={styles.btn} onClick={handleReload}>🔄 Reload</button>
//           <button style={styles.btn} onClick={handleFullscreen}>⛶ Fullscreen</button>
//           <button style={styles.btn} onClick={() => setExpanded(!expanded)}>
//             {expanded ? "Shrink ↓" : "Expand ↑"}
//           </button>
//         </div>
//       </div>

//       {/* PLAYER */}
//       <div style={styles.frameWrapper}>
//         {loading && (
//           <div style={styles.loadingOverlay}>
//             <div style={styles.loaderCircle}></div>
//             <p style={styles.loadingText}>Loading game…</p>
//           </div>
//         )}

//         {failed && (
//           <div style={styles.errorOverlay}>
//             <h3 style={{ color: "#fff", marginBottom: 6 }}>Game failed to load</h3>
//             <p style={{ color: "#94a3b8" }}>ZIP must contain index.html</p>
//           </div>
//         )}

//         {!failed && (
//           <iframe
//             ref={iframeRef}
//             title="game-player"
//             src={finalSrc}
//             onLoad={handleLoad}
//             style={{
//               ...styles.iframe,
//               opacity: loading ? 0 : 1,
//             }}
//             allow="fullscreen; autoplay; encrypted-media"
//             sandbox="
//               allow-scripts
//               allow-same-origin
//               allow-pointer-lock
//               allow-orientation-lock
//               allow-popups
//               allow-downloads
//             "
//           ></iframe>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ================================
//    FINAL WORKING STYLES
// ================================ */
// const styles = {
//   container: {
//     width: "100%",
//     maxWidth: "100%",
//     margin: "0 auto",
//     background: "#0b0e13",
//     borderRadius: 20,
//     border: "1px solid rgba(255,255,255,0.08)",
//     boxShadow: "0 25px 60px rgba(0,0,0,0.55)",
//     overflow: "hidden",
//     transition: "all .35s ease",
//   },

//   topBar: {
//     padding: "12px 14px",
//     background: "rgba(255,255,255,0.05)",
//     borderBottom: "1px solid rgba(255,255,255,0.12)",
//     backdropFilter: "blur(8px)",
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "10px",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   title: {
//     color: "#fff",
//     fontWeight: 700,
//     fontSize: 14,
//   },

//   rightBtns: {
//     display: "flex",
//     gap: "10px",
//     flexWrap: "wrap",
//   },

//   btn: {
//     padding: "6px 10px",
//     background: "rgba(255,255,255,0.18)",
//     borderRadius: 6,
//     color: "#fff",
//     border: "1px solid rgba(255,255,255,0.25)",
//     cursor: "pointer",
//     fontSize: 12,
//   },

//   /* ⬇ FIXED WRAPPER — FULL FIT GAME */
//   frameWrapper: {
//     width: "100%",
//     height: "100%",      // FULL HEIGHT
//     background: "#000",
//     position: "relative",
//   },

//   /* ⬇ IFRAME 100% WIDTH & HEIGHT (NO ASPECT) */
//   iframe: {
//     width: "100%",
//     height: "100%",
//     border: "none",
//     display: "block",
//   },

//   loadingOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.6)",
//     backdropFilter: "blur(8px)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 20,
//   },

//   loaderCircle: {
//     width: 55,
//     height: 55,
//     borderRadius: "50%",
//     border: "5px solid rgba(255,255,255,0.2)",
//     borderTopColor: "#38bdf8",
//     animation: "spinAnim 1s linear infinite",
//   },

//   loadingText: {
//     marginTop: 12,
//     color: "#d1d5db",
//   },

//   errorOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "linear-gradient(180deg,#111,#1c1c1c)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 20,
//   },
// };



import React, { useEffect, useRef, useState } from "react";
import { absoluteUrl } from "../services/api";

/* GLOBAL CSS */
(function injectCSS() {
  if (document.getElementById("gnh-loader-css")) return;
  const style = document.createElement("style");
  style.id = "gnh-loader-css";
  style.textContent = `
    @keyframes spinAnim {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
})();

/* ================================
   GAME PLAYER
================================ */
export default function GamePlayer({ gameUrl, embedUrl, onPlay, autoPlay, mobileFullScreen }) {
  const finalSrc = absoluteUrl(embedUrl || gameUrl);
  const iframeRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const timeoutRef = useRef(null);

  /* TIMEOUT */
  useEffect(() => {
    setLoading(true);
    setFailed(false);

    timeoutRef.current = setTimeout(() => {
      setFailed(true);
      setLoading(false);
    }, 15000);

    return () => clearTimeout(timeoutRef.current);
  }, [finalSrc]);

  /* ONLOAD */
  const handleLoad = () => {
    clearTimeout(timeoutRef.current);
    setLoading(false);
    setFailed(false);

    if (typeof onPlay === "function") {
      onPlay({ autoPlay });
    }
  };

  /* FULLSCREEN */
  const handleFullscreen = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (iframe.requestFullscreen) iframe.requestFullscreen();
    else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
  };

  /* RELOAD */
  const handleReload = () => {
    setLoading(true);
    setFailed(false);
    iframeRef.current.src = finalSrc;
  };

  // ⭐ DYNAMIC STYLES FOR MOBILE FULLSCREEN
  const containerStyle = mobileFullScreen
    ? {
        ...styles.container,
        position: "fixed", // Forces it out of the document flow
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh", // Takes full viewport height
        zIndex: 99999,   // HIGHER than Navbar/Footer
        borderRadius: 0, // Remove curves
        border: "none",
        margin: 0,
      }
    : {
        ...styles.container,
        height: expanded ? "90vh" : "75vh",
      };

  return (
    <div style={containerStyle}>
      {/* TOP BAR */}
      <div style={styles.topBar}>
        <span style={styles.title}>🎮 Game Player</span>

        <div style={styles.rightBtns}>
          <button style={styles.btn} onClick={handleReload}>🔄 Reload</button>
          
          {/* ⭐ On Mobile Fullscreen, we hide the sizing buttons because it's already maxed out */}
          {!mobileFullScreen && (
            <>
              <button style={styles.btn} onClick={handleFullscreen}>⛶ Fullscreen</button>
              <button style={styles.btn} onClick={() => setExpanded(!expanded)}>
                {expanded ? "Shrink ↓" : "Expand ↑"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* PLAYER */}
      <div style={styles.frameWrapper}>
        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.loaderCircle}></div>
            <p style={styles.loadingText}>Loading game…</p>
          </div>
        )}

        {failed && (
          <div style={styles.errorOverlay}>
            <h3 style={{ color: "#fff", marginBottom: 6 }}>Game failed to load</h3>
            <p style={{ color: "#94a3b8" }}>ZIP must contain index.html</p>
          </div>
        )}

        {!failed && (
          <iframe
            ref={iframeRef}
            title="game-player"
            src={finalSrc}
            onLoad={handleLoad}
            style={{
              ...styles.iframe,
              opacity: loading ? 0 : 1,
            }}
            allow="fullscreen; autoplay; encrypted-media"
            sandbox="
              allow-scripts
              allow-same-origin
              allow-pointer-lock
              allow-orientation-lock
              allow-popups
              allow-downloads
            "
          ></iframe>
        )}
      </div>
    </div>
  );
}

/* ================================
   FINAL WORKING STYLES
================================ */
const styles = {
  container: {
    width: "100%",
    maxWidth: "100%",
    margin: "0 auto",
    background: "#0b0e13",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.55)",
    overflow: "hidden",
    transition: "all .35s ease",
  },

  topBar: {
    padding: "12px 14px",
    background: "rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
  },

  rightBtns: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  btn: {
    padding: "6px 10px",
    background: "rgba(255,255,255,0.18)",
    borderRadius: 6,
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.25)",
    cursor: "pointer",
    fontSize: 12,
  },

  frameWrapper: {
    width: "100%",
    height: "100%",      
    background: "#000",
    position: "relative", 
  },

  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    display: "block",
  },

  loadingOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(8px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },

  loaderCircle: {
    width: 55,
    height: 55,
    borderRadius: "50%",
    border: "5px solid rgba(255,255,255,0.2)",
    borderTopColor: "#38bdf8",
    animation: "spinAnim 1s linear infinite",
  },

  loadingText: {
    marginTop: 12,
    color: "#d1d5db",
  },

  errorOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg,#111,#1c1c1c)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
};