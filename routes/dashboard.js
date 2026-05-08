const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Project = require("../models/Project");
const auth = require("../middleware/auth");

// GET /api/dashboard
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id; 
    // Nombre de projets actifs
const activeProjects = await Project.countDocuments({
  owner: userId,
  status: 'actif'
});// ou req.user._id selon ton middleware
  const assignedTasks = await Task.countDocuments({
      assignedTo: userId
    });
    // Les calculs seront ajoutés ici
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: 'terminé'
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: 'terminé' }
    });

    res.json({
      activeProjects: 0,
      assignedTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
