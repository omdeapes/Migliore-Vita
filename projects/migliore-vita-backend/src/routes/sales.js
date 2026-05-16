const express = require('express');
const router = express.Router();

// Placeholder: Create sale
router.post('/', (req, res) => {
  res.json({ id: 1, status: 'completed' });
});

module.exports = router;