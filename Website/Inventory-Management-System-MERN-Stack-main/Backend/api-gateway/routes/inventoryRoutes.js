const { createProxyMiddleware } = require('http-proxy-middleware');
const routeConfig = require('../config/routeConfig');

module.exports = createProxyMiddleware({
  target: routeConfig.inventory.target,
  changeOrigin: true,
  pathRewrite: (path) => `/api/inventory${path}`,
});
