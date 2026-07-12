import React from 'react';
import { FiX } from 'react-icons/fi';
import Modal from '@/components/common/Modal';

export default function CouponModal({ 
    isOpen, 
    onClose, 
    formData, 
    setFormData, 
    handleSubmit 
}) {
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            contentClassName="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-fade-in-up"
        >
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900 font-display">Tạo mã giảm giá mới</h3>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
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
                    onClick={onClose}
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
    );
}
