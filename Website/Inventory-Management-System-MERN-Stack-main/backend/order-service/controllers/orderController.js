const Order = require('../models/orderModel');

const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:4004';

const computeTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const adjustStock = async (productId, delta) => {
  const res = await fetch(`${INVENTORY_URL}/api/inventory/adjust-by-product`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, delta }),
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
};

const adjustStockForItems = async (items, sign) => {
  const applied = [];
  for (const it of items) {
    const result = await adjustStock(it.productId, sign * it.quantity);
    if (!result.ok) {
      // rollback all previously applied
      for (const done of applied) {
        await adjustStock(done.productId, -sign * done.quantity).catch(() => {});
      }
      return {
        ok: false,
        status: result.status,
        message: result.body?.message || 'Inventory update failed',
        productId: it.productId,
      };
    }
    applied.push(it);
  }
  return { ok: true };
};

exports.placeOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;
    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'userId and non-empty items are required' });
    }

    // Reserve stock first; -1 = decrement
    const reservation = await adjustStockForItems(items, -1);
    if (!reservation.ok) {
      return res.status(reservation.status === 404 ? 400 : 409).json({
        message: reservation.message,
        productId: reservation.productId,
      });
    }

    try {
      const totalAmount = computeTotal(items);
      const order = await Order.create({ userId, items, totalAmount });
      return res.status(201).json({ order });
    } catch (err) {
      // DB write failed — restore stock
      await adjustStockForItems(items, +1).catch(() => {});
      return res.status(400).json({ message: 'Failed to place order', error: err.message });
    }
  } catch (err) {
    return res.status(400).json({ message: 'Failed to place order', error: err.message });
  }
};

exports.getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user orders', error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json({ order });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const existing = await Order.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Order not found' });

    const wasCancelled = existing.status === 'cancelled';
    const becomesCancelled = status === 'cancelled';

    // Only restore inventory on the transition into 'cancelled'
    if (becomesCancelled && !wasCancelled) {
      await adjustStockForItems(existing.items, +1).catch(() => {});
    }
    // Re-deduct if moving back out of 'cancelled'
    if (wasCancelled && !becomesCancelled) {
      const reservation = await adjustStockForItems(existing.items, -1);
      if (!reservation.ok) {
        return res.status(409).json({
          message: `Cannot reactivate order: ${reservation.message}`,
          productId: reservation.productId,
        });
      }
    }

    existing.status = status;
    await existing.save();
    return res.status(200).json({ order: existing });
  } catch (err) {
    return res.status(400).json({ message: 'Failed to update status', error: err.message });
  }
};
