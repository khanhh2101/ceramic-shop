import api from '@/services/api';

export const adminDashboardApi = {
    getDashboardStats: async () => {
        // Since there is no unified dashboard API, we fetch from disparate endpoints
        return Promise.all([
            api.get('/products', { params: { pageSize: 1 } }),
            api.get('/users', { params: { pageSize: 1 } }),
            api.get('/orders/admin', { params: { pageSize: 5, sortBy: 'createdAt', sortDesc: true } })
        ]);
    }
};
