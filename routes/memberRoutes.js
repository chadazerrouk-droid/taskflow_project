const express = require('express');
const { addMember, removeMember } = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:id/members', protect, addMember);
router.delete('/:id/members', protect, removeMember);

module.exports = router;