// import React, { useEffect, useState } from "react";
// import { getAllEvents } from "../services/api";
// import { absoluteUrl } from "../services/api";
// import { useAuth } from "../context/AuthContext";

// /* ------------------------------------------------------------------
//    Event type colors (premium tag UI)
// ------------------------------------------------------------------ */
// const EVENT_COLORS = {
//   game_start: "#22c55e",
//   game_end: "#ef4444",
//   level_start: "#3b82f6",
//   level_complete: "#facc15",
//   level_fail: "#f43f5e",
// };

// /* ------------------------------------------------------------------
//    Event Type → Pretty Label
// ------------------------------------------------------------------ */
// const formatEvent = (event) =>
//   event.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// export default function AdminLiveTracker() {
//   const { user } = useAuth();
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Auto-refresh (premium smooth 4-second refresh)
//   const REFRESH_INTERVAL = 4000;

//   const loadEvents = async () => {
//     try {
//       const res = await getAllEvents();
//       setEvents(res.data.events || []);
//     } catch (err) {
//       console.error("Error fetching events:", err);
//     }
//   };

//   useEffect(() => {
//     if (!user || user.role !== "admin") return;

//     loadEvents();
//     setLoading(false);

//     const interval = setInterval(() => {
//       loadEvents();
//     }, REFRESH_INTERVAL);

//     return () => clearInterval(interval);
//   }, [user]);

//   if (!user || user.role !== "admin") {
//     return (
//       <h2 style={{ color: "#fff", padding: 20 }}>
//         Unauthorized – Admins Only
//       </h2>
//     );
//   }

//   return (
//     <div style={styles.wrapper}>
//       {/* Premium Gradient Heading */}
//       <h1 style={styles.title}>Live Game Activity</h1>
//       <p style={styles.subTitle}>Tracking player events in real-time</p>

//       {loading ? (
//         <p style={{ color: "#fff" }}>Loading...</p>
//       ) : (
//         <div style={styles.card}>
//           <div style={styles.tableWrapper}>
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th>User</th>
//                   <th>Game</th>
//                   <th>Event</th>
//                   <th>Level</th>
//                   <th>Time</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {events.map((ev) => (
//                   <tr key={ev._id} style={styles.row}>
//                     {/* USER */}
//                     <td>{ev.user?.name || ev.user?.email || "Unknown"}</td>

//                     {/* GAME THUMB + NAME */}
//                     <td>
//                       <div style={styles.gameCell}>
//                         {ev.game?.thumbnail && (
//                           <img
//                             src={absoluteUrl(ev.game.thumbnail)}
//                             style={styles.thumb}
//                             alt="game"
//                           />
//                         )}
//                         <span style={{ fontWeight: 600 }}>
//                           {ev.game?.title}
//                         </span>
//                       </div>
//                     </td>

//                     {/* EVENT TYPE → COLOR TAG */}
//                     <td>
//                       <span
//                         style={{
//                           ...styles.eventTag,
//                           background: EVENT_COLORS[ev.eventType] || "#6b7280",
//                         }}
//                       >
//                         {formatEvent(ev.eventType)}
//                       </span>
//                     </td>

//                     {/* LEVEL */}
//                     <td style={{ fontWeight: 600 }}>
//                       {ev.level !== null ? ev.level : "-"}
//                     </td>

//                     {/* TIME */}
//                     <td style={{ opacity: 0.8 }}>
//                       {new Date(ev.timestamp).toLocaleTimeString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ------------------------------------------------------------------
//     PREMIUM DASHBOARD STYLES
// ------------------------------------------------------------------ */
// const styles = {
//   wrapper: {
//     padding: "35px",
//     background: "#0f172a",
//     minHeight: "100vh",
//     color: "#fff",
//   },

//   title: {
//     fontSize: 40,
//     fontWeight: 900,
//     background: "linear-gradient(to right, #60a5fa, #a78bfa, #f472b6)",
//     WebkitTextFillColor: "transparent",
//     WebkitBackgroundClip: "text",
//     marginBottom: 5,
//   },

//   subTitle: {
//     opacity: 0.85,
//     marginBottom: 25,
//     fontSize: 16,
//   },

//   card: {
//     background: "rgba(255,255,255,0.05)",
//     backdropFilter: "blur(10px)",
//     padding: 20,
//     borderRadius: 14,
//     border: "1px solid rgba(255,255,255,0.08)",
//     boxShadow: "0 0 30px rgba(0,0,0,0.4)",
//   },

