import { useState, useEffect } from 'react';
import { adminDashboardApi } from './api/adminDashboardApi';
import DashboardStats from './components/DashboardStats';
import RecentOrdersTable from './components/RecentOrdersTable';
import { formatCurrency } from '@/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDashboardApi.getDashboardStats().then(([productRes, userRes, orderRes]) => {
      const orders = orderRes.data?.items || [];
      const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) * 10;

      setStats({
        totalProducts: productRes.data?.totalCount || 0,
        totalUsers: userRes.data?.totalCount || 0,
        totalOrders: orderRes.data?.totalCount || 0,
        totalRevenue: revenue
      });
      setRecentOrders(orders);
    }).catch(err => {
      console.error("Lỗi khi tải dữ liệu Dashboard:", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);



  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#b5624a]/30 border-t-[#b5624a] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-display">Tổng quan</h2>
        <p className="text-sm text-gray-500 mt-1">Hoạt động kinh doanh của Gốm Nâu hôm nay</p>
      </div>

      <DashboardStats stats={stats} formatCurrency={formatCurrency} />

      <RecentOrdersTable recentOrders={recentOrders} formatCurrency={formatCurrency} />
    </div>
  );
}
