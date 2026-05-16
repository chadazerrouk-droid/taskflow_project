const Project = require('../models/Project');
const User = require('../models/User');
const Activity = require('../models/Activity');

// Inviter un membre par email
exports.inviteMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    // Vérifier que c'est le créateur
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Chercher l'utilisateur par email
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Vérifier s'il est déjà membre
    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: 'Utilisateur déjà membre' });
    }

    // Ajouter le membre
    project.members.push(user._id);
    await project.save();

    // Enregistrer l'activité
    await Activity.create({
      type: 'member_added',
      project: project._id,
      user: req.user._id,
      description: `${req.user.name} a ajouté ${user.name} au projet`
    });

    res.status(200).json({ message: 'Membre ajouté avec succès', project });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Retirer un membre
exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    // Vérifier que c'est le créateur
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Retirer le membre
    project.members = project.members.filter(
      member => member.toString() !== req.params.memberId
    );
    await project.save();

    // Enregistrer l'activité
    await Activity.create({
      type: 'member_removed',
      project: project._id,
      user: req.user._id,
      description: `${req.user.name} a retiré un membre du projet`
    });

    res.status(200).json({ message: 'Membre retiré avec succès', project });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Lister les membres d'un projet
exports.getMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email');
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    res.status(200).json(project.members);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};