

// // backend/routes/authRoutes.js
// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import { OAuth2Client } from "google-auth-library";

// const router = express.Router();
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// /************************************
//  * UTIL — SIGN JWT TOKEN
//  ************************************/
// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );
// };

// /************************************
//  * UTIL — FORMAT USER RESPONSE
//  ************************************/
// const userResponse = (u) => ({
//   id: u._id,
//   name: u.name,
//   email: u.email,
//   role: u.role,
//   avatar: u.avatar,
//   favorites: u.favorites || [],
//   ratedGames: u.ratedGames || [],
// });

// /************************************
//  * REGISTER
//  ************************************/
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password)
//       return res.status(400).json({ message: "All fields are required" });

//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res
//         .status(409)
//         .json({ message: "Email already registered. Try logging in." });

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       avatar: null,
//     });

//     const token = generateToken(newUser);

//     res.status(201).json({
//       message: "Registration successful",
//       token,
//       user: userResponse(newUser),
//     });
//   } catch (error) {
//     console.error("🔥 REGISTER ERROR:", error);
//     res.status(500).json({ message: "Server error during registration" });
//   }
// });

// /************************************
//  * LOGIN
//  ************************************/
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ message: "All fields are required" });

//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(404).json({ message: "User not found" });

//     // If Google login user tries password login
//     if (user.googleId && user.password === "GOOGLE_AUTH") {
//       return res.status(400).json({
//         message: "This account uses Google Login. Please sign in with Google.",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ message: "Invalid credentials" });

//     const token = generateToken(user);

//     res.json({
//       message: "Login successful",
//       token,
//       user: userResponse(user),
//     });
//   } catch (error) {
//     console.error("🔥 LOGIN ERROR:", error);
//     res.status(500).json({ message: "Server error during login" });
//   }
// });

// /************************************
//  * GOOGLE LOGIN
//  ************************************/
// router.post("/google-login", async (req, res) => {
//   try {
//     const { credential } = req.body;

//     if (!credential)
//       return res.status(400).json({ message: "Google token missing" });

//     // Verify Google token
//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, picture, sub } = payload;

//     if (!email)
//       return res.status(400).json({ message: "Google authentication failed" });

//     let user = await User.findOne({ email });

//     // If user doesn't exist → create new entry
//     if (!user) {
//       user = await User.create({
//         name,
//         email,
//         googleId: sub,
//         avatar: picture,
//         password: "GOOGLE_AUTH", // indicator user is Google based
//       });
//     }

//     // If Google user tries with wrong Google account → reject
//     if (user.googleId && user.googleId !== sub) {
//       return res.status(400).json({
//         message: "This Google account doesn't match your registered account.",
//       });
//     }

//     const token = generateToken(user);

//     res.json({
//       message: "Google login successful",
//       token,
//       user: userResponse(user),
//     });
//   } catch (error) {
//     console.error("🔥 GOOGLE LOGIN ERROR:", error);
//     res.status(500).json({ message: "Google login failed" });
//   }
// });

// export default router;


// backend/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import generateUsername from "../utils/generateUsername.js"; // ⭐ NEW

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/************************************
 * UTIL — SIGN JWT TOKEN
 ************************************/
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/************************************
 * UTIL — FORMAT USER RESPONSE
 * (kept exactly same, only username added)
 ************************************/
const userResponse = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  avatar: u.avatar,
  favorites: u.favorites || [],
  ratedGames: u.ratedGames || [],
  username: u.username || null, // ⭐ NEW
   bio: u.bio || "",
  social: {
    instagram: u.social?.instagram || "",
    twitter: u.social?.twitter || "",
    linkedin: u.social?.linkedin || "",
  }
});

/************************************
 * ⭐ ensureUsername(user)
 * Automatically generates username if missing
 ************************************/
async function ensureUsername(user) {
  if (!user) return user;
  if (user.username) return user;

  const raw = user.name || user.email || `user${Date.now()}`;
  const finalUsername = await generateUsername(raw);

  user.username = finalUsername;
  await user.save();

  return user;
}

/************************************
 * REGISTER
 ************************************/
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(409)
        .json({ message: "Email already registered. Try logging in." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: "/avatars/avatar01.png",

    });

    // ⭐ Auto-generate username
    await ensureUsername(newUser);

    const token = generateToken(newUser);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: userResponse(newUser),
    });
  } catch (error) {
    console.error("🔥 REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

/************************************
 * LOGIN
 ************************************/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // If Google login user tries password login
    if (user.googleId && user.password === "GOOGLE_AUTH") {
      return res.status(400).json({
        message: "This account uses Google Login. Please sign in with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // ⭐ FIX old accounts — generate username if missing
    await ensureUsername(user);

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: userResponse(user),
    });
  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

/************************************
 * GOOGLE LOGIN
 ************************************/
router.post("/google-login", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential)
      return res.status(400).json({ message: "Google token missing" });

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    if (!email)
      return res.status(400).json({ message: "Google authentication failed" });

    let user = await User.findOne({ email });

    // If user doesn't exist → create
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub,
        avatar: "/avatars/avatar01.png",

        password: "GOOGLE_AUTH",
      });
    }

    // If Google account mismatched
    if (user.googleId && user.googleId !== sub) {
      return res.status(400).json({
        message: "This Google account doesn't match your registered account.",
      });
    }

    // ⭐ Auto-username for Google sign-in
    await ensureUsername(user);

    const token = generateToken(user);

    res.json({
      message: "Google login successful",
      token,
      user: userResponse(user),
    });
  } catch (error) {
    console.error("🔥 GOOGLE LOGIN ERROR:", error);
    res.status(500).json({ message: "Google login failed" });
  }
});

export default router;
