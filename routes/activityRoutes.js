const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getActivities
} = require('../controllers/activityController');

// Récupérer les activités d'un projet
router.get('/:id/activities', auth, getActivities);

module.exports = router;