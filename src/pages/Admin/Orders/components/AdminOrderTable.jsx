import React, { useMemo } from 'react';
import { FiEye } from 'react-icons/fi';
import ActionIconButton from '@/components/common/ActionIconButton';
import DataTable from '@/components/common/DataTable';

export default function AdminOrderTable({ orders, loading, handleOpenModal, formatCurrency, formatDate, getImageUrl }) {
    const columns = useMemo(() => [
        {
            headerName: 'Mã Đơn',
            field: 'orderCode',
            width: '120px',
            cellRenderer: (order) => <span className="font-semibold text-gray-900">{order.orderCode || `#${order.id}`}</span>
        },
        {
            headerName: 'Khách Hàng',
            field: 'customer',
            flex: 1,
            minWidth: '200px',
            cellRenderer: (order) => (
                <div>
                    <p className="font-semibold text-gray-900 text-sm">{order.receiverName || 'Khách Hàng'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.receiverPhone || '---'}</p>
                </div>
            )
        },
        {
            headerName: 'Sản Phẩm',
            field: 'products',
            width: '200px',
            cellRenderer: (order) => (
                <div className="flex items-center gap-3">
                    <img src={getImageUrl(order.firstItemImage)} alt="" className="w-10 h-10 rounded object-cover border border-gray-100" />
                    <p className="text-xs text-gray-600">
                        {order.itemCount > 1 ? `${order.itemCount} sản phẩm` : '1 sản phẩm'}
                    </p>
                </div>
            )
        },
        {
            headerName: 'Ngày Đặt',
            field: 'createdAt',
            width: '150px',
            cellClassName: 'text-sm text-gray-500',
            cellRenderer: (order) => formatDate(order.createdAt)
        },
        {
            headerName: 'Tổng Tiền',
            field: 'total',
            width: '150px',
            cellRenderer: (order) => <span className="font-semibold text-[#b5624a]">{formatCurrency(order.total)}</span>
        },
        {
            headerName: 'Trạng Thái',
            field: 'status',
            width: '150px',
            cellRenderer: (order) => (
                <span 
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                    style={{ backgroundColor: order.statusColor || '#888' }}
                >
                    {order.statusText}
                </span>
            )
        },
        {
            headerName: 'Thao Tác',
            width: '100px',
            headerClassName: 'justify-end pr-0 text-right',
            cellRenderer: (order) => (
                <div className="flex justify-end pr-4">
                    <ActionIconButton 
                        icon={FiEye} 
                        text="Chi tiết"
                        variant="view"
                        onClick={() => handleOpenModal(order.id)} 
                    />
                </div>
            )
        }
    ], [handleOpenModal, formatCurrency, formatDate, getImageUrl]);

    return (
        <DataTable 
            columns={columns}
            data={orders}
            loading={loading}
            emptyMessage="Không tìm thấy đơn hàng nào"
        />
    );
}
