import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js";

export const signup = async (req, res,next) => {
  const { userName, email, password } = req.body; //destructuring the client infos
  // ensuring the fulfilment of all infos
  if (!userName || !email || !password) {
    res.status(400).json({ message: "credencials should be fill" });
  }

  const hashPassword = bcryptjs.hashSync(password, 10); // hashing the password

  try {
    const newUser = new User({ userName, email, password: hashPassword }); // changing into the new hash password
    await newUser.save();
    res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    next(error)
  }
};
