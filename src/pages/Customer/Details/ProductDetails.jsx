import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addToGuestCart, addToCartServer } from '@/store/slices/cartSlice';
import { toggleCartDrawer } from '@/store/slices/uiSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { productApi } from './api/productApi';
import { useProductDetails, useProductReviews, useSimilarProducts } from '@/hooks/queries/useProducts';
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

    // Queries
    const { data: product, isLoading: loading, error } = useProductDetails(slug);
    const { data: reviewsData, isLoading: loadingReviews, refetch: refetchReviews } = useProductReviews(product?.id);
    const { data: similarProducts = [] } = useSimilarProducts(product?.id);
    
    const reviews = reviewsData?.items || [];

    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedColor, setSelectedColor] = useState(null);

    // Reviews states
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    // Initial setups when product loads
    useEffect(() => {
        if (product) {
            const primaryImg = product.images?.find((i) => i.isPrimary)?.url
                || product.images?.[0]?.url
                || product.primaryImageUrl;
            setSelectedImage(primaryImg);

            if (product.colors?.length > 0) {
                const validColors = product.colors.filter(c => c.id !== 0);
                if (validColors.length > 0) {
                    const inStockColor = validColors.find(c => c.stockQuantity > 0);
                    setSelectedColor(inStockColor || validColors[0]);
                } else {
                    setSelectedColor(null);
                }
            }
        }
    }, [product]);

    // Update quantity if color changes
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
            refetchReviews(); // Refetch the reviews after submitting
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
    if (error) return <div style={{ textAlign: 'center', padding: '5rem 0', color: '#888', fontSize: '16px' }}>{t('common.error')}: {error?.message || 'Lỗi'}</div>;
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

            <div className="details-bottom-grid">
                <div className="details-tabs-col">
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
                </div>
                
                <div className="details-additional-col">
                    <h3 className="details-additional-title">Additional Information</h3>
                    <div className="details-additional-list">
                        {product.material && (
                            <div className="details-additional-item">
                                <span className="details-additional-label">MATERIAL</span>
                                <span className="details-additional-val">{product.material}</span>
                            </div>
                        )}
                        {product.specifications && (
                            <div className="details-additional-item">
                                <span className="details-additional-label">DIMENSIONS / SPECS</span>
                                <span className="details-additional-val">{product.specifications}</span>
                            </div>
                        )}
                        {product.usageGuide && (
                            <div className="details-additional-item">
                                <span className="details-additional-label">USAGE GUIDE</span>
                                <span className="details-additional-val">{product.usageGuide}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <SimilarProducts similarProducts={similarProducts} />
        </div>
    );
}
