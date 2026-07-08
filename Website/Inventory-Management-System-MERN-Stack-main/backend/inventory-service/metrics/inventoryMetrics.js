const client = require('prom-client');

// Collect default Node.js metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics();

// Counter: Number of inventory adjustments
const inventoryAdjustmentsTotal = new client.Counter({
  name: 'inventory_adjustments_total',
  help: 'Total number of inventory adjustments',
});

// Counter: Number of large inventory adjustments (>100)
const largeInventoryAdjustmentsTotal = new client.Counter({
  name: 'large_inventory_adjustments_total',
  help: 'Total number of inventory adjustments larger than 100 units',
});

// Counter: Number of inventory records created
const inventoryCreateTotal = new client.Counter({
  name: 'inventory_create_total',
  help: 'Total inventory records created',
});

// Counter: Number of inventory records deleted
const inventoryDeleteTotal = new client.Counter({
  name: 'inventory_delete_total',
  help: 'Total inventory records deleted',
});

// Gauges (current state)
const inventoryTotalProducts = new client.Gauge({
  name: 'inventory_total_products',
  help: 'Current total number of inventory records',
});

const inventoryLowStockProducts = new client.Gauge({
  name: 'inventory_low_stock_products',
  help: 'Current number of products with low stock',
});

const inventoryOutOfStockProducts = new client.Gauge({
  name: 'inventory_out_of_stock_products',
  help: 'Current number of out-of-stock products',
});

module.exports = {
  client,

  inventoryAdjustmentsTotal,
  largeInventoryAdjustmentsTotal,
  inventoryCreateTotal,
  inventoryDeleteTotal,

  inventoryTotalProducts,
  inventoryLowStockProducts,
  inventoryOutOfStockProducts,
};