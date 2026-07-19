import api from '@/services/api';

export const adminAccountsApi = {
    getAccounts: async (params) => {
        const res = await api.get('/rbac/accounts', { params });
        return res.data;
    },
    assignGroups: async (userId, groupIds) => {
        const res = await api.post(`/rbac/accounts/${userId}/groups`, { groupIds });
        return res.data;
    },
    createAccount: async (data) => {
        const res = await api.post('/rbac/accounts', data);
        return res.data;
    }
};
