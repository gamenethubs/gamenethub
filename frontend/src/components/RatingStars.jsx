// src/components/RatingStars.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Props:
 * rating      = backend average rating
 * userRating  = user's rating (if logged-in)
 * size        = star size
 * onRate      = function(stars)
 * showUserTag = show "You rated: X"
 * editable    = allow clicking stars
 */
export default function RatingStars({
  rating = 4,
  userRating = null,
  size = 22,
  onRate = null,
  showUserTag = false,
  editable = false,
}) {
  const { isAuthenticated } = useAuth();

  const [hover, setHover] = useState(0);
  const [display, setDisplay] = useState(rating);

  // ⭐ FIXED PRIORITY LOGIC:
  // userRating → highest priority
  // else → show average rating
  useEffect(() => {
    if (userRating !== null && userRating !== undefined) {
      setDisplay(userRating);
    } else {
      setDisplay(rating);
    }
  }, [rating, userRating]);

  const totalStars = 5;

  const handleClick = (value) => {
    if (!editable || !onRate) return;

    if (!isAuthenticated) {
      alert("Please login first to rate.");
      return;
    }

    setDisplay(value); // instant update
    onRate(value);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {[...Array(totalStars)].map((_, i) => {
          const value = i + 1;

          const active =
            hover !== 0
              ? value <= hover
              : value <= display;

          return (
            <span
              key={value}
              style={{
                ...styles.star,
                fontSize: size,
                cursor: editable ? "pointer" : "default",
                color: active ? "#facc15" : "#475569",
                transform: hover === value ? "scale(1.22)" : "scale(1)",
              }}
              onMouseEnter={() => editable && setHover(value)}
              onMouseLeave={() => editable && setHover(0)}
              onClick={() => handleClick(value)}
            >
              ★
            </span>
          );
        })}

        {/* ⭐ Average visible only when not editable */}
        {!editable && (
          <span style={{ ...styles.text, fontSize: size * 0.65 }}>
            {rating?.toFixed(1)}
          </span>
        )}

        {/* ⭐ FIXED USER TAG LOGIC */}
        {editable && showUserTag && (
          <span style={{ ...styles.userTag, fontSize: size * 0.6 }}>
            {!isAuthenticated
              ? "Login to rate this game"
              : userRating !== null
              ? `You rated: ${userRating} ★`
              : "Please rate this game"}
          </span>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  container: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  star: {
    transition: "all 0.25s ease",
    userSelect: "none",
  },
  text: {
    marginLeft: 6,
    color: "#cbd5e1",
    fontWeight: 500,
  },
  userTag: {
    marginLeft: 10,
    color: "#94a3b8",
    fontWeight: 500,
  },
};
