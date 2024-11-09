import express from 'express';
import { signup } from '../controllers/signup.controller.js';
import { signin } from '../controllers/signin.controller.js';
const authRouter = express.Router();
authRouter.post('/signup',signup);
authRouter.post('/signin',signin);

export default authRouter;