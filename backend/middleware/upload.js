// // backend/middleware/upload.js
// import multer from "multer";
// import fs from "fs";
// import path from "path";

// /********************************************************
//  *  Ensure upload folders exist
//  ********************************************************/
// const ensureFolder = (folder) => {
//   if (!fs.existsSync(folder)) {
//     fs.mkdirSync(folder, { recursive: true });
//   }
// };

// ensureFolder("uploads/thumbnails");
// ensureFolder("uploads/zips");

// /********************************************************
//  *  Thumbnail Storage (Images)
//  ********************************************************/
// const thumbnailStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/thumbnails/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });

// // IMAGE FILTER
// const imageFilter = (req, file, cb) => {
//   const allowed = ["image/png", "image/jpg", "image/jpeg"];

//   if (!allowed.includes(file.mimetype)) {
//     return cb(new Error("Only PNG/JPG thumbnails allowed"), false);
//   }
//   cb(null, true);
// };

// /********************************************************
//  *  ZIP Storage (Game HTML ZIP)
//  ********************************************************/
// const zipStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/zips/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });

// // ZIP FILTER
// const zipFilter = (req, file, cb) => {
//   if (file.mimetype !== "application/zip" && file.mimetype !== "application/x-zip-compressed") {
//     return cb(new Error("Only ZIP files allowed"), false);
//   }
//   cb(null, true);
// };

// /********************************************************
//  *  Combined Upload Using .fields()
//  ********************************************************/
// export const uploadFiles = multer({
//   storage: multer.diskStorage({}),
// }).fields([
//   {
//     name: "thumbnail",
//     maxCount: 1,
//   },
//   {
//     name: "gameZip",
//     maxCount: 1,
//   }
// ]);

// export const uploadThumbnail = multer({
//   storage: thumbnailStorage,
//   fileFilter: imageFilter,
// }).single("thumbnail");

// export const uploadZip = multer({
//   storage: zipStorage,
//   fileFilter: zipFilter,
// }).single("gameZip");


// backend/middleware/upload.js

import multer from "multer";
import fs from "fs";
import path from "path";

/********************************************************
 * ⭐ 1. Get Persistent Disk Paths from Environment
 * * NOTE: These must be set in Render Environment Variables:
 * UPLOAD_PATH: /var/data/uploads 
 * GAME_PATH: /var/data/uploads/games 
 ********************************************************/
const UPLOADS_ROOT = process.env.UPLOAD_PATH; 
const UPLOAD_THUMBNAILS = path.join(UPLOADS_ROOT, "thumbnails");
const UPLOAD_ZIPS = path.join(UPLOADS_ROOT, "zips");
const UPLOAD_GAMES = process.env.GAME_PATH;   // ⭐ This is the extraction target

/********************************************************
 * ⭐ 2. Ensure these folders exist on Persistent Disk
 ********************************************************/
const ensureFolder = (folderPath) => {
  // Check for folderPath validity and existence
  if (folderPath && !fs.existsSync(folderPath)) {
    try {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`✅ Created persistent folder: ${folderPath}`);
    } catch (error) {
      // Logging error if folder creation fails (e.g., Disk not mounted correctly)
      console.error(`❌ Failed to create folder ${folderPath}:`, error.message);
    }
  }
};

// Create all necessary folders on the Persistent Disk (Mounted at /var/data)
ensureFolder(UPLOADS_ROOT); // /var/data/uploads
ensureFolder(UPLOAD_THUMBNAILS); // /var/data/uploads/thumbnails
ensureFolder(UPLOAD_ZIPS); // /var/data/uploads/zips
ensureFolder(UPLOAD_GAMES); // /var/data/uploads/games

/********************************************************
 * 3. Thumbnail Storage
 ********************************************************/
const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_THUMBNAILS), // Saves to Persistent Disk
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

// IMAGE FILTER
const imageFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only PNG/JPG images allowed"), false);
  }
  cb(null, true);
};

/********************************************************
 * 4. ZIP Storage (Game ZIP)
 ********************************************************/
const zipStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_ZIPS), // Saves to Persistent Disk
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

// ZIP FILTER
const zipFilter = (req, file, cb) => {
  const validZip =
    file.mimetype === "application/zip" ||
    file.mimetype === "application/x-zip-compressed" ||
    file.originalname.toLowerCase().endsWith(".zip");

  if (!validZip) {
    return cb(new Error("Only .zip files allowed"), false);
  }
  cb(null, true);
};

/********************************************************
 * 5. ⭐ FINAL — Combined Upload Middleware
 ********************************************************/
export const uploadFiles = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // Directing files to the correct persistent sub-folder
      if (file.fieldname === "thumbnail") cb(null, UPLOAD_THUMBNAILS);
      else if (file.fieldname === "gameZip") cb(null, UPLOAD_ZIPS);
    },
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/\s+/g, "_");
      cb(null, `${Date.now()}-${safeName}`);
    }
  }),

  fileFilter: (req, file, cb) => {
    if (file.fieldname === "thumbnail") return imageFilter(req, file, cb);
    if (file.fieldname === "gameZip") return zipFilter(req, file, cb);
  },

  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB max limit
  }
}).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "gameZip", maxCount: 1 }
]);

/********************************************************
 * 6. Optional individual uploaders
 ********************************************************/
export const uploadThumbnail = multer({
  storage: thumbnailStorage,
  fileFilter: imageFilter,
}).single("thumbnail");

export const uploadZip = multer({
  storage: zipStorage,
  fileFilter: zipFilter,
}).single("gameZip");
