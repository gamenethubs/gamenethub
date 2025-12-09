// src/components/NotificationBell.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react"; // Assuming 'lucide-react' for icons

// Key for localStorage
const STORAGE_KEY = "gamenethub_notifications";

// Helper function to get initial state from localStorage
const getInitialNotifications = () => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading notifications from localStorage:", error);
      return [];
    }
  }
  return [];
};

// Helper function to save state to localStorage
const saveNotifications = (notifications) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error("Error saving notifications to localStorage:", error);
    }
  }
};


export default function NotificationBell() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(getInitialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.seen).length;

  /********************************************
   * 🔔 Listener for 'notify-user' event from App.js
   ********************************************/
  const handleNewNotification = useCallback((event) => {
    const newNotification = { ...event.detail, seen: false };

    setNotifications((prev) => {
      // Add new notification to the beginning
      const newNotifs = [newNotification, ...prev];
      // Keep only the latest 20 notifications to prevent overload
      const trimmedNotifs = newNotifs.slice(0, 20);
      saveNotifications(trimmedNotifs);
      return trimmedNotifs;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("notify-user", handleNewNotification);
    return () => window.removeEventListener("notify-user", handleNewNotification);
  }, [handleNewNotification]);

  /********************************************
   * ⚙️ Click/Escape Handlers (Dropdown Logic)
   ********************************************/

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updatedNotifs = prev.map((n) => ({ ...n, seen: true }));
      saveNotifications(updatedNotifs);
      return updatedNotifs;
    });
  }, []);

  // Effect for handling clicks outside and Escape key
  useEffect(() => {
    function handleDocClick(e) {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        // If dropdown is open and click is outside the bell and dropdown
        setIsOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      // When opening the dropdown, mark all current notifications as seen
      if (newState) {
        markAllAsRead();
      }
      return newState;
    });
  };

  const handleNotificationClick = (notification) => {
    // 1. Close dropdown
    setIsOpen(false);

    // 2. Mark this specific notification as seen (if not already)
    if (!notification.seen) {
      setNotifications((prev) => {
        const updatedNotifs = prev.map((n) =>
          n.id === notification.id ? { ...n, seen: true } : n
        );
        saveNotifications(updatedNotifs);
        return updatedNotifs;
      });
    }

    // ⭐ NEW LOGIC → FRIEND NOTIFICATION
  if (notification.slug === "friends") {
    if (notification.username) {
      return navigate(`/user/${notification.username}`);
    }
    if (notification.userId) {
      return navigate(`/user/${notification.userId}`);
    }
    return; // fallback
  }

  // ⭐ OLD LOGIC → GAME NOTIFICATION (unchanged)
  if (notification.slug) {
    return navigate(`/game/${notification.slug}`);
  }
  };

  const handleDismiss = (id, e) => {
    // Stop event propagation to prevent triggering the notification click
    e.stopPropagation();

    setNotifications((prev) => {
      const updatedNotifs = prev.filter((n) => n.id !== id);
      saveNotifications(updatedNotifs);
      return updatedNotifs;
    });
  };

  // The Bell Icon Button
  const bellButton = (
    <button
      ref={bellRef}
      onClick={toggleDropdown}
      style={styles.bellButton}
      title={`Notifications (${unreadCount} unread)`}
      aria-expanded={isOpen}
      aria-controls="notification-dropdown"
    >
      <Bell size={20} style={{ color: "#cfe8ff" }} />
      {unreadCount > 0 && (
        <span style={styles.badge}>{unreadCount > 9 ? "9+" : unreadCount}</span>
      )}
    </button>
  );

  // The Dropdown Menu
  const notificationDropdown = (
    <div
  id="notification-dropdown"
  ref={dropdownRef}
  style={{
    ...styles.dropdown,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? "auto" : "none",

    // DESKTOP STYLES
    transform: isOpen
      ? "translateY(6px) scale(1)"
      : "translateY(0px) scale(0.98)",

    // 📱 MOBILE FIX (ONLY HERE, NO CSS)
    ...(window.innerWidth <= 480 && {
      left: "50%",
      right: "auto",
      transform: isOpen
        ? "translate(-70%, 6px) scale(1)"
        : "translate(-70%, 0px) scale(0.98)",
      width: "70vw",      // ⭐ perfect responsive width
      maxWidth: "70vw",
      borderRadius: "0 0 16px 16px",
    }),
  }}
>

      <div style={styles.dropdownHeader}>
        <span style={styles.dropdownTitle}>Notifications</span>
        <button
          onClick={markAllAsRead}
          style={styles.markAllReadButton}
          title="Mark all as read"
          disabled={unreadCount === 0}
        >
          Mark all as read
        </button>
      </div>

      <div style={styles.dropdownDivider} />

      {notifications.length === 0 ? (
        <div style={styles.emptyState}>No new notifications.</div>
      ) : (
        <div style={styles.notificationList}>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              style={{ ...styles.notificationItem, ...(n.seen ? {} : styles.notificationUnread) }}
              tabIndex={0}
              role="button"
            >
              <div style={styles.thumbnailWrapper}>
                {n.thumbnail && (
                  <img
                    src={n.thumbnail}
                    alt={n.title}
                    style={styles.thumbnail}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextSibling.style.display = "flex"; // Show fallback
                    }}
                  />
                )}
                <div style={styles.thumbnailFallback}>
                    🎮
                </div>
              </div>

              <div style={styles.notificationContent}>
                <div style={styles.notificationTitle}>{n.title}</div>
                <div style={styles.notificationText}>{n.text}</div>
                <div style={styles.notificationTime}>{n.time}</div>
              </div>

              <button
                onClick={(e) => handleDismiss(n.id, e)}
                style={styles.dismissButton}
                title="Dismiss notification"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ position: "relative" }}>
         <style>{`
      /* 📱 Mobile notification dropdown — full width */
      @media (max-width: 480px) {
        .notification-dropdown {
          right: 50% !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: 100% !important;
          max-width: 100% !important;
          border-radius: 0 0 16px 16px !important;
          margin-top: 6px !important;
        }
      }
    `}</style>
      {bellButton}
      {notificationDropdown}
    </div>
  );
}

