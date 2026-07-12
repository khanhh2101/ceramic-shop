import React from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from '@/components/common/ProductCard';

export default function SimilarProducts({ similarProducts }) {
    const { t } = useTranslation();

    if (!similarProducts || similarProducts.length === 0) return null;

    return (
        <div className="details-similar">
            <h2 className="details-similar-title">
                {t('product.similar')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
                {similarProducts.map((item) => (
                    <ProductCard key={item.id} product={item} />
                ))}
            </div>
        </div>
    );
}
