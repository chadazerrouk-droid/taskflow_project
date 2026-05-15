const Project = require('../models/Project');
const Task = require('../models/task');

// @route   GET /api/dashboard
// @desc    Récupérer les métriques pour le tableau de bord
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Projets actifs (où l'utilisateur est owner ou membre)
    const activeProjects = await Project.countDocuments({
      $or: [{ owner: userId }, { members: userId }],
      status: 'actif'
    });

    // 2. Tâches assignées à l'utilisateur
    const assignedTasks = await Task.countDocuments({
      assignedTo: userId
    });

    // 3. Tâches terminées assignées à l'utilisateur
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: 'terminé'
    });

    // 4. Tâches en retard (deadline dépassée, non terminées)
    const now = new Date();
    const lateTasks = await Task.countDocuments({
      assignedTo: userId,
      deadline: { $lt: now },
      status: { $ne: 'terminé' }
    });

    res.json({
      activeProjects,
      assignedTasks,
      completedTasks,
      lateTasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard };