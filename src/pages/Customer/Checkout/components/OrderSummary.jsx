export default function OrderSummary({
    cartItems,
    cartTotal,
    shippingFee,
    discountAmount,
    grandTotal,
    isSubmitting,
    couponCode,
    setCouponCode,
    appliedCoupon,
    isApplyingCoupon,
    onApplyCoupon,
    onRemoveCoupon
}) {
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
                                {item.productCode && <span>SKU: {item.productCode}</span>}
                                {item.productCode && item.color && <span>|</span>}
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
                        <input 
                            type="text" 
                            placeholder="Mã giảm giá" 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            disabled={!!appliedCoupon || isApplyingCoupon}
                            className="flex-1 border border-[#d8d0c4] px-3 py-2 text-[13px] bg-white outline-none focus:border-[#b5624a] disabled:bg-gray-100 disabled:text-gray-500 uppercase"
                        />
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
                
                {appliedCoupon && (
                    <div className="flex justify-between py-2 text-[14px] text-green-600 border-b border-[#d8d0c4] pb-4">
                        <span>Giảm giá (Mã: {appliedCoupon})</span>
                        <span>-{discountAmount.toLocaleString('vi-VN')} ₫</span>
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
