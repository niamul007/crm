/**
 * AUTHMIDDLEWARE.MJS — JWT PROTECTION MIDDLEWARE
 * ------------------------------------------------
 * This middleware runs before any protected route.
 * It verifies the JWT token and attaches the user to req.user.
 * 
 * WHAT IS A JWT?
 * A token made of 3 parts separated by dots:
 *   header.payload.signature
 * 
 *   header    → algorithm type (HS256)
 *   payload   → data you stored inside e.g { id: 1 }
 *   signature → proves token wasn't tampered with
 * 
 * DATA FLOW:
 *   Login → jwt.sign({ id: user.id }) → token sent to frontend
 *   Next request → token sent in Authorization header
 *   This middleware → decodes token → gets user.id back → queries DB
 * 
 * WHY QUERY THE DATABASE?
 *   The token proves identity but the user might have been deleted.
 *   We verify the user still exists before allowing access.
 */

import pool from "../db/index.mjs";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    // Token comes in Authorization header as: "Bearer <token>"
    const authHeader = req.headers.authorization;

    // If no token or wrong format — reject immediately
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Split "Bearer <token>" and take just the token part
    const token = authHeader.split(" ")[1];

    // Verify token signature and decode payload
    // verifyToken contains what we stored: { id: user.id }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    // Use the decoded id to find the user in the database
    // verifyToken.id comes from jwt.sign({ id: user.id }) at login
    const result = await pool.query(
      "SELECT id, email, username FROM users WHERE id = $1",
      [verifyToken.id],
    );

    // If user no longer exists in database — reject
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request — now available as req.user in all controllers
    req.user = result.rows[0];

    // Pass control to the next middleware or controller
    next();
  } catch (error) {
    console.error("JWT verification error", error.message);
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};