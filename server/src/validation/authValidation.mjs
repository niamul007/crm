import { z } from "zod";

export const registerSchema = z.object({
  body: {
    username: z.string().min(3, { message: "username must be 3 character" }),
    email: z.string().email("invalid email"),
    password: z.string().min(3, "password must be at least  character"),
  },
});

export const loginSchema = z.object({
  body: {
    email: z.string().email("invalid email"),
    password: z.string().min(3, "password must be at least  character"),
  },
});
