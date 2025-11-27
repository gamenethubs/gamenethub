
// // backend/models/Game.js
// import mongoose from "mongoose";
// import slugify from "slugify";

// const gameSchema = new mongoose.Schema(
//   {
//     /************************************
//      * BASIC GAME INFO
//      ************************************/
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     slug: {
//       type: String,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       required: true,
//       index: true,
//     },

//     genre: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },

//     thumbnail: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     /************************************
//      * ZIP FILE (Stored in uploads/zips)
//      ************************************/
//     gameZip: {
//       type: String,
//       required: true,   // important for deployment
//       trim: true,
//     },

//     /************************************
//      * HTML PLAY FILE URL (Extracted folder)
//      ************************************/
//     playUrl: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     /************************************
//      * ⭐ USER-BASED RATING SYSTEM
//      ************************************/
//     ratings: [
//       {
//         user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         stars: { type: Number, min: 1, max: 5 },
//       },
//     ],

//     averageRating: {
//       type: Number,
//       default: 4.0,
//       min: 0,
//       max: 5,
//     },

//     totalRatings: {
//       type: Number,
//       default: 0,
//     },

//     /************************************
//      * ⭐ PLAY COUNT SYSTEM
//      ************************************/
//     playCount: {
//       type: Number,
//       default: 0,
//     },

//     playedIPs: [
//       {
//         ip: String,
//         time: Number, // timestamp
//       },
//     ],

//     /************************************
//      * ⭐ ANALYTICS — BEST SORTING FIELDS
//      ************************************/
//     trendingScore: {
//       type: Number,
//       default: 0,
//       index: true,
//     },

//     popularScore: {
//       type: Number,
//       default: 0,
//       index: true,
//     },

//     /************************************
//      * FLAGS — FEATURED / NEW
//      ************************************/
//     isFeatured: {
//       type: Boolean,
//       default: false,
//     },

//     isNew: {
//       type: Boolean,
//       default: false,
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// /************************************
//  * AUTO-CREATE SLUG (SAFE FOR PROD)
//  ************************************/
// gameSchema.pre("validate", function (next) {
//   if (!this.slug && this.title) {
//     this.slug = slugify(this.title, { lower: true, strict: true });
//   }
//   next();
// });

// /************************************
//  * HANDLE DUPLICATE SLUG ISSUES
//  ************************************/
// gameSchema.post("save", function (error, doc, next) {
//   if (error.name === "MongoServerError" && error.code === 11000) {
//     next(new Error("Game with this title/slug already exists"));
//   } else {
//     next(error);
//   }
// });

// export default mongoose.model("Game", gameSchema);


// backend/models/Game.js
import mongoose from "mongoose";
import slugify from "slugify";

const gameSchema = new mongoose.Schema(
  {
    /************************************
     * BASIC GAME INFO
     ************************************/
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
      index: true,
    },

    genre: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },

    /************************************
     * ZIP FILE (Stored in uploads/zips)
     ************************************/
    gameZip: {
      type: String,
      required: true,   // important for deployment
      trim: true,
    },

    /************************************
     * HTML PLAY FILE URL (Extracted folder)
     ************************************/
    playUrl: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    /************************************
     * ⭐ DEVICE COMPATIBILITY FIELD (NEW)
     ************************************/
    deviceCompatibility: {
      type: String,
      enum: ["all", "desktop", "mobile"],
      default: "all",
      index: true,
    },

        /************************************
     * ⭐ ORIENTATION SETTINGS (NEW)
     ************************************/
    orientation: {
      type: String,
      enum: ["all", "landscape"],   // portrait allowed under "all"
      default: "all",
    },

    /************************************
     * ⭐ USER-BASED RATING SYSTEM
     ************************************/
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        stars: { type: Number, min: 1, max: 5 },
      },
    ],

    averageRating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    /************************************
     * ⭐ PLAY COUNT SYSTEM
     ************************************/
    playCount: {
      type: Number,
      default: 0,
    },

    playedIPs: [
      {
        ip: String,
        time: Number, // timestamp
      },
    ],

    /************************************
     * ⭐ ANALYTICS — BEST SORTING FIELDS
     ************************************/
    trendingScore: {
      type: Number,
      default: 0,
      index: true,
    },

    popularScore: {
      type: Number,
      default: 0,
      index: true,
    },

    /************************************
     * FLAGS — FEATURED / NEW
     ************************************/
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isNew: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

/************************************
 * AUTO-CREATE SLUG (SAFE FOR PROD)
 ************************************/
gameSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

/************************************
 * HANDLE DUPLICATE SLUG ISSUES
 ************************************/
gameSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Game with this title/slug already exists"));
  } else {
    next(error);
  }
});

export default mongoose.model("Game", gameSchema);
