import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addToGuestCart, addToCartServer } from '@/store/slices/cartSlice';
import { toggleCartDrawer } from '@/store/slices/uiSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { productApi } from './api/productApi';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';

import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import SimilarProducts from './components/SimilarProducts';
import './ProductDetails.css';

export default function ProductDetails() {
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
        productApi.getProduct(slug)
            .then((res) => {
                const data = res?.data || res;
                setProduct(data);
                const primaryImg = data.images?.find((i) => i.isPrimary)?.url
                    || data.images?.[0]?.url
                    || data.primaryImageUrl;
                setSelectedImage(primaryImg);
                if (data.colors?.length > 0) {
                    const inStockColor = data.colors.find(c => c.stockQuantity > 0);
                    setSelectedColor(inStockColor || data.colors[0]);
                }
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
            productApi.getReviews(product.id)
                .then((res) => {
                    const d = res;
                    setReviews(Array.isArray(d) ? d : (d?.items || d?.data || []));
                })
                .catch(() => setReviews([]))
                .finally(() => setLoadingReviews(false));
        }
    }, [product?.id]);

    // ── Fetch similar products (limit 5) ──
    useEffect(() => {
        if (product?.id) {
            productApi.getSimilarProducts(product.id)
                .then((res) => {
                    const d = res;
                    const items = Array.isArray(d) ? d : (d?.data || d?.items || []);
                    setSimilarProducts(items.slice(0, 5));
                })
                .catch(() => setSimilarProducts([]));
        }
    }, [product?.id]);

    // ── Cập nhật lại số lượng nếu đổi màu có tồn kho ít hơn số lượng đang chọn ──
    useEffect(() => {
        const currentStock = selectedColor ? (selectedColor.stockQuantity || 0) : (product?.stockQuantity || 0);
        if (quantity > currentStock && currentStock > 0) {
            setQuantity(currentStock);
        }
    }, [selectedColor, product?.stockQuantity, quantity]);

    const handleQuantity = (type) => {
        const currentStock = selectedColor ? (selectedColor.stockQuantity || 0) : (product?.stockQuantity || 0);
        if (type === 'decrease' && quantity > 1) setQuantity(quantity - 1);
        if (type === 'increase' && quantity < currentStock) setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        const currentStock = selectedColor ? (selectedColor.stockQuantity || 0) : (product?.stockQuantity || 0);
        const inStock = currentStock > 0;
        if (!inStock) { toast.error(t('product.outOfStock')); return; }
        
        const colorId = selectedColor?.id !== undefined ? selectedColor.id : null;
        const colorName = selectedColor?.name || null;
        
        if (isAuth) {
            dispatch(addToCartServer({ productId: product.id, quantity, colorId, color: colorName }));
        } else {
            dispatch(addToGuestCart({ productId: product.id, quantity, colorId, color: colorName, product }));
        }
        dispatch(toggleCartDrawer());
        toast.success(t('product.addedToCart'));
    };

    const handleSubmitReview = async () => {
        if (!reviewComment.trim()) { toast.error(t('product.reviewContent')); return; }
        try {
            setSubmittingReview(true);
            await productApi.submitReview({
                productId: product.id,
                stars: rating,
                title: '',
                content: reviewComment,
                imageUrls: []
            });
            toast.success(t('product.reviewSent'));
            setReviewComment('');
            setRating(5);
            const res = await productApi.getReviews(product.id);
            const d = res;
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

    if (loading && !product) return (
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: '5rem', paddingBottom: '5rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', width: '2rem', height: '2rem', border: '2px solid #ddd', borderTopColor: '#b5624a', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem', fontSize: '14px', color: '#888' }}>{t('common.loading')}</p>
        </div>
    );
    if (error) return <div style={{ textAlign: 'center', padding: '5rem 0', color: '#888', fontSize: '16px' }}>{t('common.error')}: {error}</div>;
    if (!product) return null;

    const isWishlisted = wishlistIds.includes(product.id);
    const inStock = product.stockQuantity > 0;
    const discountPercent = product.oldPrice > product.price ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

    const cleanDescription = DOMPurify.sanitize(product?.description || t('common.noData'), { 
        ADD_TAGS: ['mark', 'iframe'],
        ADD_ATTR: ['style', 'width', 'height', 'target', 'href', 'allowfullscreen'] 
    });

    return (
        <div className={`details-main ${loading ? 'loading' : ''}`}>
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
            
            {/* Breadcrumb */}
            <div className="details-breadcrumb">
                <span className="details-breadcrumb-link" onClick={() => navigate('/')}>{t('nav.home')}</span>
                <span>/</span>
                <span className="details-breadcrumb-link" onClick={() => navigate('/shop')}>{t('nav.shop')}</span>
                <span>/</span>
                <span className="details-breadcrumb-current">{product.name}</span>
            </div>

            {/* Layout Grid */}
            <div className="details-layout">
                <ProductGallery 
                    product={product} 
                    selectedImage={selectedImage} 
                    setSelectedImage={setSelectedImage} 
                    discountPercent={discountPercent} 
                />
                
                <ProductInfo 
                    product={product}
                    inStock={inStock}
                    discountPercent={discountPercent}
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                    quantity={quantity}
                    handleQuantity={handleQuantity}
                    handleAddToCart={handleAddToCart}
                    handleWishlist={handleWishlist}
                    isWishlisted={isWishlisted}
                />
            </div>

            <ProductTabs 
                product={product}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                cleanDescription={cleanDescription}
                reviews={reviews}
                loadingReviews={loadingReviews}
                isAuth={isAuth}
                rating={rating}
                setRating={setRating}
                hoverRating={hoverRating}
                setHoverRating={setHoverRating}
                reviewComment={reviewComment}
                setReviewComment={setReviewComment}
                handleSubmitReview={handleSubmitReview}
                submittingReview={submittingReview}
            />

            <SimilarProducts similarProducts={similarProducts} />
        </div>
    );
}
