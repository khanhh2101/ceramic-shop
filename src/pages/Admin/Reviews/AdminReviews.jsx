import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSmartFilter } from '@/hooks/useSmartFilter';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/common/ConfirmModal';
import Pagination from '@/components/common/Pagination';
import { adminReviewApi } from './api/adminReviewApi';
import ReviewTable from './components/ReviewTable';
import { useAdminReviews } from '@/pages/Admin/Reviews/hooks/useAdminReviews';

export default function AdminReviews() {
  const queryClient = useQueryClient();
  const {
      pageIndex, pageSize, searchTerm, searchInput, setSearchInput,
      filters, setFilter, setPageIndex, clearFilters, handleSearchImmediate
  } = useSmartFilter({
      rating: ''
  });

  const ratingFilter = filters.rating;
  
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    reviewId: null,
    actionType: null,
    isCurrentlyHidden: false,
    loading: false
  });

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const reviewId = queryParams.get('id');
    if (reviewId && !searchTerm) {
      setSearchInput(reviewId);
    }
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  const invalidateReviewCaches = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    queryClient.invalidateQueries({ queryKey: ['reviews'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }); // average rating might change
    queryClient.invalidateQueries({ queryKey: ['products'] });
    window.dispatchEvent(new Event('refreshNotifications'));
  };

  const { data: reviewsData, isLoading: loading } = useAdminReviews({
      pageIndex,
      pageSize,
      search: searchTerm.trim() || undefined,
      rating: ratingFilter !== '' ? parseInt(ratingFilter) : undefined
  });

  const reviews = reviewsData?.items || [];
  const totalPages = reviewsData?.totalPages || 1;

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
        const res = await adminReviewApi.toggleStatus(confirmState.reviewId);
        toast.success(res?.message || 'Đã thay đổi trạng thái');
      } else if (confirmState.actionType === 'DELETE') {
        const res = await adminReviewApi.deleteReview(confirmState.reviewId);
        toast.success(res?.message || 'Đã xóa đánh giá');
      }

      setConfirmState(prev => ({ ...prev, isOpen: false }));
      invalidateReviewCaches();
    } catch (err) {
      toast.error('Lỗi khi thao tác');
      setConfirmState(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchImmediate();
  };

  return (
    <div className="flex flex-col h-full space-y-4 p-2 relative">
      <div className="flex-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Đánh giá sản phẩm</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý các nhận xét từ khách hàng</p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex-none bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiSearch size={18} />
            </span>
            <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all"
                placeholder="Tìm kiếm đánh giá theo nội dung hoặc tên sản phẩm..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>

        {/* Specific Filters */}
        <div className="w-full lg:w-auto">
            <select
                value={ratingFilter}
                onChange={(e) => setFilter('rating', e.target.value)}
                className="w-full lg:w-auto bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
            >
                <option value="">Tất cả số sao</option>
                <option value="5">5 Sao</option>
                <option value="4">4 Sao</option>
                <option value="3">3 Sao</option>
                <option value="2">2 Sao</option>
                <option value="1">1 Sao</option>
            </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
            <button 
                onClick={handleSearchImmediate}
                className="flex-1 lg:flex-none bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
                <FiSearch size={16} />
                Tìm kiếm
            </button>
            <button 
                onClick={clearFilters}
                className="flex-1 lg:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                title="Làm mới bộ lọc"
            >
                <FiRefreshCw size={16} />
                Làm mới
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          <ReviewTable 
              reviews={reviews}
              filteredReviews={reviews}
              loading={loading}
              openConfirm={openConfirm}
          />

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex-none bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-center">
              <Pagination 
                  currentPage={pageIndex}
                  totalPages={totalPages}
                  onPageChange={(page) => setPageIndex(page)}
              />
          </div>
        )}
      </div>

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