//   tableWrapper: {
//     overflowX: "auto",
//   },

//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     fontSize: 15,
//   },

//   row: {
//     transition: "0.25s",
//   },

//   thumb: {
//     width: 42,
//     height: 42,
//     borderRadius: 10,
//     marginRight: 12,
//     objectFit: "cover",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
//   },

//   gameCell: {
//     display: "flex",
//     alignItems: "center",
//   },

//   eventTag: {
//     color: "#000",
//     padding: "4px 10px",
//     borderRadius: 6,
//     fontWeight: 700,
//     fontSize: 13,
//     display: "inline-block",
//   },
// };
import React, { useEffect, useState } from "react";
import { getAllEvents } from "../services/api";
import { absoluteUrl } from "../services/api";
import { useAuth } from "../context/AuthContext";

/* ------------------------------------------------------------------
   Event type colors (premium tag UI)
------------------------------------------------------------------ */
const EVENT_COLORS = {
  game_start: "#22c55e",
  game_end: "#ef4444",
  level_start: "#3b82f6",
  level_complete: "#facc15",
  level_fail: "#f43f5e",
};

/* ------------------------------------------------------------------
   Event Type → Pretty Label
------------------------------------------------------------------ */
const formatEvent = (event) =>
  event.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const EVENT_OPTIONS = [
  { value: "all", label: "All Events" },
  ...Object.keys(EVENT_COLORS).map((key) => ({
    value: key,
    label: formatEvent(key),
  })),
];

const NAME_SORT_OPTIONS = [
  { value: "none", label: "Time (Latest First)" },
  { value: "asc", label: "Player Name A → Z" },
  { value: "desc", label: "Player Name Z → A" },
];

// ⭐ 50 rows per page
const PAGE_SIZE = 50;

