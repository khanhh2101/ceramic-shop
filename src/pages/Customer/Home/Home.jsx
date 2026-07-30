import { useNavigate } from 'react-router-dom';
import { useHomeData } from '@/pages/Customer/Home/hooks/useHomeData';
import { useCategories } from '@/hooks/queries/useMasterData';
import { useProducts } from '@/hooks/queries/useProducts';
import HeroSlider from './components/HeroSlider';
import CategorySlider from './components/CategorySlider';
import PromoBanner from './components/PromoBanner';
import ProductCard from '@/components/common/ProductCard';
import './Home.css';

// ── CONSTANTS (Moved outside to prevent re-creation on every render) ──

const FALLBACK_HERO_SLIDES = [
    {
        image: '/assets/image/home/home.png',
        title: 'Hơi Thở Của Đất',
        subtitle: 'Khám phá sự tinh tế trong từng đường nét gốm thủ công.',
        buttonText: 'Khám phá ngay',
        buttonLink: '/shop',
    },
    {
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2000&auto=format&fit=crop',
        title: 'Nghệ Thuật Mộc Mạc',
        subtitle:
            'Tôn vinh vẻ đẹp nguyên bản và kỹ thuật vuốt tay truyền thống.',
        buttonText: 'Khám phá ngay',
        buttonLink: '/shop',
    },
    {
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=2000&auto=format&fit=crop',
        title: 'Không Gian Sống',
        subtitle: 'Tạo điểm nhấn bình yên cho ngôi nhà của bạn.',
        buttonText: 'Khám phá ngay',
        buttonLink: '/shop',
    },
];

// ── REUSABLE COMPONENTS ──
const ProductSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
            <div
                key={i}
                className="h-[300px] bg-[#eee] animate-pulse rounded-xl"
            ></div>
        ))}
    </div>
);

const ProductSection = ({
    subtitle,
    title,
    loading,
    products,
    bgColor = 'bg-white',
    showViewAll = false,
    onNavigate,
}) => (
    <div className={`py-24 px-5 md:px-12 lg:px-20 ${bgColor}`}>
        <div className="text-center mb-16">
            <span className="text-[#b5624a] text-[11px] font-bold uppercase tracking-[3px] block mb-2">
                {subtitle}
            </span>
            <h2 className="text-[36px] md:text-[46px] font-display text-[#1a1a1a] leading-none">
                {title}
            </h2>
        </div>

        {loading ? (
            <ProductSkeleton />
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.slice(0, 8).map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                ))}
            </div>
        )}

        {showViewAll && !loading && (
            <div className="text-center mt-12">
                <button
                    onClick={onNavigate}
                    className="inline-block border-b-2 border-[#1a1a1a] text-[#1a1a1a] pb-1 text-[13px] font-bold uppercase tracking-[2px] hover:text-[#b5624a] hover:border-[#b5624a] transition-colors"
                >
                    Xem tất cả đồ mới
                </button>
            </div>
        )}
    </div>
);

export default function Home() {
    const navigate = useNavigate();

    // Fetch data using React Query hooks
    const { data: categories = [] } = useCategories();

    // Instead of useProducts with sort='newest', we'll rely on the existing hooks.
    // If useProducts has an issue, it's better to fetch bestSellers and newProducts through useHomeData.
    // Let's use useHomeData for everything to be consistent with the backend changes.
    const { data: homeData, isLoading: loading } = useHomeData();
    const {
        bestSellers = [],
        newProducts = [],
        homeBlocks = {},
    } = homeData || {};

    // ── Prepare dynamic block data ──
    const heroData = homeBlocks['hero']?.data || {};
    const dynamicHeroSlides =
        heroData.slides?.length > 0 ? heroData.slides : FALLBACK_HERO_SLIDES;
    const promoData = homeBlocks['promo_banner']?.data;

    return (
        <div className="bg-[#faf7f4] min-h-screen">
            <HeroSlider slides={dynamicHeroSlides} />
            <CategorySlider categories={categories} />

            <ProductSection
                title="Sản Phẩm Mới"
                loading={loading}
                products={newProducts}
                bgColor="bg-[#faf7f4]"
                showViewAll={true}
                onNavigate={() => navigate('/shop')}
            />

            {promoData && <PromoBanner promoData={promoData} />}

            <ProductSection
                subtitle="Được Yêu Thích Nhất"
                title="Sản Phẩm Nổi Bật"
                loading={loading}
                products={bestSellers}
                bgColor="bg-white"
            />
        </div>
    );
}
