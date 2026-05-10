const Project = require('../models/Project');
const User = require('../models/User');
const Activity = require('../models/Activity');

// @desc    Récupérer tous les projets auxquels l'utilisateur participe
// @route   GET /api/projects
const getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      $or: [{ owner: req.user.id }, { members: req.user.id }]
    };

    const projects = await Project.find(query)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    res.json({
      data: projects,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des projets' });
  }
};

// @desc    Récupérer un projet spécifique par son ID
// @route   GET /api/projects/:projectId
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    const isOwner = project.owner._id.toString() === req.user.id;
    const isMember = project.members.some(m => m._id.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Accès non autorisé à ce projet' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Créer un nouveau projet
// @route   POST /api/projects
const createProject = async (req, res) => {
  try {
    const { title, description, deadline, status } = req.body;

    const project = await Project.create({
      title,
      description,
      deadline,
      status,
      owner: req.user.id,
      members: [req.user.id]
    });

    await Activity.create({
      actionType: 'PROJECT_CREATED',
      project: project._id,
      user: req.user.id,
      description: `A créé le projet : ${title}`
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du projet' });
  }
};

// @desc    Inviter un membre par son email (Mission E5 - F8)
// @route   POST /api/projects/:projectId/invite
const inviteMember = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) return res.status(404).json({ message: "Projet non trouvé" });

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ message: "Utilisateur non trouvé avec cet email" });
    }

    const alreadyMember = project.members.some(id => id.toString() === userToInvite._id.toString());
    if (alreadyMember) {
      return res.status(400).json({ message: "Cet utilisateur fait déjà partie du projet" });
    }

    project.members.push(userToInvite._id);
    await project.save();

    await Activity.create({
      actionType: "MEMBER_ADDED",
      project: project._id,
      user: req.user.id,
      description: `A ajouté ${userToInvite.name} au projet`
    });

    res.json({ message: "Membre ajouté avec succès", project });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'invitation" });
  }
};

// @desc    Récupérer l'historique des activités d'un projet (Mission E5 - F9)
// @route   GET /api/projects/:projectId/activities
const getProjectActivities = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    // VÉRIFICATION DE SÉCURITÉ : L'utilisateur doit être lié au projet pour voir l'historique
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(id => id.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Accès non autorisé : vous ne faites pas partie de ce projet' });
    }

    const activities = await Activity.find({ project: req.params.projectId })
      .populate('user', 'name email')
      .sort({ timestamp: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des activités' });
  }
};

// @desc    Supprimer un membre du projet (Mission E5 - F8 suite)
// @route   DELETE /api/projects/:projectId/members/:memberId
const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    const { memberId } = req.params;

    if (!project) return res.status(404).json({ message: "Projet non trouvé" });

    // Seul le propriétaire peut supprimer quelqu'un
    if (project.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "Seul le propriétaire peut retirer des membres" });
    }

    if (memberId === project.owner.toString()) {
      return res.status(400).json({ message: "Le propriétaire ne peut pas être retiré" });
    }

    project.members = project.members.filter(m => m.toString() !== memberId);
    await project.save();

    res.json({ message: "Membre retiré du projet" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la suppression du membre" });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  inviteMember,
  getProjectActivities,
  removeMember
};