import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { 
    selectCartItems, 
    removeCartItem, 
    removeGuestCartItem, 
    updateCartItem, 
    updateGuestCartItem,
    selectCartLoading,
    selectSelectedCartItems,
    selectSelectedCartTotal,
    selectIsAllSelected,
    selectSelectedItemIds
} from '@/store/slices/cartSlice';
import { orderService } from '@/services';
import toast from 'react-hot-toast';
import CartList from './components/CartList';
import CartSummary from './components/CartSummary';
import { getErrorMessage } from '@/utils';

export default function Cart() {
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

    const handleQuantity = (item, type, maxStock) => {
        let newQty = item.quantity;
        if (type === 'decrease' && newQty > 1) newQty--;
        if (type === 'increase' && newQty < (maxStock || 99)) newQty++;
        if (type === 'set') newQty = maxStock;
        
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
            
            // Hợp lệ -> Chuyển trang thanh toán
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
                <h2 className="text-[24px] mb-4 text-[#1a1a1a] font-display">Giỏ hàng của bạn đang trống</h2>
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
                <h1 className="text-[32px] mb-8 text-[#1a1a1a] uppercase tracking-[1px] font-display">
                    Giỏ Hàng
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10 items-start">
                    
                    {/* ── DANH SÁCH SẢN PHẨM ── */}
                    <CartList 
                        cartItems={cartItems}
                        selectedItemIds={selectedItemIds}
                        isAllSelected={isAllSelected}
                        isAuth={isAuth}
                        handleRemove={handleRemove}
                        handleQuantity={handleQuantity}
                    />

                    {/* ── TÓM TẮT ĐƠN HÀNG ── */}
                    <CartSummary 
                        selectedItemsCount={selectedItems.length}
                        selectedTotal={selectedTotal}
                        handleCheckout={handleCheckout}
                        isValidating={isValidating}
                    />

                </div>
            </div>
        </div>
    );
}
