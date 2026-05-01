const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'auth-service' }));
app.use('/api/auth', authRoutes);

const PORT = process.env.AUTH_SERVICE_PORT || 4001;
const MONGO_URI =
  process.env.AUTH_MONGO_URI || 'mongodb://localhost:27017/inventory_auth';

if (require.main === module) {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('[auth-service] MongoDB connected');
      app.listen(PORT, () => console.log(`[auth-service] listening on ${PORT}`));
    })
    .catch((err) => {
      console.error('[auth-service] MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = app;
