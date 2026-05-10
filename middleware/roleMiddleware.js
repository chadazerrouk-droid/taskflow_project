const Project = require('../models/Project');

const isOwner = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    // Vérifier si l'utilisateur connecté est le propriétaire
    if (project.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Accès refusé : Seul le propriétaire peut faire cela" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Erreur de vérification des droits" });
  }
};

module.exports = { isOwner };