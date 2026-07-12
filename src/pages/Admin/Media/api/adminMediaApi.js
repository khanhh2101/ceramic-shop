import api from '@/services/api';
import { mediaService } from '@/services/index';

export const adminMediaApi = {
    getMedia: (params) => api.get('/media', { params }),
    deleteMedia: (id) => api.delete(`/media/${id}`),
    uploadMultiple: (files, targetBucket) => mediaService.uploadMultiple(files, targetBucket)
};
