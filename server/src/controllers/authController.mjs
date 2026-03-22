/**
 * AUTHCONTROLLER.MJS — AUTH HTTP HANDLERS
 * -----------------------------------------
 * Handles register and login HTTP requests.
 * Extracts data from req.body, calls authService,
 * creates JWT token, and sends response.
 * 
 * WHY DOES CONTROLLER HANDLE JWT NOT SERVICE?
 * Service only talks to the database.
 * Controller handles HTTP — tokens are part of 
 * the HTTP response, not the database layer.
 * 
 * CATCHASYNC
 * Wraps each function so errors automatically go
 * to the global error handler — no try/catch needed.
 */

import * as authService from "../services/authService.mjs";
import catchAsync from "../utils/catchAsync.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * REGISTER
 * --------
 * 1. Extract email, password, username from req.body
 * 2. Call registerUser service — hashes password, saves to DB
 * 3. Create JWT token with user.id as payload
 * 4. Return token + user data to frontend
 * 
 * STATUS 201 — something new was created
 */
export const register = catchAsync(async (req, res) => {
  const { email, password, username } = req.body;
  
  // Service handles password hashing and DB insert
  const user = await authService.registerUser(email, password, username);

  // Sign token with user.id — this id travels with every future request
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "dev secret key",
    { expiresIn: "1d" }, // token expires in 1 day
  );

  res.status(201).json({
    status: "success",
    token: token,
    message: "Welcome to client management",
    data: {
      user: {
        id: user.id,
        email: user.email,
        username: user.username || "New User",
      },
    },
  });
});

/**
 * LOGIN
 * -----
 * 1. Extract email, password from req.body
 * 2. Find user by email — if not found, reject
 * 3. Compare password with stored hash using bcrypt.compare()
 * 4. If match, create JWT token and return to frontend
 * 
 * WHY bcrypt.compare() NOT bcrypt.hash() again?
 * bcrypt adds a random salt every time it hashes.
 * Same password hashed twice gives different results.
 * bcrypt.compare() extracts the salt from the stored hash
 * and uses it to compare correctly.
 * 
 * STATUS 200 — success, nothing new created
 */
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  
  // Find user — returns full row including password_hash
  const user = await authService.findUserByEmail(email);

  // If no user found with that email
  if (!user) {
    return res
      .status(401)
      .json({ status: "fail", message: "Invalid Credentials" });
  }

  // Compare plain password against stored hash
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(400).json({
      status: "fail",
      message: "Password doesn't match",
    });
  }

  // Create token — same pattern as register
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "dev secret key",
    { expiresIn: "1d" },
  );

  res.status(200).json({
    status: "success",
    token: token,
    message: "Login successful",
    data: {
      user: {
        id: user.id,
        email: user.email,
        username: user.username || "New User",
      },
    },
  });
});