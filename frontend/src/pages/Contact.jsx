// src/pages/Contact.jsx
import React, { useState } from "react";

// export default function Contact() {
//   const [hover, setHover] = useState(false);
export default function Contact() {
  const [hover, setHover] = useState(false);

  // 🔵 Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

 const apiBaseURL = process.env.REACT_APP_API_BASE;
    // const apiBaseURL = "http://localhost:5000";
// your backend URL
    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      const res = await fetch(`${apiBaseURL}/api/contact/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (data.success) {
        setResponseMsg("Message sent successfully! 💙");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setResponseMsg(data.message || "Failed to send message");
      }
    } catch (err) {
      setResponseMsg("Server error! Try again.");
    }

    setLoading(false);
  };



  return (
    <div style={styles.wrapper}>
      {/* 🔵 Floating Grid Background */}
      <div style={styles.grid}></div>

      {/* ⭐ Neon Floating Contact Card */}
      <div
        style={{
          ...styles.card,
          transform: hover ? "translateY(-6px) rotateX(6deg)" : "translateY(0)",
          boxShadow: hover
            ? "0 0 45px rgba(0,255,255,0.55), inset 0 0 40px rgba(0,120,255,0.35)"
            : "0 0 30px rgba(0,180,255,0.25)",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >

        {/* Hologram Header */}
        <h1 style={styles.title}>Contact Us</h1>
        <p style={styles.subtitle}>We’d love to hear from you!</p>

        {/* Neon Form */}
        {/* <form style={styles.form}>
          <input type="text" placeholder="Your Name" style={styles.input} />
          <input type="email" placeholder="Your Email" style={styles.input} />
          <textarea placeholder="Message..." style={styles.textarea}></textarea>

          <button type="submit" style={styles.btn}>
            <span style={styles.btnGlow}></span>
            Send Message
          </button>
        </form> */}
        <form style={styles.form} onSubmit={handleSubmit}>
  <input
    type="text"
    placeholder="Your Name"
    style={styles.input}
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

  <input
    type="email"
    placeholder="Your Email"
    style={styles.input}
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  <textarea
    placeholder="Message..."
    style={styles.textarea}
    value={message}
    onChange={(e) => setMessage(e.target.value)}
  />

  <button type="submit" style={styles.btn} disabled={loading}>
    <span style={styles.btnGlow}></span>
    {loading ? "Sending..." : "Send Message"}
  </button>

  {/* Response Message */}
  {responseMsg && (
    <p style={{ color: "#67e8f9", textAlign: "center", marginTop: 10 }}>
      {responseMsg}
    </p>
  )}
</form>

      </div>

      {/* Floating Neon elements */}
      <div style={styles.neonOrb1}></div>
      <div style={styles.neonOrb2}></div>

      {/* scan-line animation */}
      <div style={styles.scanline}></div>
    </div>
  );
}

/* ------------------------------------------------------------ */
/*                       STYLES                                 */
/* ------------------------------------------------------------ */

const styles = {
  wrapper: {
    width: "100%",
    minHeight: "100vh",
    background: "#030616",
    position: "relative",
    overflow: "hidden",
    padding: "40px 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ⚡ Neon Grid Background */
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
    maxWidth: 460,
    background: "rgba(10,15,25,0.55)",
    padding: "35px 28px",
    borderRadius: 20,
    backdropFilter: "blur(10px)",
    border: "2px solid rgba(0,255,255,0.18)",
    transition: "0.4s ease",
    position: "relative",
    zIndex: 10,
  },

  title: {
    textAlign: "center",
    color: "#67e8f9",
    fontSize: "32px",
    fontWeight: 800,
    textShadow: "0 0 15px #00f2ff",
    letterSpacing: 1,
    marginBottom: 4,
  },

  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    color: "#c3e6ffcc",
    marginBottom: 30,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  input: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(0,255,255,0.25)",
    background: "rgba(255,255,255,0.04)",
    color: "#e2fefe",
    fontSize: 15,
    outline: "none",
    transition: "0.25s",
    boxShadow: "0 0 8px rgba(0,255,255,0.25)",
  },

  textarea: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(0,255,255,0.25)",
    background: "rgba(255,255,255,0.04)",
    color: "#e2fefe",
    fontSize: 15,
    outline: "none",
    minHeight: 120,
    resize: "none",
    transition: "0.25s",
    boxShadow: "0 0 8px rgba(0,255,255,0.25)",
  },

  btn: {
    marginTop: 10,
    background:
      "linear-gradient(90deg, #06b6d4, #2563eb, #06b6d4)",
    padding: "14px 0",
    borderRadius: 12,
    border: "none",
    color: "white",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    textShadow: "0 0 10px #00d0ff",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 0 22px rgba(0,180,255,0.55)",
  },

  btnGlow: {
    position: "absolute",
    left: "-50%",
    top: 0,
    width: "200%",
    height: "100%",
    background:
      "linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent)",
    animation: "btnShine 2.2s infinite",
  },

  /* Floating Orbs */
  neonOrb1: {
    position: "absolute",
    width: 140,
    height: 140,
    background: "radial-gradient(circle, #00eaff, #0066ff77, transparent)",
    borderRadius: "50%",
    top: "10%",
    left: "10%",
    filter: "blur(20px)",
    animation: "floatOrb 6s ease-in-out infinite",
  },

  neonOrb2: {
    position: "absolute",
    width: 180,
    height: 180,
    background: "radial-gradient(circle, #ff00ff, #9900ff77, transparent)",
    borderRadius: "50%",
    bottom: "8%",
    right: "8%",
    filter: "blur(25px)",
    animation: "floatOrb 8s ease-in-out infinite reverse",
  },

  /* CRT scanline */
  scanline: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, transparent, rgba(255,255,255,0.03), transparent)",
    animation: "scan 3s linear infinite",
    pointerEvents: "none",
  },
};

/* ------------------------------------------------------------ */
/* KEYFRAMES (add globally - safe inside this file) */
/* ------------------------------------------------------------ */

const globalKeyframes = `
@keyframes gridMove {
  from { background-position: 0 0; }
  to { background-position: 100px 100px; }
}

@keyframes btnShine {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
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

// Inject keyframes
const sheet = document.createElement("style");
sheet.innerHTML = globalKeyframes;
document.head.appendChild(sheet);
