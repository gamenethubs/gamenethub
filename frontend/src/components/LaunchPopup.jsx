


import React, { useEffect, useState } from "react";

export default function LaunchPopup({
  launchDate = null,
  showWeeklyIfSunday = false,
  gameOffer = null,
  localStorageKey = "launchPopupDismissedUntil",
}) {
  const [visible, setVisible] = useState(false);

  

  useEffect(() => {
    const checkShouldShow = () => {
      if (localStorage.getItem("launchPopupSeen") === "true") return false;

      const now = new Date();
      const todayISO = now.toISOString().slice(0, 10);
      const isSunday = now.getDay() === 0;

      const dismissedUntil = localStorage.getItem(localStorageKey);
      if (dismissedUntil) {
        const t = Number(dismissedUntil);
        if (!Number.isNaN(t) && Date.now() < t) return false;
      }

      if (launchDate && todayISO === launchDate) return true;
      if (showWeeklyIfSunday && isSunday) return true;

      return false;
    };

    if (checkShouldShow()) {
      setVisible(true);
      localStorage.setItem("launchPopupSeen", "true");
    }
  }, [launchDate, showWeeklyIfSunday, localStorageKey]);

  if (!visible) return null;

  const offer = gameOffer || {
    title: "Play a level — get ₹10 off!",
    discount: "₹10",
    ctaText: "Play & Win",
    gameUrl: "/games/featured",
    imageUrl: null,
  };

  const persistSeenAndDismiss = (days = 7) => {
    localStorage.setItem("launchPopupSeen", "true");
    if (days > 0) {
      const until = Date.now() + days * 24 * 60 * 60 * 1000;
      localStorage.setItem(localStorageKey, String(until));
    }
    setVisible(false);
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 480;

  // ------------------------ STYLES ------------------------
  const S = {
    wrapper: {
      position: "fixed",
      inset: 0,
      zIndex: 99999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "12px",
    },
    backdrop: {
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(6px)",
    },
    panel: {
      position: "relative",
      zIndex: 10,
      width: "100%",
      maxWidth: isMobile ? "95%" : "720px",
      borderRadius: "20px",
      background: "#fff",
      padding: isMobile ? "16px" : "22px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
      boxSizing: "border-box",
    },

    header: {
      display: "flex",
      gap: "12px",
      alignItems: "flex-start",
    },

    image: {
      height: isMobile ? 55 : 80,
      width: isMobile ? 55 : 80,
      borderRadius: 14,
      objectFit: "cover",
      background: "linear-gradient(135deg,#6366f1,#ec4899)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 800,
      fontSize: isMobile ? 18 : 24,
    },

    title: {
      fontSize: isMobile ? 17 : 20,
      fontWeight: 700,
      margin: 0,
      color: "#0f172a",
    },

    subtitle: {
      fontSize: isMobile ? 12 : 14,
      margin: "4px 0 0 0",
      color: "#6b7280",
    },

    closeBtn: {
      background: "transparent",
      border: "none",
      fontSize: isMobile ? 18 : 22,
      cursor: "pointer",
      marginLeft: "auto",
      color: "#6b7280",
    },

    main: {
      marginTop: 16,
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: 16,
    },

    mainLeft: {
      flex: 1,
    },

    paragraph: {
      fontSize: isMobile ? 13 : 14,
      lineHeight: 1.5,
      color: "#374151",
    },

    cta: {
      display: "block",
      width: isMobile ? "100%" : "auto",
      padding: isMobile ? "10px 0" : "12px 18px",
      borderRadius: 12,
      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
      color: "#fff",
      textAlign: "center",
      fontWeight: 700,
      textDecoration: "none",
      marginTop: 14,
      fontSize: isMobile ? 14 : 15,
    },

    offerCard: {
      width: isMobile ? "100%" : "150px",
      padding: 14,
      borderRadius: 14,
      background: "#f8f9fb",
      border: "1px solid #e5e7eb",
      textAlign: "center",
    },

    offerTitle: {
      fontSize: 12,
      color: "#6b7280",
      marginBottom: 6,
    },

    offerValue: {
      fontSize: 22,
      fontWeight: 800,
      marginBottom: 4,
      color: "#111827",
    },

    offerSub: {
      fontSize: 13,
      color: "#6b7280",
    },

    footer: {
      marginTop: 18,
    },

    tcBox: {
      padding: "12px",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      background: "#f3f4f6",
      fontSize: isMobile ? 13 : 14,
      color: "#111827",
    },

    tcItem: {
      marginBottom: 6,
      lineHeight: 1.4,
    },

    footerRow: {
      marginTop: 12,
      display: "flex",
      justifyContent: "space-between",
      fontSize: 12,
      color: "#6b7280",
    },

    closeSmall: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: "#374151",
      padding: "6px 10px",
    },
  };

  return (
    <div style={S.wrapper}>
      <div style={S.backdrop} onClick={() => persistSeenAndDismiss(0)} />

      <div style={S.panel}>
        {/* HEADER */}
        <header style={S.header}>
          {offer.imageUrl ? (
            <img src={offer.imageUrl} alt="offer" style={S.image} />
          ) : (
            <div style={S.image}>GN</div>
          )}

          <div>
            <h2 style={S.title}>Welcome to GameNetHub 🎉</h2>
            <p style={S.subtitle}>{offer.title}</p>
          </div>

          <button style={S.closeBtn} onClick={() => persistSeenAndDismiss(0)}>
            ✕
          </button>
        </header>

        {/* MAIN CONTENT */}
        <main style={S.main}>
          <div style={S.mainLeft}>
            <p style={S.paragraph}>
              To celebrate our launch, complete a level in the featured game and
              win rewards instantly. Tap below to start playing!
            </p>

            <a
              href={offer.gameUrl}
              style={S.cta}
              onClick={() => persistSeenAndDismiss(1)}
            >
              {offer.ctaText}
            </a>
          </div>

          <div style={S.offerCard}>
            <div style={S.offerTitle}>Offer</div>
            <div style={S.offerValue}>{offer.discount}</div>
            <div style={S.offerSub}>On completing every level</div>
          </div>
        </main>

        {/* FOOTER */}
        <footer style={S.footer}>
          <details style={S.tcBox}>
            <summary style={{ fontWeight: 700, cursor: "pointer" }}>
              Terms & Conditions
            </summary>

            <ul style={{ marginTop: 10 }}>
              <li style={S.tcItem}>User must be logged in before playing.</li>
              <li style={S.tcItem}>Only levels completed after login count.</li>
              <li style={S.tcItem}>
                User must take a screenshot of the level completion screen.
              </li>
              <li style={S.tcItem}>
                User must post it to Instagram Story & tag @gamenethubs.
              </li>
              <li style={S.tcItem}>
                Story must stay live for 24 hours for verification.
              </li>
              <li style={S.tcItem}>
                Team will reach out within 24 hours after verification.
              </li>
            </ul>
          </details>

          <div style={S.footerRow}>
            <span>
              <strong style={{ color: "#111827" }}>Tip:</strong> Snap your victory screen and flex it on your Instagram Story — don’t forget to tag us!
            </span>

            <button
              style={S.closeSmall}
              onClick={() => persistSeenAndDismiss(0)}
            >
              Close
            </button>
          </div> 
        </footer>
      </div>
    </div>
  );
}

