const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/databaseConfig');
const inventoryRoutes = require('./routes/inventoryRoutes');
const { client } = require('./metrics/inventoryMetrics');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', service: 'inventory-service' })
);

app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

app.use('/api/inventory', inventoryRoutes);

const PORT = process.env.INVENTORY_SERVICE_PORT || 4004;

if (require.main === module) {
  connectDB()
    .then(() => {
      console.log('[inventory-service] MongoDB connected');
      app.listen(PORT, () =>
        console.log(`[inventory-service] listening on ${PORT}`)
      );
    })
    .catch((err) => {
      console.error('[inventory-service] MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = app;