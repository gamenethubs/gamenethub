// src/components/SearchBar.jsx
import React from "react";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search games..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: 400,
    margin: "20px auto",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 16,
    outline: "none",
    transition: "border 0.3s",
  },
};
