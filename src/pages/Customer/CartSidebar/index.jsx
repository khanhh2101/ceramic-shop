import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { 
    removeCartItem, 
    removeGuestCartItem, 
    updateCartItem, 
    updateGuestCartItem,
    toggleSelectItem,
    toggleSelectAll,
    selectSelectedCartItems,
    selectSelectedCartTotal,
    selectIsAllSelected,
    selectSelectedItemIds
} from '@/store/slices/cartSlice';
import { orderService } from '@/services';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { getErrorMessage } from '@/utils';

export default function CartSidebar({ isOpen, onClose, cartItems }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuthenticated);
    const selectedItems = useSelector(selectSelectedCartItems);
    const selectedItemIds = useSelector(selectSelectedItemIds);
    const selectedTotal = useSelector(selectSelectedCartTotal);
    const isAllSelected = useSelector(selectIsAllSelected);
    const [isValidating, setIsValidating] = useState(false);

    const handleRemove = (item) => {
        if (isAuth) {
            dispatch(removeCartItem(item.id));
        } else {
            dispatch(removeGuestCartItem(item.itemKey || item.productId));
        }
    };

    const handleQuantity = (item, type) => {
        const stockQty = item.stockQuantity ?? item.StockQuantity ?? item.product?.stockQuantity ?? item.product?.StockQuantity ?? 99;
        let newQty = item.quantity;
        if (type === 'decrease' && newQty > 1) newQty--;
        if (type === 'increase' && newQty < stockQty) newQty++;
        
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
            const reqItems = selectedItems.map(i => ({ productId: i.productId, quantity: i.quantity, colorId: i.colorId }));
            await orderService.validateCart(reqItems);
            
            onClose();
            navigate('/checkout');
        } catch (error) {
            if (error.response?.data?.data) {
                const invalidItems = error.response.data;
                invalidItems.forEach(invalidItem => {
                    toast.error(invalidItem.message || `Sản phẩm ${invalidItem.productName} đã hết hàng.`);
                });
            } else {
                /* toast handled by api */
            }
        } finally {
            setIsValidating(false);
        }
    };

    const handleViewCart = () => {
        onClose();
        navigate('/cart');
    };

    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 z-[999] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div 
                className={`fixed top-0 right-0 h-screen w-full max-w-[400px] bg-[#faf7f4] z-[1000] shadow-2xl transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#e5e0d8] bg-white">
                    <div className="flex items-center gap-3">
                        <input 
                            type="checkbox" 
                            className="w-4 h-4 accent-[#c4a882] cursor-pointer"
                            checked={isAllSelected}
                            onChange={() => dispatch(toggleSelectAll({ isAuth }))}
                        />
                        <h3 className="text-[20px] m-0 text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
                            Giỏ Hàng
                        </h3>
                    </div>
                    <button 
                        className="text-[20px] text-[#888] hover:text-[#1a1a1a] transition-colors"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#faf7f4] custom-scrollbar">
                    {cartItems.length === 0 ? (
                        <div className="text-center text-[#888] py-10">
                            Giỏ hàng của bạn đang trống
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {cartItems.map((item) => {
                                const isOutOfStock = item.stockQuantity === 0;
                                const isInactive = item.isActive === false;
                                const isDisabled = isOutOfStock || isInactive;
                                
                                return (
                                <div key={item.id || item.productId} className={`flex gap-3 relative transition-opacity duration-300 ${isDisabled ? 'opacity-50 grayscale' : ''}`}>
                                    {/* Checkbox */}
                                    <div className="pt-8">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 accent-[#c4a882] cursor-pointer disabled:cursor-not-allowed"
                                            checked={selectedItemIds.includes(item.id || item.itemKey)}
                                            disabled={isDisabled}
                                            onChange={() => {
                                                if (isDisabled) return;
                                                
                                                const stockQty = item.stockQuantity ?? item.StockQuantity ?? item.product?.stockQuantity ?? item.product?.StockQuantity ?? 99;
                                                if (!selectedItemIds.includes(item.id || item.itemKey) && item.quantity > stockQty) {
                                                    if (isAuth) {
                                                        dispatch(updateCartItem({ id: item.id, quantity: stockQty }));
                                                    } else {
                                                        dispatch(updateGuestCartItem({ itemKey: item.itemKey || item.productId, quantity: stockQty }));
                                                    }
                                                    toast.success('Số lượng sản phẩm đã được cập nhật do thay đổi tồn kho');
                                                }
                                                dispatch(toggleSelectItem(item.id || item.itemKey));
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Image */}
                                    <div 
                                        className="w-[90px] h-[90px] bg-white shrink-0 cursor-pointer overflow-hidden border border-[#eee] relative"
                                        onClick={() => { onClose(); navigate(`/product/${item.productSlug || item.productId}`); }}
                                    >
                                        <img 
                                            src={item.productImageUrl || 'https://placehold.co/600x800/eeeeee/999999?text=Gom+Nau'} 
                                            alt={item.productName} 
                                            className="w-full h-full object-cover"
                                        />
                                        {isDisabled && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <span className="text-white text-[9px] uppercase tracking-wider font-medium px-1.5 py-0.5 bg-black/60 rounded-sm">
                                                    {isInactive ? 'Ngừng bán' : 'Hết hàng'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex flex-col justify-between flex-1 py-1">
                                        <div className="pr-6">
                                            <h4 
                                                className="text-[14px] text-[#1a1a1a] cursor-pointer hover:text-[var(--terracotta)] transition-colors line-clamp-2 leading-tight"
                                                style={{ fontFamily: 'var(--font-display)' }}
                                                onClick={() => { onClose(); navigate(`/product/${item.productSlug || item.productId}`); }}
                                            >
                                                {item.productName}
                                            </h4>
                                            
                                            <div className="text-[12px] text-[#888] mt-1 flex items-center gap-2 flex-wrap">
                                                {item.productCode && (
                                                    <span>SKU: {item.productCode}</span>
                                                )}
                                                {item.productCode && item.color && <span>|</span>}
                                                {item.color && (
                                                    <span>Màu: <span className="capitalize">{item.color}</span></span>
                                                )}
                                            </div>

                                            <div className="text-[13px] font-medium text-[#1a1a1a] mt-1">
                                                {(item.price || 0).toLocaleString('vi-VN')} ₫
                                            </div>
                                        </div>

                                        {/* Qty & Price */}
                                        <div className="flex items-center justify-between mt-2">
                                            <div className={`flex items-center border border-[#ddd] h-7 rounded-sm ${isDisabled ? 'bg-gray-100' : 'bg-white'}`}>
                                                <button 
                                                    onClick={() => handleQuantity(item, 'decrease')}
                                                    disabled={isDisabled}
                                                    className="w-7 h-full flex items-center justify-center text-[#888] hover:text-[#1a1a1a] disabled:hover:text-[#888] disabled:cursor-not-allowed transition-colors"
                                                >-</button>
                                                <span className="w-7 text-center text-[12px]">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleQuantity(item, 'increase')}
                                                    disabled={isDisabled || item.quantity >= (item.stockQuantity ?? item.StockQuantity ?? item.product?.stockQuantity ?? item.product?.StockQuantity ?? 99)}
                                                    className="w-7 h-full flex items-center justify-center text-[#888] hover:text-[#1a1a1a] disabled:hover:text-[#888] disabled:cursor-not-allowed transition-colors"
                                                >+</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remove */}
                                    <button 
                                        onClick={() => handleRemove(item)}
                                        className="absolute top-0 right-0 text-[18px] text-[#ccc] hover:text-[var(--terracotta)] transition-colors w-6 h-6 flex items-center justify-center"
                                        title="Xóa"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )})}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-6 bg-white border-t border-[#e5e0d8]">
                        <div className="flex justify-between items-center mb-6 text-[18px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
                            <span>Tổng cộng <span className="text-[14px] text-[#888]">({selectedItems.length} sp)</span>:</span>
                            <span className="text-[var(--terracotta)]">{selectedTotal.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleViewCart}
                                className="w-full py-4 border border-[#1a1a1a] text-[#1a1a1a] text-[12px] uppercase tracking-[2px] transition-colors hover:bg-[#1a1a1a] hover:text-white"
                            >
                                Xem giỏ hàng
                            </button>
                            <button 
                                onClick={handleCheckout}
                                disabled={isValidating}
                                className="w-full py-4 bg-[#1a1a1a] text-white text-[12px] uppercase tracking-[2px] transition-colors hover:bg-[#444] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isValidating ? 'Đang kiểm tra...' : 'Thanh toán'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
            `}</style>
        </>
    );
}
