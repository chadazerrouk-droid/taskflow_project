const Project = require('../models/Project');
const Task = require('../models/Task');
const mongoose = require('mongoose');

const getDashboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now = new Date();

    // Projets actifs (countDocuments accepté car c'est sur Project, pas Task)
    const activeProjects = await Project.countDocuments({
      $or: [{ owner: userId }, { members: userId }],
      status: 'actif'
    });

    // Pipeline d'agrégation MongoDB pour les métriques des tâches
    const taskMetrics = await Task.aggregate([
      {
        $match: { assignedTo: userId }
      },
      {
        $group: {
          _id: null,
          assignedTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'terminé'] }, 1, 0] }
          },
          lateTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', now] },
                    { $ne: ['$status', 'terminé'] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Tâches en cours triées par priorité décroissante puis dueDate croissante
    const priorityOrder = { haute: 1, moyenne: 2, basse: 3 };
    const inProgressTasks = await Task.find({
      assignedTo: userId,
      status: 'en cours'
    })
      .populate('project', 'title')
      .sort({ dueDate: 1 });

    inProgressTasks.sort((a, b) => {
      const pa = priorityOrder[a.priority] || 99;
      const pb = priorityOrder[b.priority] || 99;
      if (pa !== pb) return pa - pb;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    const metrics = taskMetrics[0] || {
      assignedTasks: 0,
      completedTasks: 0,
      lateTasks: 0
    };

    res.json({
      activeProjects,
      assignedTasks: metrics.assignedTasks,
      completedTasks: metrics.completedTasks,
      lateTasks: metrics.lateTasks,
      inProgressTasks
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard };