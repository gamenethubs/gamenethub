// // src/pages/Profile.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useFavorites, fetchFavoritesAPI } from "../services/favoriteActions";
// import { updateProfile as apiUpdateProfile } from "../services/api";
// import AvatarSelector from "../components/AvatarSelector";
// import ShareProfileModal from "../components/ShareProfileModal";
// import { getUserXP } from "../services/api";
// import ProfileXPCard from "../components/ProfileXPCard";
// import ProfileBadges from "../components/ProfileBadges";

// const API_BASE = process.env.REACT_APP_API_BASE;

// export default function Profile() {
//   const navigate = useNavigate();
//   const { user, updateUser, logout, isAuthenticated } = useAuth();

//   const [favGames, setFavGames] = useState([]);
//   const [favLoading, setFavLoading] = useState(false);
//   const [showAvatarSelector, setShowAvatarSelector] = useState(false);


//   const { toggleFavorite, refreshFavorites } = useFavorites();
//   const [xpStats, setXpStats] = useState({
//   xp: 0,
//   level: 1,
//   xpNeeded: 100,
//   progress: 0,
// });

// useEffect(() => {
//   getUserXP()
//     .then(res => {
//       if (res.data?.stats) {
//         setXpStats(res.data.stats);
//       }
//     })
//     .catch(err => console.log("XP FETCH ERROR:", err));
// }, []);


//   const socialLinks = [
//     { id: "instagram", label: "Instagram", href: user?.social?.instagram || "#", icon: "📸" },
//     { id: "twitter", label: "Twitter", href: user?.social?.twitter || "#", icon: "🐦" },
//     { id: "linkedin", label: "LinkedIn", href: user?.social?.linkedin || "#", icon: "🔗" },
//   ];

//   const avatarPreview =
//     user?.avatar ||
//     user?.picture ||
//     "/avatars/default.png";

//   /* ---------------- LOAD FAVORITES ---------------- */
//   const loadFavoriteGames = async () => {
//     if (!isAuthenticated) return setFavGames([]);
//     setFavLoading(true);

//     try {
//       const games = await fetchFavoritesAPI();
//       setFavGames(games);
//     } catch {
//       setFavGames([]);
//     } finally {
//       setFavLoading(false);
//     }
//   };

//   useEffect(() => {
//     const init = async () => {
//       if (!isAuthenticated) return;
//       await refreshFavorites();
//       await loadFavoriteGames();
//     };

//     init();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isAuthenticated]);

//   /* ---------------- SHARE PROFILE (modal) ---------------- */
//   const [shareOpen, setShareOpen] = useState(false);

//   /* ---------------- EDIT PROFILE (modal) ---------------- */
//   const [editOpen, setEditOpen] = useState(false);

//   /* Edit form state */
//   const [editState, setEditState] = useState({
//     name: "",
//     username: "",
//     bio: "",
//     social: { instagram: "", twitter: "", linkedin: "" },
//     avatar: "",
//   });

//   const [saving, setSaving] = useState(false);
//   const [editErr, setEditErr] = useState("");
//   const [editMsg, setEditMsg] = useState("");

//   useEffect(() => {
//     if (user) {
//       setEditState({
//         name: user.name || "",
//         username: user.username || "",
//         bio: user.bio || "",
//         social: {
//           instagram: user?.social?.instagram || "",
//           twitter: user?.social?.twitter || "",
//           linkedin: user?.social?.linkedin || "",
//         },
//         avatar: user.avatar || "",
//       });
//     }
//   }, [user, editOpen]);

//   const handleEditChange = (field, value) => {
//     if (field === "instagram" || field === "twitter" || field === "linkedin") {
//       setEditState((s) => ({ ...s, social: { ...s.social, [field]: value } }));
//     } else {
//       setEditState((s) => ({ ...s, [field]: value }));
//     }
//   };

//   const handleSelectAvatar = (avatarPath) => {
//     // avatarPath example: "/avatars/avatar03.png"
//     setEditState((s) => ({ ...s, avatar: avatarPath }));
//   };

//   const handleSaveProfile = async () => {
//     setEditErr("");
//     setEditMsg("");
//     setSaving(true);

//     try {
//       const payload = {
//         name: editState.name,
//         username: editState.username?.trim().toLowerCase() || undefined,
//         avatar: editState.avatar || undefined,
//         bio: editState.bio,
//         social: {
//           instagram: editState.social.instagram || "",
//           twitter: editState.social.twitter || "",
//           linkedin: editState.social.linkedin || "",
//         },
//       };

//       const res = await apiUpdateProfile(payload);
//       const updatedUser = res.data?.user || res.data;

//       // Update auth context
//       if (updateUser) updateUser(updatedUser);

//       setEditMsg("Profile updated successfully.");
//       // reflect in UI
//       setTimeout(() => {
//         setEditOpen(false);
//         setEditMsg("");
//       }, 900);
//     } catch (err) {
//       const message = err.response?.data?.message || err.message || "Update failed";
//       setEditErr(message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleToggleFav = async (gameId) => {
//     const res = await toggleFavorite(gameId);
//     if (res?.favorites) setFavGames(res.favorites);
//     else await loadFavoriteGames();
//   };

//   return (
//     <div style={styles.wrapper}>
//       <div style={styles.card}>
//         <h1 style={styles.title}>Your Profile</h1>

