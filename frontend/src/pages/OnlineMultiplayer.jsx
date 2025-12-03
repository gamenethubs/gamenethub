//////src/pages/OnlineMultiplayer.jsx//////
import React, { useEffect, useState } from "react";
import { getAllGames } from "../services/api";
import GameCard from "../components/GameCard";
import GameModal from "../components/GameModal";

export default function OnlineMultiplayer() {
  const [games, setGames] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [scanLine, setScanLine] = useState(0);
  const [connectionPulse, setConnectionPulse] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await getAllGames();
        const all = res.data.games || [];
        const filtered = all.filter((g) => !!g.isOnline);
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

  // Scanning beam animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Connection pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionPulse((prev) => (prev + 1) % 3);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cyber-arena-wrapper online-variant">
      {/* Animated Background Layers */}
      <div className="cyber-bg-layer layer-1"></div>
      <div className="cyber-bg-layer layer-2"></div>
      <div className="cyber-bg-layer layer-3"></div>
      
      {/* Network Grid Animation */}
      <div className="network-grid"></div>
      
      {/* Scan Line Effect */}
      <div 
        className="scan-beam online-beam" 
        style={{ top: `${scanLine}%` }}
      ></div>

      {/* Floating Grid Lines */}
      <div className="grid-overlay"></div>

      {/* Main Content Container */}
      <div className={`arena-content ${animate ? 'active' : ''}`}>
        
        {/* Holographic Header Panel */}
        <div className="holo-header online-header">
          <div className="corner-frame tl"></div>
          <div className="corner-frame tr"></div>
          <div className="corner-frame bl"></div>
          <div className="corner-frame br"></div>
          
          <div className="status-indicator online-status"></div>
          
          <div className="header-content">
            <div className="mode-badge online-badge">
              <span className="badge-icon">🌐</span>
              <span>ONLINE ARENA</span>
            </div>
            
            <h1 className="cyber-title">
              <span className="glitch-text online-glitch" data-text="ONLINE MULTIPLAYER">
                ONLINE MULTIPLAYER
              </span>
            </h1>
            
            <div className="sub-header">
              <div className="connection-status">
                <div className={`signal-bar ${connectionPulse >= 0 ? 'active' : ''}`}></div>
                <div className={`signal-bar ${connectionPulse >= 1 ? 'active' : ''}`}></div>
                <div className={`signal-bar ${connectionPulse >= 2 ? 'active' : ''}`}></div>
                <span className="signal-text">CONNECTED</span>
              </div>
              <p className="subtitle-text">GLOBAL NETWORK • WORLDWIDE COMBAT</p>
              <div className="player-count online-count">
                <span className="count-label">GAMES AVAILABLE</span>
                <span className="count-number">{games.length}</span>
              </div>
            </div>
          </div>

          {/* Animated HUD Elements */}
          <div className="hud-ring rotating online-ring"></div>
          <div className="hud-ring-2 rotating-reverse online-ring-2"></div>
          
          {/* Network Nodes */}
          <div className="network-nodes">
            <div className="node"></div>
            <div className="node"></div>
            <div className="node"></div>
          </div>
        </div>

        {/* Matchmaking Status Bar */}
        <div className="matchmaking-bar online-matchmaking">
          <div className="status-line online-line"></div>
          <div className="status-text">
            <span className="pulse-dot online-pulse"></span>
            NETWORK ACTIVE • SEARCHING GLOBAL LOBBIES
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
                className="game-slot online-slot"
                style={{
                  animationDelay: `${(i * 0.08).toFixed(2)}s`,
                }}
              >
                <div className="slot-frame online-frame">
                  <div className="frame-corner"></div>
                  <div className="frame-corner"></div>
                  <div className="frame-corner"></div>
                  <div className="frame-corner"></div>
                </div>
                <GameCard game={game} onPlay={() => setSelectedGame(game)} />
                <div className="holo-glow online-glow"></div>
                <div className="connection-indicator"></div>
              </div>
            ))
          ) : (
            <div className="no-games-panel online-error">
              <div className="error-icon">📡</div>
              <h2 className="error-title">NETWORK SEARCH IN PROGRESS</h2>
              <p className="error-subtitle">Scanning global game servers</p>
              <div className="loading-bar">
                <div className="loading-progress online-progress"></div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Data Panels */}
        {/* <div className="data-panel left-panel online-panel">
          <div className="panel-line"></div>
          <div className="panel-text">NET.ONLINE</div>
        </div>
        
        <div className="data-panel right-panel online-panel">
          <div className="panel-line"></div>
          <div className="panel-text">PING: 24ms</div>
        </div> */}
      </div>

      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}