import api from './api.js';

export const listProducts = () => api.get('/products').then((r) => r.data.products);
export const createProduct = (payload) =>
  api.post('/products', payload).then((r) => r.data.product);
export const updateProduct = (id, payload) =>
  api.put(`/products/${id}`, payload).then((r) => r.data.product);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then((r) => r.data);
