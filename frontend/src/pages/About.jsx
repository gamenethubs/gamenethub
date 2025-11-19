// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div style={styles.page}>
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
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    padding: "40px 16px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 900,
    background: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#e6f0ff",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "28px",
    fontWeight: 800,
    marginBottom: 18,
  },
  subtitle: {
    fontSize: "20px",
    fontWeight: 700,
    marginTop: 20,
    marginBottom: 10,
    color: "#fff",
  },
  text: {
    color: "#cdd7f5",
    lineHeight: 1.7,
    marginBottom: 14,
    fontSize: "15px",
  },
  a:{
    color: "#ffffffff",
    fontWeight: "bold",
  },

  // Mobile responsive
  "@media (max-width: 480px)": {
    title: { fontSize: "22px" },
    subtitle: { fontSize: "18px" },
    card: { padding: "18px" },
    text: { fontSize: "14px" },
  },
};
