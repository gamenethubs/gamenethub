
// // src/pages/PublicProfile.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import { useSocket } from "../context/SocketContext";

// const API_BASE = process.env.REACT_APP_API_BASE;

// export default function PublicProfile() {
//   const { username } = useParams();
//   const navigate = useNavigate();
//   const { user: me, isAuthenticated } = useAuth();

//   const socketRef = useSocket();
//   const mainSocket = socketRef?.current?.main || null;
//   const presenceSocket = socketRef?.current?.presence || null;

//   const mountedRef = useRef(true);

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);

//   const norm = (id) => (id ? id.toString() : "");

//   // -----------------------------------------
//   // Load profile from backend
//   // -----------------------------------------
//   const loadProfile = async () => {
//     try {
//       setLoading(true);
//       const res = await API.get(`/users/${encodeURIComponent(username)}`);
//       const p = res.data?.user;


//       if (!mountedRef.current) return;
//       setProfile(p ? { ...p, id: p._id } : null);


//     } catch (err) {
//       console.error("LOAD PROFILE ERROR:", err);
//       if (mountedRef.current) setProfile(null);
//     } finally {
//       if (mountedRef.current) setLoading(false);
//     }
//   };

//   useEffect(() => {
//     mountedRef.current = true;
//     window.scrollTo(0, 0);
//     loadProfile();
//     return () => (mountedRef.current = false);
//   }, [username]);

//   const safeSetProfile = (partial) => {
//     setProfile((prev) => (prev ? { ...prev, ...partial } : prev));
//   };

 

// // -----------------------------------------
// // REALTIME SOCKET SYNC (FINAL FIX)
// // -----------------------------------------
// useEffect(() => {
//   const reload = async () => {
//     try {
//       const res = await API.get(`/users/${encodeURIComponent(username)}`);
//       const p = res.data?.user;
//       if (mountedRef.current) setProfile(p ? { ...p, id: p._id } : null);
//     } catch (err) {
//       console.error("RELOAD PROFILE ERROR:", err);
//     }
//   };  
//   if (!profile) return;

//   const pid = norm(profile.id);

// //   const reload = () => loadProfile();

//   // --- Handlers ---
//   const onRelationshipUpdate = (e) => {
//     // e.detail contains the payload, which should have { userId }
//     if (norm(e.detail?.userId) === pid) reload();
//   };

//   const onFriendsUpdated = () => {
//   console.log("🔵 SOCKET friends_updated RECEIVED");
//   reload();
// };


//   const onFriendOnline = (e) => {
//     if (norm(e.detail?.userId) === pid) safeSetProfile({ online: true });
//   };

//   const onFriendOffline = (e) => {
//     if (norm(e.detail?.userId) === pid) safeSetProfile({ online: false });
//   };

//   // The simple reload events (these happen when ANY action occurs)
//   const onAnyRelationshipChange = (e) => {
//   reload();
// };



//   // ⭐ THE FIX: Listen to Window Custom Events (from SocketContext) ⭐
//   
//   // CORE SYNC EVENTS (Relationship & Mutual Friends)
//   window.addEventListener("relationship_update", onRelationshipUpdate);
//   window.addEventListener("friends_updated", onFriendsUpdated);
//   
//   // PRESENCE EVENTS
//   window.addEventListener("friend-online", onFriendOnline);
//   window.addEventListener("friend-offline", onFriendOffline);
//   
//   // FALLBACK FOR REQUESTS (We just need to reload if any friend action occurred)
//   window.addEventListener("friend_request_received", onAnyRelationshipChange);
//   window.addEventListener("friend_request_accepted", onAnyRelationshipChange);
//   window.addEventListener("friend_request_rejected", onAnyRelationshipChange);

//   return () => {
//     // ⭐ CLEANUP THE WINDOW LISTENERS ⭐
//     window.removeEventListener("relationship_update", onRelationshipUpdate);
//     window.removeEventListener("friends_updated", onFriendsUpdated);

//     window.removeEventListener("friend-online", onFriendOnline);
//     window.removeEventListener("friend-offline", onFriendOffline);

//     window.removeEventListener("friend_request_received", onAnyRelationshipChange);
//     window.removeEventListener("friend_request_accepted", onAnyRelationshipChange);
//     window.removeEventListener("friend_request_rejected", onAnyRelationshipChange);
//   };
// }, [profile, username]); 
// // 'profile' dependency is important for initial profile ID


//   // -----------------------------------------
//   // ACTIONS (Perfect sync)
//   // -----------------------------------------
//   // src/pages/PublicProfile.jsx

