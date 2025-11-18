// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BREAKPOINT = 900;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= BREAKPOINT : false
  );
  const [open, setOpen] = useState(false); // mobile menu
  const [menuOpen, setMenuOpen] = useState(false); // profile dropdown
  const dropdownRef = useRef(null);
  const avatarBtnRef = useRef(null);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // close dropdown on outside click or ESC
  useEffect(() => {
    function handleDocClick(e) {
      if (
        menuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        avatarBtnRef.current &&
        !avatarBtnRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [menuOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/categories", label: "Categories" },
    ...(user ? [{ to: "/profile", label: "Profile" }] : []),
  ];

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  // ---------- avatar / name helpers ----------
  const getDisplayName = () => {
    if (!user) return "";
    if (user.name) return user.name;
    if (user.email) return user.email.split("@")[0];
    return "User";
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // treat user presence as "online" for UI (replace with real status if available)
  const isOnline = !!user;

  function Avatar({ size = 40 }) {
    const name = getDisplayName();
    const pic = user?.picture || user?.avatar || null;
    const avatarStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: Math.round(size / 2.6),
      color: "#07204a",
      background: "linear-gradient(90deg,#a5f3fc,#60a5fa)",
      overflow: "hidden",
      flexShrink: 0,
      boxShadow: "0 6px 18px rgba(2,6,23,0.6)",
    };

    if (pic) {
      return (
        <img
          src={pic}
          alt={name}
          style={{
            ...avatarStyle,
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.style.display = "none";
          }}
        />
      );
    }

    return <div style={avatarStyle}>{getInitials(name)}</div>;
  }

  return (
    <header style={styles.header}>
      {/* small style tag for the status-dot pulse */}
      <style>{`
        @keyframes pulseDot {
          0% { box-shadow: 0 0 0 0 rgba(96,165,250,0.28); }
          70% { box-shadow: 0 0 0 8px rgba(96,165,250,0); }
          100% { box-shadow: 0 0 0 0 rgba(96,165,250,0); }
        }
      `}</style>

      <nav style={styles.nav}>
        {/* LEFT */}
        <div style={styles.left}>
          <Link to="/" style={styles.brand}>
            <span style={styles.logoEmoji}>🎮</span>
            <span style={styles.brandText}>Gameland</span>
          </Link>
        </div>

        {/* CENTER (desktop) */}
        <div style={{ ...styles.center, display: isMobile ? "none" : "flex" }}>
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                ...styles.link,
                ...(location.pathname === l.to ? styles.linkActive : {}),
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* RIGHT (desktop) */}
        <div style={styles.right}>
          {!isMobile && (
            <>
              {!user ? (
                <>
                  <Link to="/login" style={styles.btnLogin}>
                    Login
                  </Link>
                  <Link to="/register" style={styles.btnRegister}>
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <div style={styles.userBox} title={getDisplayName()}>
                    {/* avatar + greeting inline */}
                    <button
                      ref={avatarBtnRef}
                      onClick={() => setMenuOpen((s) => !s)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setMenuOpen((s) => !s);
                        }
                      }}
                      aria-expanded={menuOpen}
                      aria-haspopup="true"
                      style={styles.avatarButton}
                    >
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <Avatar size={40} />
                        {/* status dot */}
                        <span
                          aria-hidden
                          style={{
                            position: "absolute",
                            right: -2,
                            bottom: -2,
                            width: 12,
                            height: 12,
                            borderRadius: 12,
                            border: "2px solid rgba(7,10,16,0.9)",
                            background: isOnline ? "#60a5fa" : "#334155",
                            boxShadow: isOnline ? "0 0 0 0 rgba(96,165,250,0.32)" : "none",
                            animation: isOnline ? "pulseDot 1.8s infinite" : "none",
                          }}
                        />
                      </div>
                    </button>

                    <span style={styles.userNameText}>Hello, {getDisplayName()}</span>
                  </div>

                  <div style={{ position: "relative" }}>
                    {/* dropdown with nice animation */}
                    <div
                      ref={dropdownRef}
                      style={{
                        ...styles.dropdown,
                        opacity: menuOpen ? 1 : 0,
                        transform: menuOpen
                          ? "translateY(6px) scale(1)"
                          : "translateY(0px) scale(0.98)",
                        pointerEvents: menuOpen ? "auto" : "none",
                      }}
                      role="menu"
                      aria-hidden={!menuOpen}
                    >
                      {/* profile header */}
                      <div style={styles.dropdownHeader}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <Avatar size={52} />
                          <div style={{ minWidth: 0 }}>
                            <div style={styles.dropName}>{getDisplayName()}</div>
                            <div style={styles.dropEmail}>
                              {user?.email ? user.email : "No email"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={styles.dropdownDivider} />

                      {/* quick links */}
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        style={styles.dropdownItem}
                        role="menuitem"
                      >
                        View profile
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setMenuOpen(false)}
                        style={styles.dropdownItem}
                        role="menuitem"
                      >
                        Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        style={{ ...styles.dropdownItem, border: "none", width: "100%" }}
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* MOBILE HAMBURGER */}
          {isMobile && (
            <div style={styles.right}>
              <button
                onClick={() => setOpen(!open)}
                style={{
                  ...styles.hamburgerBtn,
                  ...(open ? styles.hamburgerBtnActive : {}),
                }}
                aria-expanded={open}
                aria-label="Toggle menu"
              >
                <span
                  style={{
                    ...styles.hamburgerBar,
                    ...(open ? styles.bar1Active : {}),
                  }}
                />
                <span
                  style={{
                    ...styles.hamburgerBar,
                    ...(open ? styles.bar2Active : {}),
                  }}
                />
                <span
                  style={{
                    ...styles.hamburgerBar,
                    ...(open ? styles.bar3Active : {}),
                  }}
                />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobile && (
        <div
          style={{
            ...styles.mobileMenu,
            transform: open ? "translateY(0)" : "translateY(-8px)",
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
          }}
        >
          <div style={styles.mobileInner}>
            {/* show avatar + name on top of mobile menu */}
            {user && (
              <div style={styles.mobileProfileRow}>
                <div style={{ position: "relative" }}>
                  <Avatar size={44} />
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      right: -2,
                      bottom: -2,
                      width: 10,
                      height: 10,
                      borderRadius: 10,
                      border: "2px solid rgba(7,10,16,0.9)",
                      background: isOnline ? "#60a5fa" : "#334155",
                    }}
                  />
                </div>

                <div style={{ marginLeft: 12 }}>
                  <div style={{ fontSize: 14, color: "#cfe8ff", fontWeight: 700 }}>
                    {getDisplayName()}
                  </div>
                  <div style={{ fontSize: 12, color: "#9fb7d9" }}>Welcome back</div>
                </div>
              </div>
            )}

            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                style={{
                  ...styles.mobileLink,
                  ...(location.pathname === l.to ? styles.mobileLinkActive : {}),
                }}
              >
                {l.label}
              </Link>
            ))}

            {!user && (
              <>
                <Link to="/login" onClick={() => setOpen(false)} style={styles.mobileLink}>
                  Login
                </Link>

                <Link to="/register" onClick={() => setOpen(false)} style={styles.mobileLink}>
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} style={styles.mobileLink}>
                  Profile
                </Link>
                <Link to="/settings" onClick={() => setOpen(false)} style={styles.mobileLink}>
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  style={{ ...styles.mobileLink, border: "none", textAlign: "left", background: "transparent" }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// ---------- styles
const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 60,
    width: "100%",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    background:
      "linear-gradient(180deg, rgba(10,18,28,0.45) 0%, rgba(7,10,16,0.25) 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
  },
  nav: {
    maxWidth: 1350,
    margin: "0 auto",
    padding: "12px 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  left: { display: "flex", alignItems: "center", gap: 12 },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "#fff",
  },
  logoEmoji: { fontSize: 20, transform: "translateY(1px)" },
  brandText: {
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: 0.4,
    color: "#e6f0ff",
  },

  center: {
    display: "flex",
    gap: 22,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    justifyContent: "flex-end",
  },

  link: {
    color: "#bfe0ff",
    textDecoration: "none",
    fontSize: 14,
    padding: "8px 10px",
    borderRadius: 8,
    transition: "all 160ms ease",
  },
  linkActive: {
    color: "#fff",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
    boxShadow: "0 6px 18px rgba(59,130,246,0.12)",
  },

  // ---------- buttons ----------
  btnLogin: {
    padding: "8px 18px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#dbeafe",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: 14,
    boxShadow: "0 0 18px rgba(59,130,246,0.15)",
    transition: "all 200ms ease",
  },

  btnRegister: {
    padding: "8px 20px",
    borderRadius: 10,
    background: "linear-gradient(90deg, #3b82f6, #6366f1)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    textDecoration: "none",
    border: "none",
    boxShadow: "0 0 20px rgba(99,102,241,0.45)",
    transition: "all 200ms ease",
  },

  // ---------- USER (desktop inline) ----------
  userBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "6px 12px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,0.04)",
    boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
  },

  avatarButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    borderRadius: 999,
  },

  userNameText: {
    fontSize: 15,
    fontWeight: 700,
    color: "#e6f0ff",
    whiteSpace: "nowrap",
    opacity: 0.98,
  },

  // ---------- dropdown ----------
  dropdown: {
    position: "absolute",
    right: 0,
    marginTop: 8,
    minWidth: 220,
    background: "#071224",
    borderRadius: 12,
    padding: 10,
    boxShadow: "0 12px 40px rgba(2,6,23,0.6)",
    border: "1px solid rgba(255,255,255,0.04)",
    transition: "all 180ms cubic-bezier(.2,.9,.2,1)",
    zIndex: 120,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    transformOrigin: "top right",
  },

  dropdownHeader: {
    padding: 6,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  dropName: {
    fontSize: 15,
    fontWeight: 800,
    color: "#e6f0ff",
  },

  dropEmail: {
    fontSize: 13,
    color: "#9fb7d9",
    marginTop: 2,
  },

  dropdownDivider: {
    height: 1,
    background: "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    borderRadius: 2,
    margin: "6px 0",
  },

  dropdownItem: {
    padding: "8px 10px",
    borderRadius: 8,
    textDecoration: "none",
    color: "#cfe8ff",
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },

  // ---------- HAMBURGER ----------
  hamburgerBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    width: 44,
    height: 36,
    borderRadius: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 6,
    transition: "transform 180ms ease",
  },
  hamburgerBtnActive: { transform: "scale(0.98)" },

  hamburgerBar: {
    display: "block",
    width: 20,
    height: 2,
    borderRadius: 2,
    background: "linear-gradient(90deg, #93c5fd, #60a5fa)",
    transition: "all 220ms ease",
  },
  bar1Active: { transform: "translateY(6px) rotate(45deg)" },
  bar2Active: { opacity: 0, transform: "scaleX(0.6)" },
  bar3Active: { transform: "translateY(-6px) rotate(-45deg)" },

  // ---------- MOBILE MENU ----------
  mobileMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "100%",
    background:
      "linear-gradient(180deg, rgba(8,14,22,0.95), rgba(7,10,16,0.98))",
    borderTop: "1px solid rgba(255,255,255,0.02)",
    boxShadow: "0 10px 40px rgba(2,6,23,0.6)",
    transition: "opacity 200ms ease, transform 200ms ease",
    zIndex: 55,
  },
  mobileInner: {
    maxWidth: 1350,
    margin: "10px auto",
    padding: "12px 22px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  mobileProfileRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    paddingBottom: 6,
    borderBottom: "1px solid rgba(255,255,255,0.02)",
    marginBottom: 10,
  },
  mobileLink: {
    display: "inline-block",
    padding: "12px 14px",
    borderRadius: 10,
    textDecoration: "none",
    color: "#e6f0ff",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    fontWeight: 600,
  },
  mobileLinkActive: {
    background: "linear-gradient(90deg, rgba(59,130,246,0.12), rgba(59,130,246,0.06))",
    color: "#fff",
  },
};
