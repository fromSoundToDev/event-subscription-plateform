import express from 'express';
import userController from '../controllers/user.controller';

const router = express.Router();

// sign up route
router.post('/register', userController.createUser);

// sign in route
router.post('/login', userController.loginUser);


export default authRouter;