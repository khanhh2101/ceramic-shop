import React from 'react';
import { FiX } from 'react-icons/fi';
import Modal from '@/components/common/Modal';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5 flex justify-between items-center">
                                <span>Mã Coupon <span className="text-red-500">*</span></span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
                                        setFormData({...formData, code});
                                    }}
                                    className="text-xs text-[#b5624a] hover:underline"
                                >
                                    Tạo ngẫu nhiên
                                </button>
                            </label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none uppercase"
                                required
                                placeholder="VD: TET2024"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Áp dụng cho <span className="text-red-500">*</span></label>
                            <Select
                                value={formData.isShippingDiscount ? "true" : "false"}
                                onValueChange={(val) => setFormData({...formData, isShippingDiscount: val === "true"})}
                            >
                                <SelectTrigger className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 h-[46px] focus:ring-2 focus:ring-[#b5624a] outline-none">
                                    <SelectValue placeholder="Chọn loại áp dụng" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="false">Đơn hàng (Sản phẩm)</SelectItem>
                                    <SelectItem value="true">Phí vận chuyển</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Loại giảm giá <span className="text-red-500">*</span></label>
                            <Select
                                value={formData.type.toString()}
                                onValueChange={(val) => setFormData({...formData, type: parseInt(val)})}
                            >
                                <SelectTrigger className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 h-[46px] focus:ring-2 focus:ring-[#b5624a] outline-none">
                                    <SelectValue placeholder="Chọn loại giảm giá" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="0">Giảm theo Phần trăm (%)</SelectItem>
                                    <SelectItem value="1">Giảm Số tiền cố định (VNĐ)</SelectItem>
                                </SelectContent>
                            </Select>
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

                        <div className="md:col-span-2 pt-2 border-t border-gray-100">
                            <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={formData.isPublic}
                                        onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b5624a]"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Áp dụng tất cả (Công khai)</p>
                                    <p className="text-xs text-gray-500">Mã sẽ xuất hiện trong danh sách mã giảm giá để khách hàng dễ dàng chọn khi thanh toán.</p>
                                </div>
                            </label>
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
