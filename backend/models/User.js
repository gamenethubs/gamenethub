// // backend/models/User.js
// import mongoose from "mongoose";

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

// const userSchema = new mongoose.Schema(
//   {
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
//     },

//     // ⭐ Google Login
//     googleId: {
//       type: String,
//       default: null,
//     },

//     picture: {
//       type: String,
//       default: null,
//     },

//     // ⭐ Normal Login
//     password: {
//       type: String,
//       minlength: 6,
//       default: null, // google accounts ke liye null allowed
//     },

//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },

//     /**************************************
//      * ⭐ FAVOURITES — Game Wishlist
//      **************************************/
//     favorites: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Game",
//       },
//     ],

//     /**************************************
//      * ⭐ RATED GAMES — Track user's ratings
//      **************************************/
//     ratedGames: [ratedGameSchema],

//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

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
  },
  {
    timestamps: true,
  }
);

/**************************************
 * SAFETY: Prevent duplicate email/googleId errors
 **************************************/
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    if (error.keyValue?.email) {
      next(new Error("User with this email already exists"));
    } else if (error.keyValue?.googleId) {
      next(new Error("This Google account is already registered"));
    } else {
      next(new Error("Duplicate user data detected"));
    }
  } else {
    next(error);
  }
});

export default mongoose.model("User", userSchema);
