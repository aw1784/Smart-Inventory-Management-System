const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/databaseConfig');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'order-service' }));
app.use('/api/orders', orderRoutes);

const PORT = process.env.ORDER_SERVICE_PORT || 4003;

if (require.main === module) {
  connectDB()
    .then(() => {
      console.log('[order-service] MongoDB connected');
      app.listen(PORT, () => console.log(`[order-service] listening on ${PORT}`));
    })
    .catch((err) => {
      console.error('[order-service] MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = app;
