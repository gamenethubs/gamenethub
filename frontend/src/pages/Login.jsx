// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

// GOOGLE AUTH
import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [animate, setAnimate] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(t);
  }, []);

  /***************************
   *  NORMAL LOGIN
   ***************************/
  const handleLogin = async () => {
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({ email, password });

      login(res.data.user, res.data.token);

      navigate("/");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /***************************
   *  GOOGLE LOGIN (SECURE)
   ***************************/
  const handleGoogleSuccess = async (cred) => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: cred.credential, // ⭐ only send the token
        }),
      });

      const json = await res.json();

      if (!json.token) {
        setErrorMsg(json.message || "Google login failed");
        return;
      }

      login(json.user, json.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrorMsg("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrorMsg("Google login failed. Try again.");
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
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.sub}>Sign in to continue</p>

        {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}
        {successMsg && <div style={styles.successBox}>{successMsg}</div>}

        {/* GOOGLE LOGIN BUTTON */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        {/* OR */}
        <div style={styles.splitBox}>
          <div style={styles.line}></div>
          <span style={styles.orText}>OR</span>
          <div style={styles.line}></div>
        </div>

        {/* INPUT FIELDS */}
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
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <span style={styles.showBtn} onClick={() => setShowPass(!showPass)}>
            {showPass ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={styles.loginBtn}
        >
          {loading ? "Loading…" : "Login"}
        </button>

        <p style={styles.bottomText}>
          New here?{" "}
          <span style={styles.link} onClick={() => navigate("/register")}>
            Create account
          </span>
        </p>
      </div>
    </div>
  );
}

// -------- PREMIUM UI STYLES --------
//
const styles = {
  wrapper: {
    minHeight: "calc(100vh - 70px)",
    background: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
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
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(17,25,40,0.65)",
    backdropFilter: "blur(14px)",
    borderRadius: "20px",
    padding: "35px 30px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 35px rgba(59,130,246,0.25)",
    textAlign: "center",
    position: "relative",
    zIndex: 5,
  },

  splitBox: {
    margin: "18px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  line: {
    height: 1,
    width: "40%",
    background: "rgba(255,255,255,0.15)",
  },

  orText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: 500,
  },

  logoCircle: {
    width: "75px",
    height: "75px",
    background: "rgba(59,130,246,0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    margin: "0 auto 12px",
  },

  title: { fontSize: "32px", fontWeight: 800, marginBottom: "6px" },
  sub: { color: "#cbd5e1", marginBottom: "25px" },

  errorBox: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    color: "#fca5a5",
    padding: "8px 12px",
    borderRadius: "8px",
    marginBottom: "14px",
    fontSize: "14px",
  },

  successBox: {
    background: "rgba(16,185,129,0.12)",
    border: "1px solid rgba(16,185,129,0.3)",
    color: "#bbf7d0",
    padding: "8px 12px",
    borderRadius: "8px",
    marginBottom: "14px",
    fontSize: "14px",
  },

  inputGroup: { position: "relative", marginBottom: "18px" },

  icon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "18px",
    opacity: 0.8,
  },

  showBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    opacity: 0.75,
    fontSize: "18px",
  },

  input: {
    width: "100%",
    padding: "12px 40px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
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
  },

  bottomText: { marginTop: "15px", color: "#cbd5e1", fontSize: "14px" },

  link: { color: "#60a5fa", cursor: "pointer", textDecoration: "underline" },
};
