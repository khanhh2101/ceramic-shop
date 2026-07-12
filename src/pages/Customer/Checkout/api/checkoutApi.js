import api from '@/services/api';

export const checkoutApi = {
    getProvinces: (isNewStructure) => api.get(`/locations/provinces?isNewStructure=${isNewStructure}`),
    
    getDistricts: (provinceCode) => api.get(`/locations/districts/${provinceCode}?isNewStructure=false`),
    
    getWards: (parentCode, isNewStructure) => api.get(`/locations/wards/${parentCode}?isNewStructure=${isNewStructure}`),
    
    getShippingFee: (params) => api.get('/locations/shipping-fee', { params }),
    
    validateCoupon: (data) => api.post('/coupons/validate', data)
};
