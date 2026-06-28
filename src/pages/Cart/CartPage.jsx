import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import { 
    selectCartItems, 
    removeCartItem, 
    removeGuestCartItem, 
    updateCartItem, 
    updateGuestCartItem,
    selectCartLoading,
    toggleSelectItem,
    toggleSelectAll,
    selectSelectedCartItems,
    selectSelectedCartTotal,
    selectIsAllSelected,
    selectSelectedItemIds
} from '../../store/slices/cartSlice';
import { orderService } from '../../services';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function CartPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuthenticated);
    const cartItems = useSelector(selectCartItems);
    const selectedItems = useSelector(selectSelectedCartItems);
    const selectedItemIds = useSelector(selectSelectedItemIds);
    const selectedTotal = useSelector(selectSelectedCartTotal);
    const isAllSelected = useSelector(selectIsAllSelected);
    const isCartLoading = useSelector(selectCartLoading);
    const [isValidating, setIsValidating] = useState(false);

    const handleRemove = (item) => {
        if (isAuth) {
            dispatch(removeCartItem(item.id));
        } else {
            dispatch(removeGuestCartItem(item.itemKey || item.productId));
        }
    };

    const handleQuantity = (item, type) => {
        let newQty = item.quantity;
        if (type === 'decrease' && newQty > 1) newQty--;
        if (type === 'increase' && newQty < (item.stockQuantity || 99)) newQty++;
        
        if (newQty === item.quantity) return;

        if (isAuth) {
            dispatch(updateCartItem({ id: item.id, quantity: newQty }));
        } else {
            dispatch(updateGuestCartItem({ itemKey: item.itemKey || item.productId, quantity: newQty }));
        }
    };

    const handleCheckout = async () => {
        if (selectedItems.length === 0) {
            toast.error('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!');
            return;
        }
        
        try {
            setIsValidating(true);
            const reqItems = selectedItems.map(i => ({ productId: i.productId, quantity: i.quantity }));
            await orderService.validateCart(reqItems);
            
            // Hợp lệ -> Chuyển trang thanh toán
            navigate('/checkout');
        } catch (error) {
            if (error.response?.data?.data) {
                const invalidItems = error.response.data.data;
                invalidItems.forEach(invalidItem => {
                    toast.error(invalidItem.message || `Sản phẩm ${invalidItem.productName} đã hết hàng.`);
                });
            } else {
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi kiểm tra giỏ hàng.');
            }
        } finally {
            setIsValidating(false);
        }
    };

    if (isCartLoading) {
        return (
            <div className="bg-[#faf7f4] min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#c4a882] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="bg-[#faf7f4] min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-[24px] mb-4 text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>Giỏ hàng của bạn đang trống</h2>
                <p className="text-[#888] mb-8">Hãy khám phá thêm các sản phẩm tuyệt vời của GỐM NÂU.</p>
                <button 
                    onClick={() => navigate('/shop')}
                    className="px-8 py-3 bg-[#1a1a1a] text-white text-[12px] uppercase tracking-[2px] transition-colors hover:bg-[#b5624a]"
                >
                    Đến cửa hàng
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#faf7f4] min-h-screen py-16">
            <div className="max-w-[1200px] mx-auto px-5 md:px-10">
                <h1 className="text-[32px] mb-8 text-[#1a1a1a] uppercase tracking-[1px]" style={{ fontFamily: 'var(--font-display)' }}>
                    Giỏ Hàng
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10 items-start">
                    
                    {/* ── DANH SÁCH SẢN PHẨM ── */}
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
                            const isOutOfStock = item.stockQuantity === 0;
                            const isInactive = item.isActive === false;
                            const isDisabled = isOutOfStock || isInactive;
                            
                            return (
                            <div key={item.id || item.productId} className={`grid grid-cols-[30px_1fr] md:grid-cols-[30px_1fr_120px_120px_40px] gap-4 py-6 border-b border-[#eee] items-center transition-opacity duration-300 ${isDisabled ? 'opacity-50 grayscale' : ''}`}>
                                {/* Checkbox */}
                                <div className="self-start md:self-center pt-2 md:pt-0">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 accent-[#c4a882] cursor-pointer disabled:cursor-not-allowed"
                                        checked={selectedItemIds.includes(item.id || item.itemKey)}
                                        disabled={isDisabled}
                                        onChange={() => {
                                            if (isDisabled) return;
                                            
                                            // Auto decrease quantity if exceeding stock when selecting
                                            if (!selectedItemIds.includes(item.id || item.itemKey) && item.quantity > item.stockQuantity) {
                                                if (isAuth) {
                                                    dispatch(updateCartItem({ id: item.id, quantity: item.stockQuantity }));
                                                } else {
                                                    dispatch(updateGuestCartItem({ itemKey: item.itemKey || item.productId, quantity: item.stockQuantity }));
                                                }
                                                toast.success('Số lượng sản phẩm đã được cập nhật do thay đổi tồn kho');
                                            }
                                            dispatch(toggleSelectItem(item.id || item.itemKey));
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
                                            src={item.productImageUrl || '/assets/image/placeholder.jpg'} 
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
                                            className="text-[14px] text-[#1a1a1a] cursor-pointer hover:text-[#b5624a] transition-colors m-0 mb-1"
                                            style={{ fontFamily: 'var(--font-display)' }}
                                            onClick={() => navigate(`/product/${item.productSlug || item.productId}`)}
                                        >
                                            {item.productName}
                                        </h3>
                                        <div className="text-[12px] text-[#888] mb-1 flex items-center gap-2 flex-wrap">
                                            {item.productCode && (
                                                <span>SKU: {item.productCode}</span>
                                            )}
                                            {item.productCode && item.color && <span>|</span>}
                                            {item.color && (
                                                <span>Màu: <span className="capitalize">{item.color}</span></span>
                                            )}
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
                                        disabled={isDisabled}
                                        className="w-8 text-[16px] text-[#888] hover:text-[#1a1a1a] disabled:hover:text-[#888] disabled:cursor-not-allowed transition-colors"
                                    >-</button>
                                    <span className="w-8 text-center text-[13px]">{item.quantity}</span>
                                    <button 
                                        onClick={() => handleQuantity(item, 'increase')}
                                        disabled={isDisabled || item.quantity >= item.stockQuantity}
                                        className="w-8 text-[16px] text-[#888] hover:text-[#1a1a1a] disabled:hover:text-[#888] disabled:cursor-not-allowed transition-colors"
                                    >+</button>
                                </div>

                                {/* Tổng */}
                                <div className="text-right text-[14px] text-[#1a1a1a] font-medium hidden md:block" style={{ fontFamily: 'var(--font-display)' }}>
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

                    {/* ── TÓM TẮT ĐƠN HÀNG ── */}
                    <div className="bg-[#eee8df] p-8 shadow-sm">
                        <h2 className="text-[20px] mb-6 text-[#1a1a1a] border-b border-[#d8d0c4] pb-4" style={{ fontFamily: 'var(--font-display)' }}>
                            Tóm tắt đơn hàng
                        </h2>
                        
                        <div className="flex justify-between py-2 text-[14px] text-[#555]">
                            <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                            <span>{selectedTotal.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        
                        <div className="flex justify-between pt-6 mt-4 border-t border-[#d8d0c4] text-[22px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
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

                </div>
            </div>
        </div>
    );
}