// // -----------------------------------------
// // ACTIONS (Final Fix for State Sync)
// // -----------------------------------------
//   const doAction = async (api, optimistic) => {
//     setActionLoading(true);
//     
//     // 1. Optimistic Update (Quick visual feedback)
//     if (optimistic) safeSetProfile(optimistic);
//     
//     try {
//       // 2. Perform the API action (Accept, Unfriend, etc.)
//       await api();
//       
//       // 3. Fetch the new data from the server
//       await loadProfile();
// // ⭐ DEBUG: Check final relationship after server updates

//       
//     } catch (err) {
//       console.error("DO ACTION ERROR:", err);
//       
//       await loadProfile();
//     }
//     
//     
//     setActionLoading(false);
//   };

//   // PublicProfile.jsx

//   const handleAdd = () => {
//     const targetId = profile.id || profile._id;
//     return doAction(
//       () => API.post("/friends/request", { toUserId: targetId }),
//       { relationship: "outgoing" }
//     );
//   };
//   const handleCancel = () =>
//     doAction(
//       () => API.post("/friends/request/cancel", { toUserId: profile.id || profile._id }),
//       { relationship: "none" }
//     );

//   const handleAccept = () =>
//     doAction(
//       () => API.post("/friends/request/accept", { fromUserId: profile.id || profile._id }),
//       { relationship: "friend" }
//     );

//   const handleReject = () =>
//     doAction(
//       () => API.post("/friends/request/reject", { fromUserId: profile.id || profile._id }),
//       { relationship: "none" }
//     );

//   const handleUnfriend = () =>
//     doAction(
//       () => API.post("/friends/remove", { friendId: profile.id || profile._id }),
//       { relationship: "none" }
//     );

//   // STATUS
//   const rel = profile?.relationship;
//   const isFriend = rel === "friend";
//   const isOutgoing = rel === "outgoing";
//   const isIncoming = rel === "incoming";
//   const isMe = me?.username === profile?.username;

//   const renderFriendButton = () => {
//     if (!isAuthenticated || isMe) return null;

//     if (isFriend)
//       return (
//         <div style={{ display: "flex", gap: 10 }}>
//           <button style={styles.primaryBtn}>Friend ✓</button>
//           <button style={styles.unfriendBtn} onClick={handleUnfriend} disabled={actionLoading}>
//             Unfriend
//           </button>
//         </div>
//       );

//     if (isOutgoing)
//       return (
//         <div style={{ display: "flex", gap: 10 }}>
//           <button style={styles.sentBtn}>Sent</button>
//           <button style={styles.cancelBtn} onClick={handleCancel} disabled={actionLoading}>
//             Cancel
//           </button>
//         </div>
//       );

//     if (isIncoming)
//       return (
//         <div style={{ display: "flex", gap: 10 }}>
//           <button style={styles.acceptBtn} onClick={handleAccept} disabled={actionLoading}>
//             Accept
//           </button>
//           <button style={styles.rejectBtn} onClick={handleReject} disabled={actionLoading}>
//             Reject
//           </button>
//         </div>
//       );

//     return (
//       <button style={styles.addBtn} onClick={handleAdd} disabled={actionLoading}>
//         Add Friend
//       </button>
//     );
//   };


//   if (loading)
//     return (
//       <div style={screenCenter}>
//         <div style={{ color: "#9fb7d9" }}>Loading profile...</div>
//       </div>
//     );

//   if (!profile)
//     return (
//       <div style={screenCenter}>
//         <div style={{ color: "#ff7b7b" }}>User not found.</div>
//       </div>
//     );

//   // -----------------------------------------
//   // UI
//   // -----------------------------------------
//   return (
//     <div style={styles.wrapper}>
//       <div style={styles.card}>
//         <div style={styles.headerSection}>
//           <div style={styles.avatarBox}>
//             <img
//               src={profile.avatar || "/avatars/default.png"}
//               style={styles.avatar}
//               alt="avatar"
//               onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
//             />

//             {isFriend && (
//               <div style={profile.online ? styles.onlineDot : styles.offlineDot} />
//             )}
//           </div>

//           <div>
//             <div style={styles.name}>{profile.name}</div>
//             <div style={styles.username}>@{profile.username}</div>
//             {profile.bio && <div style={styles.bio}>{profile.bio}</div>}

//             <div style={{ marginTop: 12 }}>{renderFriendButton()}</div>
//           </div>
//         </div>

//         {/* Favorites */}
//         <h3 style={styles.sectionTitle}>❤️ Favorite Games</h3>

