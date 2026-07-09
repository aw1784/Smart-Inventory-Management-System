const client = require('prom-client');
const Inventory = require('../models/inventoryModel');

// Collect default Node.js metrics
client.collectDefaultMetrics();

// =====================
// Counters
// =====================

const inventoryAdjustmentsTotal = new client.Counter({
  name: 'inventory_adjustments_total',
  help: 'Total number of inventory adjustments',
});

const largeInventoryAdjustmentsTotal = new client.Counter({
  name: 'large_inventory_adjustments_total',
  help: 'Total number of inventory adjustments larger than 100 units',
});

const inventoryCreateTotal = new client.Counter({
  name: 'inventory_create_total',
  help: 'Total number of inventory records created',
});

const inventoryDeleteTotal = new client.Counter({
  name: 'inventory_delete_total',
  help: 'Total number of inventory records deleted',
});

// =====================
// Gauges
// =====================

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

// =====================
// Refresh Gauges
// =====================

async function updateInventoryGauges() {
  try {
    const totalProducts = await Inventory.countDocuments();

    const outOfStockProducts = await Inventory.countDocuments({
      quantity: 0,
    });

    const allProducts = await Inventory.find(
      {},
      {
        quantity: 1,
        lowStockThreshold: 1,
      }
    );

    const lowStockProducts = allProducts.filter(
      (item) =>
        item.quantity > 0 &&
        item.quantity <= item.lowStockThreshold
    ).length;

    inventoryTotalProducts.set(totalProducts);
    inventoryLowStockProducts.set(lowStockProducts);
    inventoryOutOfStockProducts.set(outOfStockProducts);
  } catch (err) {
    console.error('[metrics] Failed to update inventory gauges:', err);
  }
}

module.exports = {
  client,

  inventoryAdjustmentsTotal,
  largeInventoryAdjustmentsTotal,
  inventoryCreateTotal,
  inventoryDeleteTotal,

  inventoryTotalProducts,
  inventoryLowStockProducts,
  inventoryOutOfStockProducts,

  updateInventoryGauges,
};