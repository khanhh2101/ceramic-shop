import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import { checkoutApi } from '@/pages/Customer/Checkout/api/checkoutApi';

export const usePublicCoupons = (options = {}) => {
  return useQuery({
    queryKey: ['coupons', 'public'],
    queryFn: async () => {
      const res = await checkoutApi.getPublicCoupons();
      return res?.data || res || [];
    },
    ...QUERY_CONFIGS.MODERATE,
    ...options
  });
};
