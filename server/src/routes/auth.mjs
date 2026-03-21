import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.mjs';

router.post("/register",authController.register);
router.post("/login",authController.login)

export default router;