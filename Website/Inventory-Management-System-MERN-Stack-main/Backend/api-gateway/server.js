const express = require('express');
const cors = require('cors');
const { verifyToken } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');

const app = express();
app.use(cors());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

app.use(verifyToken);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/statistics', statisticsRoutes);

const PORT = process.env.GATEWAY_PORT || 4000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`[api-gateway] listening on ${PORT}`));
}

module.exports = app;
