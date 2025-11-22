// src/pages/Terms.jsx
import React from "react";

export default function Terms() {
  return (
    <div style={styles.wrapper}>
      {/* Floating neon grid */}
      <div style={styles.grid}></div>

      {/* Frosted glass card */}
      <div style={styles.card}>
        <h1 style={styles.title}>Terms & Conditions</h1>

        <p style={styles.text}>
          Welcome to <b>GamenetHub.com</b>. These Terms & Conditions (“Terms”) govern
          your use of our website. By accessing or using GamenetHub, you agree
          to be bound by these Terms. If you do not agree, please do not use
          our site.
        </p>

        <h2 style={styles.subtitle}>1. Use of the Website</h2>
        <p style={styles.text}>
          You agree to use the website only for lawful purposes. You must not
          upload, post, or distribute any illegal, harmful, or objectionable
          content. You are responsible for ensuring that any content you access
          is appropriate for you.
        </p>

        <h2 style={styles.subtitle}>2. Intellectual Property</h2>
        <p style={styles.text}>
          All content on GamenetHub (text, images, graphics, logos, and games)
          is owned by or licensed to us. You may not copy, reproduce, modify, or
          distribute any content from the site without prior written permission.
        </p>

        <h2 style={styles.subtitle}>3. User Conduct</h2>
        <p style={styles.text}>
          You must not disrupt or attempt to interfere with website operations.
          Use of bots, scrapers, data-mining tools, or unauthorized access
          attempts is strictly prohibited.
        </p>

        <h2 style={styles.subtitle}>4. Advertisements</h2>
        <p style={styles.text}>
          GamenetHub may display third-party ads (including Google AdSense). By
          using the site, you understand that advertisers may use cookies to
          deliver personalized ads. We are not responsible for the accuracy or
          reliability of these ads.
        </p>

        <h2 style={styles.subtitle}>5. Disclaimers</h2>
        <p style={styles.text}>
          All games and content are provided “as is.” We do not guarantee error-free
          performance, uninterrupted access, or protection from harmful code.
          Your use of the site is at your own risk.
        </p>

        <h2 style={styles.subtitle}>6. Limitation of Liability</h2>
        <p style={styles.text}>
          To the maximum extent permitted by law, GamenetHub and its affiliates
          are not liable for any direct, indirect, incidental, or special
          damages arising from your use of the website.
        </p>

        <h2 style={styles.subtitle}>7. Termination</h2>
        <p style={styles.text}>
          We may suspend or terminate your access at any time, without notice,
          for any reason. Upon termination, your right to use the site
          immediately ends.
        </p>

        <h2 style={styles.subtitle}>8. Changes to Terms</h2>
        <p style={styles.text}>
          We may update these Terms at any time. Continued use of the website
          means you accept all updated versions.
        </p>

        <h2 style={styles.subtitle}>9. Governing Law</h2>
        <p style={styles.text}>
          These Terms are governed by the laws of India. Any disputes will be
          handled under the jurisdiction of Indian courts.
        </p>

        <h2 style={styles.subtitle}>10. Contact</h2>
        <p style={styles.text}>
          If you have any questions regarding these Terms, feel free to contact
          us:
        </p>

        <p style={styles.text}>
          <b>Email:</b> <a style={styles.a} href="mailto:gamenethubs@gmail.com">gamenethubs@gmail.com</a>
        </p>
      </div>

      {/* floating neon elements */}
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

  title: {
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 18,
    color: "#67e8f9",
  },

  subtitle: {
    fontSize: 20,
    fontWeight: 700,
    marginTop: 22,
    marginBottom: 10,
    color: "#fff",
  },

  text: {
    color: "#cdd7f5",
    lineHeight: 1.7,
    marginBottom: 16,
    fontSize: "15px",
  },

  a: {
    color: "#67e8f9",
    fontWeight: "bold",
  },

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

/* ✅ inject shared keyframes */
const keyframes = `
@keyframes gridMove {
  from { background-position: 0 0; }
  to { background-position: 100px 100px; }
}

@keyframes floatOrb {
  0% { transform: translate(0,0); }
  50% { transform: translate(20px, -20px); }
  100% { transform: translate(0,0); }
}

@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
`;

const styleTag = document.createElement("style");
styleTag.innerHTML = keyframes;
document.head.appendChild(styleTag);
