import React, { useMemo } from 'react';
import { FiStar, FiCheckCircle, FiTrash2, FiEyeOff } from 'react-icons/fi';
import StatusBadge from '@/components/common/StatusBadge';
import ActionIconButton from '@/components/common/ActionIconButton';
import DataTable from '@/components/common/DataTable';

export default function ReviewTable({ reviews, filteredReviews, loading, openConfirm }) {
    const columns = useMemo(() => [
        {
            headerName: 'Khách hàng',
            field: 'customer',
            width: '250px',
            cellRenderer: (review) => (
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
            )
        },
        {
            headerName: 'Đánh giá',
            field: 'review',
            flex: 1,
            minWidth: '300px',
            cellRenderer: (review) => (
                <div className="max-w-xs py-2">
                    <div className="flex text-yellow-400 mb-1">
                        {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={i < review.stars ? 'fill-current' : 'text-gray-300'} size={14} />
                        ))}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{review.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">{review.content}</p>
                    {review.imageUrls?.length > 0 && (
                        <div className="flex gap-1 mt-2">
                            {review.imageUrls.map((img, i) => (
                                <img key={i} src={img} alt="review attachment" className="w-10 h-10 object-cover rounded border border-gray-200" />
                            ))}
                        </div>
                    )}
                </div>
            )
        },
        {
            headerName: 'Sản phẩm (ID)',
            field: 'product',
            width: '250px',
            cellRenderer: (review) => (
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
            headerName: 'Trạng thái',
            field: 'status',
            width: '150px',
            cellRenderer: (review) => (
                <StatusBadge 
                    status={review.isHidden} 
                    type="visibility" 
                    textOverrides={{ true: 'Chờ duyệt', false: 'Đã duyệt' }} 
                />
            )
        },
        {
            headerName: 'Thao Tác',
            width: '150px',
            headerClassName: 'justify-end text-right pr-0',
            cellRenderer: (review) => (
                <div className="flex items-center justify-end gap-1">
                    {review.isHidden ? (
                        <>
                            <ActionIconButton 
                                icon={FiCheckCircle} 
                                variant="toggle-on" 
                                onClick={() => openConfirm(review.id, 'TOGGLE', review.isHidden)} 
                                title="Phê duyệt đánh giá"
                            />
                            <ActionIconButton 
                                icon={FiTrash2} 
                                variant="delete" 
                                onClick={() => openConfirm(review.id, 'DELETE')} 
                                title="Không phê duyệt (Xóa)"
                            />
                        </>
                    ) : (
                        <>
                            <ActionIconButton 
                                icon={FiEyeOff} 
                                variant="toggle-off" 
                                onClick={() => openConfirm(review.id, 'TOGGLE', review.isHidden)} 
                                title="Ẩn đánh giá"
                            />
                            <ActionIconButton 
                                icon={FiTrash2} 
                                variant="delete" 
                                onClick={() => openConfirm(review.id, 'DELETE')} 
                                title="Xóa đánh giá"
                            />
                        </>
                    )}
                </div>
            )
        }
    ], [openConfirm]);

    return (
        <DataTable 
            columns={columns}
            data={filteredReviews}
            loading={loading}
            emptyMessage="Không có đánh giá nào"
            rowClassName={(row) => (row.isHidden ? 'opacity-50 bg-gray-50' : '')}
        />
    );
}
