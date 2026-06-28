import { useState, useEffect } from 'react';
import { FiShoppingBag, FiUsers, FiDollarSign, FiPackage, FiTrendingUp } from 'react-icons/fi';
import api from '../../services/api';

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
    // Gọi API để lấy dữ liệu. Vì chưa có API dashboard gộp, ta gọi các API rời rạc.
    Promise.all([
      api.get('/products', { params: { pageSize: 1 } }),
      api.get('/users', { params: { pageSize: 1 } }),
      api.get('/orders', { params: { pageSize: 5, sortBy: 'createdAt', sortDesc: true } })
    ]).then(([productRes, userRes, orderRes]) => {
      
      const orders = orderRes.data.data?.items || [];
      // Calculate mock revenue from recent orders or similar logic if needed
      const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) * 10; // Giả lập doanh thu

      setStats({
        totalProducts: productRes.data.data?.totalCount || 0,
        totalUsers: userRes.data.data?.totalCount || 0,
        totalOrders: orderRes.data.data?.totalCount || 0,
        totalRevenue: revenue
      });
      setRecentOrders(orders);
    }).catch(err => {
      console.error("Lỗi khi tải dữ liệu Dashboard:", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#b5624a]/30 border-t-[#b5624a] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-display">Tổng quan</h2>
        <p className="text-sm text-gray-500 mt-1">Hoạt động kinh doanh của Gốm Nâu hôm nay</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Tổng doanh thu</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</h3>
            <p className="text-xs text-green-600 flex items-center mt-2 font-medium">
              <FiTrendingUp className="mr-1" /> +12.5% so với tháng trước
            </p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <FiDollarSign size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Đơn hàng mới</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
            <p className="text-xs text-green-600 flex items-center mt-2 font-medium">
              <FiTrendingUp className="mr-1" /> +5.2% so với tháng trước
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <FiPackage size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Tổng sản phẩm</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
            <p className="text-xs text-gray-500 flex items-center mt-2 font-medium">
              Cập nhật gần nhất
            </p>
          </div>
          <div className="w-12 h-12 bg-[#b5624a]/10 rounded-xl flex items-center justify-center text-[#b5624a]">
            <FiShoppingBag size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Tổng khách hàng</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
            <p className="text-xs text-green-600 flex items-center mt-2 font-medium">
              <FiTrendingUp className="mr-1" /> +2.1% so với tuần trước
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
            <FiUsers size={24} />
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Đơn hàng gần đây</h3>
          <button className="text-sm font-medium text-[#b5624a] hover:text-[#9a513b]">
            Xem tất cả
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Mã Đơn</th>
                <th className="px-6 py-4 font-medium">Khách Hàng</th>
                <th className="px-6 py-4 font-medium">Ngày Đặt</th>
                <th className="px-6 py-4 font-medium">Tổng Tiền</th>
                <th className="px-6 py-4 font-medium">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">#{order.orderCode || order.id?.substring(0,8)}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.customerName || 'Khách vãng lai'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <span 
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                        style={{ backgroundColor: order.statusColor || '#888' }}
                    >
                      {order.statusText}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500 text-sm">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
