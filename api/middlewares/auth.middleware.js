import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'any token found.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajouter l'utilisateur décodé à la requête
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token invalid' });
  }
};

export default authMiddleware