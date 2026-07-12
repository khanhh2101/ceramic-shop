import api from '@/services/api';

/**
 * API độc quyền cho trang Admin Master Data
 */
export const masterDataApi = {
  // ── Master Codes ──
  getMasters: (params) => api.get('/master-data', { params }),
  
  createMaster: (data) => api.post('/master-data', data),
  
  updateMaster: (code, data) => api.put(`/master-data/${code}`, data),
  
  deleteMaster: (code) => api.delete(`/master-data/${code}`),

  // ── General Codes ──
  getGenerals: (masterCode, params) => api.get(`/master-data/${masterCode}/generals`, { params }),
  
  getNextGenCd: (masterCode) => api.get(`/master-data/${masterCode}/next-gen-cd`),
  
  createGeneral: (masterCode, data) => api.post(`/master-data/${masterCode}/generals`, data),
  
  updateGeneral: (genCd, data) => api.put(`/master-data/generals/${genCd}`, data),
  
  deleteGeneral: (genCd) => api.delete(`/master-data/generals/${genCd}`),
};
