import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import { adminUserApi } from '@/pages/Admin/Users/api/adminUserApi';

export const useAdminUsers = (params, options = {}) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const res = await adminUserApi.getUsers(params);
      const data = res || res;
      return z.object({ items: z.array(z.any()).catch([]), totalCount: z.number().catch(0), totalPages: z.number().catch(1) }).passthrough().parse({
          items: Array.isArray(data) ? data : (data?.data || data?.items || []),
          totalPages: data?.totalPages || 1,
          totalCount: data?.totalCount || 0
      });
    },
    ...QUERY_CONFIGS.MODERATE,
    ...options
  });
};
