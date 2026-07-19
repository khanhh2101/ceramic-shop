import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function OrderSummary({
    cartItems,
    cartTotal,
    shippingFee,
    orderDiscountAmount,
    shippingDiscountAmount,
    grandTotal,
    isSubmitting,
    couponCode,
    setCouponCode,
    appliedCoupon,
    isApplyingCoupon,
    onApplyCoupon,
    onRemoveCoupon,
    publicCoupons = []
}) {
    const [isManualInput, setIsManualInput] = useState(publicCoupons.length === 0);

    return (
        <div className="bg-[#eee8df] p-8 sticky top-6 shadow-sm">
            <h3 className="text-[22px] mb-5 text-[#1a1a1a] pb-4 border-b border-[#d8d0c4] font-display">
                Đơn hàng của bạn
            </h3>
            
            <div className="mb-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                    <div key={item.id || item.productId} className="flex items-center gap-3 py-3 border-b border-[#d8d0c4]">
                        <div className="w-14 h-14 bg-white shrink-0 rounded-sm overflow-hidden">
                            <img 
                                src={item.productImageUrl || 'https://placehold.co/600x800/eeeeee/999999?text=Gom+Nau'} 
                                alt={item.productName} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-[13px] text-[#1a1a1a] mb-1 line-clamp-2 font-display">
                                {item.productName}
                            </p>
                            <div className="text-[11px] text-[#888] mb-1 flex items-center gap-1.5 flex-wrap">
                                {item.sku ? <span>SKU: {item.sku}</span> : (item.productCode && <span>SKU: {item.productCode}</span>)}
                                {(item.sku || item.productCode) && item.color && <span>|</span>}
                                {item.color && <span>Màu: <span className="capitalize">{item.color}</span></span>}
                            </div>
                            <p className="text-[12px] text-[#888]">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-[14px] text-[#b5624a] font-medium font-display">
                            {((item.price || 0) * item.quantity).toLocaleString('vi-VN')} ₫
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-[#d8d0c4] pt-4 mt-2">
                {/* ── MÃ GIẢM GIÁ ── */}
                <div className="mb-4">
                    <div className="flex gap-2">
                        {(!isManualInput && publicCoupons.length > 0) ? (
                            <div className="flex-1">
                                <Select
                                    value={couponCode}
                                    onValueChange={(val) => {
                                        if (val === 'MANUAL') {
                                            setIsManualInput(true);
                                            setCouponCode('');
                                        } else {
                                            setCouponCode(val);
                                        }
                                    }}
                                    disabled={!!appliedCoupon || isApplyingCoupon}
                                >
                                    <SelectTrigger className="w-full bg-white border border-[#d8d0c4] text-gray-900 text-[13px] rounded-none py-2 h-[38px] outline-none shadow-none uppercase">
                                        <SelectValue placeholder="Chọn mã giảm giá..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white rounded-none border-[#d8d0c4]">
                                        {publicCoupons.map(coupon => {
                                            const isEligible = cartTotal >= coupon.minOrderAmount;
                                            return (
                                                <SelectItem 
                                                    key={coupon.id} 
                                                    value={coupon.code} 
                                                    disabled={!isEligible}
                                                    className="text-[13px] uppercase"
                                                >
                                                    <div className="flex flex-col gap-0.5">
                                                        <span>{coupon.code} - {coupon.isShippingDiscount ? 'Ship' : 'Đơn'} {coupon.type === 0 ? `-${coupon.value}%` : `-${coupon.value.toLocaleString('vi-VN')}đ`}</span>
                                                        {!isEligible && (
                                                            <span className="text-[10px] text-red-500 normal-case">
                                                                (Đơn tối thiểu {coupon.minOrderAmount.toLocaleString('vi-VN')}đ)
                                                            </span>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                        <SelectItem value="MANUAL" className="text-[13px] font-medium text-[#b5624a]">
                                            + NHẬP MÃ KHÁC...
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <div className="flex-1 flex gap-2 relative">
                                <input 
                                    type="text" 
                                    placeholder="Nhập mã giảm giá..." 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    disabled={!!appliedCoupon || isApplyingCoupon}
                                    className="flex-1 border border-[#d8d0c4] px-3 py-2 text-[13px] bg-white outline-none focus:border-[#b5624a] disabled:bg-gray-100 disabled:text-gray-500 uppercase w-full"
                                />
                                {publicCoupons.length > 0 && !appliedCoupon && (
                                    <button 
                                        type="button" 
                                        onClick={() => setIsManualInput(false)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 hover:text-[#b5624a] underline"
                                    >
                                        Chọn mã
                                    </button>
                                )}
                            </div>
                        )}
                        {appliedCoupon ? (
                            <button 
                                type="button"
                                onClick={onRemoveCoupon}
                                className="px-4 py-2 bg-red-500 text-white text-[12px] uppercase tracking-wider hover:bg-red-600 transition-colors"
                            >
                                Hủy
                            </button>
                        ) : (
                            <button 
                                type="button"
                                onClick={onApplyCoupon}
                                disabled={!couponCode.trim() || isApplyingCoupon}
                                className="px-4 py-2 bg-[#b5624a] text-white text-[12px] uppercase tracking-wider hover:bg-[#a05540] disabled:opacity-70 transition-colors"
                            >
                                {isApplyingCoupon ? '...' : 'Áp dụng'}
                            </button>
                        )}
                    </div>
                </div>


                <div className="flex justify-between py-2 text-[14px] text-[#555]">
                    <span>Tạm tính</span>
                    <span>{cartTotal.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between py-2 text-[14px] text-[#555] border-b border-[#d8d0c4] pb-4">
                    <span>Phí vận chuyển</span>
                    <span>{shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')} ₫`}</span>
                </div>
                
                {appliedCoupon && orderDiscountAmount > 0 && (
                    <div className="flex justify-between py-2 text-[14px] text-green-600 border-b border-[#d8d0c4] pb-2">
                        <span>Giảm giá (Mã: {appliedCoupon})</span>
                        <span>-{orderDiscountAmount.toLocaleString('vi-VN')} ₫</span>
                    </div>
                )}
                {appliedCoupon && shippingDiscountAmount > 0 && (
                    <div className="flex justify-between py-2 text-[14px] text-green-600 border-b border-[#d8d0c4] pb-2">
                        <span>Giảm phí vận chuyển (Mã: {appliedCoupon})</span>
                        <span>-{shippingDiscountAmount.toLocaleString('vi-VN')} ₫</span>
                    </div>
                )}
                
                <div className="flex justify-between pt-5 mt-2 text-[22px] text-[#1a1a1a] font-display">
                    <span>Tổng cộng</span>
                    <span className="text-[var(--terracotta)]">{grandTotal.toLocaleString('vi-VN')} ₫</span>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#1a1a1a] text-white text-[12px] tracking-[2px] uppercase mt-6
                           transition-colors duration-200 hover:bg-[#444] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
        </div>
    );
}
