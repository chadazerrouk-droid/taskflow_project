const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Tasks endpoint (temporaire)' });
});

module.exports = router;