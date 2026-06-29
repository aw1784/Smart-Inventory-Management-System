import api from './api.js';

export const listOrders = () => api.get('/orders').then((r) => r.data.orders);
export const placeOrder = (payload) =>
  api.post('/orders', payload).then((r) => r.data.order);
export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status }).then((r) => r.data.order);
