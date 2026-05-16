const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getTasksByProject,
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus
} = require('../controllers/taskController');

router.get('/my', auth, getMyTasks);
router.get('/project/:id', auth, getTasksByProject);
router.post('/', auth, createTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);
router.patch('/:id/status', auth, updateTaskStatus);

module.exports = router;