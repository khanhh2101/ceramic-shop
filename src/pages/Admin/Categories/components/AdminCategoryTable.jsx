import React, { useMemo } from 'react';
import { FiEdit2, FiTrash2, FiTag } from 'react-icons/fi';
import ActionIconButton from '@/components/common/ActionIconButton';
import AntTable from '@/components/common/AntTable';

export default function AdminCategoryTable({ categories, loading, handleOpenModal, handleDelete }) {
    const columns = useMemo(() => [
        {
            title: 'Tên Danh Mục',
            key: 'name',
            width: 250,
            render: (_, cat) => (
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
            ),
            sorter: (a, b) => (a.name || '').localeCompare(b.name || '')
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            width: 200,
            render: (slug) => <span className="text-sm text-gray-500">{slug}</span>
        },
        {
            title: 'Số Sản Phẩm',
            dataIndex: 'productCount',
            width: 150,
            render: (productCount) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {productCount || 0} sản phẩm
                </span>
            ),
            sorter: (a, b) => (a.productCount || 0) - (b.productCount || 0)
        },
        {
            title: 'Thao Tác',
            key: 'action',
            width: 100,
            align: 'right',
            render: (_, cat) => (
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <AntTable 
                columns={columns}
                dataSource={categories}
                loading={loading}
                emptyMessage="Không tìm thấy danh mục nào"
                pagination={false}
            />
        </div>
    );
}
