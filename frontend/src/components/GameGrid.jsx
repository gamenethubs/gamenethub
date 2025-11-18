// src/components/GameGrid.jsx
import React, { useState } from "react";
import GameCard from "./GameCard";
import SearchBar from "./SearchBar";
import GameModal from "./GameModal";
import gamesData from "../data/games";

export default function GameGrid() {
  const allGames = gamesData;

  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedGame, setSelectedGame] = useState(null);

  // Search filter
  let filteredGames = allGames.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Genre filter
  if (genreFilter !== "All") {
    filteredGames = filteredGames.filter((game) => game.genre === genreFilter);
  }

  // Sort by rating
  filteredGames.sort((a, b) =>
    sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating
  );

  const genres = ["All", ...new Set(allGames.map((g) => g.genre))];

  return (
    <div style={styles.container}>
      {/* Search */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Filters */}
      <div style={styles.toolbar}>
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          style={styles.select}
        >
          {genres.map((genre, idx) => (
            <option key={idx} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={styles.select}
        >
          <option value="desc">Rating: High → Low</option>
          <option value="asc">Rating: Low → High</option>
        </select>
      </div>

      {/* GAME GRID */}
      <div style={styles.grid}>
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={() => setSelectedGame(game)}
            />
          ))
        ) : (
          <div style={styles.noResult}>No games found 😢</div>
        )}
      </div>

      {/* Modal */}
      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "20px",
  },

  toolbar: {
    display: "flex",
    gap: "16px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  select: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #475569",
    background: "#1e293b",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "25px",
    width: "100%",
  },

  noResult: {
    gridColumn: "1 / -1",
    textAlign: "center",
    color: "#ccc",
    fontSize: "18px",
    marginTop: "40px",
  },
};
