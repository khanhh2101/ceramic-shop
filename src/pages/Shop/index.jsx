import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import { addToGuestCart, addToCartServer } from '../../store/slices/cartSlice';
import { toggleCartDrawer } from '../../store/slices/uiSlice';
import { toggleWishlist, selectWishlistIds } from '../../store/slices/wishlistSlice';
import toast from 'react-hot-toast';
import api from '../../services/api';

// ── Shop Page (Tailwind Migration) ──────────────────────────────────────────
// Layout gồm Sidebar + Main Content (Grid 4 cột)

function Shop() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuthenticated);
    const wishlistIds = useSelector(selectWishlistIds);
    const [searchParams, setSearchParams] = useSearchParams();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [masterTags, setMasterTags] = useState([]);
    const [masterColors, setMasterColors] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Filter state
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [sortOption, setSortOption] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    // Đọc searchParams từ URL
    useEffect(() => {
        const search = searchParams.get('search');
        if (search) fetchProducts({ search });
        else fetchProducts({});
    }, [searchParams]);

    // Lấy master data
    useEffect(() => {
        api.get('/categories').then((res) => setCategories(res.data.data || [])).catch(() => {});
        api.get('/master-data/100/generals').then((res) => setMasterColors(res.data.data || [])).catch(() => {});
        api.get('/master-data/200/generals').then((res) => setMasterTags(res.data.data || [])).catch(() => {});
    }, []);

    const fetchProducts = async (extraParams = {}) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', currentPage);
            params.append('pageSize', pageSize);
            params.append('sortBy', sortOption);

            if (extraParams.search) params.append('search', extraParams.search);

            if (selectedCategories.length > 0) {
                params.append('categoryId', selectedCategories[0]);
            }
            // Giá
            if (selectedPrices.includes('0 - 100.000')) {
                params.append('minPrice', 0);
                params.append('maxPrice', 100000);
            } else if (selectedPrices.includes('100.000 - 200.000')) {
                params.append('minPrice', 100000);
                params.append('maxPrice', 200000);
            } else if (selectedPrices.includes('200.000 - 9.999.999')) {
                params.append('minPrice', 200000);
                params.append('maxPrice', 9999999);
            }
            // Tags & Colors
            selectedTags.forEach(t => params.append('tags', t));
            selectedColors.forEach(c => params.append('colors', c));

            const res = await api.get('/products', { params });
            const data = res.data;
            setProducts(data.data || []);
            setTotalCount(data.totalCount || 0);
        } catch (err) {
            console.error(err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch khi filter thay đổi
    useEffect(() => {
        fetchProducts({});
    }, [selectedCategories, selectedPrices, selectedColors, selectedTags, sortOption, currentPage]);

    const toggleCategory = (id) => {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [id]
        );
        setCurrentPage(1);
    };

    const togglePrice = (value) => {
        setSelectedPrices((prev) =>
            prev.includes(value) ? prev.filter((p) => p !== value) : [value]
        );
        setCurrentPage(1);
    };

    const toggleTag = (id) => {
        setSelectedTags((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
        setCurrentPage(1);
    };

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
        dispatch(toggleCartDrawer());
        toast.success('Đã thêm vào giỏ hàng!');
    };

    const handleWishlist = (e, productId) => {
        e.stopPropagation();
        dispatch(toggleWishlist(productId));
        toast.success(
            wishlistIds.includes(productId) ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích'
        );
    };

    const priceRanges = [
        { value: '0 - 100.000', label: '0 – 100.000 VND' },
        { value: '100.000 - 200.000', label: '100.000 – 200.000 VND' },
        { value: '200.000 - 9.999.999', label: 'Trên 200.000 VND' },
    ];

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="bg-white min-h-screen pb-24" id="page-shop">
            {/* ── Hero Banner ── */}
            <div className="relative h-[40vh] min-h-[300px] mb-12 flex items-center justify-center bg-[#faf7f4] overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2000&auto=format&fit=crop" 
                        alt="Cửa hàng Gốm Nâu"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
                <div className="relative z-10 text-center px-5 max-w-[800px] mx-auto text-white">
                    <h1 className="text-[36px] md:text-[48px] mb-4 font-display leading-[1.1]">
                        Bộ Sưu Tập Gốm
                    </h1>
                    <p className="text-[15px] md:text-[16px] font-light leading-[1.6] opacity-90 max-w-[500px] mx-auto">
                        Khám phá những tác phẩm thủ công tinh xảo, mang trọn tâm huyết của người nghệ nhân.
                    </p>
                </div>
            </div>
            <div className="max-w-[1400px] mx-auto px-5 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12">
                {/* ── Sidebar Filter ── */}
                <div className="space-y-8">
                    {/* Danh mục */}
                    <div>
                        <h3 className="text-[12px] tracking-[2px] uppercase text-[var(--dark)] border-b border-[var(--border)] pb-3 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                            Danh mục
                        </h3>
                        {categories.length === 0 && (
                            <p className="text-[12px] text-[#aaa]">Đang tải...</p>
                        )}
                        <div className="space-y-2.5">
                            {categories.map((item) => (
                                <label key={item.id} className="flex items-center gap-2.5 cursor-pointer text-[13px] text-[var(--text)] group hover:text-[var(--dark)]">
                                    <input
                                        value={item.id}
                                        type="checkbox"
                                        checked={selectedCategories.includes(item.id)}
                                        onChange={() => toggleCategory(item.id)}
                                        className="w-4 h-4 accent-[#c4a882] cursor-pointer"
                                    />
                                    <span style={{ fontFamily: 'var(--font-display)' }}>{item.name}</span>
                                    {item.productCount > 0 && (
                                        <span className="text-[#aaa] text-[11px] ml-1">({item.productCount})</span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Giá */}
                    <div>
                        <h3 className="text-[12px] tracking-[2px] uppercase text-[var(--dark)] border-b border-[var(--border)] pb-3 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                            Giá
                        </h3>
                        <div className="space-y-2.5">
                            {priceRanges.map(({ value, label }) => (
                                <label key={value} className="flex items-center gap-2.5 cursor-pointer text-[13px] text-[var(--text)] group hover:text-[var(--dark)]">
                                    <input
                                        value={value}
                                        type="checkbox"
                                        checked={selectedPrices.includes(value)}
                                        onChange={() => togglePrice(value)}
                                        className="w-4 h-4 accent-[#c4a882] cursor-pointer"
                                    />
                                    <span style={{ fontFamily: 'var(--font-display)' }}>{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Màu sắc */}
                    <div>
                        <h3 className="text-[12px] tracking-[2px] uppercase text-[var(--dark)] border-b border-[var(--border)] pb-3 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                            Màu sắc
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {masterColors.map(({ genCd, color, genNameVn }) => (
                                <div
                                    key={genCd}
                                    className={`w-7 h-7 rounded-full cursor-pointer transition-colors duration-200 border ${
                                        selectedColors.includes(genCd) ? 'border-[var(--dark)]' : 'border-black/10'
                                    } hover:border-[var(--dark)]`}
                                    style={{
                                        background: color || '#ccc',
                                        outline: selectedColors.includes(genCd) ? '2px solid #b5624a' : 'none',
                                    }}
                                    title={genNameVn}
                                    onClick={() => {
                                        setSelectedColors((prev) =>
                                            prev.includes(genCd)
                                                ? prev.filter((c) => c !== genCd)
                                                : [...prev, genCd]
                                        );
                                        setCurrentPage(1);
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Thẻ (Tags) */}
                    <div>
                        <h3 className="text-[12px] tracking-[2px] uppercase text-[var(--dark)] border-b border-[var(--border)] pb-3 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                            Nhãn nổi bật
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {masterTags.map(({ genCd, genNameVn, color }) => (
                                <button
                                    key={genCd}
                                    type="button"
                                    onClick={() => toggleTag(genCd)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                        selectedTags.includes(genCd) 
                                        ? 'border-[#b5624a] ring-1 ring-[#b5624a]' 
                                        : 'border-transparent opacity-80 hover:opacity-100'
                                    }`}
                                    style={{ backgroundColor: color || '#faf7f4', color: color ? '#fff' : '#8B6F47', border: color ? 'none' : '1px solid #e5ddd4' }}
                                >
                                    {genNameVn}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Main Content ── */}
                <div>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-[var(--text-light)] text-[13px]" style={{ fontFamily: 'var(--font-display)' }}>
                            Hiển thị {loading ? '...' : totalCount} sản phẩm
                        </span>
                        <select
                            className="py-2 px-4 border border-[var(--border)] bg-white text-[13px] text-[var(--text)] cursor-pointer outline-none focus:border-[#c4a882]"
                            style={{ fontFamily: 'var(--font-display)' }}
                            value={sortOption}
                            onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="price-asc">Giá: Thấp → Cao</option>
                            <option value="price-desc">Giá: Cao → Thấp</option>
                            <option value="bestseller">Bán chạy nhất</option>
                            <option value="rating">Đánh giá cao</option>
                        </select>
                    </div>

                    {/* Grid sản phẩm */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {loading ? (
                            // Skeleton loader
                            Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="opacity-40">
                                    <div className="bg-[#f0f0f0] rounded-sm h-[200px] mb-2.5" />
                                    <div className="bg-[#f0f0f0] h-3 my-2 rounded-sm" />
                                    <div className="bg-[#f0f0f0] h-3.5 rounded-sm w-1/2" />
                                </div>
                            ))
                        ) : products.length === 0 ? (
                            <div className="col-span-full text-center py-16 text-[#aaa]">
                                <p style={{ fontFamily: 'var(--font-display)' }}>Không tìm thấy sản phẩm nào.</p>
                                <button
                                    className="mt-4 bg-[#1a1a1a] text-white py-2 px-6 rounded-sm text-[13px] cursor-pointer hover:bg-[#444] transition-colors"
                                    onClick={() => {
                                        setSelectedCategories([]);
                                        setSelectedPrices([]);
                                        setSelectedColors([]);
                                    }}
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        ) : (
                            products.map((product) => (
                                <div
                                    key={product.id}
                                    className="cursor-pointer group"
                                    onClick={() => navigate(`/product/${product.slug || product.id}`)}
                                >
                                    {/* Ảnh */}
                                    <div className="relative bg-white rounded-sm overflow-hidden mb-2.5 h-[200px]">
                                        <img
                                            src={product.primaryImageUrl || '/assets/image/placeholder.jpg'}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {/* Badge giảm giá */}
                                        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                                            {product.oldPrice > product.price && (
                                                <span className="bg-[#c4a882] text-white text-[10px] py-[3px] px-2 rounded-sm shadow-sm font-bold">
                                                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                                                </span>
                                            )}
                                            {/* Tags hiển thị trên ảnh */}
                                            {product.tags && product.tags.map(tag => (
                                                <span key={tag.id || tag.name} 
                                                      className="px-2 py-[3px] text-[10px] uppercase font-bold tracking-wider rounded-sm shadow-sm"
                                                      style={{ backgroundColor: tag.hexColor || '#b5624a', color: '#fff' }}>
                                                  {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Wishlist icon */}
                                        <button
                                            onClick={(e) => handleWishlist(e, product.id)}
                                            className="absolute top-2 right-2 border-none rounded-full w-[30px] h-[30px] 
                                                       cursor-pointer flex items-center justify-center transition-colors shadow-sm"
                                            style={{
                                                background: wishlistIds.includes(product.id) ? '#b5624a' : 'rgba(255,255,255,0.9)',
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlistIds.includes(product.id) ? '#fff' : 'none'} stroke={wishlistIds.includes(product.id) ? '#fff' : '#b5624a'} strokeWidth="2">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Tên & Màu sắc */}
                                    <div className="flex justify-between items-start my-2">
                                        <h3 className="text-[13px] text-[#1a1a1a] leading-[1.4] font-medium flex-1 pr-2" style={{ fontFamily: 'var(--font-display)' }}>
                                            {product.name}
                                        </h3>
                                        {/* Hiển thị chấm màu */}
                                        {product.colors && product.colors.length > 0 && (
                                            <div className="flex gap-1 flex-wrap shrink-0">
                                                {product.colors.map(color => (
                                                    <div key={color.id || color.name} 
                                                         className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-sm"
                                                         style={{ backgroundColor: color.hexColor || '#ccc' }}
                                                         title={color.name}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Giá */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[14px] font-medium m-0" style={{ fontFamily: 'var(--font-display)' }}>
                                            {product.price?.toLocaleString('vi-VN')} ₫
                                        </span>
                                        {product.oldPrice > product.price && (
                                            <span className="text-[12px] text-[#aaa] line-through" style={{ fontFamily: 'var(--font-display)' }}>
                                                {product.oldPrice?.toLocaleString('vi-VN')} ₫
                                            </span>
                                        )}
                                    </div>

                                    {/* Nút thêm giỏ */}
                                    <button
                                        className="w-full py-2 bg-transparent border border-[#ddd] text-[11px] tracking-[1px] 
                                                   cursor-pointer transition-colors duration-200 hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a]"
                                        style={!product.inStock ? { opacity: 0.5, cursor: 'not-allowed' } : { fontFamily: 'inherit' }}
                                        onClick={(e) => handleAddToCart(e, product)}
                                        disabled={!product.inStock}
                                    >
                                        {product.inStock ? 'THÊM VÀO GIỎ' : 'HẾT HÀNG'}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 py-8 mt-4">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setCurrentPage(p)}
                                    className={`w-9 h-9 border border-[#ddd] flex items-center justify-center text-[13px] rounded-sm cursor-pointer transition-colors duration-200 ${
                                        p === currentPage ? 'bg-[#b5624a] text-white border-[#b5624a]' : 'bg-transparent text-[#1a1a1a] hover:bg-[#f5f5f5]'
                                    }`}
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Shop;
