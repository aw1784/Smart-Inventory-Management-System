const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/databaseConfig');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'product-service' }));
app.use('/api/products', productRoutes);

const PORT = process.env.PRODUCT_SERVICE_PORT || 4002;

if (require.main === module) {
  connectDB()
    .then(() => {
      console.log('[product-service] MongoDB connected');
      app.listen(PORT, () => console.log(`[product-service] listening on ${PORT}`));
    })
    .catch((err) => {
      console.error('[product-service] MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = app;
