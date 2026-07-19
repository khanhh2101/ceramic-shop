import api from '@/services/api';
import { mediaService } from '@/services/index';

export const adminMediaApi = {
    getMedia: (params) => api.get('/media', { params }),
    deleteMedia: (id) => api.delete(`/media/${id}`),
    deleteMultiple: (ids) => api.delete('/media/multiple', { data: ids }),
    uploadMultiple: (files, targetBucket) => mediaService.uploadMultiple(files, targetBucket),
    scanOrphans: () => api.post('/media/scan-orphans'),
    getPurposes: () => api.get('/media/purposes')
};
