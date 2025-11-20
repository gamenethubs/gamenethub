import express from "express";
import { submitContact } from "../controllers/contactController.js";

const router = express.Router();

// Public route (no login required)
router.post("/submit", submitContact);

export default router;
