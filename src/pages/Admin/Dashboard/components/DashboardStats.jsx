import React from 'react';
import { FiShoppingBag, FiUsers, FiDollarSign, FiPackage, FiTrendingUp } from 'react-icons/fi';

export default function DashboardStats({ stats, formatCurrency }) {
    return (
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
    );
}
