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
// Card hiển thị sản phẩm trong danh sách, dùng ở shop, home, bestsellers.
//
// Props:
//   product: { id, name, price, oldPrice, primaryImageUrl, averageRating, reviewCount,
//              soldCount, inStock, isFreeShip, slug }

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuthenticated);
  const isWishlisted = useSelector(selectIsInWishlist(product.id));

  const discount = product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Không navigate khi click nút
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
        // Yêu cầu chọn màu -> chuyển tới trang chi tiết
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
    <Link to={`/product/${product.id}`} className="group product-card block">
      {/* ── Ảnh sản phẩm ── */}
      <div className="relative overflow-hidden bg-cream-100">
        <img
          src={product.primaryImageUrl || 'https://placehold.co/600x800/eeeeee/999999?text=Gom+Nau'}
          alt={product.name}
          className="w-full aspect-product object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge-sale">-{discount}%</span>
          )}
          {product.isFreeShip && (
            <span className="badge-freeship">Freeship</span>
          )}
          {!product.inStock && (
            <span className="badge bg-gray-200 text-gray-600">Hết hàng</span>
          )}
          {product.tags && product.tags.map(tag => (
            <span key={tag.id || tag.name} 
                  className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-sm shadow-sm"
                  style={{ backgroundColor: tag.hexColor || '#ff9800', color: '#fff' }}>
              {tag.name}
            </span>
          ))}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {product.colors.map(color => (
                <div key={color.id || color.name} 
                     className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                     style={{ backgroundColor: color.hexColor || '#ccc' }}
                     title={color.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
                     transition-all duration-200 opacity-0 group-hover:opacity-100
                     ${isWishlisted
                       ? 'bg-red-100 text-red-500'
                       : 'bg-white/90 text-gray-500 hover:text-red-500'
                     }`}
        >
          <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
        </button>

        {/* Add to cart overlay (hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full
                       group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full btn-primary py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FiShoppingBag className="w-4 h-4" />
            {!product.inStock ? 'Hết hàng' : (product.colors && product.colors.length > 1 ? 'Tùy chọn màu' : 'Thêm vào giỏ')}
          </button>
        </div>
      </div>

      {/* ── Thông tin sản phẩm ── */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-primary-600
                       transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <FiStar className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-gray-700">
              {product.averageRating?.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
        )}

        {/* Giá */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary-600">
            {formatCurrency(product.price)}
          </span>
          {product.oldPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Đã bán */}
        {product.soldCount > 0 && (
          <p className="text-xs text-gray-400 mt-1">Đã bán {product.soldCount}</p>
        )}
      </div>
    </Link>
  );
}
