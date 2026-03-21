import express from 'express';
import { protect } from '../middleware/authMiddleware.mjs'
const router = express.Router();
import * as clientController from "../controllers/clientController.mjs";
import { validateSchema } from '../validation/validate.mjs';
import { clientSchema, paymentSchema, noteSchema } from '../validation/clientSchema.mjs';

router.use(protect)
router.get("/", clientController.getClient);
router.post("/",validateSchema(clientSchema), clientController.createClient);
router.get("/:id", clientController.getClientById);
router.delete("/:id", clientController.deleteClient);
router.put("/:id",validateSchema(clientSchema), clientController.updateClient);
router.post("/:id/payments",validateSchema(paymentSchema), clientController.addPayments);
router.delete("/:id/payments/:pid", clientController.deletePayments)
router.post("/:id/notes",validateSchema(noteSchema),clientController.addNote);
router.delete("/:id/notes/:nid", clientController.deleteNote)

export default router;