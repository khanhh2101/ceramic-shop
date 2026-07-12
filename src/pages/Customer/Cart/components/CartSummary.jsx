export default function CartSummary({
    selectedItemsCount,
    selectedTotal,
    handleCheckout,
    isValidating
}) {
    return (
        <div className="bg-[#eee8df] p-8 shadow-sm h-fit sticky top-24">
            <h2 className="text-[20px] mb-6 text-[#1a1a1a] border-b border-[#d8d0c4] pb-4 font-display">
                Tóm tắt đơn hàng
            </h2>
            
            <div className="flex justify-between py-2 text-[14px] text-[#555]">
                <span>Tạm tính ({selectedItemsCount} sản phẩm)</span>
                <span>{selectedTotal.toLocaleString('vi-VN')} ₫</span>
            </div>
            
            <div className="flex justify-between pt-6 mt-4 border-t border-[#d8d0c4] text-[22px] text-[#1a1a1a] font-display">
                <span>Tổng cộng</span>
                <span className="text-[var(--terracotta)]">{selectedTotal.toLocaleString('vi-VN')} ₫</span>
            </div>

            <button 
                onClick={handleCheckout}
                disabled={isValidating}
                className="w-full mt-8 py-4 bg-[#1a1a1a] text-white text-[12px] uppercase tracking-[2px] transition-colors hover:bg-[#444] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isValidating ? 'Đang kiểm tra giỏ hàng...' : 'Tiến hành thanh toán'}
            </button>
        </div>
    );
}
