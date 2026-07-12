import api from './api';

/**
 * Các API dùng chung cho nhiều module (Ví dụ: Danh mục, Master Data dùng cho select box...)
 */
export const sharedApi = {
  // ── Categories ──
  getCategories: () => api.get('/categories'),
  
  // ── Products ──
  getProducts: (params) => api.get('/products', { params }),
  
  // ── Master Data (Cho dropdown, select box) ──
  getMasterDataGenerals: (masterCode) => api.get(`/master-data/${masterCode}/generals`),
};
