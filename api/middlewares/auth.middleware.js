import { verify } from 'jsonwebtoken';
import { findById } from '../models/User';
import asyncHandler from 'express-async-handler';

// Vérifie que l'utilisateur est authentifié
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Récupérer le token
      token = req.headers.authorization.split(' ')[1];

      // Vérifier et décoder le token
      const decoded = verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur associé au token
      req.user = await findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Non autorisé, token invalide.');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Non autorisé, aucun token.');
  }
});

export default { protect };
