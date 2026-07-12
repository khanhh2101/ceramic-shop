import api from '@/services/api';

/**
 * Các API độc quyền dành cho trang Shop (Cửa hàng)
 */
export const shopApi = {
  // Lấy danh sách sản phẩm kèm bộ lọc (filter, pagination, sort)
  getProducts: (params) => api.get('/products', { params }),
};
