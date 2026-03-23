// ─── ROUTES/AUTH.MJS ─────────────────────────────────────────────
/**
 * AUTH.MJS — AUTH ROUTE DEFINITIONS
 * -----------------------------------
 * Defines public routes for register and login.
 * No authMiddleware here — users aren't logged in yet.
 * 
 * MIDDLEWARE ORDER PER ROUTE:
 * 1. validateSchema → checks req.body with Zod
 * 2. controller     → handles logic and response
 */

import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.mjs';
import { validateSchema } from '../validation/validate.mjs';
import { registerSchema, loginSchema } from '../validation/authValidation.mjs';

router.post("/register", validateSchema(registerSchema), authController.register);
router.post("/login", validateSchema(loginSchema), authController.login);
router.get("/me", protect, authController.getMe);

export default router;