import api from '@/services/api';

const adminInventoryApi = {
  getLedger(params) {
    return api.get('/inventory/ledger', { params });
  },
  
  getLowStock(threshold = 10) {
    return api.get('/inventory/low-stock', { params: { threshold } });
  },
  
  adjustStock(data) {
    return api.post('/inventory/adjust', data);
  }
};

export default adminInventoryApi;
