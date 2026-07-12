import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { homeApi } from './api/homeApi';
import { sharedApi } from '@/services/sharedApi';
import HeroSlider from './components/HeroSlider';
import CategorySlider from './components/CategorySlider';
import PromoBanner from './components/PromoBanner';
import Testimonials from './components/Testimonials';
import ProductCard from '@/components/common/ProductCard';
import './Home.css';

// ── CONSTANTS (Moved outside to prevent re-creation on every render) ──
const TESTIMONIALS_DATA = [
    {
        name: 'Hương Trà',
        role: 'Nhà thiết kế nội thất',
        avatar: 'https://i.pravatar.cc/150?u=1',
        text: 'Tôi luôn tin dùng gốm của shop cho các dự án thiết kế không gian tối giản. Chất men thô mộc và màu sắc tự nhiên thực sự tạo nên đẳng cấp khác biệt.',
    },
    {
        name: 'Minh Tuấn',
        role: 'Khách hàng thân thiết',
        avatar: 'https://i.pravatar.cc/150?u=2',
        text: 'Giao hàng rất cẩn thận, không có bất kỳ sứt mẻ nào. Bình hoa thực tế còn đẹp hơn trên ảnh, một món quà tuyệt vời cho vợ tôi nhân dịp kỷ niệm.',
    },
    {
        name: 'Ngọc Lan',
        role: 'Chủ tiệm trà',
        avatar: 'https://i.pravatar.cc/150?u=3',
        text: 'Những chiếc tách trà bằng gốm vuốt tay có độ nhám nhẹ, giữ nhiệt cực tốt. Khách hàng của tôi rất thích cảm giác cầm nắm chúng.',
    },
];

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
        subtitle: 'Tôn vinh vẻ đẹp nguyên bản và kỹ thuật vuốt tay truyền thống.',
        buttonText: 'Khám phá ngay',
        buttonLink: '/shop',
    },
    {
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=2000&auto=format&fit=crop',
        title: 'Không Gian Sống',
        subtitle: 'Tạo điểm nhấn bình yên cho ngôi nhà của bạn.',
        buttonText: 'Khám phá ngay',
        buttonLink: '/shop',
    }
];

// ── REUSABLE COMPONENTS ──
const ProductSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[300px] bg-[#eee] animate-pulse rounded-xl"></div>
        ))}
    </div>
);

const ProductSection = ({ subtitle, title, loading, products, bgColor = "bg-white", showViewAll = false, onNavigate }) => (
    <div className={`py-24 px-5 md:px-12 lg:px-20 ${bgColor}`}>
        <div className="text-center mb-16">
            <span className="text-[#b5624a] text-[11px] font-bold uppercase tracking-[3px] block mb-2">{subtitle}</span>
            <h2 className="text-[36px] md:text-[46px] font-display text-[#1a1a1a] leading-none">{title}</h2>
        </div>

        {loading ? (
            <ProductSkeleton />
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.slice(0, 8).map(prod => <ProductCard key={prod.id} product={prod} />)}
            </div>
        )}

        {showViewAll && !loading && (
            <div className="text-center mt-12">
                <button 
                    onClick={onNavigate} 
                    className="inline-block border-b-2 border-[#1a1a1a] text-[#1a1a1a] pb-1 text-[13px] font-bold uppercase tracking-[2px] hover:text-[#b5624a] hover:border-[#b5624a] transition-colors"
                >
                    Xem Tất Cả Đồ Mới
                </button>
            </div>
        )}
    </div>
);


export default function Home() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [homeBlocks, setHomeBlocks] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch Data using async/await for cleaner logic
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [catRes, bestRes, newRes, homeRes] = await Promise.all([
                    sharedApi.getCategories(),
                    homeApi.getBestSellers(8),
                    sharedApi.getProducts({ limit: 8, sort: 'newest' }),
                    homeApi.getHomeContent()
                ]);

                // Helper to extract data regardless of response format
                const extractData = (res) => {
                    if (!res) return [];
                    if (Array.isArray(res)) return res;
                    return res.data || [];
                };

                setCategories(extractData(catRes));
                const bestSellersData = extractData(bestRes);
                setBestSellers(bestSellersData);
                
                // Fallback newProducts to bestSellers if empty
                const newProductsData = extractData(newRes);
                setNewProducts(newProductsData.length > 0 ? newProductsData : bestSellersData.slice(0, 4));

                // Process home blocks gracefully
                const blockMap = {};
                const blocks = extractData(homeRes);
                
                blocks.forEach(b => {
                    try {
                        blockMap[b.blockKey] = { ...b, data: JSON.parse(b.dataJson) };
                    } catch {
                        blockMap[b.blockKey] = { ...b, data: {} };
                    }
                });
                
                setHomeBlocks(blockMap);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    // ── Prepare dynamic block data ──
    const heroData = homeBlocks['hero']?.data || {};
    const dynamicHeroSlides = heroData.slides?.length > 0 ? heroData.slides : FALLBACK_HERO_SLIDES;
    const promoData = homeBlocks['promo_banner']?.data;

    return (
        <div className="bg-[#faf7f4] min-h-screen">
            <HeroSlider slides={dynamicHeroSlides} />
            <CategorySlider categories={categories} />

            <ProductSection 
                subtitle="Bộ Sưu Tập 2024"
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

            <Testimonials testimonials={TESTIMONIALS_DATA} />
        </div>
    );
}
