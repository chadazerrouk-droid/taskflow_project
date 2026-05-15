const express = require('express');
const router = express.Router();
const Task = require('../models/Task');   // ← majuscule
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware'); // ← ton vrai middleware
const User = require('../models/User');

// Toutes les routes nécessitent authentification
router.use(protect);   // ← décommenté

// GET /api/tasks?projectId=...
router.get('/', async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) {
      return res.status(400).json({ message: 'projectId est requis' });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, priority, status, project: projectId, assignedTo } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }

    const task = new Task({
      title,
      priority: priority || 'basse',
      status: status || 'à faire',
      project: projectId,
      assignedTo
    });

    await task.save();
    await task.populate('assignedTo', 'fullName email');

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, priority, status, assignedTo } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Tâche introuvable' });

    task.title = title ?? task.title;
    task.priority = priority ?? task.priority;
    task.status = status ?? task.status;
    task.assignedTo = assignedTo ?? task.assignedTo;

    await task.save();
    await task.populate('assignedTo', 'fullName email');

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tâche introuvable' });
    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/tasks/:id/assign
router.patch('/:id/assign', async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'fullName email');

    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;