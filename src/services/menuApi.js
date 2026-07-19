import api from './api';

export const menuService = {
  getAll: () => api.get('/admin-menus'),
  getMyMenu: () => api.get('/admin-menus/my-menu'),
  create: (data) => api.post('/admin-menus', data),
  update: (id, data) => api.put(`/admin-menus/${id}`, data),
  delete: (id) => api.delete(`/admin-menus/${id}`),
  updateOrder: (data) => api.post('/admin-menus/order', data),
};
