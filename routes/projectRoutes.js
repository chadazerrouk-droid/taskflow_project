const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  inviteMember,
  removeMember,
  getProjectActivities
} = require('../controllers/projectController');
const { getTasksByProject } = require('../controllers/taskController');

router.get('/', protect, getProjects);
router.post('/', protect, createProject);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

router.get('/:id/tasks', protect, getTasksByProject);

router.post('/:projectId/members', protect, inviteMember);
router.delete('/:projectId/members/:memberId', protect, removeMember);

router.get('/:projectId/activities', protect, getProjectActivities);

module.exports = router;