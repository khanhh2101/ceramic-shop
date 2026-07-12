import api from '@/services/api';

export const adminCategoryApi = {
    getCategories: (params) => api.get('/categories', { params }),
    createCategory: (data) => api.post('/categories', data),
    updateCategory: (id, data) => api.put(`/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/categories/${id}`),
};
