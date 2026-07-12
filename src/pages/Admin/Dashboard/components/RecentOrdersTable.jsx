import React, { useMemo } from 'react';
import DataTable from '@/components/common/DataTable';

export default function RecentOrdersTable({ recentOrders, formatCurrency }) {
    const columns = useMemo(() => [
        {
            headerName: 'Mã Đơn',
            field: 'orderCode',
            width: '120px',
            cellRenderer: (order) => <span className="font-semibold text-gray-900">#{order.orderCode || order.id?.substring(0,8)}</span>
        },
        {
            headerName: 'Khách Hàng',
            field: 'customerName',
            flex: 1,
            minWidth: '200px',
            cellClassName: 'text-sm text-gray-600',
            cellRenderer: (order) => order.customerName || 'Khách vãng lai'
        },
        {
            headerName: 'Ngày Đặt',
            field: 'createdAt',
            width: '150px',
            cellClassName: 'text-sm text-gray-500',
            cellRenderer: (order) => new Date(order.createdAt).toLocaleDateString('vi-VN')
        },
        {
            headerName: 'Tổng Tiền',
            field: 'totalAmount',
            width: '150px',
            cellClassName: 'text-sm font-medium text-gray-900',
            cellRenderer: (order) => formatCurrency(order.totalAmount)
        },
        {
            headerName: 'Trạng Thái',
            field: 'status',
            width: '150px',
            cellRenderer: (order) => (
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
            <DataTable 
                columns={columns}
                data={recentOrders}
                emptyMessage="Chưa có đơn hàng nào"
                wrapperClassName="flex-1 flex flex-col overflow-hidden"
            />
        </div>
    );
}
