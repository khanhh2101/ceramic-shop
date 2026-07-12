import api from '@/services/api';

export const adminOrderApi = {
    getMasterStatuses: () => api.get('/master-data/400/generals'),
    getOrders: (params) => api.get('/orders/admin', { params }),
    getOrderDetails: (orderId) => api.get(`/orders/code/${orderId}`),
    updateOrderStatus: (orderId, statusId) => api.patch(`/orders/${orderId}/status`, { statusId: parseInt(statusId) }),
};
