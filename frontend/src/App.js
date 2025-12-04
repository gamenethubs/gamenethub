

// // src/App.js
// import React from "react";
// import { Routes, Route, useLocation, Navigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// // pages
// import Home from "./pages/Home";
// import Categories from "./pages/Categories";
// import GameDetail from "./pages/GameDetail";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import About from "./pages/About";
// import Terms from "./pages/Terms";
// import Privacy from "./pages/Privacy";
// import Contact from "./pages/Contact";
// // admin
// import AdminLogin from "./pages/AdminLogin";
// import AdminDashboard from "./pages/AdminDashboard";
// import AddGame from "./pages/AddGame";
// import ManageGames from "./pages/ManageGames";
// import EditGame from "./pages/EditGame";

// // NEW PAGES (Multiplayer)
// import LocalMultiplayer from "./pages/LocalMultiplayer";
// import OnlineMultiplayer from "./pages/OnlineMultiplayer";
// // cartoon
// import Cartoon from "./components/Cartoon"; 
// import GreetingCartoon from "./components/Greeting"; 
// import Train from "./components/Train";


// //Google Analytics
// import AnalyticsTracker from "./components/AnalyticsTracker";

// function RequireAuth({ children }) {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }

// function App() {
//   const location = useLocation();
//   const isAdminRoute = location.pathname.startsWith("/admin");

//   const [showCartoon, setShowCartoon] = React.useState(false); 
//   const [showGreeting, setShowGreeting] = React.useState(false);
//   const [showTrain, setShowTrain] = React.useState(false);



//   return (
//     <div style={styles.appWrapper}>
//       <AnalyticsTracker /> 
//       {!isAdminRoute && (
//         // <Navbar 
//         //   onSearch={(value) => setShowCartoon(value.toLowerCase() === "ding dong")} 
//         // />
//         <Navbar
//   onSearch={(value) => {
//     const term = value.toLowerCase().trim().replace(/\s+/g, " ");

//     setShowCartoon(false);
//     setShowGreeting(false);
//     setShowTrain(false); 

//     if (term === "ding dong") {
//       setShowCartoon(true);   
//     }

//     if (term === "hello ding dong") {
//       setShowGreeting(true); 
//     }

//     if (term === "hello kid") {
//       setShowTrain(true);
//     }
//   }}
// />
//       )}

//       {/* Cartoon system */}
//       <Cartoon 
//   visible={showCartoon}
//   onFinish={() => {
//     setShowCartoon(false);

//     // ⭐ Trigger search clear event
//     window.dispatchEvent(new Event("clear-search"));
//   }}
// />

// {showCartoon && (
//   <div
//     style={{
//       position: "fixed",
//       inset: 0,
//       zIndex: 2000,
//       pointerEvents: "all",
//       background: "transparent",
//     }}
//   ></div>
// )}
 

// {showGreeting && (
//   <GreetingCartoon onFinish={() => {
//     setShowGreeting(false);
//     window.dispatchEvent(new Event("clear-search"));
//   }} 
//   />
// )}

// {showTrain && (
//   <Train 
//     onFinish={() => setShowTrain(false)}
//   />
// )}





//       <main style={styles.container}>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/categories" element={<Categories />} />
//           <Route path="/game/:slug" element={<GameDetail />} />
//            {/* Multiplayer Pages */}
//           <Route path="/local-multiplayer" element={<LocalMultiplayer />} />
//           <Route path="/online-multiplayer" element={<OnlineMultiplayer />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           <Route 
//             path="/profile"
//             element={<RequireAuth><Profile /></RequireAuth>}
//           />

//           <Route path="/about" element={<About />} />
//           <Route path="/terms" element={<Terms />} />
//           <Route path="/privacy" element={<Privacy />} />
//           <Route path="/contact" element={<Contact />} />


