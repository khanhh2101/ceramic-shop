import { useSelector } from 'react-redux';
import { selectWishlistIds } from '@/store/slices/wishlistSlice';
import { useWishlistProducts } from './hooks/useWishlistQueries';
import ProductCard from '@/components/common/ProductCard';
import WishlistHeroBanner from './components/WishlistHeroBanner';
import WishlistEmptyState from './components/WishlistEmptyState';

export default function Wishlist() {
    const wishlistIds = useSelector(selectWishlistIds);
    const { data: products = [], isLoading: loading } = useWishlistProducts(wishlistIds);

    return (
        <div className="bg-white min-h-screen pb-24">
            <WishlistHeroBanner />

            <div className="max-w-[1400px] mx-auto px-5 md:px-12 lg:px-20">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="opacity-40">
                                <div className="bg-[#f0f0f0] rounded-sm h-[250px] mb-2.5" />
                                <div className="bg-[#f0f0f0] h-3 my-2 rounded-sm" />
                                <div className="bg-[#f0f0f0] h-3.5 rounded-sm w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <WishlistEmptyState />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
