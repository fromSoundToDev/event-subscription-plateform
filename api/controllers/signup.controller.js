
import { User } from "../models/user.model.js";

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'error during the creation of the user', error });
  }
};

