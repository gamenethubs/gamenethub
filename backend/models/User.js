

// // backend/models/User.js
// import mongoose from "mongoose";

// /**************************************
//  * ⭐ Sub-schema for Rated Games
//  **************************************/
// const ratedGameSchema = new mongoose.Schema(
//   {
//     game: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Game",
//       required: true,
//     },
//     stars: {
//       type: Number,
//       min: 1,
//       max: 5,
//       required: true,
//     },
//   },
//   { _id: false }
// );

// /**************************************
//  * ⭐ USER SCHEMA
//  **************************************/
// const userSchema = new mongoose.Schema(
//   {
//     /**************************************
//      * BASIC USER INFO
//      **************************************/
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       index: true,
//     },

//     /**************************************
//      * GOOGLE LOGIN SUPPORT
//      **************************************/
//     googleId: {
//       type: String,
//       default: null,
//       index: true,
//       sparse: true, // prevents unique conflict with null
//     },

//     avatar: {
//       type: String,
//       default: null,
//       trim: true,
//     },

//     /**************************************
//      * PASSWORD (Only for normal login)
//      **************************************/
//     password: {
//       type: String,
//       minlength: 6,
//       default: null, // google users may not have password
//     },

//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },

//     /**************************************
//      * ⭐ FAVORITES
//      **************************************/
//     favorites: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Game",
//       },
//     ],

//     /**************************************
//      * ⭐ RATED GAMES
//      **************************************/
//     ratedGames: [ratedGameSchema],
//   },
//   {
//     timestamps: true,
//   }
// );

// /**************************************
//  * SAFETY: Prevent duplicate email/googleId errors
//  **************************************/
// userSchema.post("save", function (error, doc, next) {
//   if (error.name === "MongoServerError" && error.code === 11000) {
//     if (error.keyValue?.email) {
//       next(new Error("User with this email already exists"));
//     } else if (error.keyValue?.googleId) {
//       next(new Error("This Google account is already registered"));
//     } else {
//       next(new Error("Duplicate user data detected"));
//     }
//   } else {
//     next(error);
//   }
// });

// export default mongoose.model("User", userSchema);


// backend/models/User.js
import mongoose from "mongoose";

/**************************************
 * ⭐ Sub-schema for Rated Games
 **************************************/
const ratedGameSchema = new mongoose.Schema(
  {
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { _id: false }
);

/**************************************
 * ⭐ USER SCHEMA
 **************************************/
const userSchema = new mongoose.Schema(
  {
    /**************************************
     * BASIC USER INFO
     **************************************/
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    /**************************************
     * GOOGLE LOGIN SUPPORT
     **************************************/
    googleId: {
      type: String,
      default: null,
      index: true,
      sparse: true, // prevents unique conflict with null
    },

    avatar: {
      type: String,
      default: null,
      trim: true,
    },

    /**************************************
     * PASSWORD (Only for normal login)
     **************************************/
    password: {
      type: String,
      minlength: 6,
      default: null, // google users may not have password
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    /**************************************
     * ⭐ FAVORITES
     **************************************/
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
      },
    ],

    /**************************************
     * ⭐ RATED GAMES
     **************************************/
    ratedGames: [ratedGameSchema],


    /*******************************************************
     * 🔥 NEW SYSTEM — PREMIUM USER PROFILE & FRIEND SYSTEM
     *******************************************************/

    /**************************************
     * ⭐ UNIQUE USERNAME (public identity)
     **************************************/
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: /^[a-zA-Z0-9_]{3,30}$/,
    },

    /**************************************
     * ⭐ FRIENDS (Mutual connections)
     **************************************/
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /**************************************
     * ⭐ FRIEND REQUESTS — Incoming
     **************************************/
    incomingRequests: [
      {
        from: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /**************************************
     * ⭐ FRIEND REQUESTS — Outgoing
     **************************************/
    outgoingRequests: [
      {
        to: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /**************************************
     * ⭐ PRESENCE (Online / Offline Tracking)
     **************************************/
    lastSeen: {
      type: Date,
      default: null,
    },

    /**************************************
     * ⭐ OPTIONAL — SOCIAL + BIO
     **************************************/
    bio: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    social: {
      instagram: { type: String, trim: true, default: "" },
      twitter: { type: String, trim: true, default: "" },
      linkedin: { type: String, trim: true, default: "" },
    },
  },

  {
    timestamps: true,
  }
);

/**************************************
 * SAFETY: Prevent duplicate email/googleId/username errors
 **************************************/
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    if (error.keyValue?.email) {
      next(new Error("User with this email already exists"));
    } else if (error.keyValue?.googleId) {
      next(new Error("This Google account is already registered"));
    } else if (error.keyValue?.username) {
      next(new Error("This username is already taken"));
    } else {
      next(new Error("Duplicate user data detected"));
    }
  } else {
    next(error);
  }
});

export default mongoose.model("User", userSchema);

