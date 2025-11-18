// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [animate, setAnimate] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setTimeout(() => setAnimate(true), 80);
  }, []);

  const handleRegister = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!name || !email || !password || !confirm) {
      setErrorMsg("All fields are required");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password should be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await registerUser({ name, email, password });

      setSuccessMsg(res.data?.message || "Registered");

      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.bigGlow}></div>

      <div
        style={{
          ...styles.card,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(25px)",
        }}
      >
        <div style={styles.logoCircle}>🎮</div>
        <h2 style={styles.title}>Create account</h2>
        <p style={styles.sub}>Join Gameland — free & instant play</p>

        {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}
        {successMsg && <div style={styles.successBox}>{successMsg}</div>}

        <div style={styles.inputGroup}>
          <span style={styles.icon}>🙍</span>
          <input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <span style={styles.icon}>📧</span>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <span style={styles.icon}>🔒</span>
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <span style={styles.icon}>🔒</span>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={styles.input}
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={styles.loginBtn}
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p style={styles.bottomText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

//
// SAME PREMIUM STYLES (shared with Login)
//
const styles = {
  wrapper: {
    minHeight: "80vh",
    background: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    position: "relative",
  },


 bigGlow: {
  position: "fixed",
  top: "-40%",
  left: "-30%",
  width: "200%",
  height: "200%",
  background: "radial-gradient(circle, rgba(96,165,250,0.15), transparent 70%)",
  filter: "blur(130px)",
  zIndex: -1,
  pointerEvents: "none",
},

  card: {
    width: "100%",
    maxWidth: "480px",
    background: "rgba(17,25,40,0.65)",
    backdropFilter: "blur(14px)",
    borderRadius: "20px",
    padding: "35px 30px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 35px rgba(59,130,246,0.25)",
    textAlign: "center",
    position: "relative",
    zIndex: 5,
    transition: "all .6s ease",
  },

  logoCircle: {
    width: "72px",
    height: "72px",
    background: "rgba(59,130,246,0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    margin: "0 auto 12px",
  },

  title: { fontSize: "28px", fontWeight: 800, marginBottom: 6 },
  sub: { color: "#cbd5e1", marginBottom: 20 },

  errorBox: {
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#fecaca",
    padding: "8px 12px",
    borderRadius: "8px",
    marginBottom: "12px",
  },

  successBox: {
    background: "rgba(16,185,129,0.12)",
    border: "1px solid rgba(16,185,129,0.3)",
    color: "#bbf7d0",
    padding: "8px 12px",
    borderRadius: "8px",
    marginBottom: "12px",
  },

  inputGroup: { position: "relative", marginBottom: "14px" },
  icon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 18,
    opacity: 0.9,
  },

  input: {
    width: "100%",
    padding: "12px 40px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    fontSize: "15px",
  },

  loginBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg, #3b82f6, #6366f1)",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 600,
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 0 18px rgba(99,102,241,0.45)",
    transition: "0.25s",
  },

  bottomText: { marginTop: "12px", color: "#cbd5e1", fontSize: "14px" },
  link: { color: "#60a5fa", cursor: "pointer", textDecoration: "underline" },
};
