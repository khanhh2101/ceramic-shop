import api from '@/services/api';

export const adminPurchaseOrderApi = {
    // Lấy danh sách phiếu nhập
    getPurchaseOrders: async (params) => {
        const res = await api.get('/purchaseorders', { params });
        return res; // PagedResponse
    },

    // Lấy chi tiết phiếu nhập
    getPurchaseOrderById: async (id) => {
        const res = await api.get(`/purchaseorders/${id}`);
        return res; // ApiResponse<PurchaseOrderDto>
    },

    // Tạo phiếu nhập mới
    createPurchaseOrder: async (data) => {
        const res = await api.post('/purchaseorders', data);
        return res; // ApiResponse<PurchaseOrderDto>
    },

    // Duyệt phiếu nhập (cộng tồn kho, tính MAC)
    completePurchaseOrder: async (id) => {
        const res = await api.post(`/purchaseorders/${id}/complete`);
        return res; // ApiResponse<bool>
    }
};
