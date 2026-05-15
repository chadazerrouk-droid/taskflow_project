const Project = require('../models/Project');
const User = require('../models/User');
const Activity = require('../models/Activity');

// ==========================================
// 1. CRUD PROJETS (Fonctionnalité 2)
// ==========================================

// @desc    Récupérer tous les projets (Propriétaire ou Membre)
const getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
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
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Récupérer un projet par ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    const isOwner = project.owner._id.toString() === req.user.id;
    const isMember = project.members.some(m => m._id.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Créer un projet
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
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Mettre à jour un projet
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Seul le propriétaire peut modifier' });
    }

    const { title, description, deadline, status } = req.body;
    project.title = title || project.title;
    project.description = description || project.description;
    project.deadline = deadline || project.deadline;
    project.status = status || project.status;

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer un projet
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Seul le propriétaire peut supprimer' });
    }

    await project.deleteOne();
    res.json({ message: 'Projet supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 2. GESTION DES MEMBRES (E5)
// ==========================================

const inviteMember = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) return res.status(404).json({ message: "Projet non trouvé" });

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (project.members.includes(userToInvite._id)) {
      return res.status(400).json({ message: "Cet utilisateur est déjà membre" });
    }

    project.members.push(userToInvite._id);
    await project.save();

    await Activity.create({
      actionType: "MEMBER_ADDED",
      project: project._id,
      user: req.user.id,
      description: `A ajouté ${userToInvite.name} (${userToInvite.email}) au projet`
    });

    res.json({ message: "Membre ajouté avec succès", project });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    const { memberId } = req.params;

    if (!project) return res.status(404).json({ message: "Projet non trouvé" });

    if (memberId === project.owner.toString()) {
      return res.status(400).json({ message: "Impossible de supprimer le propriétaire" });
    }

    project.members = project.members.filter(m => m.toString() !== memberId);
    await project.save();

    res.json({ message: "Membre retiré" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ==========================================
// 3. HISTORIQUE DES ACTIVITÉS (E5)
// ==========================================

const getProjectActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ project: req.params.projectId })
      .populate('user', 'name')
      .sort({ timestamp: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des activités' });
  }
};

// ==========================================
// 4. EXPORT
// ==========================================

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  inviteMember,
  removeMember,
  getProjectActivities
};