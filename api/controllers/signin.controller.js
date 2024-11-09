import bcryptjs from "bcryptjs";
import { errorHandler } from "../outils/errors.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const signin = async (req,res,next) => {
    const {email,password} = req.body;
    try {
       const validUser = await User.findOne({email});
        if (!validUser) {
            return next(errorHandler(404,'user not fund '))
        };
        const validPassword = bcryptjs.compareSync(password,validUser.password )
        if (!validPassword) {
           return next(errorHandler(400,'wrong credencial '))
        }
        const {password:hashPassword , ...rest}= validUser._doc
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET);
        res.cookie('access_token',token,{httpOnly:true}).status(200).json({message:'success',rest})
    } catch (error) {
        next(errorHandler(400,error.message));
    }
}