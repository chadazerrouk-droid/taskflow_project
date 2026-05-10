const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  getProjectById, 
  createProject, 
  inviteMember, 
  getProjectActivities,
  removeMember,
  getUserStats // 1. Ajoute l'import ici
} = require('../controllers/projectController');

const { protect } = require('../middleware/authMiddleware'); 
const { isOwner } = require('../middleware/roleMiddleware'); 

router.get('/', protect, getProjects);
router.post('/', protect, createProject);

// 2. ROUTE STATS (Agrégation - Jour 13)
// Très important : Placer cette route AVANT /:projectId
router.get('/stats/me', protect, getUserStats);

router.get('/:projectId', protect, getProjectById);

// Routes spécifiques E5
router.post('/:projectId/invite', protect, isOwner, inviteMember);
router.get('/:projectId/activities', protect, getProjectActivities);
router.delete('/:projectId/members/:memberId', protect, isOwner, removeMember);

module.exports = router;