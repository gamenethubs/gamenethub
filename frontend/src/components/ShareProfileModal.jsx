// src/components/ShareProfileModal.jsx
import React, { useState, useEffect } from "react";

export default function ShareProfileModal({ visible, onClose, user }) {
  const [copied, setCopied] = useState(false);

  // Generate share URL only once
  const profileUrl = `${window.location.origin}/user/${user?.username}`;

  useEffect(() => {
    if (!visible) setCopied(false);
  }, [visible]);

  if (!visible) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error(e);
    }
  };

  const shareText = `Check out my profile on Gamenethub: ${profileUrl}`;

  const shareOptions = [
    {
      label: "WhatsApp",
      icon: "🟢",
      href: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    },
    {
      label: "Telegram",
      icon: "📨",
      href: `https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      label: "Twitter",
      icon: "🐦",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    },
  ];

  return (
    <div style={backdrop}>
      <div style={modal}>
        <div style={header}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Share Profile</div>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        <div style={{ marginTop: 10 }}>

          <div style={urlBox}>
            <input
              value={profileUrl}
              readOnly
              style={urlInput}
            />
            <button onClick={copyLink} style={copyBtn}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div style={shareList}>
            {shareOptions.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                style={shareItem}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </a>
            ))}
          </div>

          {/* Native Share (Mobile) */}
          {navigator.share && (
            <button
              style={nativeBtn}
              onClick={() => navigator.share({ title: "My Gamenethub Profile", text: shareText, url: profileUrl })}
            >
              📱 Share via Device
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

/* --------- STYLES ---------- */
const backdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.65)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",    // ⭐ FIX: center se upar chipakna band karega
  paddingTop: "120px",          // ⭐ FIX: enough top spacing
  paddingLeft: 20,
  paddingRight: 20,
  paddingBottom: 20,
  zIndex: 3000,
};

const modal = {
  width: "min(420px, 92vw)",
  maxHeight: "85vh",           // ⭐ FIX: screen ke andar rahe
  overflowY: "auto",           // ⭐ FIX: content scroll ho, crop nahi
  background: "#0b1220",
  borderRadius: 14,
  padding: 20,
  border: "1px solid rgba(255,255,255,0.06)",
  color: "#fff",
  alignSelf: "flex-start",     // ⭐ FIX: exact FriendsModal behaviour
};


const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const closeBtn = {
  background: "transparent",
  border: "none",
  color: "#9fb7d9",
  fontSize: 18,
  cursor: "pointer",
};

const urlBox = {
  display: "flex",
  gap: 10,
  marginTop: 12,
};

const urlInput = {
  flex: 1,
  padding: "8px 10px",
  borderRadius: 8,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
  color: "#fff",
};

const copyBtn = {
  padding: "8px 12px",
  background: "#2563eb",
  borderRadius: 8,
  border: "none",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const shareList = {
  marginTop: 18,
  display: "grid",
  gap: 12,
};

const shareItem = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  background: "rgba(255,255,255,0.05)",
  borderRadius: 10,
  textDecoration: "none",
  color: "#fff",
  fontSize: 15,
  fontWeight: 600,
};

const nativeBtn = {
  marginTop: 18,
  padding: "10px 12px",
  background: "#3b82f6",
  borderRadius: 10,
  color: "#fff",
  fontWeight: 700,
  border: "none",
  width: "100%",
  cursor: "pointer",
};