//         {!profile.favorites?.length ? (
//           <div style={{ color: "#9fb7d9" }}>No favorites.</div>
//         ) : (
//           <div style={styles.favGrid}>
//             {profile.favorites.map((g) => (
//               <div key={g._id} style={styles.favCard}>
//                 <img
//                   src={
//                     g.thumbnail?.startsWith("/uploads")
//                       ? `${API_BASE}${g.thumbnail}`
//                       : g.thumbnail
//                   }
//                   alt={g.title}
//                   style={styles.favImg}
//                 />
//                 <div style={styles.favInfo}>
//                   <div style={styles.favTitle}>{g.title}</div>
//                   <div style={styles.favGenre}>{g.genre}</div>
//                   <button
//                     style={styles.viewBtn}
//                     onClick={() => navigate(`/game/${g.slug}`)}
//                   >
//                     View
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Mutual Friends */}
//         <h3 style={{ ...styles.sectionTitle, marginTop: 28 }}>
//           👥 Mutual Friends ({profile.mutualFriends?.length || 0})
//         </h3>

//         {!profile.mutualFriends?.length ? (
//           <div style={{ color: "#9fb7d9" }}>No mutual friends.</div>
//         ) : (
//           <div style={styles.mutualGrid}>
//             {profile.mutualFriends.map((m) => (
//               <div
//                 key={m._id}
//                 style={styles.mutualCard}
//                 onClick={() => navigate(`/user/${m.username}`)}
//               >
//                 <img
//                   src={m.avatar || "/avatars/default.png"}
//                   alt={m.username}
//                   style={styles.mutualAvatar}
//                 />
//                 <div style={styles.mutualName}>{m.username}</div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // --- styles remain same as before (unchanged) ---
// const styles = {
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

//   headerSection: {
//     display: "flex",
//     gap: 20,
//     marginBottom: 30,
//     alignItems: "flex-start",
//     flexWrap: "wrap",
//   },

//   avatarBox: {
//     width: 110,
//     height: 110,
//     position: "relative",
//     borderRadius: 14,
//     overflow: "hidden",
//     background: "#071224",
//   },

//   avatar: { width: "100%", height: "100%", objectFit: "cover" },

//   onlineDot: {
//     position: "absolute",
//     bottom: -4,
//     right: -4,
//     width: 16,
//     height: 16,
//     borderRadius: 20,
//     background: "#34d399",
//     border: "2px solid #0f172a",
//   },

//   offlineDot: {
//     position: "absolute",
//     bottom: -4,
//     right: -4,
//     width: 16,
//     height: 16,
//     borderRadius: 20,
//     background: "#9ca3af",
//     border: "2px solid #0f172a",
//   },

//   name: { fontSize: 22, fontWeight: 800 },
//   username: { marginTop: 2, fontSize: 14, opacity: 0.8 },
//   bio: { marginTop: 10, fontSize: 14, maxWidth: 450 },

//   sectionTitle: {
//     marginTop: 10,
//     marginBottom: 10,
//     fontWeight: 800,
//     fontSize: 18,
//   },

//   favGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
//     gap: 16,
//   },

//   favCard: {
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

//   mutualGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
//     gap: 16,
//   },

//   mutualCard: {
//     background: "rgba(255,255,255,0.03)",
//     borderRadius: 12,
//     padding: 12,
//     textAlign: "center",
//     cursor: "pointer",
//     border: "1px solid rgba(255,255,255,0.06)",
//   },

//   mutualAvatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 12,
//     objectFit: "cover",
//     marginBottom: 6,
//   },

//   mutualName: {
//     color: "#e6f0ff",
//     fontWeight: 700,
//     fontSize: 14,
//   },

//   addBtn: {
//     padding: "10px 16px",
//     borderRadius: 10,
//     background: "#3b82f6",
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//     fontWeight: 700,
//   },

//   sentBtn: {
//     padding: "10px 14px",
//     borderRadius: 10,
//     background: "rgba(255,255,255,0.1)",
//     color: "#cfe8ff",
//     border: "none",
//     fontWeight: 700,
//   },

//   cancelBtn: {
//     padding: "10px 14px",
//     borderRadius: 10,
//     background: "transparent",
//     border: "1px solid rgba(255,255,255,0.15)",
//     color: "#fff",
//     cursor: "pointer",
//   },

//   acceptBtn: {
//     padding: "10px 14px",
//     borderRadius: 10,
//     background: "#10b981",
//     color: "#052014",
//     border: "none",
//     cursor: "pointer",
//     fontWeight: 800,
//   },

//   rejectBtn: {
//     padding: "10px 14px",
//     borderRadius: 10,
//     background: "transparent",
//     border: "1px solid rgba(255,255,255,0.15)",
//     color: "#fff",
//     cursor: "pointer",
//   },

