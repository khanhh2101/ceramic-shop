import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleSelectItem, toggleSelectAll } from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function CartList({
    cartItems,
    selectedItemIds,
    isAllSelected,
    isAuth,
    handleRemove,
    handleQuantity
}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <div className="bg-white p-8 rounded-sm shadow-sm">
            <div className="hidden md:grid grid-cols-[30px_1fr_120px_120px_40px] gap-4 pb-4 border-b border-[#eee] text-[12px] uppercase tracking-[1.5px] text-[#888] items-center">
                <div>
                    <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-[#c4a882] cursor-pointer"
                        checked={isAllSelected}
                        onChange={() => dispatch(toggleSelectAll({ isAuth }))}
                    />
                </div>
                <div>Sản phẩm</div>
                <div className="text-center">Số lượng</div>
                <div className="text-right">Tạm tính</div>
                <div></div>
            </div>

            {cartItems.map(item => {
                // Xử lý chống lỗi casing hoặc thiếu data
                const stockQty = item.stockQuantity ?? item.StockQuantity ?? item.product?.stockQuantity ?? item.product?.StockQuantity ?? 99;
                const isActive = item.isActive ?? item.IsActive ?? item.product?.isActive ?? item.product?.IsActive ?? true;
                const itemId = item.id ?? item.Id ?? item.itemKey;
                
                const isOutOfStock = stockQty <= 0;
                const isInactive = isActive === false;
                const isDisabled = isOutOfStock || isInactive;
                
                return (
                <div key={itemId || item.productId} className={`grid grid-cols-[30px_1fr] md:grid-cols-[30px_1fr_120px_120px_40px] gap-4 py-6 border-b border-[#eee] items-center transition-opacity duration-300 ${isDisabled ? 'opacity-50 grayscale' : ''}`}>
                    {/* Checkbox */}
                    <div className="self-start md:self-center pt-2 md:pt-0">
                        <input 
                            type="checkbox" 
                            className="w-4 h-4 accent-[#c4a882] cursor-pointer disabled:cursor-not-allowed"
                            checked={selectedItemIds.includes(itemId)}
                            disabled={isDisabled}
                            onChange={() => {
                                if (isDisabled) return;
                                
                                // Auto decrease quantity if exceeding stock when selecting
                                if (!selectedItemIds.includes(itemId) && item.quantity > stockQty) {
                                    handleQuantity(item, 'set', stockQty);
                                    toast.success('Số lượng sản phẩm đã được cập nhật do thay đổi tồn kho');
                                }
                                dispatch(toggleSelectItem(itemId));
                            }}
                        />
                    </div>
                    
                    {/* SP */}
                    <div className="flex items-center gap-4 relative">
                        <div 
                            className="w-[100px] h-[100px] bg-[#f9f9f9] shrink-0 cursor-pointer overflow-hidden relative"
                            onClick={() => navigate(`/product/${item.productSlug || item.productId}`)}
                        >
                            <img 
                                src={item.productImageUrl || 'https://placehold.co/600x800/eeeeee/999999?text=Gom+Nau'} 
                                alt={item.productName} 
                                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 hover:scale-105"
                            />
                            {isDisabled && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="text-white text-[10px] uppercase tracking-wider font-medium px-2 py-1 bg-black/60 rounded-sm">
                                        {isInactive ? 'Ngừng bán' : 'Hết hàng'}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 
                                className="text-[14px] text-[#1a1a1a] cursor-pointer hover:text-[#b5624a] transition-colors m-0 mb-1 font-display"
                                onClick={() => navigate(`/product/${item.productSlug || item.productId}`)}
                            >
                                {item.productName}
                            </h3>
                            <div className="text-[12px] text-[#888] mb-1 flex items-center gap-2 flex-wrap">
                                {item.productCode && <span>SKU: {item.productCode}</span>}
                                {item.productCode && item.color && <span>|</span>}
                                {item.color && <span>Màu: <span className="capitalize">{item.color}</span></span>}
                            </div>
                            <div className="text-[13px] text-[#1a1a1a] font-medium">
                                {(item.price || 0).toLocaleString('vi-VN')} ₫
                            </div>
                        </div>
                    </div>

                    {/* Số lượng */}
                    <div className={`flex items-center justify-center border border-[#ddd] h-10 md:h-auto md:py-1 rounded-sm w-max md:w-full md:mx-auto ml-11 md:ml-0 col-span-2 md:col-span-1 ${isDisabled ? 'bg-gray-100' : 'bg-white'}`}>
                        <button 
                            onClick={() => handleQuantity(item, 'decrease')}
                            disabled={isDisabled || item.quantity <= 1}
                            className="w-8 text-[16px] text-[#888] hover:text-[#1a1a1a] disabled:hover:text-[#888] disabled:cursor-not-allowed transition-colors"
                        >-</button>
                        <span className="w-8 text-center text-[13px]">{item.quantity}</span>
                        <button 
                            onClick={() => handleQuantity(item, 'increase', stockQty)}
                            disabled={isDisabled || item.quantity >= stockQty}
                            className="w-8 text-[16px] text-[#888] hover:text-[#1a1a1a] disabled:hover:text-[#888] disabled:cursor-not-allowed transition-colors"
                        >+</button>
                    </div>

                    {/* Tổng */}
                    <div className="text-right text-[14px] text-[#1a1a1a] font-medium hidden md:block font-display">
                        {((item.price || 0) * item.quantity).toLocaleString('vi-VN')} ₫
                    </div>

                    {/* Xóa */}
                    <div className="text-right">
                        <button 
                            onClick={() => handleRemove(item)}
                            className="text-[18px] text-[#ccc] hover:text-[#b5624a] transition-colors"
                            title="Xóa sản phẩm"
                        >×</button>
                    </div>
                </div>
            )})}
        </div>
    );
}
