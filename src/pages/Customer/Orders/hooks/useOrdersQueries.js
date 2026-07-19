import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import { orderApi } from '@/pages/Customer/Orders/api/orderApi';
import { z } from 'zod';

const OrderItemSchema = z.object({}).passthrough();
const OrderListSchema = z.array(OrderItemSchema).catch([]);

export const useMyOrders = (options = {}) => {
  return useQuery({
    queryKey: ['orders', 'my-orders'],
    queryFn: async () => {
      const res = await orderApi.getMyOrders();
      const data = Array.isArray(res?.data) ? res.data : (res?.items || []);
      return OrderListSchema.parse(data);
    },
    ...QUERY_CONFIGS.CRITICAL,
    ...options
  });
};

export const useOrderDetails = (orderCode, options = {}) => {
  return useQuery({
    queryKey: ['orders', orderCode],
    queryFn: async () => {
      const res = await orderApi.getByCode(orderCode);
      const data = res?.data || res;
      return OrderItemSchema.parse(data || {});
    },
    enabled: !!orderCode,
    ...QUERY_CONFIGS.CRITICAL,
    ...options
  });
};
