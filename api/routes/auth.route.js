import express from 'express';
import {  registerUser, loginUser, getMe, } from '../controllers/auth.controller.js'


const router = express.Router();

// sign up route
router.post('/register-user', registerUser);

// sign in route
router.post('/login-user', loginUser);

// get current user info
router.get('/me', getMe);


export default authRouter;