import api from '@/services/api';

export const adminLocationApi = {
    getProvinces: (isNewStructure) => api.get(`/locations/provinces?isNewStructure=${isNewStructure}`),
    syncLocations: (useNewStructure) => api.post(`/locations/sync?useNewStructure=${useNewStructure}`, null, { timeout: 300000 }),
    
    getDistricts: (code, isNewStructure) => api.get(`/locations/districts/${code}?isNewStructure=${isNewStructure}`),
    getWards: (code, isNewStructure) => api.get(`/locations/wards/${code}?isNewStructure=${isNewStructure}`),
    
    updateProvince: (code, isNewStructure, payload) => api.put(`/locations/provinces/${code}?isNewStructure=${isNewStructure}`, payload),
    updateDistrict: (code, isNewStructure, payload) => api.put(`/locations/districts/${code}?isNewStructure=${isNewStructure}`, payload),
    updateWard: (code, isNewStructure, payload) => api.put(`/locations/wards/${code}?isNewStructure=${isNewStructure}`, payload)
};
