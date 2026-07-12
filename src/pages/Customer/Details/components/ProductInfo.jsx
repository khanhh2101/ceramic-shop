import React from 'react';
import { useTranslation } from 'react-i18next';
import { renderStars } from '../utils.jsx';

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

    return (
        <div>
            <h1 className="details-info-title">
                {product.name}
            </h1>

            <div className="details-info-meta">
                <p className={`details-stock ${isCurrentlyInStock ? 'instock' : 'outstock'}`} style={{ whiteSpace: 'nowrap' }}>
                    ● {isCurrentlyInStock ? t('product.inStock') : t('product.outOfStock')} (Còn {currentStock} sản phẩm)
                </p>
                {product.code && (
                    <div className="details-sku">
                        <span className="details-sku-label">SKU:</span>
                        <span className="details-sku-val">{product.code}</span>
                    </div>
                )}
                <div className="details-rating">
                    <div className="details-rating-stars">{renderStars(product.averageRating || 0)}</div>
                    <span className="details-rating-count">({product.reviewCount || 0} {t('product.reviewCount')})</span>
                </div>
                {product.isFreeShip && (
                    <span className="details-freeship">{t('product.freeship')}</span>
                )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
                <p className="details-desc-short">
                    {product.shortDescription}
                </p>
            )}

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

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
                <div className="details-tags">
                    {product.tags.map((tag) => (
                        <span key={tag.id || tag.name} className="details-tag"
                                style={{ backgroundColor: tag.hexColor || '#faf7f4', color: tag.hexColor ? '#fff' : '#8B6F47', border: tag.hexColor ? 'none' : '1px solid #e5ddd4' }}>
                            {tag.name}
                        </span>
                    ))}
                </div>
            )}

            {/* Màu sắc */}
            {product.colors && product.colors.length > 0 && (
                <div className="details-colors-wrap">
                    <span className="details-colors-label">
                        {t('product.color')}: <span className="details-colors-val">{selectedColor?.name || ''}</span>
                    </span>
                    <div className="details-colors-list">
                        {product.colors.map((c) => {
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

            {/* Chất liệu & Kích thước inline */}
            <div className="details-specs">
                {product.material && (
                    <span><span className="details-specs-label">{t('product.material')}:</span> {product.material}</span>
                )}
                {product.specifications && (
                    <span><span className="details-specs-label">{t('product.size')}:</span> {product.specifications}</span>
                )}
            </div>

            {/* Số lượng */}
            <div className="details-qty-wrap">
                <span className="details-qty-label">
                    {t('product.quantity')}
                </span>
                <div className="details-qty-controls">
                    <button onClick={() => handleQuantity('decrease')} className="details-qty-btn">-</button>
                    <span className="details-qty-val">{quantity}</span>
                    <button onClick={() => handleQuantity('increase')} className="details-qty-btn">+</button>
                </div>
            </div>

            {/* Actions */}
            <div className="details-actions">
                <button
                    className="details-btn-add"
                    onClick={handleAddToCart} disabled={!isCurrentlyInStock}
                >
                    {isCurrentlyInStock ? t('product.addToCart') : t('product.outOfStock')}
                </button>
                <button
                    className={`details-btn-wish ${isWishlisted ? 'active' : ''}`}
                    onClick={handleWishlist}
                >
                    {isWishlisted ? '♥' : '♡'}
                </button>
            </div>
        </div>
    );
}
