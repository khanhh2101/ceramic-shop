import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { addToGuestCart, addToCartServer } from '@/store/slices/cartSlice';
import { toggleCartDrawer } from '@/store/slices/uiSlice';
import { toggleWishlist, selectIsInWishlist } from '@/store/slices/wishlistSlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils';

// ── ProductCard Component ─────────────────────────────────────────────────────

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuthenticated);
  const isWishlisted = useSelector(selectIsInWishlist(product.id));

  const discount = product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) {
      toast.error('Sản phẩm đã hết hàng!');
      return;
    }

    let selectedColor = null;
    if (product.colors && product.colors.length > 0) {
      if (product.colors.length === 1) {
        selectedColor = product.colors[0].name;
      } else {
        navigate(`/product/${product.slug || product.id}`);
        return;
      }
    }

    if (isAuth) {
      dispatch(addToCartServer({ productId: product.id, quantity: 1, color: selectedColor }));
    } else {
      dispatch(addToGuestCart({ productId: product.id, quantity: 1, color: selectedColor, product }));
    }
    dispatch(toggleCartDrawer());
    toast.success('Đã thêm vào giỏ hàng!', { icon: '🛍️' });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product.id));
    toast.success(isWishlisted ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích', {
      icon: isWishlisted ? '💔' : '❤️',
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="group product-card block relative bg-white border border-transparent hover:border-[#f0f0f0] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-xl transition-all duration-300">
      {/* ── Ảnh sản phẩm ── */}
      <div className="relative overflow-hidden bg-[#faf7f4] rounded-t-xl">
        <img
          src={product.primaryImageUrl || 'https://placehold.co/600x800/eeeeee/999999?text=Gom+Nau'}
          alt={product.name}
          className="w-full aspect-[4/5] object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Top-left Badges (Tags & Status) */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-10">
          {discount > 0 && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider text-white bg-[#e53935] rounded-sm shadow-sm">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest text-[#555] bg-white/90 backdrop-blur-sm uppercase rounded-sm shadow-sm border border-[#e0e0e0]">
              Hết hàng
            </span>
          )}
          {product.isFreeShip && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest text-white bg-[#4caf50] uppercase rounded-sm shadow-sm">
              Freeship
            </span>
          )}
          {product.tags && product.tags.map(tag => (
            <span key={tag.id || tag.name} 
                  className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-sm shadow-sm"
                  style={{ backgroundColor: tag.hexColor || '#1a1a1a', color: '#fff' }}>
              {tag.name}
            </span>
          ))}
        </div>

        {/* Color Indicators on Image Bottom Left */}
        {product.colors && product.colors.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1 z-10">
            {product.colors.map((color, idx) => {
                if (idx < 3) return (
                    <div key={color.id || color.name} 
                         className="w-3.5 h-3.5 rounded-full border border-white shadow-sm ring-1 ring-black/5"
                         style={{ backgroundColor: color.hexColor || '#ccc' }}
                         title={color.name}
                    />
                );
                if (idx === 3) return (
                    <div key="more" className="w-3.5 h-3.5 rounded-full bg-white/80 border border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-gray-500">
                        +
                    </div>
                );
                return null;
            })}
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10
                     transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-sm
                     ${isWishlisted
                       ? 'bg-white text-[#e53935]'
                       : 'bg-white/90 text-gray-400 hover:text-[#e53935]'
                     }`}
        >
          <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-[#e53935]' : ''}`} />
        </button>

        {/* Add to cart overlay (hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-[120%] opacity-0
                       group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-white/95 backdrop-blur-sm text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white border border-[#1a1a1a]/10 py-3 text-[13px] font-medium uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-lg transition-colors duration-300 shadow-lg"
          >
            <FiShoppingBag className="w-4 h-4" />
            {!product.inStock ? 'Hết hàng' : (product.colors && product.colors.length > 1 ? 'Tùy chọn màu' : 'Thêm vào giỏ')}
          </button>
        </div>
      </div>

      {/* ── Thông tin sản phẩm ── */}
      <div className="p-4 bg-white rounded-b-xl">
        <h3 className="font-display text-[15px] font-medium text-[#1a1a1a] line-clamp-2 mb-1.5 group-hover:text-[#c4a882] transition-colors duration-300 leading-snug">
          {product.name}
        </h3>

        {/* Rating & Sold */}
        <div className="flex items-center justify-between mb-2.5">
            {product.reviewCount > 0 ? (
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                        <FiStar className="w-3.5 h-3.5 fill-[#c4a882] text-[#c4a882]" />
                        <span className="text-[12px] font-medium text-[#1a1a1a]">
                        {product.averageRating?.toFixed(1)}
                        </span>
                    </div>
                    <span className="text-[11px] text-[#888]">({product.reviewCount})</span>
                </div>
            ) : (
                <div className="text-[12px] text-[#aaa] font-medium tracking-wide">CHƯA CÓ ĐÁNH GIÁ</div>
            )}
            
            {product.soldCount > 0 && (
                <span className="text-[11px] text-[#888] font-medium">Đã bán {product.soldCount}</span>
            )}
        </div>

        {/* Giá & Giảm giá */}
        <div className="flex flex-wrap items-center gap-2 mt-auto pt-1">
          <span className="text-[15px] font-bold text-[#b5624a] font-display tracking-tight">
            {formatCurrency(product.price)}
          </span>
          {product.oldPrice > product.price && (
            <span className="text-[12px] text-[#aaa] line-through font-medium">
              {formatCurrency(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
