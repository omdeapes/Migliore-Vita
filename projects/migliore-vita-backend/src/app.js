// Basic Express Server
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/products', require('./routes/products'));
app.use('/sales', require('./routes/sales'));
app.use('/sync', require('./routes/sync'));

// Start Server
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: ['http://5.189.160.78:5173', 'http://5.189.160.78:5174', 'http://localhost:5173'],
}));
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});