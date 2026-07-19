import React, { useMemo } from 'react';
import { FiStar, FiCheckCircle, FiTrash2, FiEyeOff } from 'react-icons/fi';
import StatusBadge from '@/components/common/StatusBadge';
import ActionIconButton from '@/components/common/ActionIconButton';
import AntTable from '@/components/common/AntTable';

export default function ReviewTable({ reviews, filteredReviews, loading, openConfirm }) {
    const columns = useMemo(() => [
        {
            title: 'Khách hàng',
            key: 'customer',
            width: 250,
            render: (_, review) => (
                <div className="flex items-center gap-3">
                    <img 
                        src={review.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}`} 
                        alt="Avatar" 
                        className="w-10 h-10 rounded-full border border-gray-200"
                    />
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{review.userName}</p>
                        <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                </div>
            ),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        },
        {
            title: 'Đánh giá',
            key: 'review',
            width: 300,
            render: (_, review) => (
                <div className="max-w-xs py-2">
                    <div className="flex text-yellow-400 mb-1">
                        {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={i < review.stars ? 'fill-current' : 'text-gray-300'} size={14} />
                        ))}
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-3 mt-0.5">{review.content}</p>
                    {review.imageUrls?.length > 0 && (
                        <div className="flex gap-1 mt-2">
                            {review.imageUrls.map((img, i) => (
                                <img key={i} src={img} alt="review attachment" className="w-10 h-10 object-cover rounded border border-gray-200" />
                            ))}
                        </div>
                    )}
                </div>
            ),
            sorter: (a, b) => a.stars - b.stars,
            filters: [
                { text: '5 Sao', value: 5 },
                { text: '4 Sao', value: 4 },
                { text: '3 Sao', value: 3 },
                { text: '2 Sao', value: 2 },
                { text: '1 Sao', value: 1 }
            ],
            onFilter: (value, record) => record.stars === value
        },
        {
            title: 'Sản phẩm (ID)',
            key: 'product',
            width: 250,
            render: (_, review) => (
                review.productName ? (
                    <div className="flex items-center gap-3">
                        {review.productImageUrl && (
                            <img src={review.productImageUrl} alt={review.productName} className="w-12 h-12 rounded object-cover border border-gray-200" />
                        )}
                        <div>
                            <a 
                                href={`/product/${review.productSlug}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-sm font-semibold text-[#b5624a] hover:underline"
                            >
                                {review.productName}
                            </a>
                            <p className="text-xs text-gray-500 mt-0.5">ID: {review.productId}</p>
                        </div>
                    </div>
                ) : (
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">ID: {review.productId}</span>
                )
            )
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 150,
            render: (_, review) => (
                <StatusBadge 
                    status={review.isHidden} 
                    type="visibility" 
                    textOverrides={{ true: 'Chờ phê duyệt', false: 'Đã phê duyệt' }} 
                />
            ),
            filters: [
                { text: 'Đã duyệt', value: false },
                { text: 'Chờ duyệt (Ẩn)', value: true }
            ],
            onFilter: (value, record) => record.isHidden === value
        },
        {
            title: 'Thao Tác',
            key: 'action',
            width: 150,
            align: 'right',
            fixed: 'right',
            render: (_, review) => (
                <div className="flex items-center justify-end gap-1">
                    {review.isHidden ? (
                        <>
                            <button 
                                onClick={() => openConfirm(review.id, 'TOGGLE', review.isHidden)} 
                                className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-green-200 shadow-sm transition-colors whitespace-nowrap"
                            >
                                <FiCheckCircle size={14} /> Phê duyệt
                            </button>
                            <button 
                                onClick={() => openConfirm(review.id, 'DELETE', review.isHidden)} 
                                className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-red-200 shadow-sm transition-colors whitespace-nowrap"
                            >
                                <FiTrash2 size={14} /> Từ chối
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => openConfirm(review.id, 'TOGGLE', review.isHidden)} 
                                className="px-3 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-orange-200 shadow-sm transition-colors whitespace-nowrap"
                            >
                                <FiEyeOff size={14} /> Ẩn đi
                            </button>
                            <button 
                                onClick={() => openConfirm(review.id, 'DELETE', review.isHidden)} 
                                className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-red-200 shadow-sm transition-colors whitespace-nowrap"
                            >
                                <FiTrash2 size={14} /> Xóa
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ], [openConfirm]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <AntTable 
                columns={columns}
                dataSource={filteredReviews}
                loading={loading}
                emptyMessage="Không có đánh giá nào"
                pagination={false}
                rowClassName={(record) => (record.isHidden ? 'opacity-50 bg-gray-50' : '')}
            />
        </div>
    );
}