//         <div style={styles.grid} className="profile-grid">
//           {/* LEFT COLUMN */}
//           <div style={styles.leftCol} className="profile-left">
//             <div style={styles.avatarWrap} className="profile-avatar-wrap">
//               <img
//                 src={avatarPreview}
//                 alt="avatar"
//                 style={styles.avatar}
//                 onError={(e) =>
//                   (e.currentTarget.src = "/avatars/default.png")
//                 }
//               />
//             </div>

//             {/* Buttons block */}
//             <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
//               <button
//                 style={styles.primaryBtn}
//                 onClick={() => setEditOpen(true)}
//               >
//                 Edit Profile
//               </button>

//               <button
//                 style={styles.primaryBtn}
//                 onClick={() => setShareOpen(true)}
//               >
//                 Share Profile
//               </button>

//               <button
//                 onClick={() => {
//                   logout();
//                   navigate("/login");
//                 }}
//                 style={styles.ghostBtn}
//               >
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div style={styles.rightCol}>
//             <div style={styles.infoRow}>
//               <div>
//                 <div style={styles.infoLabel}>Name</div>
//                 <div style={styles.infoValue}>{user?.name}</div>
//               </div>
//             </div>

//             <div style={styles.infoRow}>
//               <div>
//                 <div style={styles.infoLabel}>Username</div>
//                 <div style={styles.infoValueSmall}>@{user?.username || "—"}</div>
//               </div>
//             </div>

//             <div style={styles.infoRow}>
//               <div>
//                 <div style={styles.infoLabel}>Email</div>
//                 <div style={styles.infoValueSmall}>{user?.email}</div>
//               </div>
//             </div>

//             {user?.bio && (
//               <div style={styles.infoRow}>
//                 <div style={styles.infoLabel}>Bio</div>
//                 <div style={styles.infoValueSmall}>{user?.bio}</div>
//               </div>
//             )}
//           </div>

//             {/* ⭐ XP CARD — Inserted between Bio and Social section */}
//           <div style={styles.xpCardWrapper} className="xp-card">
//             <ProfileXPCard
//               xp={xpStats.xp}
//               level={xpStats.level}
//               xpNeeded={xpStats.xpNeeded}
//               progress={xpStats.progress}
//             />
//             <ProfileBadges
//                 badges={xpStats.badges}
//                 badgeProgress={xpStats.badgeProgress}
//               />

//           </div>



//           {/* SOCIAL LINKS */}
//           <div style={styles.socialCol} className="profile-social-col">
//             <div style={styles.socialTitle}>Social</div>
//             <ul style={styles.socialList}>
//               {socialLinks.map((s) => (
//                 <li key={s.id} style={styles.socialItem}>
//                   <a
//                     href={s.href}
//                     target="_blank"
//                     rel="noreferrer"
//                     style={styles.socialLink}
//                   >
//                     <span style={styles.socialIcon}>{s.icon}</span>
//                     <span style={styles.socialLabel}>{s.label}</span>
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* FAVORITE GAMES */}
//         <div style={styles.favSectionWrapper}>
//           <h3 style={{ color: "#fff", marginBottom: 10 }}>❤️ Your Favorites</h3>

//           {favLoading ? (
//             <div style={{ color: "#9fb7d9" }}>Loading favorites...</div>
//           ) : favGames.length === 0 ? (
//             <div style={{ color: "#9fb7d9" }}>No favorites yet.</div>
//           ) : (
//             <div style={styles.favGrid} className="fav-grid">
//               {favGames.map((g) => (
//                 <div key={g._id} style={styles.favCard} className="fav-card">
//                   <div style={styles.favImgWrap}>
//                     <img
//                       src={
//                         g.thumbnail?.startsWith("/uploads")
//                           ? `${API_BASE}${g.thumbnail}`
//                           : g.thumbnail
//                       }
//                       style={styles.favImg}
//                       alt={g.title}
//                     />
//                   </div>

//                   <div style={styles.favInfo}>
//                     <div style={styles.favTitle}>{g.title}</div>
//                     <div style={styles.favGenre}>{g.genre}</div>

//                     <div style={styles.favBtns}>
//                       <button
//                         onClick={() => navigate(`/game/${g.slug}`)}
//                         style={styles.viewBtn}
//                       >
//                         View
//                       </button>

//                       <button
//                         onClick={() => handleToggleFav(g._id)}
//                         style={styles.removeBtn}
//                       >
//                         ♥
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ---------------- EDIT PROFILE MODAL ---------------- */}
//       {editOpen && (
//         <div style={modalBackdrop}>
//           <div style={modalBox}>
//             <div style={modalHeader}>
//               <div style={{ color: "#e6e9f0", fontWeight: 800, fontSize: 18 }}>Edit profile</div>
//               <button onClick={() => setEditOpen(false)} style={modalClose}>✕</button>
//             </div>

//             <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
//               <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
//                 <div style={{ width: 84, height: 84, borderRadius: 12, overflow: "hidden", background: "#071224" }}>
//                   <img
//                     src={editState.avatar || avatarPreview}
//                     alt="avatar"
//                     style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                     onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
//                   />
//                 </div>

