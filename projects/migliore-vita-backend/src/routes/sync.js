const express = require('express');
const router = express.Router();

// Mobile sync endpoint
router.post('/', (req, res) => {
  try {
    const { products, sales } = req.body;
    
    // Log incoming data (for debugging)
    console.log('Sync request received:', {
      productCount: products?.length || 0,
      saleCount: sales?.length || 0,
    });
    
    // Basic validation
    if (!products && !sales) {
      return res.status(400).json({
        status: 'error',
        message: 'No data provided (expected products/sales)',
      });
    }
    
    // Process data (placeholder: save to database in future)
    // TODO: Add database integration
    
    // Return success
    res.json({
      status: 'synced',
      timestamp: new Date().toISOString(),
      processed: {
        products: products?.length || 0,
        sales: sales?.length || 0,
      },
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sync failed',
    });
  }
});

module.exports = router;