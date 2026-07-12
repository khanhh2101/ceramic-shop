import api from '@/services/api';

export const adminSettingsApi = {
    getSiteSettings: () => api.get('/settings/admin'),
    saveSiteSettings: (payload) => api.put('/settings/admin', payload),
    
    getHomeBlocks: () => api.get('/settings/home/admin'),
    saveHomeBlock: (blockKey, payload) => api.put(`/settings/home/${blockKey}`, payload),
    
    getTimeline: () => api.get('/settings/about/timeline'),
    deleteTimeline: (id) => api.delete(`/settings/about/timeline/${id}`),
    addTimeline: (payload) => api.post('/settings/about/timeline', payload),
    
    getEmailTemplates: () => api.get('/settings/email-templates'),
    saveEmailTemplate: (slug, payload) => api.put(`/settings/email-templates/${slug}`, payload)
};
