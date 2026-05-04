const express = require('express');
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Route protégée (exemple)
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'Accès autorisé',
    user: req.user
  });
});

module.exports = router;