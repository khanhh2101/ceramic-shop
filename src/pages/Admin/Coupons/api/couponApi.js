import api from '@/services/api';

export const couponApi = {
    getAll: (params) => api.get('/coupons', { params }),
    create: (data) => api.post('/coupons', data),
    delete: (id) => api.delete(`/coupons/${id}`)
};
