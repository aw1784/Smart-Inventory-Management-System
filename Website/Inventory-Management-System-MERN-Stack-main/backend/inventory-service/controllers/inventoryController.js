const Inventory = require('../models/inventoryModel');

exports.addInventory = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    return res.status(201).json({ item });
  } catch (err) {
    return res.status(400).json({ message: 'Failed to add inventory', error: err.message });
  }
};

exports.getAllInventory = async (_req, res) => {
  try {
    const items = await Inventory.find().sort({ updatedAt: -1 });
    return res.status(200).json({ items });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch inventory', error: err.message });
  }
};

exports.getInventoryByProduct = async (req, res) => {
  try {
    const item = await Inventory.findOne({ productId: req.params.productId });
    if (!item) return res.status(404).json({ message: 'Inventory record not found' });
    return res.status(200).json({ item });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch inventory', error: err.message });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: 'Inventory record not found' });
    return res.status(200).json({ item });
  } catch (err) {
    return res.status(400).json({ message: 'Failed to update inventory', error: err.message });
  }
};

exports.adjustQuantity = async (req, res) => {
  try {
    const { delta } = req.body;
    if (typeof delta !== 'number') {
      return res.status(400).json({ message: 'delta must be a number' });
    }
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Inventory record not found' });
    const newQty = item.quantity + delta;
    if (newQty < 0) return res.status(400).json({ message: 'Insufficient stock' });
    item.quantity = newQty;
    await item.save();
    return res.status(200).json({ item });
  } catch (err) {
    return res.status(400).json({ message: 'Failed to adjust inventory', error: err.message });
  }
};

exports.adjustByProduct = async (req, res) => {
  try {
    const { productId, delta } = req.body;
    if (!productId || typeof delta !== 'number') {
      return res.status(400).json({ message: 'productId and numeric delta are required' });
    }
    const item = await Inventory.findOne({ productId });
    if (!item) return res.status(404).json({ message: 'Inventory record not found for product' });
    const newQty = item.quantity + delta;
    if (newQty < 0) {
      return res.status(409).json({ message: 'Insufficient stock', available: item.quantity });
    }
    item.quantity = newQty;
    await item.save();
    return res.status(200).json({ item });
  } catch (err) {
    return res.status(400).json({ message: 'Failed to adjust inventory', error: err.message });
  }
};

exports.removeInventory = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Inventory record not found' });
    return res.status(200).json({ message: 'Inventory removed' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to remove inventory', error: err.message });
  }
};
