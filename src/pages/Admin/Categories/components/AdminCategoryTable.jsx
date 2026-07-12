import React, { useMemo } from 'react';
import { FiEdit2, FiTrash2, FiTag } from 'react-icons/fi';
import ActionIconButton from '@/components/common/ActionIconButton';
import DataTable from '@/components/common/DataTable';

export default function AdminCategoryTable({ categories, loading, handleOpenModal, handleDelete }) {
    const columns = useMemo(() => [
        {
            headerName: 'Tên Danh Mục',
            field: 'name',
            flex: 1,
            minWidth: '200px',
            cellRenderer: (cat) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden shrink-0">
                        {cat.imageUrl ? (
                            <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                            <FiTag size={18} />
                        )}
                    </div>
                    <span className="font-semibold text-gray-900">{cat.name}</span>
                </div>
            )
        },
        {
            headerName: 'Slug',
            field: 'slug',
            width: '200px',
            cellClassName: 'text-sm text-gray-500'
        },
        {
            headerName: 'Số Sản Phẩm',
            field: 'productCount',
            width: '150px',
            cellRenderer: (cat) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {cat.productCount || 0} sản phẩm
                </span>
            )
        },
        {
            headerName: 'Thao Tác',
            width: '100px',
            headerClassName: 'justify-end pr-0 text-right',
            cellRenderer: (cat) => (
                <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity">
                    <ActionIconButton 
                        icon={FiEdit2} 
                        onClick={() => handleOpenModal(cat)} 
                        title="Sửa"
                    />
                    <ActionIconButton 
                        icon={FiTrash2} 
                        variant="delete" 
                        onClick={() => handleDelete(cat.id)} 
                        title="Xóa"
                    />
                </div>
            )
        }
    ], [handleOpenModal, handleDelete]);

    return (
        <DataTable 
            columns={columns}
            data={categories}
            loading={loading}
            emptyMessage="Không tìm thấy danh mục nào"
        />
    );
}
