import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { addToGuestCart, addToCartServer } from '../../store/slices/cartSlice';
import { toggleCartDrawer } from '../../store/slices/uiSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';

// Remove old COLOR_MAP since colors are now provided by API via hexColor

function Details() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const isAuth = useSelector(selectIsAuthenticated);
    const wishlistIds = useSelector(state => state.wishlist.productIds);

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedColor, setSelectedColor] = useState(null);

    // Reviews
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    // Similar products
    const [similarProducts, setSimilarProducts] = useState([]);

    // ── Fetch product ──
    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        setError(null);
        const isNumeric = /^\d+$/.test(slug);
        const endpoint = isNumeric ? `/products/${slug}` : `/products/slug/${slug}`;

        api.get(endpoint)
            .then((res) => {
                const data = res.data.data;
                setProduct(data);
                const primaryImg = data.images?.find((i) => i.isPrimary)?.url
                    || data.images?.[0]?.url
                    || data.primaryImageUrl;
                setSelectedImage(primaryImg);
                if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [slug]);

    // ── Fetch reviews (always) ──
    useEffect(() => {
        if (product?.id) {
            setLoadingReviews(true);
            api.get(`/reviews/product/${product.id}`)
                .then((res) => {
                    const d = res.data.data;
                    setReviews(Array.isArray(d) ? d : (d?.items || d?.data || []));
                })
                .catch(() => setReviews([]))
                .finally(() => setLoadingReviews(false));
        }
    }, [product?.id]);

    // ── Fetch similar products (limit 5) ──
    useEffect(() => {
        if (product?.id) {
            api.get(`/products/${product.id}/similar`)
                .then((res) => {
                    const d = res.data.data;
                    const items = Array.isArray(d) ? d : [];
                    setSimilarProducts(items.slice(0, 5));
                })
                .catch(() => setSimilarProducts([]));
        }
    }, [product?.id]);

    const handleQuantity = (type) => {
        if (type === 'decrease' && quantity > 1) setQuantity(quantity - 1);
        if (type === 'increase' && quantity < (product?.stockQuantity || 99)) setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        const inStock = product?.stockQuantity > 0;
        if (!inStock) { toast.error(t('product.outOfStock')); return; }
        const colorName = selectedColor?.name || null;
        if (isAuth) {
            dispatch(addToCartServer({ productId: product.id, quantity, color: colorName }));
        } else {
            dispatch(addToGuestCart({ productId: product.id, quantity, color: colorName, product }));
        }
        dispatch(toggleCartDrawer());
        toast.success(t('product.addedToCart'));
    };

    const handleSubmitReview = async () => {
        if (!reviewComment.trim()) { toast.error(t('product.reviewContent')); return; }
        try {
            setSubmittingReview(true);
            await api.post('/reviews', {
                productId: product.id,
                stars: rating,
                title: '',
                content: reviewComment,
                imageUrls: []
            });
            toast.success(t('product.reviewSent'));
            setReviewComment('');
            setRating(5);
            const res = await api.get(`/reviews/product/${product.id}`);
            const d = res.data.data;
            setReviews(Array.isArray(d) ? d : (d?.items || d?.data || []));
        } catch (err) {
            if (err.response?.status === 403) {
                toast.error(t('product.mustPurchase'));
            } else {
                toast.error(err.response?.data?.message || t('product.reviewError'));
            }
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleWishlist = () => { dispatch(toggleWishlist(product.id)); };

    const getRatingText = (r) => {
        const map = { 1: t('product.ratingTerrible'), 2: t('product.ratingBad'), 3: t('product.ratingOk'), 4: t('product.ratingGood'), 5: t('product.ratingExcellent') };
        return map[r] || '';
    };

    const renderStars = (r) => {
        return Array.from({ length: 5 }, (_, i) => {
            const val = i + 1;
            if (r >= val) return <FaStar key={i} color="#b5624a" size={14} />;
            if (r >= val - 0.5) return <FaStarHalfAlt key={i} color="#b5624a" size={14} />;
            return <FaRegStar key={i} color="#ddd" size={14} />;
        });
    };

    if (loading && !product) return (
        <div className="max-w-[1200px] mx-auto pt-20 pb-20 px-5 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[#ddd] border-t-[#b5624a] rounded-full animate-spin" />
            <p className="mt-4 text-[14px] text-[#888]">{t('common.loading')}</p>
        </div>
    );
    if (error) return <div className="text-center py-20 text-[#888] text-[16px]">{t('common.error')}: {error}</div>;
    if (!product) return null;

    const isWishlisted = wishlistIds.includes(product.id);
    const inStock = product.stockQuantity > 0;
    const discountPercent = product.oldPrice > product.price ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

    const cleanDescription = DOMPurify.sanitize(product?.description || t('common.noData'), { 
        ADD_TAGS: ['mark', 'iframe'],
        ADD_ATTR: ['style', 'width', 'height', 'target', 'href', 'allowfullscreen'] 
    });

    return (
        <div className={`max-w-[1200px] mx-auto pt-8 px-5 md:px-10 lg:px-20 pb-20 bg-white transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            {product && (
                <Helmet>
                    <title>{product.name} - Ceramic Shop</title>
                    <meta name="description" content={product.shortDescription || product.name} />
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Product",
                            "name": product.name,
                            "image": product.images?.map(img => img.url),
                            "description": product.shortDescription,
                            "offers": {
                                "@type": "Offer",
                                "priceCurrency": "VND",
                                "price": product.price,
                                "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                            }
                        })}
                    </script>
                </Helmet>
            )}
            {/* ── BREADCRUMB ── */}
            <div className="flex items-center gap-2 text-[13px] text-[#888] mb-8" style={{ fontFamily: 'var(--font-display)' }}>
                <span className="cursor-pointer hover:text-[#1a1a1a] transition-colors" onClick={() => navigate('/')}>{t('nav.home')}</span>
                <span>/</span>
                <span className="cursor-pointer hover:text-[#1a1a1a] transition-colors" onClick={() => navigate('/shop')}>{t('nav.shop')}</span>
                <span>/</span>
                <span className="text-[#1a1a1a]">{product.name}</span>
            </div>

            {/* ── Detail Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-16 items-start">
                {/* ── Ảnh ── */}
                <div>
                    <div className="bg-[#f5f0e8] flex items-center justify-center h-[350px] md:h-[460px] mb-3 overflow-hidden rounded-sm relative">
                        {discountPercent > 0 && (
                            <span className="absolute top-3 left-3 bg-[#b5624a] text-white text-[11px] font-bold px-2 py-1 rounded z-10">
                                -{discountPercent}%
                            </span>
                        )}
                        <img
                            src={selectedImage || '/assets/image/placeholder.jpg'}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    {product.images && product.images.length > 0 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                            {product.images.map((img) => (
                                <img
                                    key={img.id}
                                    src={img.url}
                                    alt=""
                                    onClick={() => setSelectedImage(img.url)}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                    className={`w-[60px] md:w-[76px] h-[60px] md:h-[76px] object-cover cursor-pointer rounded-sm 
                                                border-2 transition-all duration-200 shrink-0
                                                ${selectedImage === img.url ? 'border-[#1a1a1a] opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Thông tin ── */}
                <div>
                    <h1 className="text-[22px] md:text-[26px] font-normal tracking-[0.5px] uppercase mb-3 text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
                        {product.name}
                    </h1>

                    <div className="flex gap-4 items-center mb-5 flex-wrap">
                        {product.code && (
                            <div className="text-[13px] text-[#666] flex items-center gap-1 border-r border-gray-200 pr-4">
                                <span className="font-medium text-gray-500">SKU:</span>
                                <span className="text-gray-800">{product.code}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">{renderStars(product.averageRating || 0)}</div>
                            <span className="text-[13px] text-[#888]">({product.reviewCount || 0} {t('product.reviewCount')})</span>
                        </div>
                        <p className={`text-[13px] flex items-center m-0 ${inStock ? 'text-[#6b8f5e]' : 'text-[#e53e3e]'}`}>
                            ● {inStock ? t('product.inStock') : t('product.outOfStock')}
                        </p>
                        {product.isFreeShip && (
                            <span className="text-[11px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded">{t('product.freeship')}</span>
                        )}
                    </div>

                    {/* Short Description */}
                    {product.shortDescription && (
                        <p className="text-[14px] text-[#555] mb-5 leading-[1.6]">
                            {product.shortDescription}
                        </p>
                    )}

                    {/* Giá */}
                    <div className="flex items-baseline gap-3 mb-5">
                        <span className="text-[30px] md:text-[34px] text-[var(--terracotta)] font-light" style={{ fontFamily: 'var(--font-display)' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </span>
                        {product.oldPrice > product.price && (
                            <>
                                <span className="text-[15px] text-[#aaa] line-through">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.oldPrice)}</span>
                                <span className="text-[12px] text-[#b5624a] font-bold bg-red-50 px-1.5 py-0.5 rounded">-{discountPercent}%</span>
                            </>
                        )}
                    </div>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {product.tags.map((tag) => (
                                <span key={tag.id || tag.name} className="text-[11px] uppercase tracking-[1px] py-1 px-2.5 rounded-sm font-medium"
                                      style={{ backgroundColor: tag.hexColor || '#faf7f4', color: tag.hexColor ? '#fff' : '#8B6F47', border: tag.hexColor ? 'none' : '1px solid #e5ddd4' }}>
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Màu sắc - Ô MÀU */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="mb-5">
                            <span className="text-[12px] uppercase tracking-[1px] text-[#1a1a1a] mb-2 block" style={{ fontFamily: 'var(--font-display)' }}>
                                {t('product.color')}: <span className="normal-case text-[#888] font-normal">{selectedColor?.name || ''}</span>
                            </span>
                            <div className="flex gap-2.5 items-center">
                                {product.colors.map((c) => {
                                    const hex = c.hexColor || '#ccc';
                                    const isSelected = selectedColor?.id === c.id;
                                    const isLight = ['#FFFFFF', '#FFF8DC', '#D4B99A'].includes(hex.toUpperCase());
                                    return (
                                        <button
                                            key={c.id || c.name} title={c.name} onClick={() => setSelectedColor(c)}
                                            className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-200 
                                                        ${isSelected ? 'ring-2 ring-offset-2 ring-[#b5624a] scale-110' : 'hover:scale-110'}
                                                        ${isLight ? 'border border-[#ddd]' : 'border-none'}`}
                                            style={{ backgroundColor: hex }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Chất liệu & Kích thước inline */}
                    <div className="flex gap-6 mb-5 text-[13px] text-[#555] flex-wrap" style={{ fontFamily: 'var(--font-display)' }}>
                        {product.material && (
                            <span><span className="text-[#1a1a1a] font-medium">{t('product.material')}:</span> {product.material}</span>
                        )}
                        {product.specifications && (
                            <span><span className="text-[#1a1a1a] font-medium">{t('product.size')}:</span> {product.specifications}</span>
                        )}
                    </div>

                    {/* Số lượng */}
                    <div className="flex items-center gap-5 mb-5">
                        <span className="text-[12px] uppercase tracking-[1px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
                            {t('product.quantity')}
                        </span>
                        <div className="flex items-center border border-[#ddd] rounded-sm">
                            <button onClick={() => handleQuantity('decrease')} className="w-9 h-9 bg-transparent border-none cursor-pointer text-[16px] text-[#1a1a1a] hover:bg-[#f5f0e8] transition-colors">-</button>
                            <span className="w-12 text-center text-[15px]">{quantity}</span>
                            <button onClick={() => handleQuantity('increase')} className="w-9 h-9 bg-transparent border-none cursor-pointer text-[16px] text-[#1a1a1a] hover:bg-[#f5f0e8] transition-colors">+</button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mb-3 items-center">
                        <button
                            className="flex-1 py-3 bg-[#1a1a1a] text-white border-none text-[12px] tracking-[2px] uppercase cursor-pointer hover:bg-[#444] transition-colors"
                            onClick={handleAddToCart} disabled={!inStock}
                            style={!inStock ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                            {inStock ? t('product.addToCart') : t('product.outOfStock')}
                        </button>
                        <button
                            className="w-11 h-11 bg-transparent border border-[#ddd] text-[18px] cursor-pointer flex items-center justify-center transition-all hover:border-[#1a1a1a] rounded-sm"
                            onClick={handleWishlist}
                            style={isWishlisted ? { color: '#b5624a', borderColor: '#b5624a' } : {}}
                        >
                            {isWishlisted ? '♥' : '♡'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* ── TABS: Mô tả / Thông số / Đánh giá ── */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="border-t border-[#eee] mb-16">
                <div className="flex border-b border-[#eee]">
                    {['description', 'dimensions', 'reviews'].map((tab) => (
                        <button
                            key={tab}
                            className={`py-3.5 px-5 bg-transparent border-none border-b-2 cursor-pointer text-[13px] tracking-[1px] 
                                        transition-all duration-200 -mb-[1px] ${
                                activeTab === tab ? 'text-[#1a1a1a] border-[#1a1a1a]' : 'text-[#888] border-transparent'
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'description' ? t('product.description')
                                : tab === 'dimensions' ? t('product.specifications')
                                : `${t('product.reviews')} (${product.reviewCount || 0})`}
                        </button>
                    ))}
                </div>

                <div className="py-6 text-[14px] text-[#666] leading-[1.8]" style={{ fontFamily: 'var(--font-display)' }}>
                    {/* ── TAB: Mô tả ── */}
                    {activeTab === 'description' && (
                        <div className="animate-fade-in-up">
                            <div className="prose prose-sm md:prose-base max-w-none text-[#555] leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: cleanDescription }}
                            />
                        </div>
                    )}

                    {/* ── TAB: Thông số ── */}
                    {activeTab === 'dimensions' && (
                        <div className="grid grid-cols-[130px_1fr] gap-y-3 max-w-[500px] text-[14px]">
                            <span className="font-medium text-[#1a1a1a]">{t('product.material')}</span>
                            <span className="text-[#555]">{product.material || '—'}</span>
                            <span className="font-medium text-[#1a1a1a]">{t('product.size')}</span>
                            <span className="text-[#555]">{product.specifications || '—'}</span>
                            {product.colors?.length > 0 && (
                                <>
                                    <span className="font-medium text-[#1a1a1a]">{t('product.color')}</span>
                                    <div className="flex gap-3 items-center flex-wrap">
                                        {product.colors.map((c) => (
                                            <span key={c.id || c.name} className="flex items-center gap-1.5">
                                                <span className="w-4 h-4 rounded-full inline-block border border-[#ddd]" style={{ backgroundColor: c.hexColor || '#ccc' }} />
                                                <span className="text-[13px] capitalize text-[#555]">{c.name}</span>
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* ── TAB: Đánh giá ── */}
                    {activeTab === 'reviews' && (
                        <div>
                            {/* Review Summary */}
                            <div className="flex items-center gap-8 mb-8 pb-6 border-b border-[#eee]">
                                <div className="text-center min-w-[80px]">
                                    <div className="text-[42px] font-light text-[#1a1a1a] leading-none">{(product.averageRating || 0).toFixed(1)}</div>
                                    <div className="flex gap-0.5 justify-center my-2">{renderStars(product.averageRating || 0)}</div>
                                    <div className="text-[12px] text-[#888]">{product.reviewCount || 0} {t('product.reviewCount')}</div>
                                </div>
                            </div>

                            {/* Review Form */}
                            {isAuth ? (
                                <div className="mb-8 p-6 bg-[#faf7f4] rounded-lg border border-[#e5ddd4]">
                                    <h4 className="text-[15px] font-bold mb-4 text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
                                        {t('product.writeReview')}
                                    </h4>
                                    <div className="flex gap-1 mb-4 items-center">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span
                                                key={star}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="cursor-pointer text-[24px] transition-transform hover:scale-125"
                                                style={{ color: star <= (hoverRating || rating) ? '#b5624a' : '#ddd' }}
                                            >
                                                <FaStar />
                                            </span>
                                        ))}
                                        <span className="text-[13px] text-[#888] ml-3">{getRatingText(hoverRating || rating)}</span>
                                    </div>
                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        className="w-full p-4 border border-[#ddd] rounded-lg text-[13px] bg-white resize-y min-h-[100px] outline-none focus:border-[#b5624a] focus:ring-1 focus:ring-[#b5624a]/20 transition-all"
                                        placeholder={t('product.reviewPlaceholder')}
                                    />
                                    <button
                                        onClick={handleSubmitReview}
                                        disabled={submittingReview}
                                        className="mt-3 px-8 py-2.5 bg-[#1a1a1a] text-white text-[12px] uppercase tracking-[1.5px] rounded-lg hover:bg-[#b5624a] transition-colors disabled:opacity-50"
                                    >
                                        {submittingReview ? t('product.submitting') : t('product.submitReview')}
                                    </button>
                                </div>
                            ) : (
                                <div className="mb-8 p-5 bg-[#faf7f4] text-center text-[13px] text-[#555] rounded-lg border border-[#e5ddd4]">
                                    {t('product.loginToReviewMsg')}{' '}
                                    <span className="text-[#b5624a] cursor-pointer hover:underline font-medium" onClick={() => navigate('/auth/login')}>
                                        {t('nav.login')}
                                    </span>
                                </div>
                            )}

                            {/* Review List */}
                            {loadingReviews ? (
                                <p className="text-[#aaa] text-[13px]">{t('common.loading')}</p>
                            ) : reviews.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-[#aaa] text-[14px] mb-1">{t('product.noReviews')}</p>
                                    <p className="text-[#ccc] text-[13px]">{t('product.beFirstReview')}</p>
                                </div>
                            ) : (
                                <div>
                                    {reviews.map((review) => (
                                        <div key={review.id} className="py-5 border-b border-[#f0f0f0] last:border-none">
                                            <div className="flex justify-between items-start mb-2.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-[#f5f0e8] flex items-center justify-center text-[13px] font-bold text-[#8B6F47] shrink-0">
                                                        {(review.userName || 'U')[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <strong className="text-[13px] text-[#1a1a1a] block">{review.userName || 'Anonymous'}</strong>
                                                        <span className="text-[11px] text-[#aaa]">
                                                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">{renderStars(review.stars || review.rating || 0)}</div>
                                            </div>
                                            {review.title && <p className="text-[14px] font-medium text-[#1a1a1a] mb-1 m-0">{review.title}</p>}
                                            <p className="text-[13px] text-[#555] leading-[1.7] m-0 ml-12">{review.content || review.comment || ''}</p>
                                            {review.imageUrls && review.imageUrls.length > 0 && (
                                                <div className="flex gap-2 mt-2 ml-12">
                                                    {review.imageUrls.map((url, idx) => (
                                                        <img key={idx} src={url} alt="" className="w-16 h-16 object-cover rounded border border-[#eee]" />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* ── SẢN PHẨM TƯƠNG TỰ (5 sản phẩm) ── */}
            {/* ══════════════════════════════════════════════════════════ */}
            {similarProducts.length > 0 && (
                <div className="border-t border-[#eee] pt-12">
                    <h2 className="text-[22px] md:text-[26px] font-normal mb-8 text-[#1a1a1a] uppercase tracking-[1px] text-center" style={{ fontFamily: 'Georgia, serif' }}>
                        {t('product.similar')}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                        {similarProducts.map((item) => (
                            <div
                                key={item.id}
                                className="cursor-pointer group"
                                onClick={() => {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    navigate(`/product/${item.slug || item.id}`);
                                }}
                            >
                                <div className="aspect-square bg-[#f5f0e8] overflow-hidden mb-3 rounded-sm relative">
                                    <img
                                        src={item.primaryImageUrl || '/assets/image/placeholder.jpg'}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {item.oldPrice > 0 && (
                                        <span className="absolute top-2 left-2 bg-[#b5624a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                            -{Math.round((1 - item.price / item.oldPrice) * 100)}%
                                        </span>
                                    )}
                                    {!item.inStock && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="text-white text-[11px] uppercase tracking-[1px] font-bold">{t('product.outOfStock')}</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[12px] tracking-[0.5px] uppercase mb-1 text-[#1a1a1a] line-clamp-2 leading-[1.4]" style={{ fontFamily: 'var(--font-display)' }}>
                                    {item.name}
                                </p>
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="flex gap-0.5">{renderStars(item.averageRating || 0)}</div>
                                    {item.reviewCount > 0 && <span className="text-[11px] text-[#aaa]">({item.reviewCount})</span>}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[14px] text-[#1a1a1a] font-medium">{item.price?.toLocaleString('vi-VN')} ₫</span>
                                    {item.oldPrice > 0 && (
                                        <span className="text-[11px] text-[#aaa] line-through">{item.oldPrice?.toLocaleString('vi-VN')} ₫</span>
                                    )}
                                </div>
                                <button
                                    className="w-full p-2 bg-transparent border border-[#ddd] text-[10px] tracking-[1.5px] uppercase
                                               cursor-pointer transition-all duration-200 hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a]"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(isAuth
                                            ? addToCartServer({ productId: item.id, quantity: 1 })
                                            : addToGuestCart({ productId: item.id, quantity: 1, product: item })
                                        );
                                        toast.success(t('product.addedToCart'));
                                    }}
                                >
                                    {t('product.addToCart')}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Details;
