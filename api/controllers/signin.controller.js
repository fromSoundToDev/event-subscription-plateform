import { findOne } from '../models/user.model';


// Authentifier un utilisateur
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    res.status(200).json({ message: 'Connexion réussie', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
}