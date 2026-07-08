import api from './api.js';

export const signIn = (payload) => api.post('/auth/signin', payload).then((r) => r.data);
export const signUp = (payload) => api.post('/auth/signup', payload).then((r) => r.data);
export const me = () => api.get('/auth/me').then((r) => r.data);
