const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  inviteMember,
  removeMember,
  getMembers
} = require('../controllers/memberController');

// Lister les membres d'un projet
router.get('/:id/members', auth, getMembers);

// Inviter un membre par email
router.post('/:id/members', auth, inviteMember);

// Retirer un membre
router.delete('/:id/members/:memberId', auth, removeMember);

module.exports = router;