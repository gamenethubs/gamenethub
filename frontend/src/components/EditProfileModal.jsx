// src/components/EditProfileModal.jsx
import React, { useEffect, useState } from "react";
import { updateProfile, searchUsers } from "../services/api";

export default function EditProfileModal({ visible, onClose, user, onUpdated }) {

  // 🔥 HOOKS ALWAYS AT TOP
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    avatar: user?.avatar || "/avatars/avatar01.png",
    bio: user?.bio || "",
    instagram: user?.social?.instagram || "",
    twitter: user?.social?.twitter || "",
    linkedin: user?.social?.linkedin || "",
  });

  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [saving, setSaving] = useState(false);

  const avatars = Array.from({ length: 20 }, (_, i) => {
    const idx = String(i + 1).padStart(2, "0");
    return `/avatars/avatar${idx}.png`;
  });

  // 🔥 useEffect also ALWAYS at top (before any return)
  useEffect(() => {
    if (!form.username || form.username === user.username) {
      setUsernameError("");
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const res = await searchUsers(form.username);
        const match = res.data?.find(
          (u) => u.username?.toLowerCase() === form.username.toLowerCase()
        );
        setUsernameError(match ? "Username already taken" : "");
      } catch {
        setUsernameError("");
      }
      setCheckingUsername(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [form.username, user.username]);


  // ✅ CONDITIONAL RETURN MUST COME AFTER HOOKS
  if (!visible) return null;

  const handleSave = async () => {
    if (usernameError) return;

    setSaving(true);
    try {
      const res = await updateProfile({
        name: form.name,
        username: form.username,
        avatar: form.avatar,
        bio: form.bio,
        social: {
          instagram: form.instagram,
          twitter: form.twitter,
          linkedin: form.linkedin,
        },
      });

      if (res.data?.success) {
        onUpdated(res.data.user);
        onClose();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
    setSaving(false);
  };

  return (
    <div style={backdrop}>
      <div style={modal}>

        {/* HEADER */}
        <div style={header}>
          <h2 style={{ margin: 0, color: "#e6e9f0", fontWeight: 800 }}>Edit Profile</h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        {/* FORM */}
        <div style={{ marginTop: 12 }}>

          {/* NAME */}
          <label style={label}>Full Name</label>
          <input
            style={input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* USERNAME */}
          <label style={label}>Username</label>
          <input
            style={{
              ...input,
              borderColor: usernameError ? "#ff5b5b" : "rgba(255,255,255,0.12)",
            }}
            value={form.username}
            onChange={(e) => {
              setForm({ ...form, username: e.target.value.toLowerCase() });
            }}
          />
          {checkingUsername && (
            <div style={{ color: "#9fb7d9", fontSize: 13 }}>Checking…</div>
          )}
          {usernameError && (
            <div style={{ color: "#ff5b5b", fontSize: 13 }}>{usernameError}</div>
          )}

          {/* BIO */}
          <label style={label}>Bio</label>
          <textarea
            style={textarea}
            maxLength={200}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />

          {/* SOCIAL LINKS */}
          <label style={label}>Instagram</label>
          <input
            style={input}
            value={form.instagram}
            onChange={(e) =>
              setForm({ ...form, instagram: e.target.value })
            }
          />

          <label style={label}>Twitter</label>
          <input
            style={input}
            value={form.twitter}
            onChange={(e) =>
              setForm({ ...form, twitter: e.target.value })
            }
          />

          <label style={label}>LinkedIn</label>
          <input
            style={input}
            value={form.linkedin}
            onChange={(e) =>
              setForm({ ...form, linkedin: e.target.value })
            }
          />

          {/* AVATAR GRID */}
          <div style={{ marginTop: 20, marginBottom: 10, fontWeight: 700, color: "#9fb7d9" }}>
            Choose Avatar
          </div>

          <div style={avatarGrid}>
            {avatars.map((a) => (
              <div
                key={a}
                style={{
                  ...avatarBox,
                  border: form.avatar === a ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.08)",
                }}
                onClick={() => setForm({ ...form, avatar: a })}
              >
                <img src={a} alt="avatar" style={avatarImg} />
              </div>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div style={footer}>

          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button
            style={{
              ...saveBtn,
              opacity: usernameError ? 0.5 : 1,
            }}
            disabled={saving || usernameError}
            onClick={handleSave}
          >
            {saving ? "Saving…" : "Save"}
          </button>

        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const backdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.65)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
  zIndex: 2400,
};

const modal = {
  width: "min(600px, 96vw)",
  background: "rgba(17,25,40,0.95)",
  borderRadius: 16,
  padding: "20px 24px",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
  maxHeight: "90vh",
  overflowY: "auto",
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
  cursor: "pointer",
  fontSize: 22,
};

const label = {
  marginTop: 14,
  marginBottom: 6,
  fontSize: 14,
  color: "#9fb7d9",
  fontWeight: 700,
};

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
  outline: "none",
};

const textarea = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
  minHeight: 70,
  outline: "none",
};

const avatarGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
  gap: 12,
  marginTop: 10,
};

const avatarBox = {
  width: 60,
  height: 60,
  borderRadius: 12,
  overflow: "hidden",
  cursor: "pointer",
  background: "#0b1220",
};

const avatarImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const footer = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: 20,
  gap: 12,
};

const cancelBtn = {
  padding: "10px 18px",
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 10,
  color: "#cfe8ff",
  fontWeight: 700,
  cursor: "pointer",
};

const saveBtn = {
  padding: "10px 22px",
  background: "#3b82f6",
  border: "none",
  borderRadius: 10,
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};
