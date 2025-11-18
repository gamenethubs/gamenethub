// // backend/middleware/authMiddleware.js
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// /********************************************************
//  *  PROTECT → Verify Token + Attach req.user
//  ********************************************************/
// export const protect = async (req, res, next) => {
//   try {
//     let token;

//     // Accept Bearer Token
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     // No token provided
//     if (!token) {
//       return res.status(401).json({
//         message: "Login required",
//       });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Find user
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     // Attach user
//     req.user = user;

//     next();
//   } catch (error) {
//     console.error("AUTH ERROR:", error.message);

//     // Token expired or invalid
//     return res.status(401).json({
//       message: "Invalid or expired token",
//     });
//   }
// };

// /********************************************************
//  *  ADMIN-ONLY MIDDLEWARE
//  ********************************************************/
// export const adminOnly = (req, res, next) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({
//         message: "Login required",
//       });
//     }

//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         message: "Admins only",
//       });
//     }

//     next();
//   } catch (err) {
//     console.error("ADMIN CHECK ERROR:", err.message);
//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };

// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/********************************************************
 *  PROTECT → Verify JWT + Attach req.user
 ********************************************************/
export const protect = async (req, res, next) => {
  try {
    let token = null;

    /********************************************
     * 1️⃣ Extract Bearer token (case-insensitive)
     ********************************************/
    const authHeader =
      req.headers.authorization ||
      req.headers.Authorization ||
      null;

    if (authHeader) {
      const parts = authHeader.split(" ");
      if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
        token = parts[1];
      }
    }

    /********************************************
     * 2️⃣ Token missing
     ********************************************/
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    /********************************************
     * 3️⃣ Ensure JWT secret exists
     ********************************************/
    if (!process.env.JWT_SECRET) {
      console.error("❌ MISSING JWT_SECRET in environment");

      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    /********************************************
     * 4️⃣ Verify Token safely
     ********************************************/
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("❌ JWT VERIFY FAILED:", err.message);
      }

      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    /********************************************
     * 5️⃣ Fetch user (lean = faster, safe)
     ********************************************/
    const user = await User.findById(decoded.id)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to req
    req.user = user;

    next();
  } catch (err) {
    console.error("🔥 AUTH MIDDLEWARE ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

/********************************************************
 *  ADMIN-ONLY MIDDLEWARE
 ********************************************************/
export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins only",
      });
    }

    next();
  } catch (err) {
    console.error("🔥 ADMIN CHECK ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