//                 <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                   <div style={{ fontWeight: 800, color: "#e6f0ff" }}>{user?.name}</div>
//                   <div style={{ color: "#9fb7d9", fontSize: 13 }}>Choose an avatar or keep current</div>
//                   <button style={styles.primaryBtn} onClick={() => {/* show AvatarSelector below */ setShowAvatarSelector(true); }}>
//                     Choose Avatar
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <div style={formLabel}>Name</div>
//                 <input
//                   value={editState.name}
//                   onChange={(e) => handleEditChange("name", e.target.value)}
//                   style={formInput}
//                 />
//               </div>

//               <div>
//                 <div style={formLabel}>Username</div>
//                 <input
//                   value={editState.username || ""}
//                   onChange={(e) => handleEditChange("username", e.target.value)}
//                   style={formInput}
//                   placeholder="unique username (a-z, 0-9, _)"
//                 />
//               </div>

//               <div>
//                 <div style={formLabel}>Bio</div>
//                 <textarea
//                   value={editState.bio}
//                   onChange={(e) => handleEditChange("bio", e.target.value)}
//                   style={{ ...formInput, height: 80, resize: "vertical" }}
//                   maxLength={200}
//                 />
//               </div>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
//                 <div>
//                   <div style={formLabel}>Instagram</div>
//                   <input
//                     value={editState.social.instagram}
//                     onChange={(e) => handleEditChange("instagram", e.target.value)}
//                     style={formInput}
//                     placeholder="https://www.instagram.com/..."
//                   />
//                 </div>

//                 <div>
//                   <div style={formLabel}>Twitter</div>
//                   <input
//                     value={editState.social.twitter}
//                     onChange={(e) => handleEditChange("twitter", e.target.value)}
//                     style={formInput}
//                     placeholder="https://x.com/..."
//                   />
//                 </div>
//               </div>

//               <div>
//                 <div style={formLabel}>LinkedIn</div>
//                 <input
//                   value={editState.social.linkedin}
//                   onChange={(e) => handleEditChange("linkedin", e.target.value)}
//                   style={formInput}
//                   placeholder="https://www.linkedin.com/..."
//                 />
//               </div>

//               {editErr && <div style={styles.error}>{editErr}</div>}
//               {editMsg && <div style={styles.success}>{editMsg}</div>}

//               <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
//                 <button onClick={() => setEditOpen(false)} style={modalCancel}>Cancel</button>
//                 <button onClick={handleSaveProfile} disabled={saving} style={modalSave}>
//                   {saving ? "Saving…" : "Save changes"}
//                 </button>
//               </div>
//             </div>

//             {/* Avatar selector overlay */}
//             <AvatarSelectorWrapper
//               visible={typeof showAvatarSelector !== "undefined" ? showAvatarSelector : false}
//               onClose={() => setShowAvatarSelector(false)}
//               onSelect={(a) => {
//                 handleSelectAvatar(a);
//                 setShowAvatarSelector(false);
//               }}
//               selected={editState.avatar}
//             />
//           </div>
//         </div>
//       )}

//       {/* ---------------- SHARE PROFILE MODAL ---------------- */}
//       {shareOpen && (
//         <ShareProfileModal
//           visible={shareOpen}
//           onClose={() => setShareOpen(false)}
//           user={user}
//         />
//       )}
//     </div>
//   );
// }

// /* ------------------------- small avatar selector wrapper (local) ------------------------- */
// /* We wrap AvatarSelector so state lives here. Keeps the main UI simple. */
// function AvatarSelectorWrapper({ visible, onClose, onSelect, selected }) {
//   // simply render AvatarSelector component imported earlier
//   if (!visible) return null;
//   return (
//     <AvatarSelector visible={visible} onClose={onClose} onSelect={onSelect} selected={selected} />
//   );
// }

// /* ------------------------- STYLES ------------------------- */
// /* All original styles preserved, modal / form styles added inline to match theme */
// const styles = {

//   xpCardWrapper: {
//   marginTop: 10,
//   marginBottom: 20,
//   width: "100%",
// },

//   wrapper: {
//     minHeight: "100vh",
//     background: "#0f172a",
//     padding: "30px 20px",
//     display: "flex",
//     justifyContent: "center",
//   },

//   card: {
//     width: "100%",
//     maxWidth: 900,
//     background: "rgba(17,25,40,0.65)",
//     borderRadius: 16,
//     padding: 26,
//     color: "#e6f0ff",
//     border: "1px solid rgba(255,255,255,0.06)",
//   },

//   title: {
//     fontSize: 24,
//     fontWeight: 800,
//     marginBottom: 20,
//   },

//   grid: {
//     display: "flex",
//     gap: 24,
//     alignItems: "flex-start",
//     marginBottom: 20,
//   },

//   leftCol: {
//     width: 160,
//     display: "flex",
//     flexDirection: "column",
//   },

//   rightCol: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//   },

//   avatarWrap: {
//     width: 110,
//     height: 110,
//     borderRadius: 14,
//     overflow: "hidden",
//     background: "#071224",
//   },

//   avatar: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//   },

//   primaryBtn: {
//     padding: "10px 20px",
//     borderRadius: 10,
//     background: "#3b82f6",
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//     fontWeight: 700,
//   },

//   ghostBtn: {
//     padding: "10px 14px",
//     borderRadius: 10,
//     border: "1px solid rgba(255,255,255,0.2)",
//     background: "transparent",
//     color: "#cfe8ff",
//     cursor: "pointer",
//     fontWeight: 700,
//   },

//   success: {
//     marginTop: 10,
//     background: "rgba(16,185,129,0.15)",
//     padding: 10,
//     borderRadius: 8,
//   },

