// backend/utils/generateUsername.js
import slugify from "slugify";
import User from "../models/User.js";

/**
 * generateUsername(baseSource, maxAttempts = 1000)
 *
 * - baseSource: a string like full name or email local-part
 * - returns a unique username (lowercase, no spaces, only a-z0-9 and underscore)
 * - pattern: base, base1, base2, ...
 *
 * Uses DB checks to ensure uniqueness.
 */

const CLEAN_RE = /[^a-z0-9_]/g;

/**
 * sanitizeBase - produce a reasonable base username from a raw input
 */
function sanitizeBase(raw) {
  if (!raw || typeof raw !== "string") return "user";
  // Normalize: convert to ASCII-ish (slugify), lowercase
  // slugify with replacement '' to remove spaces and diacritics.
  const slug = slugify(raw, {
    replacement: "",
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
  // Allow underscores if present; replace non alnum/underscore
  const cleaned = slug.replace(CLEAN_RE, "");
  // fallback
  if (!cleaned || cleaned.length < 2) {
    // try email local-part fallback (if raw contains @)
    if (raw.includes("@")) {
      const local = raw.split("@")[0].replace(CLEAN_RE, "");
      if (local && local.length >= 2) return local.slice(0, 30);
    }
    // final fallback
    return `user${Math.floor(1000 + Math.random() * 9000)}`;
  }
  // trim to max 24 chars for aesthetics
  return cleaned.slice(0, 24);
}

/**
 * generateUsername: async function that checks DB for availability
 */
export default async function generateUsername(rawSource, maxAttempts = 1000) {
  const base = sanitizeBase(rawSource);

  // If base is available, use it
  const exists = await User.findOne({ username: base }).select("_id").lean();
  if (!exists) return base;

  // Otherwise append small numeric suffixes
  for (let i = 1; i <= maxAttempts; i++) {
    const candidate = `${base}${i}`;
    // quick sanity: never exceed 30 chars
    if (candidate.length > 30) {
      // trim base portion to accommodate suffix
      const trimLen = 30 - String(i).length;
      const trimmed = base.slice(0, Math.max(1, trimLen));
      const cand2 = `${trimmed}${i}`;
      const found = await User.findOne({ username: cand2 }).select("_id").lean();
      if (!found) return cand2;
      continue;
    }
    const found = await User.findOne({ username: candidate }).select("_id").lean();
    if (!found) return candidate;
  }

  // Last resort: random unique username
  for (let j = 0; j < 20; j++) {
    const rnd = `${base}${Math.floor(10000 + Math.random() * 89999)}`;
    const found = await User.findOne({ username: rnd }).select("_id").lean();
    if (!found) return rnd;
  }

  // If still not found (extremely unlikely), throw
  throw new Error("Unable to generate unique username — try again later");
}
