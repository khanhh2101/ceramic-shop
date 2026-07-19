import React from 'react';
import { useTranslation } from 'react-i18next';
import { renderStars } from '../utils.jsx';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ProductInfo({
    product,
    inStock,
    discountPercent,
    selectedColor,
    setSelectedColor,
    quantity,
    handleQuantity,
    handleAddToCart,
    handleWishlist,
    isWishlisted
}) {
    const { t } = useTranslation();

    const currentStock = selectedColor ? (selectedColor.stockQuantity || 0) : (product.stockQuantity || 0);
    const isCurrentlyInStock = currentStock > 0;

    const handleShare = (platform) => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Check out ${product.name} at Ceramic Shop!`);
        let shareUrl = '';

        if (platform === 'facebook') {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        } else if (platform === 'twitter') {
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        } else if (platform === 'instagram') {
            navigator.clipboard.writeText(window.location.href);
            toast.success(t('product.linkCopied', 'Link copied to clipboard!'));
            return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    return (
        <div className="details-info-wrap">
            {product.categoryName && (
                <div className="details-info-category">{product.categoryName}</div>
            )}
            <h1 className="details-info-title">
                {product.name}
            </h1>

            <div className="details-info-meta-top">
                <div className="details-rating">
                    <div className="details-rating-stars">{renderStars(product.averageRating || 0)}</div>
                    <span className="details-rating-count">{product.reviewCount || 0} reviews</span>
                </div>
            </div>

            {/* Giá */}
            <div className="details-price-wrap">
                <span className="details-price-current">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </span>
                {product.oldPrice > product.price && (
                    <>
                        <span className="details-price-old">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.oldPrice)}</span>
                        <span className="details-price-discount">-{discountPercent}%</span>
                    </>
                )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
                <p className="details-desc-short">
                    {product.shortDescription}
                </p>
            )}

            <div className="details-info-options">
                {/* Chất liệu inline */}
                {product.material && (
                    <div className="details-option-row">
                        <span className="details-option-label">{t('product.material')}</span>
                        <span className="details-option-val">{product.material}</span>
                    </div>
                )}
                
                {/* Màu sắc */}
                {product.colors && product.colors.filter(c => c.id !== 0).length > 0 && (
                    <div className="details-option-row details-colors-wrap">
                        <span className="details-option-label">
                            {t('product.color')}: <span style={{ fontWeight: 600, color: '#1a1a1a', marginLeft: '0.5rem' }}>{selectedColor?.id !== 0 ? selectedColor?.name : ''}</span>
                        </span>
                        <div className="details-colors-list">
                            {product.colors.filter(c => c.id !== 0).map((c) => {
                                const hex = c.hexColor || '#ccc';
                                const isSelected = selectedColor?.id === c.id;
                                const isLight = ['#FFFFFF', '#FFF8DC', '#D4B99A'].includes(hex.toUpperCase());
                                const colorStock = c.stockQuantity || 0;
                                const isColorOutOfStock = colorStock <= 0;
                                return (
                                    <button
                                        key={c.id || c.name} title={`${c.name} ${isColorOutOfStock ? '(Hết hàng)' : ''}`} onClick={() => !isColorOutOfStock && setSelectedColor(c)}
                                        className={`details-color-btn ${isSelected ? 'active' : ''} ${isLight ? 'light' : 'dark'} ${isColorOutOfStock ? 'disabled' : ''}`}
                                        style={{ backgroundColor: hex, opacity: isColorOutOfStock ? 0.3 : 1, cursor: isColorOutOfStock ? 'not-allowed' : 'pointer' }}
                                        disabled={isColorOutOfStock}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="details-info-meta-bottom">
                <p className={`details-stock ${isCurrentlyInStock ? 'instock' : 'outstock'}`}>
                    Availability: <span>{isCurrentlyInStock ? `${currentStock} in stock` : 'Out of stock'}</span>
                </p>
                {product.code && (
                    <div className="details-sku">
                        SKU: <span>{product.code}</span>
                    </div>
                )}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
                <div className="details-tags">
                    {product.tags.map((tag) => (
                        <span key={tag.id || tag.name} className="details-tag"
                                style={{ backgroundColor: tag.hexColor || '#f7f7f7', color: tag.hexColor ? '#fff' : '#666' }}>
                            {tag.name}
                        </span>
                    ))}
                </div>
            )}



            {/* Số lượng & Thêm vào giỏ */}
            <div className="details-actions-row">
                <div className="details-qty-controls">
                    <button onClick={() => handleQuantity('decrease')} className="details-qty-btn">-</button>
                    <span className="details-qty-val">{quantity}</span>
                    <button onClick={() => handleQuantity('increase')} className="details-qty-btn">+</button>
                </div>
                <button
                    className="details-btn-add"
                    onClick={handleAddToCart} disabled={!isCurrentlyInStock}
                >
                    {isCurrentlyInStock ? 'Add to cart' : t('product.outOfStock')}
                </button>
                <button
                    className={`details-btn-wish ${isWishlisted ? 'active' : ''}`}
                    onClick={handleWishlist}
                >
                    {isWishlisted ? '♥' : '♡'}
                </button>
            </div>

            <div className="details-share">
                <span className="details-share-label">SHARE ON:</span>
                <div className="details-share-icons">
                    <button onClick={() => handleShare('facebook')} className="share-icon fb" title="Share on Facebook">
                        <FaFacebookF />
                    </button>
                    <button onClick={() => handleShare('twitter')} className="share-icon tw" title="Share on Twitter">
                        <FaTwitter />
                    </button>
                    <button onClick={() => handleShare('instagram')} className="share-icon ig" title="Copy Link">
                        <FaInstagram />
                    </button>
                </div>
            </div>
        </div>
    );
}