//   error: {
//     marginTop: 10,
//     background: "rgba(239,68,68,0.15)",
//     padding: 10,
//     borderRadius: 8,
//   },

//   infoRow: {
//     marginBottom: 10,
//   },

//   infoLabel: {
//     color: "#9fb7d9",
//     fontSize: 13,
//     fontWeight: 700,
//   },

//   infoValue: {
//     fontSize: 18,
//     fontWeight: 800,
//   },

//   infoValueSmall: {
//     fontSize: 14,
//     fontWeight: 700,
//   },

//   socialCol: {
//     width: 140,
//   },

//   socialTitle: {
//     color: "#9fb7d9",
//     fontSize: 13,
//     fontWeight: 700,
//     marginBottom: 10,
//   },

//   socialList: {
//     listStyle: "none",
//     padding: 0,
//     margin: 0,
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//   },

//   socialItem: {},

//   socialLink: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     textDecoration: "none",
//     padding: "8px 10px",
//     borderRadius: 10,
//     border: "1px solid rgba(255,255,255,0.05)",
//     background: "rgba(255,255,255,0.03)",
//     color: "#fff",
//   },

//   socialIcon: {
//     background: "#3b82f6",
//     color: "#fff",
//     padding: "6px",
//     borderRadius: 8,
//     display: "inline-flex",
//     width: 32,
//     height: 32,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   favSectionWrapper: { marginTop: 30 },

//   favGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
//     gap: 16,
//   },

//   favCard: {
//     width: "100%",
//     background: "#0b1220",
//     borderRadius: 10,
//     overflow: "hidden",
//     border: "1px solid rgba(255,255,255,0.05)",
//   },

//   favImgWrap: { height: 120, overflow: "hidden" },

//   favImg: { width: "100%", height: "120px", objectFit: "cover" },

//   favInfo: { padding: 10 },

//   favTitle: {
//     fontWeight: 800,
//     color: "#fff",
//     marginBottom: 4,
//     fontSize: 14,
//   },

//   favGenre: { fontSize: 12, color: "#93c5fd", marginBottom: 8 },

//   favBtns: { display: "flex", gap: 8 },

//   viewBtn: {
//     flex: 1,
//     background: "#2563eb",
//     border: "none",
//     color: "#fff",
//     padding: "6px 8px",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontSize: 13,
//   },

//   removeBtn: {
//     background: "transparent",
//     border: "1px solid rgba(255,0,0,0.3)",
//     color: "#ff5b5b",
//     padding: "6px",
//     borderRadius: 8,
//     cursor: "pointer",
//     minWidth: 40,
//   },
// };

// /* ------------------------- MODAL / FORM STYLES ------------------------- */
// const modalBackdrop = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.6)",
//   zIndex: 2500,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   padding: 18,
// };

// const modalBox = {
//   width: "min(760px, 96vw)",
//   maxHeight: "90vh",
//   overflow: "auto",
//   background: "#071224",
//   borderRadius: 12,
//   padding: 18,
//   border: "1px solid rgba(255,255,255,0.04)",
//   boxShadow: "0 20px 60px rgba(2,6,23,0.6)",
// };

// const modalHeader = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: 8,
// };

// const modalClose = {
//   background: "transparent",
//   border: "none",
//   color: "#9fb7d9",
//   fontSize: 18,
//   cursor: "pointer",
// };

// const formLabel = { color: "#9fb7d9", fontSize: 13, fontWeight: 700, marginBottom: 6 };
// const formInput = {
//   width: "100%",
//   padding: "8px 10px",
//   borderRadius: 8,
//   background: "rgba(255,255,255,0.03)",
//   border: "1px solid rgba(255,255,255,0.06)",
//   color: "#fff",
//   outline: "none",
//   fontSize: 14,
// };

// const modalCancel = {
//   padding: "8px 12px",
//   borderRadius: 8,
//   background: "transparent",
//   border: "1px solid rgba(255,255,255,0.06)",
//   color: "#cfe8ff",
//   cursor: "pointer",
// };

// const modalSave = {
//   padding: "8px 12px",
//   borderRadius: 8,
//   background: "#2563eb",
//   border: "none",
//   color: "#fff",
//   cursor: "pointer",
//   fontWeight: 800,
// };

// /* RESPONSIVE - keep identical to your previous rules */
// const responsive = `
// @media (max-width: 900px) {
//   .profile-grid {
//     flex-direction: column;
//     gap: 20px;
//   }
//   .profile-left {
//     width: 100% !important;
//     flex-direction: row;
//     align-items: center;
//     gap: 20px;
//   }
//   .profile-avatar-wrap {
//     width: 90px !important;
//     height: 90px !important;
//   }
//   .profile-social-col {
//     width: 100% !important;
//     margin-top: 20px;
//   }
// }

// @media (max-width: 600px) {
//   .fav-grid {
//     grid-template-columns: repeat(2, 1fr) !important;
//   }
// }

// @media (max-width: 400px) {
//   .fav-grid {
//     grid-template-columns: repeat(2, 1fr) !important;
//   }
//   .profile-left {
//     flex-direction: column !important;
//     align-items: flex-start !important;
//   }
// }

// @media (max-width: 300px) {
//   .fav-grid {
//     grid-template-columns: repeat(1, 1fr) !important;
//   }
// }
// /* XP Card Responsive Fix */
// @media (max-width: 600px) {
//   .xp-card-root {
//     transform: scale(1.05);
//   }
// }

