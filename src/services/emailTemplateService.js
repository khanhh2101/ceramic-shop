import api from './api';

const emailTemplateService = {
  getTemplates: () => api.get('/email-templates'),
  getTemplateById: (id) => api.get(`/email-templates/${id}`),
  updateTemplate: (id, data) => api.put(`/email-templates/${id}`, data),
};

export default emailTemplateService;
