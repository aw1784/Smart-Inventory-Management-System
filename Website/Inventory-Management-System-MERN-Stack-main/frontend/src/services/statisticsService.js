import api from './api.js';

export const getSummary = () => api.get('/statistics/summary').then((r) => r.data.summary);
export const getOrderStats = () => api.get('/statistics/orders').then((r) => r.data.stats);
export const getUserStats = () => api.get('/statistics/users').then((r) => r.data.stats);
export const getInventoryStats = () =>
  api.get('/statistics/inventory').then((r) => r.data.stats);