// @media (max-width: 420px) {
//   .xp-card-root {
//     transform: scale(1.12);
//   }
// }

// @media (max-width: 350px) {
//   .xp-card-root {
//     transform: scale(1.18);
//   }
// }


// `;

// const styleSheet = document.createElement("style");
// styleSheet.innerText = responsive;
// document.head.appendChild(styleSheet);


///newww////////////////////////////////////////
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

  const avatarPreview = user?.avatar || user?.picture || "/avatars/default.png";

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

  const [shareOpen, setShareOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

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

      if (updateUser) updateUser(updatedUser);

      setEditMsg("Profile updated successfully.");
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
      {/* Background Decor Elements */}
      <div style={styles.ambientGlowTop} />
      <div style={styles.ambientGlowBottom} />

      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h1 style={styles.pageTitle}>
            <span style={styles.pageTitleIcon}>⚡</span> Profile
          </h1>
          <div style={styles.statusBadge}>
            <span style={styles.statusDot} /> ONLINE
          </div>
        </div>  

        <div style={styles.mainGrid} className="profile-main-grid">
          {/* LEFT PROFILE CARD */}
          <div style={styles.profileCard} className="glass-panel">
            <div style={styles.profileHeaderBg} />
            
            <div style={styles.avatarContainer}>
              <div style={styles.avatarRing} />
              <img 
                src={avatarPreview}
                alt="avatar"
                style={styles.avatar}
                onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
              />
              <div style={styles.levelBadge}>{xpStats.level}</div>
            </div>

            <div style={styles.userInfo}>
              <h2 style={styles.userName}>{user?.name}</h2>
              <p style={styles.userUsername}>@{user?.username || "anonymous"}</p>
              
              {user?.bio && (
                <div style={styles.bioContainer}>
                  <p style={styles.userBio}>{user?.bio}</p>
                </div>
              )}
            </div>

            <div style={styles.actionButtons}>
              <button
                style={styles.primaryButton}
                className="premium-btn"
                onClick={() => setEditOpen(true)}
              >
                <span>Edit Profile</span>
                <span style={styles.btnIcon}>✏️</span>
              </button>

              <button
                style={styles.secondaryButton}
                className="glass-btn"
                onClick={() => setShareOpen(true)}
              >
                <span>Share Profile</span>
                <span style={styles.btnIcon}>🔗</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                style={styles.logoutButton}
                className="danger-btn"
              >
                <span>Disconnect</span>
                <span style={styles.btnIcon}>🛑</span>
              </button>
            </div>

            {/* SOCIAL LINKS */}
            <div style={styles.socialSection}>
              <h3 style={styles.sectionTitle}>Connectivity</h3>
              <div style={styles.socialGrid}>
                {socialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.socialLink}
                    className="social-hover"
                  >
                    <span style={styles.socialIconWrapper}>{s.icon}</span>
                    <span style={styles.socialLabel}>{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COL: XP, CHALLENGES, BADGES */}
          <div style={styles.statsColumn}>
            {/* XP CARD */}
           <div style={styles.glassSection} className="glass-panel weekly-shimmer-container">
              <div className="shimmer-anim" style={styles.shimmerOverlay}></div>
              <ProfileXPCard 
                xp={xpStats.xp}
                level={xpStats.level}
                xpNeeded={xpStats.xpNeeded}
                progress={xpStats.progress}
              />
            </div>


            {/* 🏆 WEEKLY CHALLENGES (NEW FEATURE) */}
            <div style={styles.weeklyCard} className="weekly-shimmer-container">
              <div style={styles.shimmerOverlay} className="shimmer-anim"></div>
              <div style={styles.weeklyHeader}>
                <span style={styles.weeklyIcon}>🏆</span>
                <span style={styles.weeklyTitle}>Your Weekly Challenges</span>
              </div>
              <div style={styles.weeklyBody}>
                <div style={styles.lockedState}>
                  <div style={styles.lockIcon} className="pulse-slow">🔒</div>
                  <span style={styles.lockedText}>YET TO COME</span>
                </div>
              </div>
            </div>

            {/* BADGES SECTION */}
            <div style={styles.glassSection} className="glass-panel weekly-shimmer-container">
                <div className="shimmer-anim" style={styles.shimmerOverlay}></div>
                <ProfileBadges
                  badges={xpStats.badges}
                  badgeProgress={xpStats.badgeProgress}
                />
              </div>

          </div>
        </div>

        {/* FAVORITE GAMES SECTION */}
        <div style={styles.favoritesCard} className="glass-panel">
          <div style={styles.favHeader}>
            <h3 style={styles.favoritesTitle}>
              <span style={styles.titleIcon}>❤️</span> Favourites
            </h3>
            <div style={styles.favCount}>{favGames.length} LIKES</div>
          </div>

          {favLoading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loader} />
            </div>
          ) : favGames.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.ghostIcon}>👻</span>
              <p>No favorites yet. Start your collection.</p>
            </div>
          ) : (
            <div style={styles.favGrid} className="fav-grid">
              {favGames.map((g) => (
                <div key={g._id} style={styles.favCard} className="game-card">
                  <div style={styles.favImageWrapper}>
                    <img
                      src={
                        g.thumbnail?.startsWith("/uploads")
                          ? `${API_BASE}${g.thumbnail}`
                          : g.thumbnail
                      }
                      style={styles.favImage}
                      alt={g.title}
                    />
                    <div style={styles.favOverlay}>
                      <button
                        onClick={() => navigate(`/game/${g.slug}`)}
                        style={styles.playButton}
                      >
                        PLAY
                      </button>
                    </div>
                  </div>

                  <div style={styles.favContent}>
                    <div style={styles.favInfo}>
                      <div style={styles.favTitle}>{g.title}</div>
                      <div style={styles.favGenre}>{g.genre}</div>
                    </div>
                    <button
                      onClick={() => handleToggleFav(g._id)}
                      style={styles.heartButton}
                      className="heart-btn"
                    >
                      ♥
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {editOpen && (
        <div style={modalStyles.backdrop} onClick={() => setEditOpen(false)}>
          <div style={modalStyles.container} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <h2 style={modalStyles.title}>UPDATE PROFILE</h2>
              <button onClick={() => setEditOpen(false)} style={modalStyles.closeButton}>
                ✕
              </button>
            </div>

            <div style={modalStyles.content}>
              <div style={modalStyles.avatarSection}>
                <div style={modalStyles.avatarPreview}>
                  <img
                    src={editState.avatar || avatarPreview}
                    alt="avatar"
                    style={modalStyles.avatarImage}
                    onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
                  />
                </div>
                <div style={modalStyles.avatarInfo}>
                  <div style={modalStyles.avatarName}>{user?.name}</div>
                  <button
                    style={modalStyles.avatarButton}
                    className="premium-btn-sm"
                    onClick={() => setShowAvatarSelector(true)}
                  >
                    Change Identity
                  </button>
                </div>
              </div>

              <div style={modalStyles.formGrid}>
                <div style={modalStyles.formGroup}>
                  <label style={modalStyles.label}>Display Name</label>
                  <input
                    value={editState.name}
                    onChange={(e) => handleEditChange("name", e.target.value)}
                    style={modalStyles.input}
                    placeholder="Enter name"
                  />
                </div>

                <div style={modalStyles.formGroup}>
                  <label style={modalStyles.label}>Codename (User)</label>
                  <input
                    value={editState.username || ""}
                    onChange={(e) => handleEditChange("username", e.target.value)}
                    style={modalStyles.input}
                    placeholder="username"
                  />
                </div>

                <div style={modalStyles.formGroup}>
                  <label style={modalStyles.label}>Bio / Status</label>
                  <textarea
                    value={editState.bio}
                    onChange={(e) => handleEditChange("bio", e.target.value)}
                    style={modalStyles.textarea}
                    maxLength={200}
                    placeholder="Tell us your legend..."
                  />
                </div>

                <div style={modalStyles.socialGroup}>
                  <label style={modalStyles.label}>Social Uplinks</label>
                  <div style={modalStyles.socialInputs}>
                    <input
                      value={editState.social.instagram}
                      onChange={(e) => handleEditChange("instagram", e.target.value)}
                      style={modalStyles.inputSocial}
                      placeholder="Instagram URL"
                    />
                    <input
                      value={editState.social.twitter}
                      onChange={(e) => handleEditChange("twitter", e.target.value)}
                      style={modalStyles.inputSocial}
                      placeholder="Twitter / X URL"
                    />
                    <input
                      value={editState.social.linkedin}
                      onChange={(e) => handleEditChange("linkedin", e.target.value)}
                      style={modalStyles.inputSocial}
                      placeholder="LinkedIn URL"
                    />
                  </div>
                </div>

                {editErr && <div style={modalStyles.error}>{editErr}</div>}
                {editMsg && <div style={modalStyles.success}>{editMsg}</div>}
              </div>

              <div style={modalStyles.footer}>
                <button onClick={() => setEditOpen(false)} style={modalStyles.cancelButton}>
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  style={modalStyles.saveButton}
                  className="premium-btn"
                >
                  {saving ? "Processing..." : "Save Changes"}
                </button>
              </div>
            </div>

            <AvatarSelectorWrapper
              visible={showAvatarSelector}
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

      {/* SHARE PROFILE MODAL */}
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

function AvatarSelectorWrapper({ visible, onClose, onSelect, selected }) {
  if (!visible) return null;
  return (
    <AvatarSelector visible={visible} onClose={onClose} onSelect={onSelect} selected={selected} />
  );
}

// ------------------- STYLES -------------------

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#050505",
    color: "#fff",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  ambientGlowTop: {
    position: "absolute",
    top: "-20%",
    left: "10%",
    width: "60%",
    height: "500px",
    background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(0,0,0,0) 70%)",
    filter: "blur(60px)",
    pointerEvents: "none",
    zIndex: 0,
  },
  ambientGlowBottom: {
    position: "absolute",
    bottom: "-10%",
    right: "0%",
    width: "50%",
    height: "500px",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(0,0,0,0) 70%)",
    filter: "blur(80px)",
    pointerEvents: "none",
    zIndex: 0,
  },
  container: {
    width: "100%",
    maxWidth: 1200,
    position: "relative",
    zIndex: 1,
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 900,
    letterSpacing: "1px",
    textTransform: "uppercase",
    background: "linear-gradient(90deg, #fff, #94a3b8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  pageTitleIcon: {
    fontSize: 24,
    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 12px",
    background: "rgba(34, 197, 94, 0.1)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    color: "#4ade80",
    letterSpacing: "0.5px",
  },
  statusDot: {
    width: 8,
    height: 8,
    background: "#4ade80",
    borderRadius: "50%",
    boxShadow: "0 0 8px #4ade80",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "360px 1fr",
    gap: 24,
    marginBottom: 24,
  },
  profileCard: {
    position: "relative",
    borderRadius: 24,
    padding: 30,
    display: "flex",
    flexDirection: "column",
    gap: 24,
    overflow: "hidden",
  },
  profileHeaderBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    background: "linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(0,0,0,0) 100%)",
    zIndex: 0,
  },
  avatarContainer: {
    position: "relative",
    width: 130,
    height: 130,
    margin: "0 auto",
    zIndex: 1,
  },
  avatarRing: {
    position: "absolute",
    inset: -3,
    borderRadius: "50%",
    background: "conic-gradient(from 0deg, transparent 0%, #38bdf8 50%, transparent 100%)",
    animation: "spin 4s linear infinite",
    maskImage: "linear-gradient(transparent, black)",
    WebkitMaskImage: "linear-gradient(transparent, black)",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    border: "4px solid #0f172a",
    objectFit: "cover",
    position: "relative",
    background: "#0f172a",
  },
  levelBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    background: "#3b82f6",
    color: "#fff",
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: 14,
    border: "3px solid #0f172a",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
  },
  userInfo: {
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },
  userName: {
    fontSize: 26,
    fontWeight: 800,
    color: "#fff",
    marginBottom: 4,
    letterSpacing: "-0.5px",
  },
  userUsername: {
    fontSize: 14,
    color: "#94a3b8",
    fontFamily: "'JetBrains Mono', monospace",
  },
  bioContainer: {
    marginTop: 16,
    padding: "12px",
    background: "rgba(0,0,0,0.2)",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.05)",
  },
  userBio: {
    fontSize: 13,
    color: "#cbd5e1",
    lineHeight: 1.5,
    fontStyle: "italic",
  },
  actionButtons: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    width: "100%",
    padding: "14px",
    borderRadius: 14,
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
    transition: "all 0.3s ease",
  },
  secondaryButton: {
    width: "100%",
    padding: "14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    color: "#e2e8f0",
    border: "1px solid rgba(255,255,255,0.08)",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  },
  logoutButton: {
    width: "100%",
    padding: "14px",
    borderRadius: 14,
    background: "rgba(239, 68, 68, 0.05)",
    color: "#f87171",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    transition: "all 0.3s ease",
  },
  btnIcon: {
    opacity: 0.8,
  },
  socialSection: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 800,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: 12,
  },
  socialGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 8,
  },
  socialLink: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: 13,
    transition: "all 0.2s ease",
  },
  socialIconWrapper: {
    fontSize: 16,
  },
  statsColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  glassSection: {
    borderRadius: 24,
    padding: 24,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  // --- NEW WEEKLY CHALLENGE CARD ---
  weeklyCard: {
    position: "relative",
    borderRadius: 24,
    padding: "24px",
    border: "1px solid rgba(56, 189, 248, 0.2)", // Cyan tint
    background: "rgba(15, 23, 42, 0.4)",
    overflow: "hidden",
    backdropFilter: "blur(12px)",
    boxShadow: "0 0 20px rgba(56, 189, 248, 0.05)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.05), transparent)",
    transform: "skewX(-20deg)",
    zIndex: 0,
    pointerEvents: "none",
  },
  weeklyHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    position: "relative",
    zIndex: 1,
  },
  weeklyIcon: {
    fontSize: 20,
    filter: "drop-shadow(0 0 8px rgba(250, 204, 21, 0.6))",
  },
  weeklyTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "0.5px",
  },
  weeklyBody: {
    background: "rgba(0,0,0,0.3)",
    borderRadius: 16,
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px dashed rgba(255,255,255,0.1)",
    position: "relative",
    zIndex: 1,
  },
  lockedState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    opacity: 0.6,
  },
  lockIcon: {
    fontSize: 20,
  },
  lockedText: {
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "2px",
    color: "#94a3b8",
  },
  // ------------------------------
  favoritesCard: {
    borderRadius: 24,
    padding: 32,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  favHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  favoritesTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 12,
    letterSpacing: "1px",
  },
  titleIcon: {
    filter: "drop-shadow(0 0 8px rgba(244, 63, 94, 0.5))",
  },
  favCount: {
    fontSize: 12,
    fontWeight: 700,
    color: "#64748b",
    background: "rgba(255,255,255,0.05)",
    padding: "4px 10px",
    borderRadius: 12,
  },
  favGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 20,
  },
  favCard: {
    background: "rgba(255,255,255,0.02)",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.05)",
    transition: "all 0.4s ease",
    position: "relative",
    group: "fav",
  },
  favImageWrapper: {
    position: "relative",
    height: 180, // Taller, premium aspect ratio
    overflow: "hidden", 
  },
  favImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
  },
  favOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "all 0.3s ease",
  },
  playButton: {
    padding: "10px 24px",
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: 30,
    fontWeight: 800,
    fontSize: 12,
    cursor: "pointer",
    letterSpacing: "1px",
    transform: "translateY(10px)",
    transition: "all 0.3s ease",
  },
  favContent: {
    padding: "12px",
    background: "linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
  favTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#fff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 120,
  },
  favGenre: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
  },
  heartButton: {
    background: "rgba(255,255,255,0.05)",
    border: "none",
    color: "#f43f5e",
    width: 32,
    height: 32,
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    transition: "all 0.2s ease",
  },
  loadingContainer: {
    padding: 40,
    display: "flex",
    justifyContent: "center",
  },
  loader: {
    width: 24,
    height: 24,
    border: "2px solid #3b82f6",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  emptyState: {
    textAlign: "center",
    padding: 60,
    color: "#64748b",
    fontSize: 14,
    border: "1px dashed rgba(255,255,255,0.1)",
    borderRadius: 16,
  },
  ghostIcon: {
    fontSize: 32,
    marginBottom: 10,
    display: "block",
    opacity: 0.5,
  },
};

