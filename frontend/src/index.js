// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ReactGA from "react-ga4";
// Auth Context
import { AuthProvider } from "./context/AuthContext";

// Google Provider
import { GoogleOAuthProvider } from "@react-oauth/google";

// Load Google Client ID
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_ID;

if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
