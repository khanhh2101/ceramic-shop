import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import api from '@/services/api';
import { z } from 'zod';

const CouponResponseSchema = z.object({
  items: z.array(z.any()).catch([]),
  totalCount: z.number().catch(0),
  totalPages: z.number().catch(1)
});

export const useAdminCoupons = (params, options = {}) => {
  return useQuery({
    queryKey: ['admin', 'coupons', params],
    queryFn: async () => {
      const res = await api.get('/coupons/admin', { params });
      return CouponResponseSchema.parse({
        items: Array.isArray(res) ? res : (res?.data || res?.items || []),
        totalCount: res?.totalCount || 0,
        totalPages: res?.totalPages || 1
      });
    },
    ...QUERY_CONFIGS.MODERATE,
    ...options
  });
};