const modalStyles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(16px)",
    zIndex: 3000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    animation: "fadeIn 0.2s ease",
  },
  container: {
    width: "min(600px, 95vw)",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 24,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "24px 32px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255,255,255,0.02)",
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  closeButton: {
    background: "transparent",
    border: "none",
    color: "#64748b",
    fontSize: 20,
    cursor: "pointer",
    transition: "color 0.2s",
  },
  content: {
    padding: 32,
    display: "flex",
    flexDirection: "column",
    gap: 32,
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: 24,
  },
  avatarPreview: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    border: "2px solid rgba(59, 130, 246, 0.5)",
    padding: 4,
    background: "rgba(0,0,0,0.3)",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
  },
  avatarInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  avatarName: {
    fontSize: 16,
    fontWeight: 700,
    color: "#fff",
  },
  avatarButton: {
    background: "rgba(59, 130, 246, 0.1)",
    color: "#60a5fa",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  formGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    background: "#1e293b",
    border: "1px solid rgba(255,255,255,0.05)",
    color: "#fff",
    padding: "14px",
    borderRadius: 12,
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
  },
  textarea: {
    background: "#1e293b",
    border: "1px solid rgba(255,255,255,0.05)",
    color: "#fff",
    padding: "14px",
    borderRadius: 12,
    fontSize: 14,
    minHeight: 100,
    resize: "none",
    outline: "none",
  },
  socialGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  socialInputs: {
    display: "grid",
    gap: 12,
  },
  inputSocial: {
    background: "#1e293b",
    border: "1px solid rgba(255,255,255,0.05)",
    color: "#94a3b8",
    padding: "12px",
    borderRadius: 10,
    fontSize: 13,
    outline: "none",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#94a3b8",
    padding: "12px 24px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  saveButton: {
    background: "#2563eb",
    border: "none",
    color: "#fff",
    padding: "12px 32px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
  },
  error: {
    color: "#f87171",
    fontSize: 13,
    background: "rgba(248, 113, 113, 0.1)",
    padding: 12,
    borderRadius: 8,
  },
  success: {
    color: "#4ade80",
    fontSize: 13,
    background: "rgba(74, 222, 128, 0.1)",
    padding: 12,
    borderRadius: 8,
  },
};

