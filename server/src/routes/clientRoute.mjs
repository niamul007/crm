// ─── ROUTES/CLIENTROUTE.MJS ──────────────────────────────────────
/**
 * CLIENTROUTE.MJS — CLIENT ROUTE DEFINITIONS
 * --------------------------------------------
 * All routes here are protected — router.use(protect) runs
 * before every route in this file.
 * 
 * ROUTE PARAMS:
 *   :id  → client id
 *   :pid → payment id
 *   :nid → note id
 * 
 * MIDDLEWARE ORDER PER ROUTE:
 * 1. protect         → verifies JWT, attaches req.user
 * 2. validateSchema  → checks req.body (only on POST/PUT)
 * 3. controller      → handles logic and response
 * 
 * WHY NO VALIDATION ON GET/DELETE?
 * GET sends no body — nothing to validate
 * DELETE sends no body — only needs the id from URL
 */

import express from 'express';
import { protect } from '../middleware/authMiddleware.mjs';
const router = express.Router();
import * as clientController from "../controllers/clientController.mjs";
import { validateSchema } from '../validation/validate.mjs';
import { clientSchema, paymentSchema, noteSchema } from '../validation/clientSchema.mjs';

// Protect all routes in this file
router.use(protect);

router.get("/", clientController.getClient);
router.post("/", validateSchema(clientSchema), clientController.createClient);
router.get("/:id", clientController.getClientById);
router.delete("/:id", clientController.deleteClient);
router.put("/:id", validateSchema(clientSchema), clientController.updateClient);
router.post("/:id/payments", validateSchema(paymentSchema), clientController.addPayments);
router.delete("/:id/payments/:pid", clientController.deletePayments);
router.post("/:id/notes", validateSchema(noteSchema), clientController.addNote);
router.delete("/:id/notes/:nid", clientController.deleteNote);

export default router;