//   primaryBtn: {
//     padding: "10px 14px",
//     borderRadius: 10,
//     background: "#3b82f6",
//     border: "none",
//     color: "#fff",
//     cursor: "pointer",
//     fontWeight: 700,
//   },

//   unfriendBtn: {
//     padding: "10px 14px",
//     borderRadius: 10,
//     background: "transparent",
//     border: "1px solid rgba(255,255,255,0.15)",
//     color: "#ff7b7b",
//     cursor: "pointer",
//     fontWeight: 700,
//   },
// };

// const screenCenter = {
//   minHeight: "100vh",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   background: "#0f172a",
//   color: "#fff",
// };


// /////////////////new./////////////////////
// src/pages/PublicProfile.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
// src/pages/PublicProfile.jsx
import ChatButton from "../components/ChatButton";


const API_BASE = process.env.REACT_APP_API_BASE;

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: me, isAuthenticated } = useAuth();

  const socketRef = useSocket();
  // Keeping these to preserve original logic flow, even if not directly used in the simplified view
  const mainSocket = socketRef?.current?.main || null;
  const presenceSocket = socketRef?.current?.presence || null;

  const mountedRef = useRef(true);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const norm = (id) => (id ? id.toString() : "");

  // -----------------------------------------
  // Load profile from backend
  // -----------------------------------------
  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/users/${encodeURIComponent(username)}`);
      const p = res.data?.user;

      if (!mountedRef.current) return;
      setProfile(p ? { ...p, id: p._id } : null);

    } catch (err) {
      console.error("LOAD PROFILE ERROR:", err);
      if (mountedRef.current) setProfile(null);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    window.scrollTo(0, 0);
    loadProfile();
    return () => (mountedRef.current = false);
  }, [username]);

  const safeSetProfile = (partial) => {
    setProfile((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  // -----------------------------------------
  // REALTIME SOCKET SYNC (FINAL FIX)
  // -----------------------------------------
  useEffect(() => {
    const reload = async () => {
      try {
        const res = await API.get(`/users/${encodeURIComponent(username)}`);
        const p = res.data?.user;
        if (mountedRef.current) setProfile(p ? { ...p, id: p._id } : null);
      } catch (err) {
        console.error("RELOAD PROFILE ERROR:", err);
      }
    };
    if (!profile) return;

    const pid = norm(profile.id);

    // --- Handlers ---
    const onRelationshipUpdate = (e) => {
      // e.detail contains the payload, which should have { userId }
      if (norm(e.detail?.userId) === pid) reload();
    };

    const onFriendsUpdated = () => {
      // console.log("🔵 SOCKET friends_updated RECEIVED");
      reload();
    };

    const onFriendOnline = (e) => {
      if (norm(e.detail?.userId) === pid) safeSetProfile({ online: true });
    };

    const onFriendOffline = (e) => {
      if (norm(e.detail?.userId) === pid) safeSetProfile({ online: false });
    };

    // The simple reload events (these happen when ANY action occurs)
    const onAnyRelationshipChange = (e) => {
      reload();
    };

    // ⭐ THE FIX: Listen to Window Custom Events (from SocketContext) ⭐
    
    // CORE SYNC EVENTS (Relationship & Mutual Friends)
    window.addEventListener("relationship_update", onRelationshipUpdate);
    window.addEventListener("friends_updated", onFriendsUpdated);
    
    // PRESENCE EVENTS
    window.addEventListener("friend-online", onFriendOnline);
    window.addEventListener("friend-offline", onFriendOffline);
    
    // FALLBACK FOR REQUESTS (We just need to reload if any friend action occurred)
    window.addEventListener("friend_request_received", onAnyRelationshipChange);
    window.addEventListener("friend_request_accepted", onAnyRelationshipChange);
    window.addEventListener("friend_request_rejected", onAnyRelationshipChange);

    return () => {
      // ⭐ CLEANUP THE WINDOW LISTENERS ⭐
      window.removeEventListener("relationship_update", onRelationshipUpdate);
      window.removeEventListener("friends_updated", onFriendsUpdated);

      window.removeEventListener("friend-online", onFriendOnline);
      window.removeEventListener("friend-offline", onFriendOffline);

      window.removeEventListener("friend_request_received", onAnyRelationshipChange);
      window.removeEventListener("friend_request_accepted", onAnyRelationshipChange);
      window.removeEventListener("friend_request_rejected", onAnyRelationshipChange);
    };
  }, [profile, username]); 

  // -----------------------------------------
  // ACTIONS (Final Fix for State Sync)
  // -----------------------------------------
  const doAction = async (api, optimistic) => {
    setActionLoading(true);
    
    // 1. Optimistic Update (Quick visual feedback)
    if (optimistic) safeSetProfile(optimistic);
    
    try {
      // 2. Perform the API action (Accept, Unfriend, etc.)
      await api();
      
      // 3. Fetch the new data from the server
      await loadProfile();
      
    } catch (err) {
      console.error("DO ACTION ERROR:", err);
      await loadProfile();
    }
    
    setActionLoading(false);
  };

  const handleAdd = () => {
    const targetId = profile.id || profile._id;
    return doAction(
      () => API.post("/friends/request", { toUserId: targetId }),
      { relationship: "outgoing" }
    );
  };
  const handleCancel = () =>
    doAction(
      () => API.post("/friends/request/cancel", { toUserId: profile.id || profile._id }),
      { relationship: "none" }
    );

  const handleAccept = () =>
    doAction(
      () => API.post("/friends/request/accept", { fromUserId: profile.id || profile._id }),
      { relationship: "friend" }
    );

  const handleReject = () =>
    doAction(
      () => API.post("/friends/request/reject", { fromUserId: profile.id || profile._id }),
      { relationship: "none" }
    );

  const handleUnfriend = () =>
    doAction(
      () => API.post("/friends/remove", { friendId: profile.id || profile._id }),
      { relationship: "none" }
    );

  // STATUS
  const rel = profile?.relationship;
  const isFriend = rel === "friend";
  const isOutgoing = rel === "outgoing";
  const isIncoming = rel === "incoming";
  const isMe = me?.username === profile?.username;

  const renderFriendButton = () => {
    if (!isAuthenticated || isMe) return null;

    if (isFriend)
      return (
        <div className="pp-btn-group">
          <button className="pp-btn pp-btn-success pp-no-hover">Friend ✓</button>
          <button className="pp-btn pp-btn-danger-ghost" onClick={handleUnfriend} disabled={actionLoading}>
            Unfriend
          </button>
        </div>
      );

    if (isOutgoing)
      return (
        <div className="pp-btn-group">
          <button className="pp-btn pp-btn-neutral">Sent</button>
          <button className="pp-btn pp-btn-outline" onClick={handleCancel} disabled={actionLoading}>
            Cancel
          </button>
        </div>
      );

    if (isIncoming)
      return (
        <div className="pp-btn-group">
          <button className="pp-btn pp-btn-glow-green" onClick={handleAccept} disabled={actionLoading}>
            Accept
          </button>
          <button className="pp-btn pp-btn-outline" onClick={handleReject} disabled={actionLoading}>
            Reject
          </button>
        </div>
      );

    return (
      <button className="pp-btn pp-btn-glow-primary" onClick={handleAdd} disabled={actionLoading}>
        + Add Friend
      </button>
    );
  };

  // -----------------------------------------
  // RENDER LOADING / ERROR
  // -----------------------------------------
  if (loading)
    return (
      <div className="pp-screen-center">
        <style>{premiumStyles}</style>
        <div className="pp-loader">
          <div className="pp-loader-ring"></div>
          <div className="pp-loader-text">INITIALIZING PROFILE...</div>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="pp-screen-center">
        <style>{premiumStyles}</style>
        <div className="pp-error-box">
          <div className="pp-error-glitch" data-text="404">404</div>
          <div className="pp-error-msg">USER NOT FOUND</div>
        </div>
      </div>
    );

  // -----------------------------------------
  // MAIN UI
  // -----------------------------------------
  return (
    <div className="pp-wrapper">
      <style>{premiumStyles}</style>
      <div className="pp-grid-background"></div>
      
      <div className="pp-card glass-panel">
        
        {/* === HEADER SECTION === */}
        <div className="pp-header">
          
          {/* AVATAR RING SYSTEM */}
          <div className="pp-avatar-container">
            <div className={`pp-avatar-ring ${profile.online ? 'ring-online' : 'ring-offline'}`}>
              <div className="ring-spinner"></div>
              <div className="ring-glow"></div>
            </div>
            
            <div className="pp-avatar-mask">
              <img
                src={profile.avatar || "/avatars/default.png"}
                className="pp-avatar-img"
                alt="avatar"
                onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
              />
            </div>

            {/* Online Status Indicator */}
            {isFriend && (
              <div className={`pp-status-indicator ${profile.online ? 'status-online' : 'status-offline'}`}>
                <div className="status-ping"></div>
              </div>
            )}
          </div>

          <div className="pp-user-details">
            <h1 className="pp-name">{profile.name}</h1>
            
            {/* XP PROGRESS BAR SYSTEM */}
            <div className="pp-xp-system">
              <div className="pp-xp-header">
                <span className="pp-username">@{profile.username}</span>
                <span className="pp-lvl-badge">LVL 42</span>
              </div>
              <div className="pp-xp-track">
                <div className="pp-xp-fill" style={{ width: '75%' }}>
                  <div className="pp-xp-shine"></div>
                </div>
              </div>
            </div>

            {profile.bio && <div className="pp-bio">{profile.bio}</div>}

            {/* BADGE SHOWCASE SYSTEM */}
            <div className="pp-badge-showcase">
              <div className="pp-badge-slot glow-gold" title="Early Adopter">🛡️</div>
              <div className="pp-badge-slot glow-blue" title="Verified Streamer">💎</div>
              <div className="pp-badge-slot glow-purple" title="Top Fragger">⚔️</div>
              <div className="pp-badge-slot empty-slot"></div>
            </div>

            <div className="pp-action-area">
                <div className="pp-action-row">
                  {renderFriendButton()}
                  {isFriend && (
                    <div className="pp-chat-btn-wrap">
                      <ChatButton friend={profile} />
                    </div>
                  )}
                </div>
              </div>

          </div>
        </div>

        <div className="pp-divider"></div>

        {/* === FAVORITES SECTION === */}
        <h3 className="pp-section-title">
          <span>❤️{profile.name?.toUpperCase()} FAVORITE GAMES</span>
        </h3>

        {!profile.favorites?.length ? (
          <div className="pp-empty-state">No favorite games pinned.</div>
        ) : (
          <div className="pp-games-grid">
            {profile.favorites.map((g) => (
              <div key={g._id} className="pp-game-card">
                <div className="pp-game-img-wrap">
                  <img
                    src={
                      g.thumbnail?.startsWith("/uploads")
                        ? `${API_BASE}${g.thumbnail}`
                        : g.thumbnail
                    }
                    alt={g.title}
                    className="pp-game-img"
                  />
                  <div className="pp-game-overlay"></div>
                </div>
                <div className="pp-game-info">
                  <div className="pp-game-title">{g.title}</div>
                  <div className="pp-game-genre">{g.genre}</div>
                  <button
                    className="pp-btn-mini"
                    onClick={() => navigate(`/game/${g.slug}`)}
                  >
                    VIEW
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === MUTUAL FRIENDS SECTION === */}
        <h3 className="pp-section-title mt-large">
          <span>👥 MUTUAL FRIENDS</span>
          <span className="pp-count-badge">{profile.mutualFriends?.length || 0}</span>
        </h3>

        {!profile.mutualFriends?.length ? (
          <div className="pp-empty-state">No mutual connections found.</div>
        ) : (
          <div className="pp-friends-grid">
            {profile.mutualFriends.map((m) => (
              <div
                key={m._id}
                className="pp-friend-card"
                onClick={() => navigate(`/user/${m.username}`)}
              >
                <div className="pp-friend-avatar-wrap">
                  <img
                    src={m.avatar || "/avatars/default.png"}
                    alt={m.username}
                    className="pp-friend-avatar"
                  />
                  <div className="pp-friend-glow"></div>
                </div>
                <div className="pp-friend-name">{m.username}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// PREMIUM CSS STYLES (EMBEDDED)
// ----------------------------------------------------------------------
const premiumStyles = `
/* --- VARIABLES & THEME --- */
:root {
  --pp-bg-dark: #050b14;
  --pp-panel-bg: rgba(16, 24, 40, 0.75);
  --pp-primary: #3b82f6;
  --pp-accent: #8b5cf6;
  --pp-neon-blue: #00f3ff;
  --pp-neon-purple: #bc13fe;
  --pp-glass-border: rgba(255, 255, 255, 0.08);
  --pp-font-main: 'Inter', system-ui, -apple-system, sans-serif;
}

