const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema(
  {
    metric: {
      type: String,
      required: true,
      enum: ['orders', 'users', 'inventory', 'revenue'],
    },
    value: { type: Number, required: true, default: 0 },
    period: { type: String, default: 'all-time' },
    breakdown: { type: mongoose.Schema.Types.Mixed, default: {} },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Statistics', statisticsSchema);
