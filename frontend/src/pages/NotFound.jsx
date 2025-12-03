import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playerY, setPlayerY] = useState(200);
  const [obstacles, setObstacles] = useState([]);
  const [particles, setParticles] = useState([]);
  
  const gameLoopRef = useRef(null);
  const playerVelocityRef = useRef(0);
  const gravityRef = useRef(0.6);
  const frameCountRef = useRef(0);

  useEffect(() => {
    // Create floating particles for background
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        playerVelocityRef.current = -12;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // Game loop
    gameLoopRef.current = setInterval(() => {
      frameCountRef.current++;

      // Update player position
      playerVelocityRef.current += gravityRef.current;
      setPlayerY(prev => {
        const newY = prev + playerVelocityRef.current;
        if (newY > 350) {
          setGameOver(true);
          return 350;
        }
        if (newY < 0) return 0;
        return newY;
      });

      // Spawn obstacles
      if (frameCountRef.current % 90 === 0) {
        const height = 40 + Math.random() * 80;
        setObstacles(prev => [...prev, { 
          id: Date.now(), 
          x: 800, 
          height,
          scored: false 
        }]);
      }

      // Move obstacles and check collision
      setObstacles(prev => {
        const updated = prev.map(obs => {
          const newX = obs.x - 5;
          return { ...obs, x: newX };
        });

        // Check collision with current playerY
        updated.forEach(obs => {
          if (obs.x < 120 && obs.x > 60) {
            setPlayerY(currentY => {
              if (currentY < obs.height || currentY > 400 - obs.height - 30) {
                setGameOver(true);
              }
              return currentY;
            });
          }

          // Update score
          if (!obs.scored && obs.x < 60) {
            obs.scored = true;
            setScore(s => {
              const newScore = s + 1;
              setHighScore(hs => Math.max(hs, newScore));
              return newScore;
            });
          }
        });

        return updated.filter(obs => obs.x > -50);
      });

    }, 1000 / 60);

    return () => {
      clearInterval(gameLoopRef.current);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setPlayerY(200);
    setObstacles([]);
    playerVelocityRef.current = 0;
    frameCountRef.current = 0;
  };

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setPlayerY(200);
    setObstacles([]);
    playerVelocityRef.current = 0;
    frameCountRef.current = 0;
  };

  const handleJump = () => {
    if (gameStarted && !gameOver) {
      playerVelocityRef.current = -12;
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Animated background grid */}
      <div style={styles.gridOverlay} />
      
      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            ...styles.particle,
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}

      <div style={styles.content}>
        {/* 404 Header */}
        <h1 style={styles.head}>
          <span style={styles.number}>4</span>
          <span style={styles.numberMiddle}>0</span>
          <span style={styles.number}>4</span>
        </h1>

        <div style={styles.errorBox}>
          <p style={styles.errorTitle}>PAGE NOT FOUND</p>
          <p style={styles.text}>While you're here, try this mini game!</p>
        </div>

        {/* Game Canvas */}
        <div style={styles.gameContainer}>
          {!gameStarted ? (
            <div style={styles.startScreen}>
              <div style={styles.startIcon}>🎮</div>
              <h2 style={styles.startTitle}>SPACE DODGE</h2>
              <p style={styles.startInstructions}>
                Press SPACE or Click to Jump
              </p>
              <button style={styles.playButton} onClick={startGame}>
                START GAME
              </button>
              {highScore > 0 && (
                <p style={styles.highScoreText}>High Score: {highScore}</p>
              )}
            </div>
          ) : (
            <>
              <div style={styles.scoreDisplay}>
                <span style={styles.scoreLabel}>SCORE</span>
                <span style={styles.scoreValue}>{score}</span>
              </div>
              
              <div style={styles.gameCanvas} onClick={handleJump}>
                {/* Player */}
                <div style={{
                  ...styles.player,
                  top: `${playerY}px`
                }} />

                {/* Obstacles */}
                {obstacles.map(obs => (
                  <React.Fragment key={obs.id}>
                    <div style={{
                      ...styles.obstacle,
                      left: `${obs.x}px`,
                      height: `${obs.height}px`,
                      top: 0
                    }} />
                    <div style={{
                      ...styles.obstacle,
                      left: `${obs.x}px`,
                      height: `${400 - obs.height - 150}px`,
                      bottom: 0
                    }} />
                  </React.Fragment>
                ))}

                {/* Ground line */}
                <div style={styles.ground} />
              </div>

              {gameOver && (
                <div style={styles.gameOverScreen}>
                  <h3 style={styles.gameOverTitle}>GAME OVER!</h3>
                  <p style={styles.gameOverScore}>Score: {score}</p>
                  <p style={styles.gameOverHighScore}>Best: {highScore}</p>
                  <button style={styles.retryButton} onClick={restartGame}>
                    RETRY
                  </button>
                  <button 
                    style={styles.quitButton} 
                    onClick={() => setGameStarted(false)}
                  >
                    QUIT
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={styles.buttonGroup}>
          <Link to="/" style={styles.btnPrimary}>
            <span style={styles.btnIcon}>🏠</span>
            Go Home
          </Link>
          <button style={styles.btnSecondary} onClick={() => navigate(-1)}>
            <span style={styles.btnIcon}>↩</span>
            Go Back
          </button>
        </div>
      </div>

      <style>{keyframes}</style>
    </div>
  );
}

const keyframes = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
    50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
  }
  
  @keyframes gridMove {
    0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
    100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const styles = {
  wrapper: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
    overflow: "hidden",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px"
  },
  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
    `,
    backgroundSize: "50px 50px",
    animation: "gridMove 3s linear infinite",
    opacity: 0.3
  },
  particle: {
    position: "absolute",
    width: "4px",
    height: "4px",
    background: "#3b82f6",
    borderRadius: "50%",
    animation: "float 4s ease-in-out infinite",
    boxShadow: "0 0 10px #3b82f6"
  },
  content: {
    position: "relative",
    zIndex: 10,
    textAlign: "center",
    maxWidth: "900px",
    width: "100%"
  },
  head: {
    fontSize: "clamp(60px, 15vw, 100px)",
    fontWeight: "900",
    margin: "0 0 20px 0",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    letterSpacing: "10px",
    textShadow: "0 0 20px rgba(244, 63, 94, 0.8)"
  },
  number: {
    background: "linear-gradient(180deg, #f43f5e 0%, #be123c 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    filter: "drop-shadow(0 0 20px rgba(244, 63, 94, 0.6))"
  },
  numberMiddle: {
    background: "linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))"
  },
  errorBox: {
    background: "rgba(17, 24, 39, 0.6)",
    border: "2px solid rgba(244, 63, 94, 0.3)",
    borderRadius: "12px",
    padding: "15px 30px",
    marginBottom: "30px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
  },
  errorTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#f43f5e",
    margin: "0 0 8px 0",
    letterSpacing: "2px"
  },
  text: {
    fontSize: "16px",
    color: "#94a3b8",
    margin: 0
  },
  gameContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "800px",
    height: "400px",
    margin: "0 auto 30px",
    background: "rgba(17, 24, 39, 0.8)",
    borderRadius: "16px",
    border: "3px solid rgba(59, 130, 246, 0.3)",
    overflow: "hidden",
    boxShadow: "0 0 40px rgba(59, 130, 246, 0.2), 0 8px 32px rgba(0, 0, 0, 0.5)"
  },
  startScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: "40px"
  },
  startIcon: {
    fontSize: "64px",
    marginBottom: "20px",
    animation: "pulse 2s ease-in-out infinite"
  },
  startTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#3b82f6",
    margin: "0 0 15px 0",
    letterSpacing: "3px",
    textShadow: "0 0 20px rgba(59, 130, 246, 0.6)"
  },
  startInstructions: {
    fontSize: "16px",
    color: "#94a3b8",
    marginBottom: "30px"
  },
  playButton: {
    padding: "15px 50px",
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
    transition: "all 0.3s ease",
    letterSpacing: "2px"
  },
  highScoreText: {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "20px"
  },
  gameCanvas: {
    position: "relative",
    width: "100%",
    height: "100%",
    background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
    overflow: "hidden",
    cursor: "pointer"
  },
  scoreDisplay: {
    position: "absolute",
    top: "20px",
    left: "20px",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  scoreLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600",
    letterSpacing: "1px"
  },
  scoreValue: {
    fontSize: "32px",
    color: "#3b82f6",
    fontWeight: "900",
    textShadow: "0 0 10px rgba(59, 130, 246, 0.8)"
  },
  player: {
    position: "absolute",
    left: "80px",
    width: "30px",
    height: "30px",
    background: "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)",
    borderRadius: "8px",
    boxShadow: "0 0 20px rgba(244, 63, 94, 0.8)",
    transform: "rotate(45deg)",
    transition: "top 0.05s linear"
  },
  obstacle: {
    position: "absolute",
    width: "40px",
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    boxShadow: "0 0 15px rgba(59, 130, 246, 0.6)"
  },
  ground: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "rgba(59, 130, 246, 0.5)"
  },
  gameOverScreen: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(17, 24, 39, 0.95)",
    padding: "40px",
    borderRadius: "16px",
    border: "2px solid rgba(244, 63, 94, 0.5)",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    zIndex: 200
  },
  gameOverTitle: {
    fontSize: "32px",
    color: "#f43f5e",
    margin: "0 0 15px 0",
    fontWeight: "800",
    letterSpacing: "2px"
  },
  gameOverScore: {
    fontSize: "20px",
    color: "#94a3b8",
    margin: "10px 0"
  },
  gameOverHighScore: {
    fontSize: "16px",
    color: "#64748b",
    marginBottom: "25px"
  },
  retryButton: {
    padding: "12px 35px",
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginRight: "10px",
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
    letterSpacing: "1px"
  },
  quitButton: {
    padding: "12px 35px",
    background: "rgba(30, 41, 59, 0.8)",
    color: "#94a3b8",
    border: "2px solid rgba(148, 163, 184, 0.3)",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "1px"
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 30px",
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "white",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "15px",
    border: "2px solid rgba(59, 130, 246, 0.5)",
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    letterSpacing: "1px"
  },
  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 30px",
    background: "rgba(30, 41, 59, 0.8)",
    color: "#94a3b8",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "15px",
    border: "2px solid rgba(148, 163, 184, 0.3)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    letterSpacing: "1px"
  },
  btnIcon: {
    fontSize: "18px"
  }
};


