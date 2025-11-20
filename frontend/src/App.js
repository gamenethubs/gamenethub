// // // src/App.js
// // import React from "react";
// // import { Routes, Route, useLocation } from "react-router-dom";

// // // Components
// // import Navbar from "./components/Navbar";
// // import Footer from "./components/Footer";

// // // User Pages
// // import Home from "./pages/Home";
// // import Categories from "./pages/Categories"; 
// // import GameDetail from "./pages/GameDetail";
// // import Login from "./pages/Login";
// // import Register from "./pages/Register";

// // // Admin Pages
// // import AdminLogin from "./pages/AdminLogin";
// // import AdminDashboard from "./pages/AdminDashboard";
// // import AddGame from "./pages/AddGame";
// // import ManageGames from "./pages/ManageGames";
// // import EditGame from "./pages/EditGame";

// // function App() {
// //   const location = useLocation();

// //   // hide navbar/footer on admin
// //   const isAdminRoute = location.pathname.startsWith("/admin");

// //   return (
// //     <div style={styles.appWrapper}>
// //       {!isAdminRoute && <Navbar />}

// //       <main style={styles.container}>
// //         <Routes>

// //           {/* PUBLIC ROUTES */}
// //           <Route path="/" element={<Home />} />
// //           <Route path="/categories" element={<Categories />} />

// //           {/* ⭐ SLUG BASED ROUTING */}
// //           <Route path="/game/:slug" element={<GameDetail />} />

// //           {/* AUTH */}
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/register" element={<Register />} />

// //           {/* ADMIN */}
// //           <Route path="/admin" element={<AdminLogin />} />
// //           <Route path="/admin/dashboard" element={<AdminDashboard />} />
// //           <Route path="/admin/add-game" element={<AddGame />} />
// //           <Route path="/admin/games" element={<ManageGames />} />
// //           <Route path="/admin/games/:id/edit" element={<EditGame />} />

// //         </Routes>
// //       </main>

// //       {!isAdminRoute && <Footer />}
// //     </div>
// //   );
// // }

// // const styles = {
// //   appWrapper: {
// //     background: "#0f172a",
// //     minHeight: "100vh",
// //     width: "100vw",
// //     overflowX: "hidden",
// //     display: "flex",
// //     flexDirection: "column",
// //   },
// //   container: {
// //     padding: "20px",
// //     flex: 1,
// //   },
// // };

// // export default App;


// // src/App.js
// import React from "react";
// import { Routes, Route, useLocation, Navigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

// // Components
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// // User Pages
// import Home from "./pages/Home";
// import Categories from "./pages/Categories";
// import GameDetail from "./pages/GameDetail";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile"; // <-- ensure this file exists exactly at this path

// // Admin Pages
// import AdminLogin from "./pages/AdminLogin";
// import AdminDashboard from "./pages/AdminDashboard";
// import AddGame from "./pages/AddGame";
// import ManageGames from "./pages/ManageGames";
// import EditGame from "./pages/EditGame";

// function RequireAuth({ children }) {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }

// function App() {
//   const location = useLocation();
//   const isAdminRoute = location.pathname.startsWith("/admin");

//   return (
//     <div style={styles.appWrapper}>
//       {!isAdminRoute && <Navbar />}

//       <main style={styles.container}>
//         <Routes>
//           {/* PUBLIC ROUTES */}
//           <Route path="/" element={<Home />} />
//           <Route path="/categories" element={<Categories />} />

//           {/* SLUG BASED ROUTING */}
//           <Route path="/game/:slug" element={<GameDetail />} />

//           {/* AUTH */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* PROFILE (protected) */}
//           <Route
//             path="/profile"
//             element={
//               <RequireAuth>
//                 <Profile />
//               </RequireAuth>
//             }
//           />

//           {/* ADMIN */}
//           <Route path="/admin" element={<AdminLogin />} />
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//           <Route path="/admin/add-game" element={<AddGame />} />
//           <Route path="/admin/games" element={<ManageGames />} />
//           <Route path="/admin/games/:id/edit" element={<EditGame />} />

//           {/* fallback could be added here if you want */}
//         </Routes>
//       </main>

//       {!isAdminRoute && <Footer />}
//     </div>
//   );
// }

// const styles = {
//   appWrapper: {
//     background: "#0f172a",
//     minHeight: "100vh",
//     width: "100vw",
//     overflowX: "hidden",
//     display: "flex",
//     flexDirection: "column",
//   },
//   container: {
//     padding: "20px",
//     flex: 1,
//   },
// };

// export default App;
// src/App.js
import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// pages
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import GameDetail from "./pages/GameDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// admin
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddGame from "./pages/AddGame";
import ManageGames from "./pages/ManageGames";
import EditGame from "./pages/EditGame";

// cartoon
import Cartoon from "./components/Cartoon";  

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [showCartoon, setShowCartoon] = React.useState(false);

  return (
    <div style={styles.appWrapper}>

      {!isAdminRoute && (
        <Navbar 
          onSearch={(value) => setShowCartoon(value.toLowerCase() === "ding dong")}
        />
      )}

      {/* Cartoon system */}
      <Cartoon 
  visible={showCartoon}
  onFinish={() => {
    setShowCartoon(false);

    // ⭐ Trigger search clear event
    window.dispatchEvent(new Event("clear-search"));
  }}
/>


      <main style={styles.container}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/game/:slug" element={<GameDetail />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route 
            path="/profile"
            element={<RequireAuth><Profile /></RequireAuth>}
          />

          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-game" element={<AddGame />} />
          <Route path="/admin/games" element={<ManageGames />} />
          <Route path="/admin/games/:id/edit" element={<EditGame />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

const styles = {
  appWrapper: {
    background: "#0f172a",
    minHeight: "100vh",
    width: "100vw",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  container: {
    padding: "20px",
    flex: 1,
  },
};

export default App;

