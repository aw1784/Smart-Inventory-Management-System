const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    location: { type: String, default: 'main-warehouse' },
    lowStockThreshold: { type: Number, default: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);
