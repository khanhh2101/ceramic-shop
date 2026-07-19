import React, { useMemo } from 'react';
import AntTable from '@/components/common/AntTable';

export default function RecentOrdersTable({ recentOrders, formatCurrency }) {
    const columns = useMemo(() => [
        {
            title: 'Mã Đơn',
            dataIndex: 'orderCode',
            width: 120,
            render: (orderCode, order) => <span className="font-semibold text-gray-900">#{orderCode || order.id?.substring(0,8)}</span>
        },
        {
            title: 'Khách Hàng',
            dataIndex: 'customerName',
            width: 200,
            render: (customerName) => <span className="text-sm text-gray-600">{customerName || 'Khách vãng lai'}</span>
        },
        {
            title: 'Ngày Đặt',
            dataIndex: 'createdAt',
            width: 150,
            render: (createdAt) => <span className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString('vi-VN')}</span>
        },
        {
            title: 'Tổng Tiền',
            dataIndex: 'totalAmount',
            width: 150,
            render: (totalAmount) => <span className="text-sm font-medium text-gray-900">{formatCurrency(totalAmount)}</span>
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            width: 150,
            render: (_, order) => (
                <span 
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                    style={{ backgroundColor: order.statusColor || '#888' }}
                >
                    {order.statusText}
                </span>
            )
        }
    ], [formatCurrency]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-[450px]">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-bold text-gray-900">Đơn hàng gần đây</h3>
                <button className="text-sm font-medium text-[#b5624a] hover:text-[#9a513b]">
                    Xem tất cả
                </button>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
                <AntTable 
                    columns={columns}
                    dataSource={recentOrders}
                    emptyMessage="Chưa có đơn hàng nào"
                    pagination={false}
                    scroll={{ y: 'calc(100% - 40px)', x: 'max-content' }}
                />
            </div>
        </div>
    );
}
