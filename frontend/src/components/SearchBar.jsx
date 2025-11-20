// // src/components/SearchBar.jsx
// import React from "react";

// export default function SearchBar({ searchTerm, setSearchTerm }) {
//   return (
//     <div style={styles.container}>
//       <input
//         type="text"
//         placeholder="Search games..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         style={styles.input}
//       />
//     </div>
//   );
// }

// const styles = {
//   container: {
//     width: "100%",
//     maxWidth: 400,
//     margin: "20px auto",
//   },
//   input: {
//     width: "100%",
//     padding: "10px 14px",
//     borderRadius: 8,
//     border: "1px solid #ccc",
//     fontSize: 16,
//     outline: "none",
//     transition: "border 0.3s",
//   },
// };
// src/components/SearchBar.jsx




// import React from "react";

// export default function SearchBar({ searchTerm, setSearchTerm }) {
//   return (
//     <div style={styles.container}>
//       <input
//         type="text"
//         placeholder="Search games..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         style={styles.input}
//       />
//     </div>
//   );
// }

import React from "react";

export default function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (onSearch) onSearch(value); // ⭐ PASS VALUE TO NAVBAR
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search games..."
        value={searchTerm}
        onChange={handleChange}
        style={styles.input}
      />
    </div>
  );
}


const styles = {
  container: {
    width: "100%",
    maxWidth: 420,
  },

  input: {
    width: "100%",
    padding: "12px 18px",
    borderRadius: "14px",
    fontSize: "15px",
    color: "#e2e8f0",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    outline: "none",
    backdropFilter: "blur(6px)",
    transition: "all 0.3s ease",
    boxShadow: "0 0 20px rgba(59,130,246,0.15)",
  },
};
