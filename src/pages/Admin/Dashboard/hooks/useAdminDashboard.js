import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import { adminDashboardApi } from '@/pages/Admin/Dashboard/api/adminDashboardApi';
import { z } from 'zod';

const DashboardStatsSchema = z.object({
  stats: z.object({
    totalProducts: z.number().catch(0),
    totalUsers: z.number().catch(0),
    totalOrders: z.number().catch(0),
    totalRevenue: z.number().catch(0)
  }),
  recentOrders: z.array(z.any()).catch([])
});

export const useAdminDashboardStats = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'dashboardStats'],
    queryFn: async () => {
      const [productRes, userRes, orderRes] = await adminDashboardApi.getDashboardStats();
      const orders = orderRes.data?.items || [];
      const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) * 10;
      
      return DashboardStatsSchema.parse({
        stats: {
          totalProducts: productRes.data?.totalCount || 0,
          totalUsers: userRes.data?.totalCount || 0,
          totalOrders: orderRes.data?.totalCount || 0,
          totalRevenue: revenue
        },
        recentOrders: orders
      });
    },
    ...QUERY_CONFIGS.CRITICAL,
    ...options
  });
};
