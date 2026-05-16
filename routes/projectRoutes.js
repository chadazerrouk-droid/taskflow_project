const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getTasksByProject } = require('../controllers/taskController');

// GET /api/projects/:id/tasks
router.get('/:id/tasks', auth, getTasksByProject);

module.exports = router;
