// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [animate, setAnimate] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleAdminLogin = async () => {
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({ email, password });

      if (res.data.user.role !== "admin") {
        setErrorMsg("Access denied — Not an admin account");
        return;
      }

      login(res.data.user, res.data.token);
      navigate("/admin/dashboard");

    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed");
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
        <div style={styles.logoCircle}>🛠️</div>
        <h2 style={styles.title}>Admin Panel</h2>
        <p style={styles.sub}>Restricted Access</p>

        {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}

        {/* INPUT EMAIL */}
        <div style={styles.inputGroup}>
          <span style={styles.icon}>📧</span>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* INPUT PASSWORD */}
        <div style={styles.inputGroup}>
          <span style={styles.icon}>🔒</span>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <span style={styles.showBtn} onClick={() => setShowPass(!showPass)}>
            {showPass ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          onClick={handleAdminLogin}
          disabled={loading}
          style={styles.loginBtn}
        >
          {loading ? "Verifying…" : "Login as Admin"}
        </button>
      </div>
    </div>
  );
}

// -------- ADMIN PREMIUM UI STYLES --------
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
    background: "radial-gradient(circle, rgba(239,68,68,0.2), transparent 70%)",
    filter: "blur(140px)",
    zIndex: -1,
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(17,25,40,0.60)",
    backdropFilter: "blur(14px)",
    borderRadius: "20px",
    padding: "35px 30px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 40px rgba(239,68,68,0.25)",
    textAlign: "center",
    position: "relative",
    zIndex: 5,
  },

  logoCircle: {
    width: "75px",
    height: "75px",
    background: "rgba(239,68,68,0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "34px",
    margin: "0 auto 12px",
  },

  title: { fontSize: "32px", fontWeight: 800, marginBottom: "6px" },
  sub: { color: "#fca5a5", marginBottom: "25px" },

  errorBox: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    color: "#fca5a5",
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
    opacity: 0.85,
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
    background: "linear-gradient(90deg, #ef4444, #dc2626)",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 600,
    borderRadius: "12px",
    cursor: "pointer",
    marginTop: "5px",
  },
};
