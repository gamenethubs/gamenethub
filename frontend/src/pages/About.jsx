// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.grid}></div>

      <div style={styles.card}>
        <h1 style={styles.title}>About GamenetHub</h1>

        <p style={styles.text}>
          Welcome to <b>GamenetHub.com</b> — your trusted hub for high-quality HTML5 web
          games crafted for players of all ages. We bring you a dynamic and
          ever-expanding library of fun, interactive, and mobile-friendly games
          that run instantly on any browser — no downloads, no installations,
          just pure gaming.
        </p>

        <p style={styles.text}>
          <b>At GamenetHub.com, our mission is simple:</b> <br />
          ✔ Offer a smooth, fast, and distraction-free gaming experience <br />
          ✔ Provide 100% free-to-play HTML5 games that work on all devices <br />
          ✔ Make online gaming safe, accessible, and enjoyable for everyone <br />
          ✔ Deliver new, curated games every week <br />
        </p>

        <p style={styles.text}>
          Whether you're here for action, puzzles, racing, shooting, sports,
          adventure, or relaxing casual games, <b>GamenetHub.com</b> is designed to
          give you endless entertainment with zero hassle.
        </p>

        <h2 style={styles.subtitle}>🎮 Why Choose GamenetHub.com?</h2>

        <p style={styles.text}>
          ⚡ <b>Lightning-Fast Loading</b> — Games load instantly without lag — even on slow networks. <br />
          📱 <b>Play on Any Device</b> — Modern HTML5 tech makes every game fully responsive on mobile, tablet, or desktop. <br />
          🛡 <b>Safe & Secure</b> — All games are screened to ensure smooth performance with no harmful scripts. <br />
          ✨ <b>Zero Downloads Needed</b> — Just open your browser and start playing. No storage required. <br />
          🎯 <b>Curated for Quality</b> — Handpicked games that are fun, engaging, and easy for all ages. <br />
          🔄 <b>Regular Updates</b> — New games are added frequently so there’s always something fresh to enjoy. <br />
        </p>

        <h2 style={styles.subtitle}>Get in Touch</h2>

        <p style={styles.text}>
          Have a suggestion, game request, or partnership idea? We're always open
          to feedback and collaboration! Thank you for being a part of the
          <b> GamenetHub community</b>. Enjoy gaming the smart way! 🎮✨
        </p>

        <p style={{ ...styles.text, marginTop: 10 }}>
          <b>Email ID:</b> <a style={styles.a} href="mailto:gamenethubs@gmail.com">gamenethubs@gmail.com</a>
        </p>
      </div>

      <div style={styles.neonOrb1}></div>
      <div style={styles.neonOrb2}></div>
      <div style={styles.scanline}></div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    minHeight: "100vh",
    background: "#030616",
    position: "relative",
    overflow: "hidden",
    padding: "40px 16px",
    display: "flex",
    justifyContent: "center",
  },

  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(#00f2ff22 1px, transparent 1px), linear-gradient(90deg, #00f2ff22 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    animation: "gridMove 12s linear infinite",
  },

  card: {
    width: "100%",
    maxWidth: 900,
    background: "rgba(10,15,25,0.55)",
    padding: "28px",
    borderRadius: 20,
    border: "2px solid rgba(0,255,255,0.18)",
    backdropFilter: "blur(10px)",
    position: "relative",
    zIndex: 5,
    color: "#e6f0ff",
  },

  title: { fontSize: 28, fontWeight: 800, marginBottom: 18, color: "#67e8f9" },
  subtitle: { fontSize: 20, fontWeight: 700, marginTop: 20, marginBottom: 10 },
  text: { color: "#cdd7f5", lineHeight: 1.7, marginBottom: 14, fontSize: 15 },
  a: { color: "#67e8f9", fontWeight: "bold" },

  neonOrb1: {
    position: "absolute",
    width: 140,
    height: 140,
    background: "radial-gradient(circle, #00eaff, #0066ff77, transparent)",
    borderRadius: "50%",
    top: "8%",
    left: "10%",
    filter: "blur(22px)",
    animation: "floatOrb 6s ease-in-out infinite",
  },

  neonOrb2: {
    position: "absolute",
    width: 180,
    height: 180,
    background: "radial-gradient(circle, #ff00ff, #9900ff77, transparent)",
    borderRadius: "50%",
    bottom: "10%",
    right: "8%",
    filter: "blur(26px)",
    animation: "floatOrb 8s ease-in-out infinite reverse",
  },

  scanline: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, transparent, rgba(255,255,255,0.04), transparent)",
    animation: "scan 3s linear infinite",
    pointerEvents: "none",
  },
};
