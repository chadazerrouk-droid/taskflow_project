const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  getProjectById, 
  createProject, 
  inviteMember, 
  getProjectActivities,
  removeMember 
} = require('../controllers/projectController');

const { protect } = require('../middleware/authMiddleware'); 
const { isOwner } = require('../middleware/roleMiddleware'); 

router.get('/', protect, getProjects);
router.post('/', protect, createProject);
router.get('/:projectId', protect, getProjectById);

// Routes spécifiques E5
router.post('/:projectId/invite', protect, isOwner, inviteMember);
router.get('/:projectId/activities', protect, getProjectActivities);
router.delete('/:projectId/members/:memberId', protect, isOwner, removeMember);

module.exports = router;