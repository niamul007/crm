import express, { Router } from 'express'
const router = Router.express()
import * as authController from '../controllers/authController.mjs';

router.post("/register",authController.register);
router.post("/login",authController.login)

export default router;