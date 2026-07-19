import React from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from '@/components/common/ProductCard';

export default function SimilarProducts({ similarProducts }) {
    const { t } = useTranslation();

    if (!similarProducts || similarProducts.length === 0) return null;

    return (
        <div className="details-similar">
            <h2 className="details-similar-title">
                You may also like
            </h2>
            <div className="details-similar-carousel">
                {similarProducts.map((item) => (
                    <div key={item.id} className="details-similar-carousel-item">
                        <ProductCard product={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}
