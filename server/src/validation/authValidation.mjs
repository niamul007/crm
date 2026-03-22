// ─── AUTHVALIDATION.MJS ───────────────────────────────────────────
/**
 * AUTHVALIDATION.MJS — ZOD SCHEMAS FOR AUTH ROUTES
 * --------------------------------------------------
 * Defines the shape and rules for auth request bodies.
 * Used by validateSchema middleware before controllers run.
 * If validation fails, request never reaches the controller.
 */

import { z } from "zod";

// Used on POST /api/auth/register
export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3, { message: "username must be 3 characters" }),
    email: z.string().email("invalid email"),
    password: z.string().min(6, "password must be at least 6 characters"),
  }),
});

// Used on POST /api/auth/login
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("invalid email"),
    password: z.string().min(1, "password is required"),
  }),
});