const Activity = require('../models/Activity');

// Récupérer les activités d'un projet
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ project: req.params.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Enregistrer une activité (utilisé en interne)
exports.logActivity = async (type, projectId, userId, description) => {
  try {
    await Activity.create({
      type,
      project: projectId,
      user: userId,
      description
    });
  } catch (err) {
    console.error('Erreur log activité:', err.message);
  }
};