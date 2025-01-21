import expressAsyncHandler from "express-async-handler";
import User from '../models/user.model.js'


export const getUserNotifications = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
  
    if (!user) {
      res.status(404);
      throw new Error('Utilisateur non trouvé.');
    }
  
    res.json(user.notifications);
  });
  