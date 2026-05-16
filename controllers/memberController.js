const Project = require('../models/Project');
const User = require('../models/User');
const Activity = require('../models/Activity');

// Inviter un membre par email
exports.inviteMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: 'Utilisateur déjà membre' });
    }

    project.members.push(user._id);
    await project.save();

    await Activity.create({
      actionType: 'MEMBER_ADDED',
      project: project._id,
      user: req.user._id,
      description: `${req.user.fullName} a ajouté ${user.fullName} au projet`
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

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    project.members = project.members.filter(
      member => member.toString() !== req.params.memberId
    );
    await project.save();

    await Activity.create({
      actionType: 'MEMBER_REMOVED',
      project: project._id,
      user: req.user._id,
      description: `${req.user.fullName} a retiré un membre du projet`
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
      .populate('members', 'fullName email');
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    res.status(200).json(project.members);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};