// Additional styles for the NotificationBell component
const styles = {
  bellButton: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "none",
    background: "rgba(255,255,255,0.06)",
    color: "#cfe8ff",
    cursor: "pointer",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 150ms ease",
    outline: "none",
    boxShadow: "0 0 10px rgba(96,165,250,0.1)",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    background: "#ef4444", // Red color for unread count
    color: "#fff",
    borderRadius: 10,
    padding: "2px 6px",
    fontSize: 10,
    fontWeight: 700,
    minWidth: 18,
    textAlign: "center",
    lineHeight: "14px",
    border: "2px solid #071224", // Matches dropdown/navbar background
  },
  dropdown: {
  position: "absolute",
  right: 0,
  left: "auto",
  marginTop: 8,
  width: 300,
  maxWidth: "90vw",         // ⭐ Prevents overflow on mobile
  background: "#071224",
  borderRadius: 12,
  padding: 10,
  boxShadow: "0 12px 40px rgba(2,6,23,0.8)",
  border: "1px solid rgba(255,255,255,0.08)",
  transition: "all 180ms cubic-bezier(.2,.9,.2,1)",
  zIndex: 150,
  transformOrigin: "top right",  // ⭐ Ensures animation stays aligned
  display: "flex",
  flexDirection: "column",
},

  dropdownHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 8px 6px 4px",
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: "#e6f0ff",
  },
  markAllReadButton: {
    background: "transparent",
    border: "none",
    color: "#60a5fa", // Blue color
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    padding: "4px 8px",
    borderRadius: 6,
  },
  dropdownDivider: {
    height: 1,
    background: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
    borderRadius: 2,
    margin: "6px 0",
  },
  notificationList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxHeight: 400, // Limit height for scrollability
    overflowY: "auto",
    paddingRight: 4, // Space for scrollbar
  },
  notificationItem: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "10px",
    borderRadius: 8,
    background: "rgba(255,255,255,0.03)", // Slightly darker for seen
    cursor: "pointer",
    transition: "background 150ms ease",
    border: "1px solid transparent",
    "&:hover": {
      background: "rgba(255,255,255,0.08)",
    },
    position: "relative",
  },
  notificationUnread: {
    background: "linear-gradient(90deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))", // Gradient/lighter for unread
    border: "1px solid rgba(59,130,246,0.2)",
  },
  thumbnailWrapper: {
    flexShrink: 0,
    width: 48,
    height: 48,
    borderRadius: 6,
    overflow: "hidden",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  thumbnailFallback: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    height: "100%",
    width: "100%",
    color: "#fff",
    display: "none", // Hide by default, shown on image error
  },
  notificationContent: {
    flex: 1,
    minWidth: 0,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#e6f0ff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  notificationText: {
    fontSize: 13,
    color: "#9fb7d9",
    marginTop: 2,
    // Add truncation for long text if necessary
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  notificationTime: {
    fontSize: 10,
    color: "#475569",
    marginTop: 4,
  },
  dismissButton: {
    position: "absolute",
    top: 4,
    right: 4,
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: 18,
    lineHeight: "10px",
    padding: 4,
    cursor: "pointer",
    borderRadius: 4,
    transition: "color 150ms ease",
    "&:hover": {
      color: "#f87171",
    },
  },
  emptyState: {
    padding: "20px 10px",
    color: "#94a3b8",
    textAlign: "center",
    fontSize: 14,
  }
};