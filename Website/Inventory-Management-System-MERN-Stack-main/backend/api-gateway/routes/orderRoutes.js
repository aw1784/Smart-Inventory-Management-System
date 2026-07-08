const { createProxyMiddleware } = require('http-proxy-middleware');
const routeConfig = require('../config/routeConfig');

module.exports = createProxyMiddleware({
  target: routeConfig.order.target,
  changeOrigin: true,
  pathRewrite: (path) => `/api/orders${path}`,
});
