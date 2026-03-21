import { z } from "zod";

export const clientSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Minimum 6 character"),
    email: z.string().email("invalid email"),
    phone: z
      .string()
      .min(8, "Minimum 8 number")
      .max(11, { message: "max number 11" }),
    company: z
      .string()
      .min(10, { message: "atleast more than 10 character long" }),
    project_name: z.string().min(3, { message: "minimum 3 character long" }),
    project_status: z.string().min(3, { message: "minimum 3 char long " }),
    deadline: z.string().date("must be  valid date"),
    budget: z.number().positive(),
  }),
});

export const paymentSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    payment_date: z.string().date("Must be valid date"),
    payment_note: z
      .string()
      .min(5, { message: "more than 5 char needed" })
      .optional(),
  }),
});

export const noteSchema = z.object({
  body: z.object({
    content: z.string().min(5, { message: "more than 5 char needed" }),
  }),
});
