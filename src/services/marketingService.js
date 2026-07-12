import api from './api';

const marketingService = {
  sendMassEmail: (data) => api.post('/marketing/send-mass-email', data),
};

export default marketingService;
