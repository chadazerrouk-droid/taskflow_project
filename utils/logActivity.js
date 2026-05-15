const Activity = require('../models/Activity');

/**
 * Log une activité
 * @param {string} action - Type d'action (task_created, member_added, etc.)
 * @param {string} projectId - ID du projet concerné
 * @param {string} userId - ID de l'utilisateur qui a fait l'action
 * @param {string} details - Détails optionnels (ex: "Tâche: Faire le login")
 */
const logActivity = async (action, projectId, userId, details = '') => {
  try {
    const activity = new Activity({
      action,
      project: projectId,
      user: userId,
      details
    });
    await activity.save();
    console.log(`✅ Activité enregistrée : ${action}`);
    return activity;
  } catch (error) {
    console.error('❌ Erreur logActivity :', error.message);
    return null;
  }
};

module.exports = logActivity;