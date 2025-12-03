//////////////////src/pages/LocalMultiplayer.jsx////////////////
import React, { useEffect, useState } from "react";
import { getAllGames } from "../services/api";
import GameCard from "../components/GameCard";
import GameModal from "../components/GameModal";


export default function LocalMultiplayer() {
  const [games, setGames] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await getAllGames();
        const all = res.data.games || [];
        const filtered = all.filter((g) => !!g.isLocal);
        setGames(filtered);
      } catch (err) {
        console.log("Error:", err);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(t);
  }, []);
useEffect(() => {
  console.log("GAMES:", games);
}, [games]);

  // Scanning beam animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cyber-arena-wrapper">
      {/* Animated Background Layers */}
      <div className="cyber-bg-layer layer-1"></div>
      <div className="cyber-bg-layer layer-2"></div>
      <div className="cyber-bg-layer layer-3"></div>
      
      {/* Scan Line Effect */}
      <div 
        className="scan-beam" 
        style={{ top: `${scanLine}%` }}
      ></div>

      {/* Floating Grid Lines */}
      <div className="grid-overlay"></div>

      {/* Main Content Container */}
      <div className={`arena-content ${animate ? 'active' : ''}`}>
        
        {/* Holographic Header Panel */}
        <div className="holo-header">
          <div className="corner-frame tl"></div>
          <div className="corner-frame tr"></div>
          <div className="corner-frame bl"></div>
          <div className="corner-frame br"></div>
          
          <div className="status-indicator"></div>
          
          <div className="header-content">
            <div className="mode-badge">
              <span className="badge-icon">⚡</span>
              <span>LOCAL ARENA</span>
            </div>
            
            <h1 className="cyber-title">
              <span className="glitch-text" data-text="LOCAL MULTIPLAYER">
                LOCAL MULTIPLAYER
              </span>
            </h1>
            
            <div className="sub-header">
              <div className="connection-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              <p className="subtitle-text">SAME DEVICE • SHARED COMBAT</p>
              <div className="player-count">
                <span className="count-label">GAMES AVAILABLE</span>
                <span className="count-number">{games.length}</span>
              </div>
            </div>
          </div>

          {/* Animated HUD Elements */}
          <div className="hud-ring rotating"></div>
          <div className="hud-ring-2 rotating-reverse"></div>
        </div>

        {/* Matchmaking Status Bar */}
        <div className="matchmaking-bar">
          <div className="status-line"></div>
          <div className="status-text">
            <span className="pulse-dot"></span>
            ARENA READY • LOADING GAME MATRIX
          </div>
          <div className="energy-bars">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>

        {/* Game Grid with Holographic Cards */}
        <div className="game-arena-grid">
          {games.length > 0 ? (
            games.map((game, i) => (
              <div
                key={game._id}
                className="game-slot"
                style={{
                  animationDelay: `${(i * 0.08).toFixed(2)}s`,
                }}
              >
                <div className="slot-frame">
                  <div className="frame-corner"></div>
                  <div className="frame-corner"></div>
                  <div className="frame-corner"></div>
                  <div className="frame-corner"></div>
                </div>
                <GameCard game={game} onPlay={() => setSelectedGame(game)} />
                <div className="holo-glow"></div>
              </div>
            ))
          ) : (
            <div className="no-games-panel">
              <div className="error-icon">🕹️</div>
              <h2 className="error-title">READY TO BATTLE!</h2>
              <p className="error-subtitle">Waiting for local challengers...</p>
              <div className="loading-bar">
                <div className="loading-progress"></div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Data Panels */}
        {/* <div className="data-panel left-panel">
          <div className="panel-line"></div>
          <div className="panel-text">SYS.LOCAL</div>
        </div>
        
        <div className="data-panel right-panel">
          <div className="panel-line"></div>
          <div className="panel-text">v4.2.1</div>
        </div> */}
      </div>

      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}