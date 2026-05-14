const Project = require("../models/Project");

exports.isOwner = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId || req.params.id);
    if (!project) return res.status(404).json({ message: "Projet non trouvé" });

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Seul le créateur peut faire ça." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Erreur de permission" });
  }
};