// ------------------- GLOBAL RESPONSIVE STYLES -------------------
const responsiveStyles = `
/* Global Animations */
@keyframes spin { 100% { transform: rotate(360deg); } }
@keyframes pulse-slow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
@keyframes shimmerMove { 0% { transform: translateX(-150%) skewX(-20deg); } 100% { transform: translateX(150%) skewX(-20deg); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

/* Glass Panel Base */
.glass-panel {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Hover Glow Effects */
.hover-glow:hover {
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.1);
}

/* Button Interactions */
.premium-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255,255,255,0.3);
}
.premium-btn:active { transform: translateY(0); }

.glass-btn:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.2);
}

.danger-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
}

/* Social Interactions */
.social-hover:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.2);
  transform: translateX(4px);
  color: #fff;
}

/* Weekly Challenge Shimmer */
.weekly-shimmer-container:hover {
  transform: scale(1.02);
  border-color: rgba(56, 189, 248, 0.4);
  box-shadow: 0 0 30px rgba(56, 189, 248, 0.15);
}
.weekly-shimmer-container { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.shimmer-anim { animation: shimmerMove 3s infinite linear; }
.pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }

/* Game Card Interactions */
.game-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(255,255,255,0.2);
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  z-index: 10;
}
.game-card:hover img { transform: scale(1.1); }
.game-card:hover .fav-overlay { opacity: 1; }
.game-card:hover button.play-button { transform: translateY(0); }

.heart-btn:hover {
  background: rgba(244, 63, 94, 0.1);
  transform: scale(1.1);
}

/* Form Inputs */
input:focus, textarea:focus {
  border-color: #3b82f6 !important;
  background: #1e293b !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* Responsive Breakpoints */
@media (max-width: 1024px) {
  .profile-main-grid { grid-template-columns: 1fr !important; }
  .fav-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important; }
}
@media (max-width: 640px) {
  .fav-grid { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (max-width: 480px) {
  .fav-grid { grid-template-columns: 1fr !important; }
  .header-row { flex-direction: column; align-items: flex-start; gap: 10px; }
}
`;

const styleElement = document.createElement("style");
styleElement.textContent = responsiveStyles;
if (!document.head.querySelector('style[data-profile-premium]')) {
  styleElement.setAttribute('data-profile-premium', 'true');
  document.head.appendChild(styleElement);
}