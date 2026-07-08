import api from './api.js';

export const listUsers = () =>
  api.get('/auth/users').then((r) => r.data.users);

export const updateUserRole = (id, role) =>
  api.put(`/auth/users/${id}/role`, { role }).then((r) => r.data.user);

export const deleteUser = (id) =>
  api.delete(`/auth/users/${id}`).then((r) => r.data);
