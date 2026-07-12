import api from '@/services/api';

export const aboutApi = {
    getHomeSettings: () => api.get('/settings/home')
};