/* --- LAYOUT WRAPPERS --- */
.pp-wrapper {
  min-height: 100vh;
  background-color: var(--pp-bg-dark);
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 40%);
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  font-family: var(--pp-font-main);
  color: #fff;
  position: relative;
  overflow-x: hidden;
}

/* Sci-fi Grid Background Effect */
.pp-grid-background {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.pp-card {
  width: 100%;
  max-width: 950px;
  position: relative;
  z-index: 1;
  border-radius: 24px;
  padding: 40px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: var(--pp-panel-bg);
  border: 1px solid var(--pp-glass-border);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
    
}

/* --- HEADER SECTION --- */
.pp-header {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  margin-bottom: 30px;
}

/* --- AVATAR SYSTEM --- */
.pp-avatar-container {
  width: 140px;
  height: 140px;
  position: relative;
  flex-shrink: 0;
}

.pp-avatar-mask {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  z-index: 2;
  border: 4px solid rgba(15, 23, 42, 0.8);
}

.pp-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.pp-avatar-container:hover .pp-avatar-img {
  transform: scale(1.1);
}

/* Avatar Ring Animation */
.pp-avatar-ring {
  position: absolute;
  top: -8px; left: -8px; right: -8px; bottom: -8px;
  border-radius: 50%;
  z-index: 1;
}

.ring-spinner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid transparent;
  position: absolute;
  animation: spin 6s linear infinite;
}

