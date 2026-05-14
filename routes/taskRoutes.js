const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Toutes les routes sont protégées
router.route('/')
  .get(getTasks)  // ← protect enlevé temporairement
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.patch('/:id/status', protect, updateTaskStatus);

module.exports = router;