const Task = require('../models/task');
const Project = require('../models/Project');

// @route   GET /api/tasks
// @desc    Récupérer toutes les tâches (avec filtres projet/membre)
const getTasks = async (req, res) => {
  try {
    req.user = { id: "1" }; // ← temporaire, à enlever après
    const { projectId } = req.query;
    let filter = {};

    if (projectId) {
      filter.project = projectId;
    } else {
      // Par défaut, l'utilisateur voit les tâches des projets où il est owner ou membre
      const projects = await Project.find().select('_id');
      filter.project = { $in: projects.map(p => p._id) };
    }

   // Gestion du tri
let sortCriteria = {};
const { sort } = req.query;

if (sort === 'priority') {
  sortCriteria = { priority: -1 }; // haute → basse
} else if (sort === 'dueDate') {
  sortCriteria = { dueDate: 1 };   // plus proche → plus lointaine
} else if (sort === 'priority+dueDate') {
  sortCriteria = { priority: -1, dueDate: 1 };
} else {
  sortCriteria = { createdAt: -1 }; // tri par défaut
}

const tasks = await Task.find(filter)
  .populate('project', 'title')
  .populate('assignedTo', 'name email')
  .sort(sortCriteria);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/tasks
// @desc    Créer une tâche
const createTask = async (req, res) => {
  try {
    const { title, description, priority, project, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      project,
      assignedTo
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/tasks/:id
// @desc    Mettre à jour une tâche
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });

    const { title, description, priority, status, assignedTo } = req.body;
    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.assignedTo = assignedTo || task.assignedTo;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/tasks/:id
// @desc    Supprimer une tâche
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
    await task.deleteOne();
    res.json({ message: 'Tâche supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PATCH /api/tasks/:id/status
// @desc    Changer uniquement le statut
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
    task.status = status;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus
};