.ring-online .ring-spinner {
  border-top-color: var(--pp-neon-blue);
  border-right-color: rgba(0, 243, 255, 0.3);
}

.ring-offline .ring-spinner {
  border-top-color: #64748b;
  border-right-color: rgba(100, 116, 139, 0.3);
}

.ring-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0.4;
  filter: blur(8px);
}

.ring-online .ring-glow {
  background: radial-gradient(circle, transparent 50%, var(--pp-neon-blue) 100%);
  animation: pulse-blue 3s infinite ease-in-out;
}

/* Online Status Dot */
.pp-status-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  z-index: 10;
  border: 4px solid var(--pp-bg-dark);
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-online { background: #10b981; box-shadow: 0 0 10px #10b981; }
.status-offline { background: #64748b; }

.status-ping {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: inherit;
  opacity: 0.6;
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.status-offline .status-ping { animation: none; display: none; }

/* --- USER DETAILS & XP --- */
.pp-user-details {
  flex: 1;
  min-width: 0;
}

.pp-name {
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(to right, #fff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
  line-height: 1.1;
}

/* XP Bar System */
.pp-xp-system {
  margin: 12px 0;
  max-width: 400px;
}

.pp-xp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 6px;
}

.pp-username {
  color: var(--pp-neon-blue);
  font-family: 'Courier New', monospace;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.pp-lvl-badge {
  font-size: 0.7rem;
  font-weight: 900;
  background: #f59e0b;
  color: #000;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.pp-xp-track {
  height: 8px;
  background: rgba(255,255,255,0.08);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}

.pp-xp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--pp-primary), var(--pp-neon-purple));
  position: relative;
  border-radius: 4px;
}

.pp-xp-shine {
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transform: skewX(-20deg) translateX(-150%);
  animation: shine-pass 3s infinite;
}

.pp-bio {
  color: #cbd5e1;
  font-size: 1rem;
  line-height: 1.6;
  margin-top: 16px;
  max-width: 600px;
  border-left: 3px solid rgba(255,255,255,0.1);
  padding-left: 12px;
}

/* Badge Showcase */
.pp-badge-showcase {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.pp-badge-slot {
  width: 44px;
  height: 44px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  cursor: help;
  transition: all 0.3s;
}

.pp-badge-slot:hover {
  transform: translateY(-3px);
  border-color: rgba(255,255,255,0.3);
}

.pp-badge-slot.glow-gold { box-shadow: 0 0 15px rgba(245, 158, 11, 0.15); }
.pp-badge-slot.glow-blue { box-shadow: 0 0 15px rgba(59, 130, 246, 0.15); }
.pp-badge-slot.glow-purple { box-shadow: 0 0 15px rgba(139, 92, 246, 0.15); }
.pp-badge-slot.empty-slot { opacity: 0.3; background: transparent; border-style: dashed; }

.pp-action-area {
  margin-top: 24px;
}

/* --- BUTTONS --- */
.pp-btn-group {
  display: flex;
  gap: 12px;
}

.pp-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--pp-font-main);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pp-btn-glow-primary {
  background: linear-gradient(135deg, var(--pp-primary), var(--pp-accent));
  color: white;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
}
.pp-btn-glow-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
}

