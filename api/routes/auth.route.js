import express from 'express';
import {  registerUser, loginUser, getMe, } from '../controllers/auth.controller.js'
import { protect } from '../middlewares/auth.middleware.js';


const router = express.Router();

// sign up route
router.post('/register-user', registerUser);

// sign in route
router.post('/login-user', loginUser);

// get current user info
router.get('/me',protect, getMe);


export default authRouter;