//           <Route path="/admin" element={<AdminLogin />} />
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//           <Route path="/admin/add-game" element={<AddGame />} />
//           <Route path="/admin/games" element={<ManageGames />} />
//           <Route path="/admin/games/:id/edit" element={<EditGame />} />
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
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// admin
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddGame from "./pages/AddGame";
import ManageGames from "./pages/ManageGames";
import EditGame from "./pages/EditGame";
import AdminLiveTracker from "./pages/AdminLiveTracker";   // ⭐ ADDED

// NEW PAGES (Multiplayer)
import LocalMultiplayer from "./pages/LocalMultiplayer";
import OnlineMultiplayer from "./pages/OnlineMultiplayer";

// cartoon
import Cartoon from "./components/Cartoon"; 
import GreetingCartoon from "./components/Greeting"; 
import Train from "./components/Train";

//Google Analytics
import AnalyticsTracker from "./components/AnalyticsTracker";

import KidsThemeParkHub from "./KidsThemeParkHub.jsx"; // ⭐ ADDED
// ⭐ ADD SOCKET.IO
import { io } from "socket.io-client";

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [showCartoon, setShowCartoon] = React.useState(false); 
  const [showGreeting, setShowGreeting] = React.useState(false);
  const [showTrain, setShowTrain] = React.useState(false);

   /********************************************
   * ⭐ SOCKET.IO NOTIFICATION LISTENER
   ********************************************/
  React.useEffect(() => {
    const socket = io("https://gamenethub.onrender.com", {
      withCredentials: true,
    });

    // TEMP TEST (shows in console)
  socket.on("new-game-added", (game) => {
    console.log("⚡ SOCKET EVENT RECEIVED:", game);
  });

    socket.on("new-game-added", (game) => {
  window.dispatchEvent(
    new CustomEvent("notify-user", {
      detail: {
        id: Date.now(),
        title: game.title,
        slug: game.slug,
        thumbnail: game.thumbnail,
        text: `${game.title} is now available!`,
        time: new Date().toLocaleTimeString(),
        seen: false
      }
    })
  );
});


    return () => socket.disconnect();
  }, []);

  return (
    <div style={styles.appWrapper}>
      <AnalyticsTracker /> 
      {!isAdminRoute && (
        <Navbar
          onSearch={(value) => {
            const term = value.toLowerCase().trim().replace(/\s+/g, " ");

            setShowCartoon(false);
            setShowGreeting(false);
            setShowTrain(false); 

            if (term === "ding dong") {
              setShowCartoon(true);   
            }

            if (term === "hello ding dong") {
              setShowGreeting(true); 
            }

            if (term === "hello kid") {
              setShowTrain(true);
            }
          }}
        />
      )}

      {/* Cartoon system */}
      <Cartoon 
        visible={showCartoon}
        onFinish={() => {
          setShowCartoon(false);
          window.dispatchEvent(new Event("clear-search"));
        }}
      />

      {showCartoon && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            pointerEvents: "all",
            background: "transparent",
          }}
        ></div>
      )}

      {showGreeting && (
        <GreetingCartoon 
          onFinish={() => {
            setShowGreeting(false);
            window.dispatchEvent(new Event("clear-search"));
          }} 
        />
      )}

      {showTrain && (
        <Train onFinish={() => setShowTrain(false)} />
      )}

      <main style={styles.container}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/game/:slug" element={<GameDetail />} />

          {/* Multiplayer Pages */}
          <Route path="/local-multiplayer" element={<LocalMultiplayer />} />
          <Route path="/online-multiplayer" element={<OnlineMultiplayer />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route 
            path="/profile"
            element={<RequireAuth><Profile /></RequireAuth>}
          />

          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/kids" element={<KidsThemeParkHub />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-game" element={<AddGame />} />
          <Route path="/admin/games" element={<ManageGames />} />
          <Route path="/admin/games/:id/edit" element={<EditGame />} />

          {/* ⭐ NEW: Live Game Tracker Route */}
          <Route path="/admin/live-tracker" element={<AdminLiveTracker />} />
          <Route path="*" element={<NotFound />} />
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
