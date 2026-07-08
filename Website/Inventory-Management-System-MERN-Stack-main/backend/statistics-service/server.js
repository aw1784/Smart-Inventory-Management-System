const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/databaseConfig');
const statisticsRoutes = require('./routes/statisticsRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'statistics-service' }));
app.use('/api/statistics', statisticsRoutes);

const PORT = process.env.STATISTICS_SERVICE_PORT || 4005;

if (require.main === module) {
  connectDB()
    .then(() => {
      console.log('[statistics-service] MongoDB connected');
      app.listen(PORT, () => console.log(`[statistics-service] listening on ${PORT}`));
    })
    .catch((err) => {
      console.error('[statistics-service] MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = app;
