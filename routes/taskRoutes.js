const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTasksByProject,
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus
} = require('../controllers/taskController');

router.get('/my', protect, getMyTasks);
router.get('/project/:id', protect, getTasksByProject);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.patch('/:id/status', protect, updateTaskStatus);

module.exports = router;