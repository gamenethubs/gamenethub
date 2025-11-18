// // src/context/AuthContext.js
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// // ⭐ Custom Hook
// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   // -----------------------------
//   //  INITIAL LOAD FROM LOCALSTORAGE
//   // -----------------------------
//   const [user, setUser] = useState(() => {
//     try {
//       const u = localStorage.getItem("user");
//       return u ? JSON.parse(u) : null;
//     } catch {
//       return null;
//     }
//   });

//   const [token, setToken] = useState(() => {
//     try {
//       return localStorage.getItem("token") || null;
//     } catch {
//       return null;
//     }
//   });

//   // -----------------------------
//   //  SET AXIOS AUTH HEADER WHEN TOKEN CHANGES
//   // -----------------------------
//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     } else {
//       delete axios.defaults.headers.common["Authorization"];
//     }
//   }, [token]);

//   // -----------------------------
//   //  LOGIN (Save to state + localStorage)
//   // -----------------------------
//   const login = (userData, newToken) => {
//     try {
//       localStorage.setItem("user", JSON.stringify(userData));
//       localStorage.setItem("token", newToken);
//     } catch {}

//     setUser(userData);
//     setToken(newToken);
//   };

//   // -----------------------------
//   //  LOGOUT
//   // -----------------------------
//   const logout = () => {
//     try {
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//     } catch {}

//     setUser(null);
//     setToken(null);
//     delete axios.defaults.headers.common["Authorization"];
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         login,
//         logout,
//         isAuthenticated: !!user && !!token,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

// Custom hook
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  /*************************************************
   * USER + TOKEN (stored in localStorage)
   *************************************************/
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || null;
    } catch {
      return null;
    }
  });

  /*************************************************
   * ⭐ NEW → STORE USER FAVORITES IN CONTEXT
   *************************************************/
  const [favorites, setFavorites] = useState(() => {
    try {
      const f = localStorage.getItem("favorites");
      return f ? JSON.parse(f) : [];
    } catch {
      return [];
    }
  });

  // ⭐⭐⭐ NEW (MINIMAL REQUIRED CHANGE ONLY)
  const [ratedGames, setRatedGames] = useState(() => {
    try {
      const r = localStorage.getItem("ratedGames");
      return r ? JSON.parse(r) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("ratedGames", JSON.stringify(ratedGames));
    } catch {}
  }, [ratedGames]);
  // ⭐⭐⭐ END NEW PART


  // save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  /*************************************************
   * SET axios token automatically
   *************************************************/
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  /*************************************************
   * LOGIN — Save user + token + favorites
   *************************************************/
  const login = (userData, newToken) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", newToken);

      // ⭐⭐⭐ required for rating system
      localStorage.setItem("ratedGames", JSON.stringify(userData.ratedGames || []));

      // IMPORTANT: clear & reset favorites for this user
      localStorage.removeItem("favorites");
    } catch {}

    setUser(userData);
    setToken(newToken);

    // ⭐⭐⭐ required for rating system
    setRatedGames(userData.ratedGames || []);

    setFavorites([]); // reload from API later
  };

  /*************************************************
   * UPDATE USER (e.g. avatar)
   *************************************************/
  const updateUser = (newFields) => {
    const merged = { ...(user || {}), ...newFields };
    setUser(merged);

    // ⭐⭐⭐ sync ratedGames
    if (newFields.ratedGames) {
      setRatedGames(newFields.ratedGames);
      localStorage.setItem("ratedGames", JSON.stringify(newFields.ratedGames));
    }

    try {
      localStorage.setItem("user", JSON.stringify(merged));
    } catch {}
  };

  /*************************************************
   * LOGOUT — Clear everything
   *************************************************/
  const logout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("favorites");
      localStorage.removeItem("ratedGames"); // ⭐ REQUIRED
    } catch {}

    setUser(null);
    setToken(null);
    setFavorites([]);
    setRatedGames([]); // ⭐ REQUIRED
    delete axios.defaults.headers.common["Authorization"];
  };

  /*************************************************
   * ⭐ NEW → FAVORITES HANDLERS
   *************************************************/
  const setInitialFavorites = (favArray) => {
    setFavorites(favArray || []);
  };

  const toggleFavoriteLocal = (gameId) => {
    setFavorites((prev) => {
      if (prev.includes(gameId))
        return prev.filter((id) => id !== gameId);

      return [...prev, gameId];
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        favorites,              // ⭐ EXPOSE favorites array
        setInitialFavorites,    // ⭐ when we fetch favorites from backend
        toggleFavoriteLocal,    // ⭐ update UI instantly

        ratedGames,             // ⭐ REQUIRED EXPORT

        login,
        logout,
        updateUser,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
