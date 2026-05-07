const Project = require('../models/Project');

// @route   GET /api/projects
// @desc    Récupérer tous les projets de l'utilisateur (paginé)
const getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // L'utilisateur voit ses projets + ceux où il est membre
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    });

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

// @route   GET /api/projects/:id
// @desc    Récupérer un projet par son ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Vérifier que l'utilisateur a accès
    if (project.owner.toString() !== req.user.id && !project.members.some(m => m._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @route   POST /api/projects
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
      members: [req.user.id] // Le créateur est membre
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @route   PUT /api/projects/:id
// @desc    Modifier un projet
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Seul le propriétaire peut modifier
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Seul le propriétaire peut modifier le projet' });
    }

    const { title, description, deadline, status } = req.body;
    project.title = title || project.title;
    project.description = description || project.description;
    project.deadline = deadline !== undefined ? deadline : project.deadline;
    project.status = status || project.status;

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @route   DELETE /api/projects/:id
// @desc    Supprimer un projet (cascade sur les tâches)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Seul le propriétaire peut supprimer
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Seul le propriétaire peut supprimer le projet' });
    }

    await project.deleteOne();
    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};