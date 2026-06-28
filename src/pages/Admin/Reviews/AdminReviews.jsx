import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiSearch, FiStar, FiEyeOff, FiEye, FiMessageSquare, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import ConfirmModal from '../../../components/common/ConfirmModal';
import StatusBadge from '../../../components/common/StatusBadge';
import ActionIconButton from '../../../components/common/ActionIconButton';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    reviewId: null,
    actionType: null, // 'TOGGLE' | 'DELETE'
    isCurrentlyHidden: false,
    loading: false
  });

  const location = useLocation();

  useEffect(() => {
    fetchReviews();
  }, [page]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const reviewId = queryParams.get('id');
    if (reviewId) {
      setSearchTerm(reviewId);
    }
  }, [location.search]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reviews/admin', { params: { page, pageSize: 50 } });
      setReviews(res.data.data || []);
      setTotalPages(Math.ceil((res.data.totalCount || 0) / 50) || 1);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const openConfirm = (id, actionType, isCurrentlyHidden = false) => {
    setConfirmState({
      isOpen: true,
      reviewId: id,
      actionType,
      isCurrentlyHidden,
      loading: false
    });
  };

  const executeAction = async () => {
    try {
      setConfirmState(prev => ({ ...prev, loading: true }));
      
      if (confirmState.actionType === 'TOGGLE') {
        const res = await api.patch(`/reviews/${confirmState.reviewId}/toggle`);
        toast.success(res.data?.message || 'Đã thay đổi trạng thái');
      } else if (confirmState.actionType === 'DELETE') {
        const res = await api.delete(`/reviews/${confirmState.reviewId}`);
        toast.success(res.data?.message || 'Đã xóa đánh giá');
      }

      setConfirmState(prev => ({ ...prev, isOpen: false }));
      fetchReviews();
    } catch (err) {
      toast.error('Lỗi khi thao tác');
      setConfirmState(prev => ({ ...prev, isOpen: false }));
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.content?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id?.toString() === searchTerm
  );

  return (
    <div className="p-2 space-y-6 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Đánh giá sản phẩm</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý các nhận xét từ khách hàng</p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={18} />
          </span>
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all"
            placeholder="Tìm theo tên KH hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-[#b5624a]/30 border-t-[#b5624a] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Khách hàng</th>
                  <th className="px-6 py-4 font-medium">Đánh giá</th>
                  <th className="px-6 py-4 font-medium">Sản phẩm (ID)</th>
                  <th className="px-6 py-4 font-medium">Trạng thái</th>
                  <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReviews.length > 0 ? filteredReviews.map((review) => (
                  <tr key={review.id} className={`hover:bg-gray-50/50 transition-colors group ${review.isHidden ? 'opacity-50 bg-gray-50' : ''}`}>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4 max-w-xs">
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
                    </td>
                    <td className="px-6 py-4">
                      {review.productName ? (
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
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge 
                        status={review.isHidden} 
                        type="visibility" 
                        textOverrides={{ true: 'Chờ duyệt', false: 'Đã duyệt' }} 
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
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
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                      Không có đánh giá nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Trang trước
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700 flex items-center">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Trang sau
            </button>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal 
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={executeAction}
        title={
          confirmState.actionType === 'DELETE' ? (confirmState.isCurrentlyHidden ? 'Từ chối đánh giá' : 'Xóa Đánh Giá') :
          confirmState.isCurrentlyHidden ? 'Duyệt Đánh Giá' : 'Ẩn Đánh Giá'
        }
        message={
          confirmState.actionType === 'DELETE' ? 'Bạn có chắc chắn muốn xóa đánh giá này vĩnh viễn không? Hành động này không thể hoàn tác.' :
          confirmState.isCurrentlyHidden ? 'Bạn có chắc chắn muốn duyệt và hiển thị đánh giá này trên cửa hàng không?' : 'Bạn có chắc chắn muốn ẩn đánh giá này khỏi cửa hàng không?'
        }
        confirmText={
          confirmState.actionType === 'DELETE' ? (confirmState.isCurrentlyHidden ? 'Từ chối & Xóa' : 'Xóa') :
          confirmState.isCurrentlyHidden ? 'Phê duyệt' : 'Ẩn'
        }
        type={
          confirmState.actionType === 'DELETE' ? 'danger' :
          confirmState.isCurrentlyHidden ? 'success' : 'warning'
        }
        isLoading={confirmState.loading}
      />
    </div>
  );
}
