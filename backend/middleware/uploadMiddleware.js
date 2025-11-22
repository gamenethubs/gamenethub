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

/********************************************************
 * ⭐ 1. Get Persistent Disk Paths from Environment
 * * NOTE: Ensure these are set in Render Environment:
 * UPLOAD_PATH: /var/data/uploads 
 * GAME_PATH: /var/data/uploads/games 
 ********************************************************/
const UPLOADS_ROOT = process.env.UPLOAD_PATH; 
const GAME_EXTRACT_DIR = process.env.GAME_PATH; 

// Sub-folders paths inside the persistent disk
const THUMB_DIR = path.join(UPLOADS_ROOT, "thumbnails");
const ZIP_DIR = path.join(UPLOADS_ROOT, "zips");

/********************************************************
 * ⭐ 2. Ensure upload folders exist on Persistent Disk
 * * This runs when the server starts to make sure the folders exist on /var/data
 ********************************************************/
const ensureFolder = (folderPath) => {
  // Check for folderPath validity and existence
  if (folderPath && !fs.existsSync(folderPath)) {
    try {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`✅ Created persistent folder: ${folderPath}`);
    } catch (error) {
      // Logging error if folder creation fails
      console.error(`❌ Failed to create folder ${folderPath}:`, error.message);
    }
  }
};

// Create all necessary folders on the Persistent Disk
ensureFolder(UPLOADS_ROOT); 
ensureFolder(THUMB_DIR); 
ensureFolder(ZIP_DIR); 
ensureFolder(GAME_EXTRACT_DIR); 

/************************************
 * 3. Multer Storage Engine - Points to Persistent Disk
 ************************************/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Directing files to the correct persistent sub-folder
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
 * 4. File Filter (Validation)
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
 * 5. FINAL UPLOADER
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

