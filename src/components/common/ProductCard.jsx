import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToGuestCart, addToCartServer } from '@/store/slices/cartSlice';
import {
    toggleWishlist,
    selectWishlistIds,
} from '@/store/slices/wishlistSlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { toggleCartDrawer } from '@/store/slices/uiSlice';
import { FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuthenticated);
    const wishlistIds = useSelector(selectWishlistIds);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (!product.inStock) {
            toast.error('Sản phẩm đã hết hàng!');
            return;
        }

        let selectedColor = null;
        let selectedColorId = null;
        if (product.colors && product.colors.length > 0) {
            if (product.colors.length === 1) {
                selectedColor = product.colors[0].name;
                selectedColorId =
                    product.colors[0].id !== undefined
                        ? product.colors[0].id
                        : null;
            } else {
                navigate(`/product/${product.slug || product.id}`);
                return;
            }
        }

        if (isAuth) {
            dispatch(
                addToCartServer({
                    productId: product.id,
                    quantity: 1,
                    color: selectedColor,
                    colorId: selectedColorId,
                }),
            );
        } else {
            dispatch(
                addToGuestCart({
                    productId: product.id,
                    quantity: 1,
                    color: selectedColor,
                    colorId: selectedColorId,
                    product,
                }),
            );
        }
        dispatch(toggleCartDrawer());
        toast.success('Đã thêm vào giỏ hàng!');
    };

    const handleWishlist = (e) => {
        e.stopPropagation();
        dispatch(toggleWishlist(product.id));
        toast.success(
            wishlistIds.includes(product.id)
                ? 'Đã xóa khỏi yêu thích'
                : 'Đã thêm vào yêu thích',
        );
    };

    return (
        <div
            className="cursor-pointer group flex flex-col h-full bg-transparent transition-all duration-300"
            onClick={() => navigate(`/product/${product.slug || product.id}`)}
        >
            {/* Ảnh */}
            <div className="relative bg-[#fcf9f5] rounded-xl overflow-hidden mb-4 aspect-square shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <img
                    src={
                        product.primaryImageUrl ||
                        'https://placehold.co/600x800/eeeeee/999999?text=Gom+Nau'
                    }
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                />

                {/* Overlay (Làm mờ nhẹ khi hover) */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-0"></div>

                {/* Badge giảm giá & Tags */}
                <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-10">
                    {product.oldPrice > product.price && (
                        <span className="bg-[#784242] text-white text-[11px] font-bold py-1 px-2.5 rounded-sm uppercase tracking-[1px] shadow-sm border border-[#784242]">
                            -
                            {Math.round(
                                (1 - product.price / product.oldPrice) * 100,
                            )}
                            %
                        </span>
                    )}
                    {!product.inStock && (
                        <span className="px-2.5 py-1 text-[10px] font-bold tracking-[1px] text-[#555] bg-white/90 backdrop-blur-sm uppercase rounded-sm shadow-sm border border-[#e0e0e0]">
                            Hết hàng
                        </span>
                    )}
                    {product.isFreeShip && (
                        <span className="px-2.5 py-1 text-[10px] font-bold tracking-[1px] text-white bg-[#4caf50] uppercase rounded-sm shadow-sm">
                            Freeship
                        </span>
                    )}
                    {product.tags &&
                        product.tags.map((tag) => (
                            <span
                                key={tag.id || tag.name}
                                className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-[1px] rounded-sm shadow-sm w-fit"
                                style={{
                                    backgroundColor: tag.hexColor || '#1a1a1a',
                                    color: '#fff',
                                }}
                            >
                                {tag.name}
                            </span>
                        ))}
                </div>

                {/* Wishlist icon */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-3 right-3 border-none rounded-full w-[36px] h-[36px] z-10
                               cursor-pointer flex items-center justify-center transition-all duration-300 shadow-sm
                               ${wishlistIds.includes(product.id) ? 'bg-[#b5624a] scale-100 opacity-100' : 'bg-white/90 hover:bg-white scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`}
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill={
                            wishlistIds.includes(product.id) ? '#fff' : 'none'
                        }
                        stroke={
                            wishlistIds.includes(product.id)
                                ? '#fff'
                                : '#b5624a'
                        }
                        strokeWidth="2"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                {/* Nút thêm giỏ (Quick Add - Hover) - Zara Style */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-10">
                    <button
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1a1a1a]/85 backdrop-blur-md text-white text-[11px] tracking-[2px] font-bold uppercase
                                   cursor-pointer transition-colors duration-300 hover:bg-[#b5624a] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                    >
                        <FiShoppingBag size={14} />
                        {!product.inStock
                            ? 'Hết hàng'
                            : product.colors && product.colors.length > 1
                              ? 'Tùy chọn màu'
                              : 'Thêm vào giỏ'}
                    </button>
                </div>
            </div>

            {/* Thông tin */}
            <div className="flex-1 flex flex-col px-1">
                <p className="text-[10px] text-[#888] mb-1.5 uppercase tracking-[2px] font-bold">
                    {product.categoryName || 'Sản phẩm'}
                </p>
                <h3 className="text-[15px] text-[#1a1a1a] font-display font-medium leading-[1.4] mb-3 group-hover:text-[#b5624a] transition-colors line-clamp-2 min-h-[42px]">
                    {product.name}
                </h3>

                {/* Giá */}
                <div className="mt-auto flex items-center gap-2.5">
                    <span className="text-[15px] font-bold text-[#1a1a1a]">
                        {product.price?.toLocaleString('vi-VN')} ₫
                    </span>
                    {product.oldPrice > product.price && (
                        <span className="text-[13px] text-[#aaa] line-through">
                            {product.oldPrice?.toLocaleString('vi-VN')} ₫
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
