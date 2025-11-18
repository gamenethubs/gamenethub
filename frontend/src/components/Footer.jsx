// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.brandCol}>
          <div style={styles.brandRow}>
            <div style={styles.logo}>🎮</div>
            <div>
              <div style={styles.brandTitle}>Gameland</div>
              <div style={styles.brandSubtitle}>Play browser games, rate & enjoy.</div>
            </div>
          </div>

          <div style={styles.copy}>© {year} Gameland. All rights reserved.</div>
        </div>

        <div style={styles.linksCol}>
          <div style={styles.linksGroup}>
            <div style={styles.groupTitle}>Explore</div>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/categories" style={styles.link}>Categories</Link>
            <Link to="/games" style={styles.link}>Games</Link>
          </div>

          <div style={styles.linksGroup}>
            <div style={styles.groupTitle}>Company</div>
            <a href="#" style={styles.link}>About</a>
            <a href="#" style={styles.link}>Contact</a>
            <a href="#" style={styles.link}>Games</a>
          </div>
        </div>

        <div style={styles.actionsCol}>
          <div style={styles.newsTitle}>Stay updated</div>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={styles.newsForm}
            aria-label="Subscribe to newsletter"
          >
            <input
              type="email"
              placeholder="Your email"
              style={styles.input}
              aria-label="Email address"
            />
            <button type="submit" style={styles.subscribeBtn}>Subscribe</button>
          </form>

          <div style={styles.socialRow} aria-hidden>
            <IconCircle>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M22 4.01c-.77.35-1.6.59-2.47.69a4.26 4.26 0 0 0-7.27 3v.44A12.08 12.08 0 0 1 3.15 3.16a4.23 4.23 0 0 0-.58 2.15c0 1.5.76 2.82 1.92 3.6a4.21 4.21 0 0 1-1.92-.54v.05c0 2.08 1.48 3.82 3.45 4.22a4.25 4.25 0 0 1-1.9.07c.54 1.67 2.08 2.88 3.92 2.91A8.5 8.5 0 0 1 2 19.54a12 12 0 0 0 6.5 1.9c7.79 0 12.06-6.45 12.06-12.05v-.55A8.72 8.72 0 0 0 22 4.01z" fill="#9fd0ff"/>
              </svg>
            </IconCircle>

            <IconCircle>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 2.86 8.16 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.26-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.28.1-2.67 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.8c.85.004 1.71.115 2.51.34 1.9-1.29 2.74-1.02 2.74-1.02.55 1.39.2 2.41.1 2.67.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.67-4.57 4.93.36.31.68.91.68 1.84 0 1.33-.01 2.4-.01 2.73 0 .26.18.58.69.48A9.96 9.96 0 0 0 21.96 12c0-5.5-4.46-9.96-9.96-9.96z" fill="#9fd0ff"/>
              </svg>
            </IconCircle>

            <IconCircle>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 7.5a4.5 4.5 0 0 1-1.3.36 2.28 2.28 0 0 0 .98-1.26 4.49 4.49 0 0 1-1.44.55A2.24 2.24 0 0 0 12 9.45a6.34 6.34 0 0 1-4.6-2.33 2.25 2.25 0 0 0 .7 3.01 2.22 2.22 0 0 1-1.02-.28v.03c0 1.07.76 1.96 1.76 2.16a2.24 2.24 0 0 1-1.01.04 2.24 2.24 0 0 0 2.09 1.56A4.5 4.5 0 0 1 3 17.54a6.29 6.29 0 0 0 3.42.99c4.11 0 6.36-3.4 6.36-6.36v-.29A4.53 4.53 0 0 0 21 7.5z" fill="#9fd0ff"/>
              </svg>
            </IconCircle>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Small helper component for circular icon background */
function IconCircle({ children }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 34,
      height: 34,
      borderRadius: 10,
      background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
      boxShadow: "inset 0 -2px 8px rgba(2,6,23,0.6)",
      marginRight: 8,
    }}>
      {children}
    </span>
  );
}

const styles = {
  footer: {
    width: "100%",
    background: "linear-gradient(180deg, rgba(8,14,22,0.95), rgba(7,10,16,0.98))",
    borderTop: "1px solid rgba(255,255,255,0.02)",
    padding: "28px 20px",
    color: "#e6f0ff",
    boxSizing: "border-box",
  },
  container: {
    maxWidth: 1350,
    margin: "0 auto",
    display: "flex",
    gap: 24,
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },

  brandCol: {
    minWidth: 220,
    flex: "1 1 280px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  brandRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 10,
    background: "linear-gradient(135deg,#5b21b6,#06b6d4)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    boxShadow: "0 6px 20px rgba(8,16,40,0.6)",
  },
  brandTitle: {
    fontWeight: 800,
    fontSize: 16,
    color: "#fff",
  },
  brandSubtitle: {
    fontSize: 13,
    color: "#9fb7d9",
  },
  copy: {
    fontSize: 13,
    color: "#9fb7d9",
    marginTop: 6,
  },

  linksCol: {
    display: "flex",
    gap: 36,
    flex: "1 1 340px",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  linksGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  groupTitle: {
    color: "#cfe8ff",
    fontWeight: 700,
    marginBottom: 6,
  },
  link: {
    color: "#9fd0ff",
    textDecoration: "none",
    fontSize: 14,
  },

  actionsCol: {
    flex: "1 1 260px",
    minWidth: 220,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "flex-end",
  },
  newsTitle: {
    color: "#cfe8ff",
    fontWeight: 700,
  },
  newsForm: {
    display: "flex",
    gap: 8,
    marginTop: 6,
    width: "100%",
    maxWidth: 320,
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.04)",
    background: "rgba(255,255,255,0.02)",
    color: "#e6f0ff",
    outline: "none",
    fontSize: 14,
  },
  subscribeBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    background: "linear-gradient(180deg, #60a5fa, #2563eb)",
    border: "none",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(37,99,235,0.18)",
  },
  socialRow: {
    display: "flex",
    gap: 8,
    marginTop: 10,
  },

  /* Responsive tweaks */
  "@media (max-width: 860px)": {
    actionsCol: {
      alignItems: "flex-start",
      width: "100%",
      marginTop: 8,
    },
  }, 
};
