const { createProxyMiddleware } = require('http-proxy-middleware');
const routeConfig = require('../config/routeConfig');

module.exports = createProxyMiddleware({
  target: routeConfig.product.target,
  changeOrigin: true,
  pathRewrite: (path) => `/api/products${path}`,
});
