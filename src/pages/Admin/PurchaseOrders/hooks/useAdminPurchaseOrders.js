import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import { adminPurchaseOrderApi } from '@/pages/Admin/PurchaseOrders/api/adminPurchaseOrderApi';
import { z } from 'zod';

const PurchaseOrderResponseSchema = z.object({
  items: z.array(z.any()).catch([]),
  totalCount: z.number().catch(0)
});

export const useAdminPurchaseOrders = (params, options = {}) => {
  return useQuery({
    queryKey: ['admin', 'purchaseorders', params],
    queryFn: async () => {
      const res = await adminPurchaseOrderApi.getPurchaseOrders(params);
      return PurchaseOrderResponseSchema.parse({
        items: res?.data || [],
        totalCount: res?.totalCount || 0
      });
    },
    ...QUERY_CONFIGS.CRITICAL,
    ...options
  });
};
