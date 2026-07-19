import api from '@/services/api';

/**
 * Các API độc quyền dành cho trang chủ
 */
export const homeApi = {
  // Lấy danh sách sản phẩm bán chạy
  getBestSellers: (count = 8) => api.get('/products/bestsellers', { params: { count } }),
  
  // Lấy các cấu hình hiển thị nội dung động trên Home (Hero slider, Promo Banner)
  getHomeContent: () => api.get('/settings/home'),

  // Lấy danh sách timeline
  getTimeline: () => api.get('/settings/about/timeline'),
};
