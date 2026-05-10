const Project = require('../models/Project');
const User = require('../models/User');

// Ajouter un membre (par email)
const addMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    // Seul le propriétaire peut ajouter des membres
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: 'Déjà membre' });
    }

    project.members.push(user._id);
    await project.save();
    res.json({ message: 'Membre ajouté', members: project.members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retirer un membre
const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    const { userId } = req.body;
    if (!project.members.includes(userId)) {
      return res.status(400).json({ message: 'Utilisateur non membre' });
    }

    project.members = project.members.filter(m => m.toString() !== userId);
    await project.save();
    res.json({ message: 'Membre retiré', members: project.members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMember, removeMember };