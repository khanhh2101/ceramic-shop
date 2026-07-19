import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSmartFilter } from '@/hooks/useSmartFilter';
import { FiPlus, FiTrash2, FiSearch, FiRefreshCw, FiTag, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ActionIconButton from '@/components/common/ActionIconButton';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import { couponApi } from './api/couponApi';
import { formatCurrency, formatDate } from '@/utils';
import CouponModal from './components/CouponModal';
import { getErrorMessage } from '@/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAdminCoupons } from '@/pages/Admin/Coupons/hooks/useAdminCoupons';

export default function AdminCoupons() {
  const queryClient = useQueryClient();
  const {
      pageIndex, pageSize, searchTerm, searchInput, setSearchInput,
      filters, setFilter, setPageIndex, clearFilters, handleSearchImmediate
  } = useSmartFilter({
      status: ''
  });

  const statusFilter = filters.status;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 0,
    value: '',
    minOrderAmount: '0',
    maxDiscountAmount: '',
    usageLimit: '-1',
    expiresAt: '',
    isShippingDiscount: false,
    isPublic: false
  });

  const invalidateCouponCaches = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    queryClient.invalidateQueries({ queryKey: ['coupons'] });
  };

  const { data: couponsData, isLoading: loading } = useAdminCoupons({
      pageIndex,
      pageSize,
      search: searchTerm.trim() || undefined,
      isActive: statusFilter !== '' ? statusFilter === 'true' : undefined
  });

  const coupons = couponsData?.items || [];
  const totalPages = couponsData?.totalPages || 1;

  const handleOpenModal = () => {
    setFormData({
      code: '', type: 0, value: '', minOrderAmount: '0', 
      maxDiscountAmount: '', usageLimit: '-1', expiresAt: '',
      isShippingDiscount: false, isPublic: false
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.value) {
      toast.error('Vui lòng nhập mã và giá trị giảm');
      return;
    }

    const payload = {
      code: formData.code.toUpperCase(),
      type: parseInt(formData.type),
      value: parseFloat(formData.value),
      minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
      maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
      usageLimit: parseInt(formData.usageLimit) || -1,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
      isShippingDiscount: formData.isShippingDiscount,
      isPublic: formData.isPublic
    };

    try {
      await couponApi.create(payload);
      toast.success('Tạo mã giảm giá thành công');
      handleCloseModal();
      invalidateCouponCaches();
    } catch (err) {
      /* toast handled by api */
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn vô hiệu hóa mã giảm giá này?')) {
      try {
        await couponApi.delete(id);
        toast.success('Đã vô hiệu hóa mã');
        invalidateCouponCaches();
      } catch (err) {
        toast.error('Lỗi khi vô hiệu hóa mã');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchImmediate();
  };

  return (
    <div className="flex flex-col h-full space-y-4 p-2 relative">
      {/* HEADER */}
      <div className="flex-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Mã Giảm Giá</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý các chương trình khuyến mãi</p>
        </div>
        <Button variant="primary" icon={FiPlus} onClick={handleOpenModal}>
          Tạo mã mới
        </Button>
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
                  placeholder="Tìm kiếm mã giảm giá (VD: TET2024)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
              />
          </div>

          {/* Specific Filters */}
          <div className="w-full lg:w-auto">
              <Select
                  value={statusFilter}
                  onValueChange={(val) => setFilter('status', val === "all" ? "" : val)}
              >
                  <SelectTrigger className="w-full lg:w-[180px] bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 h-[42px] focus:ring-2 focus:ring-[#b5624a] outline-none">
                      <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="true">Đang hoạt động</SelectItem>
                      <SelectItem value="false">Không khả dụng</SelectItem>
                  </SelectContent>
              </Select>
          </div>

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

      {/* TABLE & PAGINATION */}
      <div className="flex-1 overflow-hidden flex flex-col space-y-4">
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden max-h-[calc(100vh-180px)]">
            {/* HEADER */}
            <div className="flex items-center py-3 px-6 bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0 min-w-max">
                <div className="w-[250px] shrink-0">Mã Coupon</div>
                <div className="w-[180px] shrink-0">Giảm giá</div>
                <div className="w-[150px] shrink-0">Sử dụng</div>
                <div className="flex-1 min-w-[200px] shrink-0">Trạng thái / Hạn SD</div>
                <div className="w-[100px] text-right shrink-0">Thao Tác</div>
            </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 flex-1">
              <div className="w-8 h-8 border-4 border-[#b5624a]/30 border-t-[#b5624a] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto custom-scrollbar">
                {coupons.length > 0 ? (
                    <div className="flex flex-col divide-y divide-gray-100 min-w-max">
                        {coupons.map((coupon) => {
                            const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                            const isExhausted = coupon.usageLimit !== -1 && coupon.usedCount >= coupon.usageLimit;
                            const isActive = coupon.isActive && !isExpired && !isExhausted;

                            return (
                            <div key={coupon.id} className={`flex items-center py-4 px-6 hover:bg-gray-50/50 transition-colors group ${!isActive ? 'opacity-60' : ''}`}>
                                <div className="w-[250px] shrink-0 pr-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <FiTag size={18} />
                                    </div>
                                    <div>
                                    <span className="font-bold text-gray-900 tracking-wider bg-gray-100 px-2 py-0.5 rounded text-sm">{coupon.code}</span>
                                    <div className="flex gap-1.5 mt-1">
                                        {coupon.isPublic && (
                                            <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium">Public</span>
                                        )}
                                        {coupon.isShippingDiscount ? (
                                            <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded font-medium">Vận chuyển</span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-medium">Đơn hàng</span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">Đơn tối thiểu: {formatCurrency(coupon.minOrderAmount)}</p>
                                    </div>
                                </div>
                                </div>
                                <div className="w-[180px] shrink-0 pr-4">
                                <p className="font-bold text-[#b5624a]">
                                    {coupon.type === 0 ? `Giảm ${coupon.value}%` : `Giảm ${formatCurrency(coupon.value)}`}
                                </p>
                                {coupon.type === 0 && coupon.maxDiscountAmount > 0 && (
                                    <p className="text-xs text-gray-500 mt-0.5">Tối đa: {formatCurrency(coupon.maxDiscountAmount)}</p>
                                )}
                                </div>
                                <div className="w-[150px] shrink-0 pr-4">
                                <div className="flex flex-col text-sm">
                                    <span className="font-medium text-gray-900">{coupon.usedCount} lần</span>
                                    <span className="text-xs text-gray-500">Giới hạn: {coupon.usageLimit === -1 ? 'Không giới hạn' : `${coupon.usageLimit} lần`}</span>
                                </div>
                                </div>
                                <div className="flex-1 min-w-[200px] shrink-0 pr-4">
                                <div className="flex flex-col gap-1.5">
                                    {isActive ? (
                                    <span className="inline-flex items-center w-fit px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                        Đang hoạt động
                                    </span>
                                    ) : (
                                    <span className="inline-flex items-center w-fit px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                        Không khả dụng
                                    </span>
                                    )}
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <FiClock size={12} />
                                    {formatDate(coupon.expiresAt)}
                                    </div>
                                </div>
                                </div>
                                <div className="w-[100px] shrink-0 text-right">
                                {coupon.isActive && (
                                    <div className="flex items-center justify-end opacity-100 transition-opacity">
                                    <ActionIconButton 
                                        icon={FiTrash2} 
                                        variant="delete" 
                                        onClick={() => handleDelete(coupon.id)} 
                                        title="Vô hiệu hóa"
                                    />
                                    </div>
                                )}
                                </div>
                            </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500 text-sm">
                        Không tìm thấy mã giảm giá nào
                    </div>
                )}
            </div>
          )}
        </div>

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

      <CouponModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
