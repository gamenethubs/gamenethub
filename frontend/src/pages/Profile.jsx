// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites, fetchFavoritesAPI } from "../services/favoriteActions";
import { updateProfile as apiUpdateProfile } from "../services/api";
import AvatarSelector from "../components/AvatarSelector";
import ShareProfileModal from "../components/ShareProfileModal";
import { getUserXP } from "../services/api";
import ProfileXPCard from "../components/ProfileXPCard";
import ProfileBadges from "../components/ProfileBadges";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, logout, isAuthenticated } = useAuth();

  const [favGames, setFavGames] = useState([]);
  const [favLoading, setFavLoading] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);


  const { toggleFavorite, refreshFavorites } = useFavorites();
  const [xpStats, setXpStats] = useState({
  xp: 0,
  level: 1,
  xpNeeded: 100,
  progress: 0,
});

useEffect(() => {
  getUserXP()
    .then(res => {
      if (res.data?.stats) {
        setXpStats(res.data.stats);
      }
    })
    .catch(err => console.log("XP FETCH ERROR:", err));
}, []);


  const socialLinks = [
    { id: "instagram", label: "Instagram", href: user?.social?.instagram || "#", icon: "📸" },
    { id: "twitter", label: "Twitter", href: user?.social?.twitter || "#", icon: "🐦" },
    { id: "linkedin", label: "LinkedIn", href: user?.social?.linkedin || "#", icon: "🔗" },
  ];

  const avatarPreview =
    user?.avatar ||
    user?.picture ||
    "/avatars/default.png";

  /* ---------------- LOAD FAVORITES ---------------- */
  const loadFavoriteGames = async () => {
    if (!isAuthenticated) return setFavGames([]);
    setFavLoading(true);

    try {
      const games = await fetchFavoritesAPI();
      setFavGames(games);
    } catch {
      setFavGames([]);
    } finally {
      setFavLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated) return;
      await refreshFavorites();
      await loadFavoriteGames();
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  /* ---------------- SHARE PROFILE (modal) ---------------- */
  const [shareOpen, setShareOpen] = useState(false);

  /* ---------------- EDIT PROFILE (modal) ---------------- */
  const [editOpen, setEditOpen] = useState(false);

  /* Edit form state */
  const [editState, setEditState] = useState({
    name: "",
    username: "",
    bio: "",
    social: { instagram: "", twitter: "", linkedin: "" },
    avatar: "",
  });

  const [saving, setSaving] = useState(false);
  const [editErr, setEditErr] = useState("");
  const [editMsg, setEditMsg] = useState("");

  useEffect(() => {
    if (user) {
      setEditState({
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
        social: {
          instagram: user?.social?.instagram || "",
          twitter: user?.social?.twitter || "",
          linkedin: user?.social?.linkedin || "",
        },
        avatar: user.avatar || "",
      });
    }
  }, [user, editOpen]);

  const handleEditChange = (field, value) => {
    if (field === "instagram" || field === "twitter" || field === "linkedin") {
      setEditState((s) => ({ ...s, social: { ...s.social, [field]: value } }));
    } else {
      setEditState((s) => ({ ...s, [field]: value }));
    }
  };

  const handleSelectAvatar = (avatarPath) => {
    // avatarPath example: "/avatars/avatar03.png"
    setEditState((s) => ({ ...s, avatar: avatarPath }));
  };

  const handleSaveProfile = async () => {
    setEditErr("");
    setEditMsg("");
    setSaving(true);

    try {
      const payload = {
        name: editState.name,
        username: editState.username?.trim().toLowerCase() || undefined,
        avatar: editState.avatar || undefined,
        bio: editState.bio,
        social: {
          instagram: editState.social.instagram || "",
          twitter: editState.social.twitter || "",
          linkedin: editState.social.linkedin || "",
        },
      };

      const res = await apiUpdateProfile(payload);
      const updatedUser = res.data?.user || res.data;

      // Update auth context
      if (updateUser) updateUser(updatedUser);

      setEditMsg("Profile updated successfully.");
      // reflect in UI
      setTimeout(() => {
        setEditOpen(false);
        setEditMsg("");
      }, 900);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Update failed";
      setEditErr(message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFav = async (gameId) => {
    const res = await toggleFavorite(gameId);
    if (res?.favorites) setFavGames(res.favorites);
    else await loadFavoriteGames();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Your Profile</h1>

        <div style={styles.grid} className="profile-grid">
          {/* LEFT COLUMN */}
          <div style={styles.leftCol} className="profile-left">
            <div style={styles.avatarWrap} className="profile-avatar-wrap">
              <img
                src={avatarPreview}
                alt="avatar"
                style={styles.avatar}
                onError={(e) =>
                  (e.currentTarget.src = "/avatars/default.png")
                }
              />
            </div>

            {/* Buttons block */}
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                style={styles.primaryBtn}
                onClick={() => setEditOpen(true)}
              >
                Edit Profile
              </button>

              <button
                style={styles.primaryBtn}
                onClick={() => setShareOpen(true)}
              >
                Share Profile
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                style={styles.ghostBtn}
              >
                Logout
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={styles.rightCol}>
            <div style={styles.infoRow}>
              <div>
                <div style={styles.infoLabel}>Name</div>
                <div style={styles.infoValue}>{user?.name}</div>
              </div>
            </div>

            <div style={styles.infoRow}>
              <div>
                <div style={styles.infoLabel}>Username</div>
                <div style={styles.infoValueSmall}>@{user?.username || "—"}</div>
              </div>
            </div>

            <div style={styles.infoRow}>
              <div>
                <div style={styles.infoLabel}>Email</div>
                <div style={styles.infoValueSmall}>{user?.email}</div>
              </div>
            </div>

            {user?.bio && (
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>Bio</div>
                <div style={styles.infoValueSmall}>{user?.bio}</div>
              </div>
            )}
          </div>

            {/* ⭐ XP CARD — Inserted between Bio and Social section */}
          <div style={styles.xpCardWrapper} className="xp-card">
            <ProfileXPCard
              xp={xpStats.xp}
              level={xpStats.level}
              xpNeeded={xpStats.xpNeeded}
              progress={xpStats.progress}
            />
            <ProfileBadges
                badges={xpStats.badges}
                badgeProgress={xpStats.badgeProgress}
              />

          </div>



          {/* SOCIAL LINKS */}
          <div style={styles.socialCol} className="profile-social-col">
            <div style={styles.socialTitle}>Social</div>
            <ul style={styles.socialList}>
              {socialLinks.map((s) => (
                <li key={s.id} style={styles.socialItem}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.socialLink}
                  >
                    <span style={styles.socialIcon}>{s.icon}</span>
                    <span style={styles.socialLabel}>{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAVORITE GAMES */}
        <div style={styles.favSectionWrapper}>
          <h3 style={{ color: "#fff", marginBottom: 10 }}>❤️ Your Favorites</h3>

          {favLoading ? (
            <div style={{ color: "#9fb7d9" }}>Loading favorites...</div>
          ) : favGames.length === 0 ? (
            <div style={{ color: "#9fb7d9" }}>No favorites yet.</div>
          ) : (
            <div style={styles.favGrid} className="fav-grid">
              {favGames.map((g) => (
                <div key={g._id} style={styles.favCard} className="fav-card">
                  <div style={styles.favImgWrap}>
                    <img
                      src={
                        g.thumbnail?.startsWith("/uploads")
                          ? `${API_BASE}${g.thumbnail}`
                          : g.thumbnail
                      }
                      style={styles.favImg}
                      alt={g.title}
                    />
                  </div>

                  <div style={styles.favInfo}>
                    <div style={styles.favTitle}>{g.title}</div>
                    <div style={styles.favGenre}>{g.genre}</div>

                    <div style={styles.favBtns}>
                      <button
                        onClick={() => navigate(`/game/${g.slug}`)}
                        style={styles.viewBtn}
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleToggleFav(g._id)}
                        style={styles.removeBtn}
                      >
                        ♥
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---------------- EDIT PROFILE MODAL ---------------- */}
      {editOpen && (
        <div style={modalBackdrop}>
          <div style={modalBox}>
            <div style={modalHeader}>
              <div style={{ color: "#e6e9f0", fontWeight: 800, fontSize: 18 }}>Edit profile</div>
              <button onClick={() => setEditOpen(false)} style={modalClose}>✕</button>
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 84, height: 84, borderRadius: 12, overflow: "hidden", background: "#071224" }}>
                  <img
                    src={editState.avatar || avatarPreview}
                    alt="avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontWeight: 800, color: "#e6f0ff" }}>{user?.name}</div>
                  <div style={{ color: "#9fb7d9", fontSize: 13 }}>Choose an avatar or keep current</div>
                  <button style={styles.primaryBtn} onClick={() => {/* show AvatarSelector below */ setShowAvatarSelector(true); }}>
                    Choose Avatar
                  </button>
                </div>
              </div>

              <div>
                <div style={formLabel}>Name</div>
                <input
                  value={editState.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  style={formInput}
                />
              </div>

              <div>
                <div style={formLabel}>Username</div>
                <input
                  value={editState.username || ""}
                  onChange={(e) => handleEditChange("username", e.target.value)}
                  style={formInput}
                  placeholder="unique username (a-z, 0-9, _)"
                />
              </div>

              <div>
                <div style={formLabel}>Bio</div>
                <textarea
                  value={editState.bio}
                  onChange={(e) => handleEditChange("bio", e.target.value)}
                  style={{ ...formInput, height: 80, resize: "vertical" }}
                  maxLength={200}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <div style={formLabel}>Instagram</div>
                  <input
                    value={editState.social.instagram}
                    onChange={(e) => handleEditChange("instagram", e.target.value)}
                    style={formInput}
                    placeholder="https://www.instagram.com/..."
                  />
                </div>

                <div>
                  <div style={formLabel}>Twitter</div>
                  <input
                    value={editState.social.twitter}
                    onChange={(e) => handleEditChange("twitter", e.target.value)}
                    style={formInput}
                    placeholder="https://x.com/..."
                  />
                </div>
              </div>

              <div>
                <div style={formLabel}>LinkedIn</div>
                <input
                  value={editState.social.linkedin}
                  onChange={(e) => handleEditChange("linkedin", e.target.value)}
                  style={formInput}
                  placeholder="https://www.linkedin.com/..."
                />
              </div>

              {editErr && <div style={styles.error}>{editErr}</div>}
              {editMsg && <div style={styles.success}>{editMsg}</div>}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button onClick={() => setEditOpen(false)} style={modalCancel}>Cancel</button>
                <button onClick={handleSaveProfile} disabled={saving} style={modalSave}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>

            {/* Avatar selector overlay */}
            <AvatarSelectorWrapper
              visible={typeof showAvatarSelector !== "undefined" ? showAvatarSelector : false}
              onClose={() => setShowAvatarSelector(false)}
              onSelect={(a) => {
                handleSelectAvatar(a);
                setShowAvatarSelector(false);
              }}
              selected={editState.avatar}
            />
          </div>
        </div>
      )}

      {/* ---------------- SHARE PROFILE MODAL ---------------- */}
      {shareOpen && (
        <ShareProfileModal
          visible={shareOpen}
          onClose={() => setShareOpen(false)}
          user={user}
        />
      )}
    </div>
  );
}

/* ------------------------- small avatar selector wrapper (local) ------------------------- */
/* We wrap AvatarSelector so state lives here. Keeps the main UI simple. */
function AvatarSelectorWrapper({ visible, onClose, onSelect, selected }) {
  // simply render AvatarSelector component imported earlier
  if (!visible) return null;
  return (
    <AvatarSelector visible={visible} onClose={onClose} onSelect={onSelect} selected={selected} />
  );
}

/* ------------------------- STYLES ------------------------- */
/* All original styles preserved, modal / form styles added inline to match theme */
const styles = {

  xpCardWrapper: {
  marginTop: 10,
  marginBottom: 20,
  width: "100%",
},

  wrapper: {
    minHeight: "100vh",
    background: "#0f172a",
    padding: "30px 20px",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: 900,
    background: "rgba(17,25,40,0.65)",
    borderRadius: 16,
    padding: 26,
    color: "#e6f0ff",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  title: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 20,
  },

  grid: {
    display: "flex",
    gap: 24,
    alignItems: "flex-start",
    marginBottom: 20,
  },

  leftCol: {
    width: 160,
    display: "flex",
    flexDirection: "column",
  },

  rightCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  avatarWrap: {
    width: 110,
    height: 110,
    borderRadius: 14,
    overflow: "hidden",
    background: "#071224",
  },

  avatar: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  primaryBtn: {
    padding: "10px 20px",
    borderRadius: 10,
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },

  ghostBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "#cfe8ff",
    cursor: "pointer",
    fontWeight: 700,
  },

  success: {
    marginTop: 10,
    background: "rgba(16,185,129,0.15)",
    padding: 10,
    borderRadius: 8,
  },

  error: {
    marginTop: 10,
    background: "rgba(239,68,68,0.15)",
    padding: 10,
    borderRadius: 8,
  },

  infoRow: {
    marginBottom: 10,
  },

  infoLabel: {
    color: "#9fb7d9",
    fontSize: 13,
    fontWeight: 700,
  },

  infoValue: {
    fontSize: 18,
    fontWeight: 800,
  },

  infoValueSmall: {
    fontSize: 14,
    fontWeight: 700,
  },

  socialCol: {
    width: 140,
  },

  socialTitle: {
    color: "#9fb7d9",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 10,
  },

  socialList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  socialItem: {},

  socialLink: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(255,255,255,0.03)",
    color: "#fff",
  },

  socialIcon: {
    background: "#3b82f6",
    color: "#fff",
    padding: "6px",
    borderRadius: 8,
    display: "inline-flex",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  favSectionWrapper: { marginTop: 30 },

  favGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 16,
  },

  favCard: {
    width: "100%",
    background: "#0b1220",
    borderRadius: 10,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  favImgWrap: { height: 120, overflow: "hidden" },

  favImg: { width: "100%", height: "120px", objectFit: "cover" },

  favInfo: { padding: 10 },

  favTitle: {
    fontWeight: 800,
    color: "#fff",
    marginBottom: 4,
    fontSize: 14,
  },

  favGenre: { fontSize: 12, color: "#93c5fd", marginBottom: 8 },

  favBtns: { display: "flex", gap: 8 },

  viewBtn: {
    flex: 1,
    background: "#2563eb",
    border: "none",
    color: "#fff",
    padding: "6px 8px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
  },

  removeBtn: {
    background: "transparent",
    border: "1px solid rgba(255,0,0,0.3)",
    color: "#ff5b5b",
    padding: "6px",
    borderRadius: 8,
    cursor: "pointer",
    minWidth: 40,
  },
};

/* ------------------------- MODAL / FORM STYLES ------------------------- */
const modalBackdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  zIndex: 2500,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 18,
};

const modalBox = {
  width: "min(760px, 96vw)",
  maxHeight: "90vh",
  overflow: "auto",
  background: "#071224",
  borderRadius: 12,
  padding: 18,
  border: "1px solid rgba(255,255,255,0.04)",
  boxShadow: "0 20px 60px rgba(2,6,23,0.6)",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
};

const modalClose = {
  background: "transparent",
  border: "none",
  color: "#9fb7d9",
  fontSize: 18,
  cursor: "pointer",
};

const formLabel = { color: "#9fb7d9", fontSize: 13, fontWeight: 700, marginBottom: 6 };
const formInput = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
  color: "#fff",
  outline: "none",
  fontSize: 14,
};

const modalCancel = {
  padding: "8px 12px",
  borderRadius: 8,
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.06)",
  color: "#cfe8ff",
  cursor: "pointer",
};

const modalSave = {
  padding: "8px 12px",
  borderRadius: 8,
  background: "#2563eb",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 800,
};

/* RESPONSIVE - keep identical to your previous rules */
const responsive = `
@media (max-width: 900px) {
  .profile-grid {
    flex-direction: column;
    gap: 20px;
  }
  .profile-left {
    width: 100% !important;
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }
  .profile-avatar-wrap {
    width: 90px !important;
    height: 90px !important;
  }
  .profile-social-col {
    width: 100% !important;
    margin-top: 20px;
  }
}

@media (max-width: 600px) {
  .fav-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 400px) {
  .fav-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  .profile-left {
    flex-direction: column !important;
    align-items: flex-start !important;
  }
}

@media (max-width: 300px) {
  .fav-grid {
    grid-template-columns: repeat(1, 1fr) !important;
  }
}
/* XP Card Responsive Fix */
@media (max-width: 600px) {
  .xp-card-root {
    transform: scale(1.05);
  }
}

@media (max-width: 420px) {
  .xp-card-root {
    transform: scale(1.12);
  }
}

@media (max-width: 350px) {
  .xp-card-root {
    transform: scale(1.18);
  }
}


`;

const styleSheet = document.createElement("style");
styleSheet.innerText = responsive;
document.head.appendChild(styleSheet);

