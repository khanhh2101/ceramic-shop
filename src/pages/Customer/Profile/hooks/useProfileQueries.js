import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import { profileApi } from '@/pages/Customer/Profile/api/profileApi';

export const useAddresses = (options = {}) => {
    return useQuery({
        queryKey: ['addresses'],
        queryFn: async () => {
            const res = await profileApi.getAddresses();
            return res?.data || res || [];
        },
        ...QUERY_CONFIGS.HIGH,
        ...options
    });
};
