const express = require('express');
const router = express.Router();

// Placeholder: List products
router.get('/', (req, res) => {
  res.json([{ id: 1, name: 'Sample Product', price: 10.99 }]);
});

module.exports = router;