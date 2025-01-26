import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { getUserNotifications } from "../controllers/user.controller.js";


Router.get('/notifications', protect, getUserNotifications);


export default userRouter
