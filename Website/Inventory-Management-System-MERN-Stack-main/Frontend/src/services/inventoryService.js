import api from './api.js';

export const listInventory = () => api.get('/inventory').then((r) => r.data.items);
export const addInventory = (payload) =>
  api.post('/inventory', payload).then((r) => r.data.item);
export const adjustInventory = (id, delta) =>
  api.patch(`/inventory/${id}/adjust`, { delta }).then((r) => r.data.item);
export const removeInventory = (id) =>
  api.delete(`/inventory/${id}`).then((r) => r.data);
