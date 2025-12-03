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

export default function AdminLiveTracker() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-refresh (premium smooth 4-second refresh)
  const REFRESH_INTERVAL = 4000;

  const loadEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res.data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    loadEvents();
    setLoading(false);

    const interval = setInterval(() => {
      loadEvents();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [user]);

  if (!user || user.role !== "admin") {
    return (
      <h2 style={{ color: "#fff", padding: 20 }}>
        Unauthorized – Admins Only
      </h2>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Premium Gradient Heading */}
      <h1 style={styles.title}>Live Game Activity</h1>
      <p style={styles.subTitle}>Tracking player events in real-time</p>

      {loading ? (
        <p style={{ color: "#fff" }}>Loading...</p>
      ) : (
        <div style={styles.card}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Game</th>
                  <th>Event</th>
                  <th>Level</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {events.map((ev) => (
                  <tr key={ev._id} style={styles.row}>
                    {/* USER */}
                    <td>{ev.user?.name || ev.user?.email || "Unknown"}</td>

                    {/* GAME THUMB + NAME */}
                    <td>
                      <div style={styles.gameCell}>
                        {ev.game?.thumbnail && (
                          <img
                            src={absoluteUrl(ev.game.thumbnail)}
                            style={styles.thumb}
                            alt="game"
                          />
                        )}
                        <span style={{ fontWeight: 600 }}>
                          {ev.game?.title}
                        </span>
                      </div>
                    </td>

                    {/* EVENT TYPE → COLOR TAG */}
                    <td>
                      <span
                        style={{
                          ...styles.eventTag,
                          background: EVENT_COLORS[ev.eventType] || "#6b7280",
                        }}
                      >
                        {formatEvent(ev.eventType)}
                      </span>
                    </td>

                    {/* LEVEL */}
                    <td style={{ fontWeight: 600 }}>
                      {ev.level !== null ? ev.level : "-"}
                    </td>

                    {/* TIME */}
                    <td style={{ opacity: 0.8 }}>
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    padding: 20,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 30px rgba(0,0,0,0.4)",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 15,
  },

  row: {
    transition: "0.25s",
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

  eventTag: {
    color: "#000",
    padding: "4px 10px",
    borderRadius: 6,
    fontWeight: 700,
    fontSize: 13,
    display: "inline-block",
  },
};