export default function AdminLiveTracker() {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters / search / pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [nameSort, setNameSort] = useState("none");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [page, setPage] = useState(1);

  // Auto-refresh (premium smooth 4-second refresh)
  const REFRESH_INTERVAL = 4000;

  const loadEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res.data.events || []);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error("Error fetching events:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    setLoading(true);
    loadEvents();

    const interval = setInterval(() => {
      loadEvents();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [user]);

  // 🔁 Jab search ya filter ya sort badle → page = 1
  useEffect(() => {
    setPage(1);
  }, [searchTerm, eventFilter, nameSort]);

  if (!user || user.role !== "admin") {
    return (
      <h2 style={{ color: "#fff", padding: 20 }}>
        Unauthorized – Admins Only
      </h2>
    );
  }

  /* ---------------------------------------------------------
     Derived data: search + filters + sort (FULL data)
  --------------------------------------------------------- */
  const normalizedSearch = searchTerm.trim().toLowerCase();

  let filtered = events.filter((ev) => {
    // Event type filter
    if (eventFilter !== "all" && ev.eventType !== eventFilter) return false;

    // Search by player name / email / game title
    if (normalizedSearch) {
      const playerName = (ev.user?.name || "").toLowerCase();
      const playerEmail = (ev.user?.email || "").toLowerCase();
      const gameTitle = (ev.game?.title || "").toLowerCase();

      const matchesPlayerName = playerName.includes(normalizedSearch);
      const matchesPlayerEmail = playerEmail.includes(normalizedSearch);
      const matchesGame = gameTitle.includes(normalizedSearch);

      if (!matchesPlayerName && !matchesPlayerEmail && !matchesGame)
        return false;
    }

    return true;
  });

  // Sort by player name if requested
  if (nameSort !== "none") {
    filtered = [...filtered].sort((a, b) => {
      const nameA = (a.user?.name || a.user?.email || "").toLowerCase();
      const nameB = (b.user?.name || b.user?.email || "").toLowerCase();

      if (nameA < nameB) return nameSort === "asc" ? -1 : 1;
      if (nameA > nameB) return nameSort === "asc" ? 1 : -1;
      return 0;
    });
  }

  const totalEvents = events.length;
  const uniquePlayers = new Set(
    events.map((e) => e.user?._id || e.user?.email || e.user?.name || "unknown")
  ).size;
  const uniqueGames = new Set(
    events.map((e) => e.game?._id || e.game?.title || "unknown")
  ).size;

  const lastUpdatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString()
    : "—";

  // 📄 Pagination (AFTER full filter+sort)
  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pageEvents = filtered.slice(startIndex, endIndex);

  const showingFrom = totalFiltered === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(endIndex, totalFiltered);

  return (
    <div style={styles.wrapper}>
      {/* Premium Gradient Heading */}
      <h1 style={styles.title}>Live Game Activity</h1>
      <p style={styles.subTitle}>Tracking player events in real-time</p>

      {/* Top stats + filters */}
      <div style={styles.topBar}>
        <div style={styles.statsLeft}>
          <div style={styles.statPill}>
            <span style={styles.statLabel}>Total Events</span>
            <span style={styles.statValue}>{totalEvents}</span>
          </div>
          <div style={styles.statPill}>
            <span style={styles.statLabel}>Players</span>
            <span style={styles.statValue}>{uniquePlayers}</span>
          </div>
          <div style={styles.statPill}>
            <span style={styles.statLabel}>Games</span>
            <span style={styles.statValue}>{uniqueGames}</span>
          </div>
          <div style={{ ...styles.statPill, opacity: 0.85 }}>
            <span style={styles.statLabel}>Last Updated</span>
            <span style={styles.statValueSmall}>{lastUpdatedLabel}</span>
          </div>
        </div>

        <div style={styles.filtersRight}>
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search by player, email or game…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />

          {/* Event filter */}
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            style={styles.select}
          >
            {EVENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Name sort */}
          <select
            value={nameSort}
            onChange={(e) => setNameSort(e.target.value)}
            style={styles.select}
          >
            {NAME_SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#fff", marginTop: 20 }}>Loading...</p>
      ) : (
        <div style={styles.card}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.headerRow}>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Game</th>
                  <th style={styles.th}>Event</th>
                  <th style={styles.th}>Level</th>
                  <th style={styles.th}>Time</th>
                </tr>
              </thead>

              <tbody>
                {pageEvents.length === 0 ? (
                  <tr>
                    <td style={styles.noData} colSpan={5}>
                      No events match your filters yet.
                    </td>
                  </tr>
                ) : (
                  pageEvents.map((ev) => {
                    const displayName =
                      ev.user?.name || ev.user?.email || "Unknown";
                    const displayEmail = ev.user?.email || "";

                    return (
                      <tr key={ev._id} style={styles.row}>
                        {/* USER (Name + Email) */}
                        <td style={styles.td}>
                          <div style={styles.userCell}>
                            <div style={styles.userName}>{displayName}</div>
                            {displayEmail && (
                              <div style={styles.userEmail}>
                                {displayEmail}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* GAME THUMB + NAME */}
                        <td style={styles.td}>
                          <div style={styles.gameCell}>
                            {ev.game?.thumbnail && (
                              <img
                                src={absoluteUrl(ev.game.thumbnail)}
                                style={styles.thumb}
                                alt="game"
                              />
                            )}
                            <span style={{ fontWeight: 600 }}>
                              {ev.game?.title || "Unknown Game"}
                            </span>
                          </div>
                        </td>

                        {/* EVENT TYPE → COLOR TAG */}
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.eventTag,
                              background:
                                EVENT_COLORS[ev.eventType] || "#6b7280",
                            }}
                          >
                            {formatEvent(ev.eventType || "unknown")}
                          </span>
                        </td>

                        {/* LEVEL */}
                        <td style={{ ...styles.td, fontWeight: 600 }}>
                          {ev.level !== null && ev.level !== undefined
                            ? ev.level
                            : "-"}
                        </td>

                        {/* TIME */}
                        <td style={{ ...styles.td, opacity: 0.8 }}>
                          {new Date(ev.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ⭐ Pagination bar */}
          <div style={styles.paginationBar}>
            <span style={styles.paginationInfo}>
              Showing{" "}
              <strong>
                {showingFrom}-{showingTo}
              </strong>{" "}
              of <strong>{totalFiltered}</strong> events
            </span>

            <div style={styles.paginationButtons}>
              <button
                style={{
                  ...styles.pageButton,
                  opacity: safePage === 1 ? 0.5 : 1,
                  cursor: safePage === 1 ? "default" : "pointer",
                }}
                disabled={safePage === 1}
                onClick={() => safePage > 1 && setPage(safePage - 1)}
              >
                ← Prev
              </button>
              <span style={styles.pageIndicator}>
                Page {safePage} / {totalPages}
              </span>
              <button
                style={{
                  ...styles.pageButton,
                  opacity: safePage === totalPages ? 0.5 : 1,
                  cursor:
                    safePage === totalPages ? "default" : "pointer",
                }}
                disabled={safePage === totalPages}
                onClick={() =>
                  safePage < totalPages && setPage(safePage + 1)
                }
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
    PREMIUM DASHBOARD STYLES
------------------------------------------------------------------ */
const styles = {
  wrapper: {
    padding: "35px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "#fff",
  },

  title: {
    fontSize: 40,
    fontWeight: 900,
    background: "linear-gradient(to right, #60a5fa, #a78bfa, #f472b6)",
    WebkitTextFillColor: "transparent",
    WebkitBackgroundClip: "text",
    marginBottom: 5,
  },

  subTitle: {
    opacity: 0.85,
    marginBottom: 25,
    fontSize: 16,
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    marginBottom: 18,
    flexWrap: "wrap",
  },

  statsLeft: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  statPill: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(15,23,42,0.9)",
    border: "1px solid rgba(148,163,184,0.4)",
    display: "flex",
    flexDirection: "column",
    minWidth: 110,
  },

  statLabel: {
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "#94a3b8",
    marginBottom: 3,
  },

  statValue: {
    fontSize: 17,
    fontWeight: 800,
  },

  statValueSmall: {
    fontSize: 14,
    fontWeight: 700,
  },

  filtersRight: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },

  searchInput: {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.6)",
    background: "rgba(15,23,42,0.9)",
    color: "#e5e7eb",
    minWidth: 220,
    outline: "none",
    fontSize: 14,
  },

  select: {
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.6)",
    background: "rgba(15,23,42,0.95)",
    color: "#e5e7eb",
    fontSize: 13,
    outline: "none",
    cursor: "pointer",
  },

  card: {
    background: "rgba(15,23,42,0.95)",
    backdropFilter: "blur(10px)",
    padding: 20,
    borderRadius: 18,
    border: "1px solid rgba(148,163,184,0.4)",
    boxShadow: "0 0 30px rgba(15,23,42,0.8)",
  },

  tableWrapper: {
    overflowX: "auto",
    maxHeight: "65vh",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 15,
  },

  // headerRow: {
  //   position: "sticky",
  //   top: 0,
  // },

  th: {
    textAlign: "left",
    padding: "10px 14px",
    fontSize: 12,
    fontWeight: 700,
    color: "#9ca3af",
    borderBottom: "1px solid rgba(148,163,184,0.35)",
    background:
      "linear-gradient(to bottom, rgba(15,23,42,1), rgba(15,23,42,0.92))",
    position: "sticky",
    top: 0,
    zIndex: 5,
  },

  row: {
    transition: "background 0.2s ease, transform 0.15s ease",
  },

  td: {
    padding: "10px 14px",
    borderBottom: "1px solid rgba(30,41,59,0.9)",
    verticalAlign: "middle",
  },

  noData: {
    padding: "18px 14px",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 14,
  },

  thumb: {
    width: 42,
    height: 42,
    borderRadius: 10,
    marginRight: 12,
    objectFit: "cover",
    boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
  },

  gameCell: {
    display: "flex",
    alignItems: "center",
  },

  userCell: {
    display: "flex",
    flexDirection: "column",
  },

  userName: {
    fontWeight: 600,
    fontSize: 14,
  },

  userEmail: {
    fontSize: 12,
    color: "#9ca3af",
  },

  eventTag: {
    color: "#000",
    padding: "4px 10px",
    borderRadius: 6,
    fontWeight: 700,
    fontSize: 13,
    display: "inline-block",
  },

  paginationBar: {
    marginTop: 14,
    paddingTop: 10,
    borderTop: "1px solid rgba(30,41,59,0.9)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },

  paginationInfo: {
    fontSize: 13,
    color: "#9ca3af",
  },

  paginationButtons: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  pageButton: {
    padding: "6px 12px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.6)",
    background: "rgba(15,23,42,0.95)",
    color: "#e5e7eb",
    fontSize: 13,
    cursor: "pointer",
  },

  pageIndicator: {
    fontSize: 13,
    color: "#e5e7eb",
  },
};
