import express from 'express';
import { protect } from '../middleware/authMiddleware.mjs'
const router = express.Router();
import * as clientController from "../controllers/clientController.mjs";

router.use(protect)
router.get("/", clientController.getClient);
router.post("/", clientController.createClient);
router.get("/:id", clientController.getClientById);
router.delete("/:id", clientController.deleteClient);
router.put("/:id", clientController.updateClient);
router.post("/:id/payments", clientController.addPayments);
router.delete("/:id/payments/:pid", clientController.deletePayments)
router.post("/:id/notes",clientController.addNote);
router.delete("/:id/notes/:nid", clientController.deleteNote)

export default router;