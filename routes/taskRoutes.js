const express = require('express');
const router = express.Router();
const { 
    getTasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    updateTaskStatus 
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Toutes les routes sont protégées
router.use(protect);

// Routes de base : /api/tasks
router.route('/')
    .get(getTasks)
    .post(createTask);

// Routes par ID : /api/tasks/:id
router.route('/:id')
    .put(updateTask)
    .delete(deleteTask);

// Route spécifique pour le statut : /api/tasks/:id/status
router.patch('/:id/status', updateTaskStatus);

module.exports = router;