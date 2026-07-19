import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import { adminProductApi } from '@/pages/Admin/Products/api/adminProductApi';

export const useAdminProducts = (params, options = {}) => {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: async () => {
      const res = await adminProductApi.getProducts(params);
      return z.object({ items: z.array(z.any()).catch([]), totalCount: z.number().catch(0), totalPages: z.number().catch(1) }).passthrough().parse({
        items: Array.isArray(res) ? res : (res?.data || res?.items || []),
        totalCount: res?.totalCount || 0,
        totalPages: res?.totalPages || 1
      });
    },
    ...QUERY_CONFIGS.HIGH,
    ...options
  });
};
