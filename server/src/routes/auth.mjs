import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.mjs';
import { validateSchema } from '../validation/validate.mjs';
import { registerSchema, loginSchema } from '../validation/authValidation.mjs';

router.post("/register",validateSchema(registerSchema),authController.register);
router.post("/login",validateSchema(loginSchema),authController.login)

export default router;