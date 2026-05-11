const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/task');
const Project = require('../models/project');

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    // ID temporaire pour les tests (à remplacer par req.user.id plus tard)
    const userId = new mongoose.Types.ObjectId("6a01cf73d972b1408744ba89");
    
    // 1. Projets actifs
    const totalActiveProjects = await Project.countDocuments({
      owner: userId,
      status: 'actif'
    });
    
    // 2. Tâches assignées
    const assignedTasks = await Task.countDocuments({ assignedTo: userId });
    
    // 3. Tâches terminées
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: 'terminé'
    });
    
    // 4. Tâches en retard
    const now = new Date();
    const lateTasks = await Task.countDocuments({
      assignedTo: userId,
      dueDate: { $lt: now, $ne: null },
      status: { $ne: 'terminé' }
    });
    
    // 5. Tâches en cours triées (priorité + date)
    const tasksInProgress = await Task.find({
      assignedTo: userId,
      status: 'en cours'
    }).sort({ priority: -1, dueDate: 1 }).lean();
    
    res.json({
      totalActiveProjects,
      assignedTasks,
      completedTasks,
      lateTasks,
      tasksInProgress
    });
    
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;