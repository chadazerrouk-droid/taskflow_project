const Task = require('../models/Task');
const Activity = require('../models/Activity');

// GET toutes les tâches d'un projet
const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.id })
      .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// GET tâches assignées à l'utilisateur connecté
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user.id
    }).populate('assignedTo', 'name email')
      .populate('project', 'title');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// POST créer une tâche
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, project, assignedTo, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      project,
      assignedTo,
      dueDate
    });

    await Activity.create({
      actionType: 'TASK_CREATED',
      project,
      user: req.user.id,
      description: `A créé la tâche : ${title}`
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// PUT modifier une tâche
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });

    const { title, description, priority, status, assignedTo, dueDate } = req.body;
    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.assignedTo = assignedTo || task.assignedTo;
    task.dueDate = dueDate || task.dueDate;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// DELETE supprimer une tâche
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });

    await Activity.create({
      actionType: 'TASK_DELETED',
      project: task.project,
      user: req.user.id,
      description: `A supprimé la tâche : ${task.title}`
    });

    await task.deleteOne();
    res.json({ message: 'Tâche supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// PATCH mettre à jour le statut uniquement
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });

    const oldStatus = task.status;
    task.status = req.body.status;
    await task.save();

    await Activity.create({
      actionType: 'TASK_STATUS_CHANGED',
      project: task.project,
      user: req.user.id,
      description: `A changé le statut de "${oldStatus}" à "${task.status}"`
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = {
  getTasksByProject,
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus
};