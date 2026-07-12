import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectWishlistIds } from '@/store/slices/wishlistSlice';
import { wishlistApi } from './api/wishlistApi';
import toast from 'react-hot-toast';
import ProductCard from '@/components/common/ProductCard';
import WishlistHeroBanner from './components/WishlistHeroBanner';
import WishlistEmptyState from './components/WishlistEmptyState';

export default function Wishlist() {
    const wishlistIds = useSelector(selectWishlistIds);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (!wishlistIds || wishlistIds.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const fetchedProducts = await wishlistApi.getWishlistProducts(wishlistIds);
                setProducts(fetchedProducts);
            } catch (error) {
                console.error("Lỗi khi tải wishlist:", error);
                toast.error('Không thể tải danh sách yêu thích');
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistProducts();
    }, [wishlistIds]);

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
