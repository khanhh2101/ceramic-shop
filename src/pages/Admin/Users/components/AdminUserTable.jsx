import React, { useMemo } from 'react';
import { FiUser, FiMail, FiCalendar, FiShoppingBag, FiEdit2, FiTrash2, FiShield, FiLock, FiUnlock } from 'react-icons/fi';
import ActionIconButton from '@/components/common/ActionIconButton';
import DataTable from '@/components/common/DataTable';

export default function AdminUserTable({ filteredUsers, loading, handleOpenEdit, handleOpenDelete, formatDate }) {
    
    const columns = useMemo(() => [
        {
            headerName: 'Người dùng',
            field: 'user',
            flex: 1,
            minWidth: '250px',
            cellRenderer: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                            <FiUser className="text-gray-400" size={20} />
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{user.fullName}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                                <FiMail size={12} />
                                {user.email}
                            </span>
                            <span className="text-gray-300">|</span>
                            <span className="flex items-center gap-1">
                                <span className="font-medium text-gray-400">📞</span>
                                {user.phone || 'Chưa có SĐT'}
                            </span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            headerName: 'Vai trò',
            field: 'role',
            width: '150px',
            cellRenderer: (user) => (
                user.role === 'Admin' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                        <FiShield size={12} /> Quản trị viên
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        <FiUser size={12} /> Khách hàng
                    </span>
                )
            )
        },
        {
            headerName: 'Trạng thái',
            field: 'status',
            width: '150px',
            cellRenderer: (user) => (
                user.isLocked ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <FiLock size={12} /> Đã khóa
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <FiUnlock size={12} /> Hoạt động
                    </span>
                )
            )
        },
        {
            headerName: 'Ngày tham gia',
            field: 'createdAt',
            width: '150px',
            cellRenderer: (user) => (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <FiCalendar size={14} />
                    {formatDate(user.createdAt)}
                </div>
            )
        },
        {
            headerName: 'Đã mua',
            field: 'orderCount',
            width: '120px',
            headerClassName: 'justify-center text-center',
            cellRenderer: (user) => (
                <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-900">
                    <FiShoppingBag className="text-gray-400" size={14} />
                    {user.orderCount} <span className="text-xs font-normal text-gray-500">đơn</span>
                </div>
            )
        },
        {
            headerName: 'Thao tác',
            width: '100px',
            headerClassName: 'justify-end text-right pr-0',
            cellRenderer: (user) => (
                <div className="flex items-center justify-end gap-1">
                    <ActionIconButton
                        icon={FiEdit2}
                        onClick={() => handleOpenEdit(user)}
                        title="Sửa"
                    />
                    <ActionIconButton
                        icon={FiTrash2}
                        variant="delete"
                        onClick={() => handleOpenDelete(user)}
                        title="Xóa"
                    />
                </div>
            )
        }
    ], [handleOpenEdit, handleOpenDelete, formatDate]);

    return (
        <DataTable 
            columns={columns}
            data={filteredUsers}
            loading={loading}
            emptyMessage="Không tìm thấy người dùng nào"
        />
    );
}
