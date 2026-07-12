import api from '@/services/api';

export const adminProductApi = {
    getColors: () => api.get('/master-data/100/generals'),
    getTags: () => api.get('/master-data/200/generals'),
    getCategories: () => api.get('/categories'),
    getProducts: (params) => api.get('/products', { params }),
    getProductDetails: (id) => api.get(`/products/${id}`),
    createProduct: (data) => api.post('/products', data),
    updateProduct: (id, data) => api.put(`/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/products/${id}`),
    toggleVisibility: (id) => api.patch(`/products/${id}/toggle-visibility`),
    setPrimaryImage: (productId, imageId) => api.put(`/media/product/${productId}/images/${imageId}/set-primary`),
    deleteImage: (productId, imageId) => api.delete(`/media/product/${productId}/images/${imageId}`)
};
