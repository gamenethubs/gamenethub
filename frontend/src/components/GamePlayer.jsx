

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
// export default function GamePlayer({ gameUrl, embedUrl, onPlay, autoPlay, mobileFullScreen }) {
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

//   // ⭐ DYNAMIC STYLES FOR MOBILE FULLSCREEN
//   const containerStyle = mobileFullScreen
//     ? {
//         ...styles.container,
//         position: "fixed", // Forces it out of the document flow
//         top: 0,
//         left: 0,
//         width: "100vw",
//         height: "100vh", // Takes full viewport height
//         zIndex: 99999,   // HIGHER than Navbar/Footer
//         borderRadius: 0, // Remove curves
//         border: "none",
//         margin: 0,
//       }
//     : {
//         ...styles.container,
//         height: expanded ? "90vh" : "75vh",
//       };

//   return (
//     <div style={containerStyle}>
//       {/* TOP BAR */}
//       <div style={styles.topBar}>
//         <span style={styles.title}>🎮 Game Player</span>

//         {/* changes new */}
//         <div style={styles.rightBtns}>

//   {/* ⭐ Fullscreen ALWAYS visible */}
//   <button style={styles.btn} onClick={handleFullscreen}>⛶ Fullscreen</button>

//   {/* Reload & Expand only when NOT mobile full screen */}
//   {!mobileFullScreen && (
//     <>
//       <button style={styles.btn} onClick={handleReload}>🔄 Reload</button>

//       <button style={styles.btn} onClick={() => setExpanded(!expanded)}>
//         {expanded ? "Shrink ↓" : "Expand ↑"}
//       </button>
//     </>
//   )}

// </div>
// {/* changes end */}
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

//   frameWrapper: {
//     width: "100%",
//     height: "100%",      
//     background: "#000",
//     position: "relative", 
//   },

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
export default function GamePlayer({
  gameUrl,
  embedUrl,
  onPlay,
  autoPlay,
  mobileFullScreen,
  gameData, // ⭐ NEW → entire game object needed for compatibility checking
}) {

  const finalSrc = absoluteUrl(embedUrl || gameUrl);
  const iframeRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const timeoutRef = useRef(null);

  /* ==========================================
     ⭐ DEVICE TYPE DETECTION (Perfect)
  ========================================== */
  const [isMobile, setIsMobile] = useState(false);
  const [compatibilityBlocked, setCompatibilityBlocked] = useState(false);

  useEffect(() => {
    const width = window.innerWidth;

    // <1024px = Mobile/Tablet
    setIsMobile(width < 1024);

    const compat = gameData?.deviceCompatibility || "all";

    if (compat === "desktop" && width < 1024) {
      setCompatibilityBlocked("desktop");
    } else if (compat === "mobile" && width >= 1024) {
      setCompatibilityBlocked("mobile");
    } else {
      setCompatibilityBlocked(false);
    }
  }, [gameData]);

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
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999,
        borderRadius: 0,
        border: "none",
        margin: 0,
      }
    : {
        ...styles.container,
        height: expanded ? "90vh" : "75vh",
      };

  /* ======================================================
     ⭐ COMPATIBILITY BLOCK — Show custom messages
  ====================================================== */
  const renderCompatibilityBlock = () => {
    if (!compatibilityBlocked) return null;

    const isDesk = compatibilityBlocked === "desktop";
    const msg = isDesk
      ? "This game is available only on Desktop."
      : "This game is available only on Mobile.";

    const sub = "We’re working to bring it to this device soon.";

    return (
      <div style={styles.compatBlock}>
        <h2 style={styles.compatTitle}>⚠️ Not Compatible</h2>
        <p style={styles.compatMsg}>{msg}</p>
        <p style={styles.compatSub}>{sub}</p>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      {/* TOP BAR */}
      <div style={styles.topBar}>
        <span style={styles.title}>🎮 Game Player</span>

        <div style={styles.rightBtns}>
          {/* ⭐ Fullscreen ALWAYS visible */}
          <button style={styles.btn} onClick={handleFullscreen}>
            ⛶ Fullscreen
          </button>

          {/* Reload & Expand only when NOT mobile full screen */}
          {!mobileFullScreen && (
            <>
              <button style={styles.btn} onClick={handleReload}>
                🔄 Reload
              </button>

              <button style={styles.btn} onClick={() => setExpanded(!expanded)}>
                {expanded ? "Shrink ↓" : "Expand ↑"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* PLAYER */}
      <div style={styles.frameWrapper}>
        {/* ⭐ Compatibility block — BEFORE game loads */}
        {compatibilityBlocked && renderCompatibilityBlock()}

        {!compatibilityBlocked && (
          <>
            {loading && (
              <div style={styles.loadingOverlay}>
                <div style={styles.loaderCircle}></div>
                <p style={styles.loadingText}>Loading game…</p>
              </div>
            )}

            {failed && (
              <div style={styles.errorOverlay}>
                <h3 style={{ color: "#fff", marginBottom: 6 }}>
                  Game failed to load
                </h3>
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
          </>
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

  /* ⭐ NEW COMPATIBILITY BLOCK */
  compatBlock: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    textAlign: "center",
  },

  compatTitle: {
    color: "#fff",
    fontSize: "1.4rem",
    marginBottom: "10px",
  },

  compatMsg: {
    color: "#f8fafc",
    fontSize: "1rem",
    marginBottom: "6px",
  },

  compatSub: {
    color: "#94a3b8",
    fontSize: "0.85rem",
  },
};
