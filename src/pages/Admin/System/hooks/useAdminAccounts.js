import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAccountsApi } from '../api/adminAccountsApi';
import { rbacService } from '@/services/rbacApi';
import toast from 'react-hot-toast';

export const useAdminAccounts = (params) => {
    return useQuery({
        queryKey: ['adminAccounts', params],
        queryFn: () => adminAccountsApi.getAccounts(params),
        keepPreviousData: true
    });
};

export const useAssignGroupsToUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, groupIds }) => adminAccountsApi.assignGroups(userId, groupIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminAccounts'] });
        },
        onError: (err) => {
            console.error('Assign Groups Error:', err);
        }
    });
};

export const useCreateAdminAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => adminAccountsApi.createAccount(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminAccounts'] });
            toast.success('Tạo tài khoản thành công!');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Có lỗi khi tạo tài khoản');
        }
    });
};

export const useAdminGroupsList = () => {
    return useQuery({
        queryKey: ['rbac', 'groups', 'all'],
        queryFn: async () => {
            const res = await rbacService.getGroups();
            return res.data;
        }
    });
};
