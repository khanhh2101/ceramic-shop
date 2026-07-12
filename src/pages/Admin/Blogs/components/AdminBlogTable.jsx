import React, { useMemo } from 'react';
import { FiFileText, FiCheckCircle, FiClock, FiEdit2, FiTrash2 } from 'react-icons/fi';
import ActionIconButton from '@/components/common/ActionIconButton';
import DataTable from '@/components/common/DataTable';

export default function AdminBlogTable({ blogs, loading, handleOpenModal, handleDelete }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa xuất bản';
        return new Intl.DateTimeFormat('vi-VN', { 
            day: '2-digit', month: '2-digit', year: 'numeric'
        }).format(new Date(dateString));
    };

    const columns = useMemo(() => [
        {
            headerName: 'Tiêu đề',
            field: 'title',
            flex: 1,
            minWidth: '250px',
            cellRenderer: (blog) => (
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
            headerName: 'Danh mục',
            field: 'categoryName',
            width: '150px',
            cellRenderer: (blog) => (
                blog.categoryName ? (
                    <span className="inline-flex px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium">
                        {blog.categoryName}
                    </span>
                ) : (
                    <span className="text-gray-400 italic text-xs">Chưa có</span>
                )
            )
        },
        {
            headerName: 'Tác giả',
            field: 'authorName',
            width: '150px',
            cellClassName: 'text-sm text-gray-700'
        },
        {
            headerName: 'Trạng thái',
            field: 'status',
            width: '180px',
            cellRenderer: (blog) => (
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
            )
        },
        {
            headerName: 'Ngày xuất bản',
            field: 'publishedAt',
            width: '150px',
            cellClassName: 'text-sm text-gray-500',
            cellRenderer: (blog) => formatDate(blog.publishedAt)
        },
        {
            headerName: 'Thao Tác',
            width: '100px',
            headerClassName: 'justify-end pr-0 text-right',
            cellRenderer: (blog) => (
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
        <DataTable 
            columns={columns}
            data={blogs}
            loading={loading}
            emptyMessage="Không tìm thấy bài viết nào"
        />
    );
}
