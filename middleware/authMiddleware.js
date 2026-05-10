const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      // On vérifie aussi si l'utilisateur existe toujours en base
      if(!req.user) {
          return res.status(401).json({ message: 'Utilisateur introuvable' });
      }

      return next(); // On ajoute return pour être sûr de sortir de la fonction
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  }

  // Si on arrive ici, c'est que le header n'était pas bon ou absent
  return res.status(401).json({ message: 'Non autorisé, pas de token' });
};

module.exports = { protect };