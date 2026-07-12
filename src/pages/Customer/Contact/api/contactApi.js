import api from '@/services/api';

export const contactApi = {
    getHomeSettings: () => api.get('/settings/home')
};
