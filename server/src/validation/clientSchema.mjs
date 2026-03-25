// ─── CLIENTVALIDATION.MJS ────────────────────────────────────────
/**
 * CLIENTVALIDATION.MJS — ZOD SCHEMAS FOR CLIENT ROUTES
 * ------------------------------------------------------
 * Three schemas — one for each type of request body.
 * All live in one file because they are all client related.
 */

import { z } from "zod";

// Used on POST /api/clients and PUT /api/clients/:id
export const clientSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Minimum 3 characters"),
    email: z.string().email("invalid email"),
    phone: z
      .string()
      .min(8, "Minimum 8 digits")
      .max(11, { message: "Max 11 digits" }),
    company: z.string().min(10, { message: "At least 10 characters" }),
    project_name: z.string().min(3, { message: "Minimum 3 characters" }),
    project_status: z.string().min(3, { message: "Minimum 3 characters" }),
    deadline: z.string().date("must be a valid date"),
    budget: z.coerce.number().positive(),
  }),
});

// Used on POST /api/clients/:id/payments
// payment_note is optional — user may not always add a note
export const paymentSchema = z.object({
  body: z.object({
    amount: z.coerce.number().positive(),
    payment_date: z.string().date("Must be valid date"),
    payment_note: z.string().min(5).optional().or(z.literal("")),
  }),
});

// Used on POST /api/clients/:id/notes
export const noteSchema = z.object({
  body: z.object({
    content: z.string().min(5, { message: "more than 5 chars needed" }),
  }),
});
