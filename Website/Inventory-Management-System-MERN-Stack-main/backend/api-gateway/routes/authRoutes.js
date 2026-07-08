const { createProxyMiddleware } = require('http-proxy-middleware');
const routeConfig = require('../config/routeConfig');

module.exports = createProxyMiddleware({
  target: routeConfig.auth.target,
  changeOrigin: true,
  pathRewrite: (path) => `/api/auth${path}`,
});
