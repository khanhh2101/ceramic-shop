import api from '@/services/api';

export const adminUserApi = {
    getUsers: (params) => api.get('/users', { params }),
    updateUser: (id, data) => api.put(`/users/${id}`, data),
    updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
    updateUserStatus: (id, isLocked) => api.put(`/users/${id}/status`, { isLocked }),
    deleteUser: (id) => api.delete(`/users/${id}`)
};
