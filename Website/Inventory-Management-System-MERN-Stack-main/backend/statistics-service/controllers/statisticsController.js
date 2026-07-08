const Statistics = require('../models/statisticsModel');

const SERVICES = {
  product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:4002',
  order: process.env.ORDER_SERVICE_URL || 'http://localhost:4003',
  inventory: process.env.INVENTORY_SERVICE_URL || 'http://localhost:4004',
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:4001',
};

const fetchJson = async (url, headers = {}) => {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    return await res.json();
  } catch (_err) {
    return null;
  }
};

const forwardAuth = (req) => {
  const h = req.headers.authorization;
  return h ? { Authorization: h } : {};
};

exports.recordStat = async (req, res) => {
  try {
    const stat = await Statistics.create(req.body);
    return res.status(201).json({ stat });
  } catch (err) {
    return res.status(400).json({ message: 'Failed to record stat', error: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const headers = forwardAuth(req);
    const [productsRes, ordersRes, inventoryRes, usersRes] = await Promise.all([
      fetchJson(`${SERVICES.product}/api/products`),
      fetchJson(`${SERVICES.order}/api/orders`),
      fetchJson(`${SERVICES.inventory}/api/inventory`),
      fetchJson(`${SERVICES.auth}/api/auth/users`, headers),
    ]);

    const products = productsRes?.products || [];
    const orders = ordersRes?.orders || [];
    const inventory = inventoryRes?.items || [];
    const users = usersRes?.users || [];

    const revenue = orders
      .filter((o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalStock = inventory.reduce((sum, i) => sum + (i.quantity || 0), 0);

    return res.status(200).json({
      summary: {
        products: products.length,
        orders: orders.length,
        users: users.length,
        revenue,
        inventoryItems: inventory.length,
        totalStock,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch summary', error: err.message });
  }
};

exports.getOrderStats = async (_req, res) => {
  try {
    const data = await fetchJson(`${SERVICES.order}/api/orders`);
    const orders = data?.orders || [];

    const byStatus = orders.reduce((acc, o) => {
      const k = o.status || 'unknown';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    const totalRevenue = orders
      .filter((o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return res.status(200).json({
      stats: {
        total: orders.length,
        totalRevenue,
        byStatus,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch order stats', error: err.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const data = await fetchJson(`${SERVICES.auth}/api/auth/users`, forwardAuth(req));
    const users = data?.users || [];
    const byRole = users.reduce((acc, u) => {
      const k = u.role || 'user';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    return res.status(200).json({ stats: { total: users.length, byRole } });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user stats', error: err.message });
  }
};

exports.getInventoryStats = async (_req, res) => {
  try {
    const data = await fetchJson(`${SERVICES.inventory}/api/inventory`);
    const inventory = data?.items || [];
    const totalStock = inventory.reduce((sum, i) => sum + (i.quantity || 0), 0);
    const byLocation = inventory.reduce((acc, i) => {
      const k = i.location || 'unknown';
      acc[k] = (acc[k] || 0) + (i.quantity || 0);
      return acc;
    }, {});
    return res.status(200).json({
      stats: { items: inventory.length, totalStock, byLocation },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch inventory stats', error: err.message });
  }
};
