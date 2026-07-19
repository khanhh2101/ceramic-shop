import React, { useMemo } from 'react';
import { FiEye, FiCheckCircle } from 'react-icons/fi';
import AntTable from '@/components/common/AntTable';

export default function AdminOrderTable({ orders, loading, handleOpenModal, formatCurrency, formatDate, getImageUrl }) {
    const columns = useMemo(() => [
        {
            title: 'Mã Đơn',
            dataIndex: 'orderCode',
            width: 120,
            render: (orderCode, order) => <span className="font-semibold text-gray-900">{orderCode || `#${order.id}`}</span>
        },
        {
            title: 'Khách Hàng',
            key: 'customer',
            render: (_, order) => (
                <div>
                    <p className="font-semibold text-gray-900 text-sm">{order.receiverName || 'Khách Hàng'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.receiverPhone || '---'}</p>
                </div>
            )
        },
        {
            title: 'Sản Phẩm',
            key: 'products',
            width: 200,
            render: (_, order) => (
                <div className="flex items-center gap-3">
                    <img src={getImageUrl(order.firstItemImage)} alt="" className="w-10 h-10 rounded object-cover border border-gray-100" />
                    <p className="text-xs text-gray-600">
                        {order.itemCount > 1 ? `${order.itemCount} sản phẩm` : '1 sản phẩm'}
                    </p>
                </div>
            )
        },
        {
            title: 'Ngày Đặt',
            dataIndex: 'createdAt',
            width: 160,
            render: (createdAt) => <span className="text-sm text-gray-500">{formatDate(createdAt)}</span>,
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        },
        {
            title: 'Tổng Tiền',
            dataIndex: 'total',
            width: 150,
            render: (total) => <span className="font-semibold text-[#b5624a]">{formatCurrency(total)}</span>,
            sorter: (a, b) => a.total - b.total
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            width: 150,
            render: (_, order) => (
                <span 
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                    style={{ backgroundColor: order.statusColor || '#888' }}
                >
                    {order.statusText}
                </span>
            ),
            filters: [
                { text: 'Chờ xử lý', value: 'pending' },
                { text: 'Đang xử lý', value: 'processing' },
                { text: 'Đang giao', value: 'shipped' },
                { text: 'Hoàn thành', value: 'delivered' },
                { text: 'Đã hủy', value: 'cancelled' }
            ],
            onFilter: (value, record) => record.status?.toLowerCase() === value
        },
        {
            title: 'Thao Tác',
            key: 'action',
            width: 100,
            align: 'right',
            fixed: 'right',
            render: (_, order) => (
                <div className="flex items-center justify-end gap-2 pr-2">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(order.id);
                        }}
                        className="px-3 py-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-gray-200 shadow-sm transition-colors whitespace-nowrap"
                    >
                        <FiEye size={14} /> Chi tiết
                    </button>
                </div>
            )
        }
    ], [handleOpenModal, formatCurrency, formatDate, getImageUrl]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <AntTable 
                columns={columns}
                dataSource={orders}
                loading={loading}
                emptyMessage="Không tìm thấy đơn hàng nào"
                pagination={false}
            />
        </div>
    );
}
