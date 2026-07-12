import React from 'react';

export default function ProductGallery({ product, selectedImage, setSelectedImage, discountPercent }) {
    return (
        <div>
            <div className="details-gallery-main">
                {discountPercent > 0 && (
                    <span className="details-gallery-discount">
                        -{discountPercent}%
                    </span>
                )}
                <img
                    src={selectedImage || 'https://placehold.co/600x800/eeeeee/999999?text=Gom+Nau'}
                    alt={product.name}
                    className="details-gallery-main-img"
                />
            </div>
            {product.images && product.images.length > 0 && (
                <div className="details-gallery-thumbs">
                    {product.images.map((img) => (
                        <img
                            key={img.id}
                            src={img.url}
                            alt=""
                            onClick={() => setSelectedImage(img.url)}
                            onError={(e) => { e.target.style.display = 'none'; }}
                            className={`details-gallery-thumb ${selectedImage === img.url ? 'active' : ''}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
