import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistIds, toggleWishlist } from '../../store/slices/wishlistSlice';
import { addToGuestCart, addToCartServer } from '../../store/slices/cartSlice';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import { productService } from '../../services';
import toast from 'react-hot-toast';
import { FiHeart, FiX } from 'react-icons/fi';

export default function WishlistPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuthenticated);
    const wishlistIds = useSelector(selectWishlistIds);
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (!wishlistIds || wishlistIds.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Fetch từng sản phẩm (vì wishlist lưu ở dạng ID trên client)
                const promises = wishlistIds.map(id => productService.getById(id));
                const responses = await Promise.allSettled(promises);
                
                // Lọc ra các request thành công
                const fetchedProducts = responses
                    .filter(res => res.status === 'fulfilled' && res.value?.data?.data)
                    .map(res => res.value.data.data);
                    
                setProducts(fetchedProducts);
            } catch (error) {
                console.error("Lỗi khi tải wishlist:", error);
                toast.error('Không thể tải danh sách yêu thích');
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistProducts();
    }, [wishlistIds]);

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        if (!product.inStock) {
            toast.error('Sản phẩm đã hết hàng!');
            return;
        }
        if (isAuth) {
            dispatch(addToCartServer({ productId: product.id, quantity: 1 }));
        } else {
            dispatch(addToGuestCart({ productId: product.id, quantity: 1, product }));
        }
        toast.success('Đã thêm vào giỏ hàng!');
    };

    const handleRemoveFromWishlist = (e, productId) => {
        e.stopPropagation();
        dispatch(toggleWishlist(productId));
        toast.success('Đã xóa khỏi danh sách yêu thích');
    };

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* ── Hero Banner ── */}
            <div className="relative h-[30vh] min-h-[250px] mb-12 flex items-center justify-center bg-[#faf7f4] overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1565193566173-6a0d0d860d5b?q=80&w=2000&auto=format&fit=crop" 
                        alt="Yêu thích"
                        className="w-full h-full object-cover opacity-70 grayscale-[30%]"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>
                <div className="relative z-10 text-center px-5 max-w-[800px] mx-auto text-white">
                    <h1 className="text-[32px] md:text-[42px] mb-3 font-display">
                        Danh sách yêu thích
                    </h1>
                    <p className="text-[14px] md:text-[15px] font-light opacity-90 max-w-[500px] mx-auto">
                        Lưu giữ những món đồ gốm bạn yêu thích để mua sau
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-5 md:px-12 lg:px-20">

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="opacity-40">
                                <div className="bg-[#f0f0f0] rounded-sm h-[250px] mb-2.5" />
                                <div className="bg-[#f0f0f0] h-3 my-2 rounded-sm" />
                                <div className="bg-[#f0f0f0] h-3.5 rounded-sm w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-[#faf7f4] rounded-full flex items-center justify-center mx-auto mb-6 text-[#c4a882] text-3xl">
                            <FiHeart />
                        </div>
                        <h2 className="text-[20px] mb-4 text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
                            Danh sách trống
                        </h2>
                        <p className="text-[#888] mb-8 text-[14px]">
                            Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.
                        </p>
                        <Link 
                            to="/shop" 
                            className="inline-block px-8 py-3 bg-[#1a1a1a] text-white text-[12px] uppercase tracking-[2px] 
                                     hover:bg-[#444] transition-colors duration-200"
                        >
                            Khám phá sản phẩm
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="cursor-pointer group relative"
                                onClick={() => navigate(`/product/${product.slug || product.id}`)}
                            >
                                {/* Ảnh */}
                                <div className="relative bg-[#faf7f4] rounded-sm overflow-hidden mb-3 h-[200px] md:h-[280px]">
                                    <img
                                        src={product.primaryImageUrl || '/assets/image/placeholder.jpg'}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Badge giảm giá */}
                                    {product.oldPrice > 0 && (
                                        <span className="absolute top-2 left-2 bg-[#c4a882] text-white text-[10px] py-[3px] px-2 rounded-sm z-10">
                                            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                                        </span>
                                    )}
                                    {/* Nút xóa khỏi wishlist */}
                                    <button
                                        onClick={(e) => handleRemoveFromWishlist(e, product.id)}
                                        className="absolute top-2 right-2 border-none rounded-full w-8 h-8 bg-white/90 shadow-sm
                                                   cursor-pointer flex items-center justify-center transition-all duration-200 
                                                   hover:bg-[#1a1a1a] hover:text-white text-[#888] z-10"
                                        title="Xóa khỏi yêu thích"
                                    >
                                        <FiX size={16} />
                                    </button>
                                </div>

                                {/* Thông tin */}
                                <div className="text-center">
                                    <p className="text-[12px] text-[#888] mb-1 uppercase tracking-[1px]" style={{ fontFamily: 'var(--font-display)' }}>
                                        {product.categoryName || 'Sản phẩm'}
                                    </p>
                                    <h3 className="text-[14px] text-[#1a1a1a] my-2 leading-[1.4] font-medium transition-colors group-hover:text-[#c4a882]" style={{ fontFamily: 'var(--font-display)' }}>
                                        {product.name}
                                    </h3>
                                    
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <span className="text-[14px] font-medium m-0 text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
                                            {product.price?.toLocaleString('vi-VN')} ₫
                                        </span>
                                        {product.oldPrice > 0 && (
                                            <span className="text-[12px] text-[#aaa] line-through" style={{ fontFamily: 'var(--font-display)' }}>
                                                {product.oldPrice?.toLocaleString('vi-VN')} ₫
                                            </span>
                                        )}
                                    </div>

                                    {/* Nút thêm giỏ */}
                                    <button
                                        className="w-full py-2.5 bg-transparent border border-[#ddd] text-[11px] tracking-[1.5px] uppercase
                                                   cursor-pointer transition-colors duration-300 hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a]"
                                        style={!product.inStock ? { opacity: 0.5, cursor: 'not-allowed' } : { fontFamily: 'inherit' }}
                                        onClick={(e) => handleAddToCart(e, product)}
                                        disabled={!product.inStock}
                                    >
                                        {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
