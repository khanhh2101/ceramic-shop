import React from 'react';

export default function ProductGallery({ product, selectedImage, setSelectedImage, discountPercent }) {
    return (
        <div className="details-gallery-wrap">
            {product.images && product.images.length > 0 && (
                <div className="details-gallery-thumbs">
                    {product.images.map((img) => (
                        <div key={img.id} className={`details-gallery-thumb-wrap ${selectedImage === img.url ? 'active' : ''}`}>
                            <img
                                src={img.url}
                                alt=""
                                onClick={() => setSelectedImage(img.url)}
                                onError={(e) => { e.target.style.display = 'none'; }}
                                className="details-gallery-thumb"
                            />
                        </div>
                    ))}
                </div>
            )}
            <div className="details-gallery-main">
                <img
                    src={selectedImage || 'https://placehold.co/600x800/eeeeee/999999?text=Gom+Nau'}
                    alt={product.name}
                    className="details-gallery-main-img"
                />
            </div>
        </div>
    );
}
