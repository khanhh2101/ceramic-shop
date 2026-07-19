import React, { useMemo } from 'react';
import { FiFileText, FiCheckCircle, FiClock, FiEdit2, FiTrash2 } from 'react-icons/fi';
import ActionIconButton from '@/components/common/ActionIconButton';
import AntTable from '@/components/common/AntTable';

export default function AdminBlogTable({ blogs, loading, handleOpenModal, handleDelete }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa xuất bản';
        return new Intl.DateTimeFormat('vi-VN', { 
            day: '2-digit', month: '2-digit', year: 'numeric'
        }).format(new Date(dateString));
    };

    const columns = useMemo(() => [
        {
            title: 'Tiêu đề',
            key: 'title',
            width: 250,
            render: (_, blog) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#b5624a]/10 flex items-center justify-center text-[#b5624a] flex-shrink-0">
                        <FiFileText size={18} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 line-clamp-1">{blog.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{blog.slug}</p>
                    </div>
                </div>
            )
        },
        {
            title: 'Danh mục',
            dataIndex: 'categoryName',
            width: 150,
            render: (categoryName) => (
                categoryName ? (
                    <span className="inline-flex px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium">
                        {categoryName}
                    </span>
                ) : (
                    <span className="text-gray-400 italic text-xs">Chưa có</span>
                )
            ),
            sorter: (a, b) => (a.categoryName || '').localeCompare(b.categoryName || '')
        },
        {
            title: 'Tác giả',
            dataIndex: 'authorName',
            width: 150,
            render: (authorName) => <span className="text-sm text-gray-700">{authorName}</span>
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 180,
            render: (_, blog) => (
                <div>
                    {blog.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                            <FiCheckCircle size={12} /> Đã xuất bản
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
                            <FiClock size={12} /> Bản nháp
                        </span>
                    )}
                    {blog.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100 mt-1 block w-fit">
                            📌 Đã ghim
                        </span>
                    )}
                </div>
            ),
            filters: [
                { text: 'Đã xuất bản', value: true },
                { text: 'Bản nháp', value: false }
            ],
            onFilter: (value, record) => record.isPublished === value
        },
        {
            title: 'Ngày xuất bản',
            dataIndex: 'publishedAt',
            width: 150,
            render: (publishedAt) => <span className="text-sm text-gray-500">{formatDate(publishedAt)}</span>,
            sorter: (a, b) => new Date(a.publishedAt || 0) - new Date(b.publishedAt || 0)
        },
        {
            title: 'Thao Tác',
            key: 'action',
            width: 100,
            align: 'right',
            render: (_, blog) => (
                <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity">
                    <ActionIconButton 
                        icon={FiEdit2} 
                        onClick={() => handleOpenModal(blog)} 
                        title="Sửa"
                    />
                    <ActionIconButton 
                        icon={FiTrash2} 
                        variant="delete" 
                        onClick={() => handleDelete(blog.id)} 
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
                dataSource={blogs}
                loading={loading}
                emptyMessage="Không tìm thấy bài viết nào"
                pagination={false}
            />
        </div>
    );
}