.pp-btn-glow-green {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
}

.pp-btn-outline {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
}
.pp-btn-outline:hover {
  border-color: #fff;
  background: rgba(255,255,255,0.05);
}

.pp-btn-danger-ghost {
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.2);
}
.pp-btn-danger-ghost:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #fff;
}

.pp-btn-success {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.pp-btn-neutral {
  background: rgba(255,255,255,0.1);
  color: #cbd5e1;
}

.pp-plus-icon { font-size: 1.2em; font-weight: 800; }
.pp-no-hover { cursor: default; }

/* --- SECTIONS --- */
.pp-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  margin: 40px 0;
}

.pp-section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.2rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 24px;
  letter-spacing: 0.5px;
}

.mt-large { margin-top: 50px; }

.pp-count-badge {
  background: rgba(255,255,255,0.1);
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
  color: #94a3b8;
}

/* --- GAMES GRID --- */
.pp-games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.pp-game-card {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.pp-game-card:hover {
  transform: translateY(-5px);
  border-color: var(--pp-primary);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.pp-game-img-wrap {
  height: 140px;
  position: relative;
  overflow: hidden;
}

.pp-game-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.pp-game-card:hover .pp-game-img {
  transform: scale(1.1);
}

.pp-game-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15,23,42,1) 0%, transparent 100%);
  opacity: 0.6;
}

