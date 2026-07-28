const routeConfig = {
  auth: {
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:4001',
    pathPrefix: '/api/auth',
  },
  product: {
    target: process.env.PRODUCT_SERVICE_URL || 'http://localhost:4002',
    pathPrefix: '/api/products',
  },
  order: {
    target: process.env.ORDER_SERVICE_URL || 'http://localhost:4003',
    pathPrefix: '/api/orders',
  },
  inventory: {
    target: process.env.INVENTORY_SERVICE_URL || 'http://localhost:4004',
    pathPrefix: '/api/inventory',
  },
  statistics: {
    target: process.env.STATISTICS_SERVICE_URL || 'http://localhost:4005',
    pathPrefix: '/api/statistics',
  },
};

module.exports = routeConfig;
