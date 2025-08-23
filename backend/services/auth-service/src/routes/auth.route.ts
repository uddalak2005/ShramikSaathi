import express from 'express';
import authController from '../controllers/auth.controller.ts';

const authRouter  = express.Router();


authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

authRouter.get('/:id', authController.getUser);

export default authRouter;