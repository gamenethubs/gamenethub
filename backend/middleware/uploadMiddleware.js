// // backend/middleware/uploadMiddleware.js
// import multer from "multer";
// import fs from "fs";

// /************************************
//  * Ensure upload folders exist
//  ************************************/
// const ensureFolder = (folder) => {
//   if (!fs.existsSync(folder)) {
//     fs.mkdirSync(folder, { recursive: true });
//   }
// };

// ensureFolder("uploads/thumbnails");
// ensureFolder("uploads/zips");

// /************************************
//  * STORAGE ENGINE
//  ************************************/
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "thumbnail") {
//       cb(null, "uploads/thumbnails/");
//     } else if (file.fieldname === "gameZip") {
//       cb(null, "uploads/zips/");
//     }
//   },

//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// /************************************
//  * FILE FILTER
//  ************************************/
// const fileFilter = (req, file, cb) => {
//   if (file.fieldname === "thumbnail") {
//     if (!file.mimetype.startsWith("image/")) {
//       return cb(new Error("Thumbnail must be an image"), false);
//     }
//   }

//   if (file.fieldname === "gameZip") {
//     if (!file.originalname.endsWith(".zip")) {
//       return cb(new Error("Game ZIP must be a .zip file"), false);
//     }
//   }

//   cb(null, true);
// };

// /************************************
//  * FINAL MULTER UPLOADER
//  ************************************/
// export const uploadFiles = multer({
//   storage,
//   fileFilter,
// }).fields([
//   { name: "thumbnail", maxCount: 1 },
//   { name: "gameZip", maxCount: 1 },
// ]);


// backend/middleware/uploadMiddleware.js
import multer from "multer";
import fs from "fs";
import path from "path";

// ROOT path for Linux + Render safety
const ROOT_DIR = process.cwd();

/************************************
 * Define all required folders
 ************************************/
const UPLOADS_ROOT = path.join(ROOT_DIR, "uploads");
const THUMB_DIR = path.join(UPLOADS_ROOT, "thumbnails");
const ZIP_DIR = path.join(UPLOADS_ROOT, "zips");
const GAME_EXTRACT_DIR = path.join(UPLOADS_ROOT, "games"); // ⭐ IMPORTANT

/************************************
 * Ensure upload folders exist
 ************************************/
const ensureFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

ensureFolder(UPLOADS_ROOT);
ensureFolder(THUMB_DIR);
ensureFolder(ZIP_DIR);
ensureFolder(GAME_EXTRACT_DIR); // ⭐ must exist for game extraction

/************************************
 * Multer Storage Engine
 ************************************/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") {
      cb(null, THUMB_DIR);
    } else if (file.fieldname === "gameZip") {
      cb(null, ZIP_DIR);
    } else {
      cb(new Error("Invalid upload field"), null);
    }
  },

  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

/************************************
 * File Filter (Safe for Production)
 ************************************/
const fileFilter = (req, file, cb) => {
  // Thumbnail validation
  if (file.fieldname === "thumbnail") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Thumbnail must be a valid image"), false);
    }
    return cb(null, true);
  }

  // ZIP validation
  if (file.fieldname === "gameZip") {
    const validZip =
      file.mimetype === "application/zip" ||
      file.mimetype === "application/x-zip-compressed" ||
      file.originalname.toLowerCase().endsWith(".zip");

    if (!validZip) {
      return cb(new Error("Game ZIP must be a .zip file"), false);
    }
    return cb(null, true);
  }

  return cb(new Error("Invalid file type"), false);
};

/************************************
 * FINAL UPLOADER (Render + Persistent Disk Ready)
 ************************************/
export const uploadFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max for ZIPs
  },
}).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "gameZip", maxCount: 1 },
]);

