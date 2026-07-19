import api from './api';

export const rbacService = {
  getGroups: () => api.get('/rbac/groups'),
  createGroup: (data) => api.post('/rbac/groups', data),
  updateGroup: (id, data) => api.put(`/rbac/groups/${id}`, data),
  deleteGroup: (id) => api.delete(`/rbac/groups/${id}`),
  assignRolesToGroup: (id, data) => api.post(`/rbac/groups/${id}/roles`, data),
  
  getRoles: () => api.get('/rbac/roles'),
  getRolePermissions: (roleId) => api.get(`/rbac/roles/${roleId}/permissions`),
  assignPermissionsToRole: (roleId, data) => api.post(`/rbac/roles/${roleId}/permissions`, data),
  
  getPermissions: () => api.get('/rbac/permissions'),
};
