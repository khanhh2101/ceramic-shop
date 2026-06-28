import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSearch, FiTag, FiClock, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import api from '@/services/api';
import ActionIconButton from '@/components/common/ActionIconButton';
import Button from '@/components/common/Button';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 0, // 0: Percent, 1: FixedAmount
    value: '',
    minOrderAmount: '0',
    maxDiscountAmount: '',
    usageLimit: '-1',
    expiresAt: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/coupons');
      setCoupons(res.data.data || []);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      code: '', type: 0, value: '', minOrderAmount: '0', 
      maxDiscountAmount: '', usageLimit: '-1', expiresAt: ''
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
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null
    };

    try {
      await api.post('/coupons', payload);
      toast.success('Tạo mã giảm giá thành công');
      handleCloseModal();
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi tạo mã');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn vô hiệu hóa mã giảm giá này?')) {
      try {
        await api.delete(`/coupons/${id}`);
        toast.success('Đã vô hiệu hóa mã');
        fetchCoupons();
      } catch (err) {
        toast.error('Lỗi khi vô hiệu hóa mã');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không hết hạn';
    return new Intl.DateTimeFormat('vi-VN', { 
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateString));
  };

  const filteredCoupons = coupons.filter(c => 
    c.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 space-y-6 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Mã Giảm Giá</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý các chương trình khuyến mãi</p>
        </div>
        <Button variant="primary" icon={FiPlus} onClick={() => handleOpenModal()}>
          Tạo mã mới
        </Button>
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
            placeholder="Tìm kiếm mã giảm giá (VD: TET2024)..."
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
                  <th className="px-6 py-4 font-medium">Mã Coupon</th>
                  <th className="px-6 py-4 font-medium">Giảm giá</th>
                  <th className="px-6 py-4 font-medium">Sử dụng</th>
                  <th className="px-6 py-4 font-medium">Trạng thái / Hạn SD</th>
                  <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCoupons.length > 0 ? filteredCoupons.map((coupon) => {
                  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                  const isExhausted = coupon.usageLimit !== -1 && coupon.usedCount >= coupon.usageLimit;
                  const isActive = coupon.isActive && !isExpired && !isExhausted;

                  return (
                    <tr key={coupon.id} className={`hover:bg-gray-50/50 transition-colors group ${!isActive ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                            <FiTag size={18} />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 tracking-wider bg-gray-100 px-2 py-0.5 rounded text-sm">{coupon.code}</span>
                            <p className="text-xs text-gray-500 mt-1">Đơn tối thiểu: {formatCurrency(coupon.minOrderAmount)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#b5624a]">
                          {coupon.type === 0 ? `Giảm ${coupon.value}%` : `Giảm ${formatCurrency(coupon.value)}`}
                        </p>
                        {coupon.type === 0 && coupon.maxDiscountAmount > 0 && (
                          <p className="text-xs text-gray-500 mt-0.5">Tối đa: {formatCurrency(coupon.maxDiscountAmount)}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-sm">
                          <span className="font-medium text-gray-900">{coupon.usedCount} lần</span>
                          <span className="text-xs text-gray-500">Giới hạn: {coupon.usageLimit === -1 ? 'Không giới hạn' : `${coupon.usageLimit} lần`}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
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
                      </td>
                      <td className="px-6 py-4 text-right">
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
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                      Không tìm thấy mã giảm giá nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL THÊM MỚI */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        contentClassName="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-fade-in-up"
      >
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900 font-display">Tạo mã giảm giá mới</h3>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              <form id="couponForm" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">Mã Coupon (VD: TET2024) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none uppercase"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">Loại giảm giá <span className="text-red-500">*</span></label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                    >
                      <option value="0">Giảm theo Phần trăm (%)</option>
                      <option value="1">Giảm Số tiền cố định (VNĐ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                      Mức giảm ({formData.type == 0 ? '%' : 'VNĐ'}) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                      required
                    />
                  </div>
                  
                  {formData.type == 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1.5">Giảm tối đa (VNĐ)</label>
                      <input
                        type="number"
                        value={formData.maxDiscountAmount}
                        onChange={(e) => setFormData({...formData, maxDiscountAmount: e.target.value})}
                        className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                        placeholder="Để trống nếu không giới hạn"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">Đơn tối thiểu để áp dụng (VNĐ)</label>
                    <input
                      type="number"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">Giới hạn số lần dùng</label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                      placeholder="-1 là không giới hạn"
                    />
                    <p className="text-xs text-gray-500 mt-1">Nhập -1 nếu không giới hạn số lượng.</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">Ngày hết hạn</label>
                    <input
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Để trống nếu mã giảm giá vô thời hạn.</p>
                  </div>
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                type="button" 
                onClick={handleCloseModal}
                className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit"
                form="couponForm"
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#b5624a] hover:bg-[#9a513b] rounded-xl transition-colors"
              >
                Tạo mã giảm giá
              </button>
            </div>
      </Modal>

    </div>
  );
}
