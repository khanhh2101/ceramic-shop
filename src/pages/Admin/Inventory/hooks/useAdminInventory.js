import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import adminInventoryApi from '@/pages/Admin/Inventory/api/adminInventoryApi';

export const useAdminLowStock = (threshold = 15, options = {}) => {
  return useQuery({
    queryKey: ['admin', 'inventory', 'lowStock', threshold],
    queryFn: async () => {
      const res = await adminInventoryApi.getLowStock(threshold);
      return z.array(z.any()).catch([]).parse(res?.data || []);
    },
    ...QUERY_CONFIGS.HIGH,
    ...options
  });
};

export const useAdminLedger = (params, options = {}) => {
  return useQuery({
    queryKey: ['admin', 'inventory', 'ledger', params],
    queryFn: async () => {
      const res = await adminInventoryApi.getLedger(params);
      // res is already the response body (due to api.js interceptor)
      // Server returns PagedResponse { data: [...], totalCount, page, pageSize }
      const body = res || {};
      return z.object({
        items: z.array(z.any()).catch([]),
        totalCount: z.number().catch(0),
        totalPages: z.number().catch(1)
      }).passthrough().parse({
        items: body.data || [],
        totalCount: body.totalCount || 0,
        totalPages: body.totalPages || 1
      });
    },
    ...QUERY_CONFIGS.HIGH,
    ...options
  });
};