.pp-game-info {
  padding: 16px;
  position: relative;
}

.pp-game-title {
  font-weight: 700;
  font-size: 1rem;
  color: #fff;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pp-game-genre {
  color: #94a3b8;
  font-size: 0.8rem;
  margin-bottom: 12px;
  text-transform: uppercase;
  font-weight: 600;
}

.pp-btn-mini {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.1);
  background: transparent;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  text-transform: uppercase;
}
.pp-btn-mini:hover {
  background: var(--pp-primary);
  border-color: var(--pp-primary);
}

/* --- MUTUAL FRIENDS GRID --- */
.pp-friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 16px;
}

.pp-friend-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255,255,255,0.02);
  padding: 16px 8px;
  border-radius: 12px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: 0.3s;
}

.pp-friend-card:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.1);
}

.pp-friend-avatar-wrap {
  position: relative;
  width: 64px;
  height: 64px;
  margin-bottom: 10px;
}

.pp-friend-avatar {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  object-fit: cover;
  position: relative;
  z-index: 2;
}

.pp-friend-glow {
  position: absolute;
  inset: -5px;
  background: var(--pp-primary);
  opacity: 0;
  filter: blur(10px);
  border-radius: 50%;
  transition: opacity 0.3s;
  z-index: 1;
}

.pp-friend-card:hover .pp-friend-glow {
  opacity: 0.4;
}

.pp-friend-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e2e8f0;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

/* --- UTILS --- */
.pp-empty-state {
  text-align: center;
  padding: 40px;
  color: #64748b;
  border: 1px dashed rgba(255,255,255,0.1);
  border-radius: 12px;
  font-style: italic;
}

.pp-screen-center {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #050b14;
  color: #fff;
}

/* ACTION AREA LAYOUT FIX */
.pp-action-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}



/* MOBILE FIX — Chat button moves below */
@media (max-width: 768px) {
  .pp-action-row {
    flex-direction: column;
    width: 100%;
  }

  .pp-chat-btn-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .pp-chat-btn-wrap button {
    width: 26%;
  }
}

/* SUPER SMALL DEVICES FIX (<380px) */
@media (max-width: 380px) {
  .pp-btn-group {
    flex-direction: column;
    width: 100%;
  }

  .pp-btn-group .pp-btn {
    width: 100%;
    font-size: 0.8rem;
    padding: 10px 14px;
  }

  /* Chat button also full width */
  .pp-chat-btn-wrap button {
    width: 30%;
  }
    
}


/* Animations */
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes pulse-blue { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
@keyframes shine-pass { 0% { transform: skewX(-20deg) translateX(-150%); } 100% { transform: skewX(-20deg) translateX(250%); } }
@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }

/* Glitch Loader Text */
.pp-loader { display: flex; flex-direction: column; align-items: center; gap: 20px; }
.pp-loader-ring { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--pp-primary); border-radius: 50%; animation: spin 1s infinite linear; }
.pp-loader-text { font-family: monospace; letter-spacing: 2px; color: var(--pp-primary); font-size: 0.9rem; }

/* 404 Glitch */
.pp-error-box { text-align: center; }
.pp-error-glitch { font-size: 5rem; font-weight: 900; color: #ef4444; position: relative; text-shadow: 2px 2px 0px #000; animation: pulse-blue 0.2s infinite; }
.pp-error-msg { letter-spacing: 4px; color: #999; margin-top: 10px; }

/* --- RESPONSIVENESS --- */
@media (max-width: 768px) {
  .pp-header { flex-direction: column; align-items: center; text-align: center; gap: 24px; }
  .pp-card { padding: 24px 16px; margin: 0; border-radius: 0; border: none; min-height: 100vh; }
  .pp-user-details { width: 100%; display: flex; flex-direction: column; align-items: center; }
  .pp-xp-system { width: 100%; max-width: 100%; }
  .pp-bio { border-left: none; border-top: 1px solid rgba(255,255,255,0.1); padding-left: 0; padding-top: 12px; text-align: center; }
  .pp-btn-group { justify-content: center; width: 100%; }
  .pp-btn { flex: 1; justify-content: center; }
  .pp-games-grid { grid-template-columns: 1fr; }
  .pp-friends-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 400px) {
  .pp-friends-grid { grid-template-columns: repeat(2, 1fr); }
  .pp-name { font-size: 2rem; }
}
`;