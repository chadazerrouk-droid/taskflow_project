<<<<<<< HEAD
const express = require("express");
const router = express.Router({ mergeParams: true });
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const {
  validateTask,
  validateStatusUpdate,
} = require("../middleware/validateTask");

router.get("/", auth, async (req, res) => {
  try {
    const {
      status,
      priority,
      assignedTo,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (req.params.projectId) filter.project = req.params.projectId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("assignedTo", "name email");

    res.json({
      data: tasks,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", auth, validateTask, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      project: req.params.projectId,
    });
=======
const express = require('express');
const router = express.Router();
//const Task = require('../models/Task');   // ← majuscule
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

>>>>>>> origin/develop
    await task.save();
    await task.populate('assignedTo', 'fullName email');

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

<<<<<<< HEAD
router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email",
    );
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
=======
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

>>>>>>> origin/develop
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

<<<<<<< HEAD
router.put("/:id", auth, validateTask, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/status", auth, validateStatusUpdate, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
=======
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

>>>>>>> origin/develop
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

<<<<<<< HEAD
router.patch("/:id/assign", auth, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId est requis" });
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { new: true },
    );
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
=======
module.exports = router;
>>>>>>> origin/develop
