import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToGuestCart, addToCartServer } from '../../store/slices/cartSlice';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

export default function Home() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuthenticated);

    const [categories, setCategories] = useState([]);
    const [bestSellers, setBestSellers] = useState([]); // Sản phẩm nổi bật
    const [newProducts, setNewProducts] = useState([]); // Sản phẩm mới
    const [homeBlocks, setHomeBlocks] = useState({}); // Dữ liệu HomeContent động
    const [loading, setLoading] = useState(true);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    // Hero Slides
    const heroSlides = [
        {
            image: '/assets/image/home/home.png',
            title: 'Hơi Thở Của Đất',
            subtitle: 'Khám phá sự tinh tế trong từng đường nét gốm thủ công.',
        },
        {
            image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2000&auto=format&fit=crop',
            title: 'Nghệ Thuật Mộc Mạc',
            subtitle:
                'Tôn vinh vẻ đẹp nguyên bản và kỹ thuật vuốt tay truyền thống.',
        },
        {
            image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=2000&auto=format&fit=crop',
            title: 'Không Gian Sống',
            subtitle: 'Tạo điểm nhấn bình yên cho ngôi nhà của bạn.',
        },
    ];

    const testimonials = [
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

    // Fetch Data
    useEffect(() => {
        Promise.all([
            api.get('/categories'),
            api.get('/products/bestsellers', { params: { count: 8 } }),
            api.get('/products', { params: { limit: 8, sort: 'newest' } }), // Lấy sp mới
            api.get('/settings/home'), // Lấy Home Content
        ])
            .then(([catRes, bestRes, newRes, homeRes]) => {
                setCategories(catRes.data.data || []);
                setBestSellers(bestRes.data.data || []);
                setNewProducts(
                    newRes.data.data || bestRes.data.data?.slice(0, 4) || [],
                ); // fallback nếu ko có sp mới

                // Xử lý home contents
                const blocks = homeRes.data.data || [];
                const blockMap = {};
                blocks.forEach((b) => {
                    try {
                        blockMap[b.blockKey] = {
                            ...b,
                            data: JSON.parse(b.dataJson),
                        };
                    } catch (e) {
                        blockMap[b.blockKey] = { ...b, data: {} };
                    }
                });
                setHomeBlocks(blockMap);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    // ── Xử lý dữ liệu động cho Hero Slider ──
    const heroData = homeBlocks['hero']?.data || {};
    let dynamicHeroSlides = heroData.slides || [];

    // Fallback if there are no slides or using old format
    if (!dynamicHeroSlides.length) {
        dynamicHeroSlides = [
            {
                image: heroData.image1 || '/assets/image/home/home.png',
                title: heroData.title1 || 'Hơi Thở Của Đất',
                subtitle:
                    heroData.subtitle1 ||
                    'Khám phá sự tinh tế trong từng đường nét gốm thủ công.',
                buttonText: heroData.buttonText1 || 'Khám phá ngay',
                buttonLink: heroData.buttonLink1 || '/shop',
            },
            {
                image:
                    heroData.image2 ||
                    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2000&auto=format&fit=crop',
                title: heroData.title2 || 'Nghệ Thuật Mộc Mạc',
                subtitle:
                    heroData.subtitle2 ||
                    'Tôn vinh vẻ đẹp nguyên bản và kỹ thuật vuốt tay truyền thống.',
                buttonText: heroData.buttonText2 || 'Khám phá ngay',
                buttonLink: heroData.buttonLink2 || '/shop',
            },
            {
                image:
                    heroData.image3 ||
                    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=2000&auto=format&fit=crop',
                title: heroData.title3 || 'Không Gian Sống',
                subtitle:
                    heroData.subtitle3 ||
                    'Tạo điểm nhấn bình yên cho ngôi nhà của bạn.',
                buttonText: heroData.buttonText3 || 'Khám phá ngay',
                buttonLink: heroData.buttonLink3 || '/shop',
            },
        ];
    }

    // ── Xử lý dữ liệu Promo Banner ──
    const promoBlock = homeBlocks['promo_banner'];
    const promoData = promoBlock?.data || {};

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        if (isAuth) {
            dispatch(addToCartServer({ productId: product.id, quantity: 1 }));
        } else {
            dispatch(
                addToGuestCart({ productId: product.id, quantity: 1, product }),
            );
        }
        toast.success('Đã thêm vào giỏ hàng!');
    };

    const renderProductCard = (prod) => (
        <div
            key={prod.id}
            className="cursor-pointer group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-[#eee] overflow-hidden flex flex-col h-full"
            onClick={() => navigate(`/product/${prod.slug || prod.id}`)}
        >
            <div className="relative overflow-hidden h-[220px] bg-[#fcf9f5]">
                <img
                    src={
                        prod.primaryImageUrl || '/assets/image/placeholder.jpg'
                    }
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                />
                {prod.oldPrice > 0 && (
                    <span className="absolute top-3 left-3 bg-[#b5624a] text-white text-[11px] font-bold py-1 px-2.5 rounded-full uppercase tracking-[1px] shadow-sm">
                        -{Math.round((1 - prod.price / prod.oldPrice) * 100)}%
                    </span>
                )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <p className="text-[10px] text-[#888] mb-1.5 uppercase tracking-[2px] font-bold">
                    {prod.categoryName}
                </p>
                <h3 className="text-[16px] text-[#1a1a1a] font-display font-medium leading-[1.3] mb-3 group-hover:text-[#b5624a] transition-colors line-clamp-2">
                    {prod.name}
                </h3>
                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <p className="text-[16px] text-[#1a1a1a] font-bold">
                            {prod.price?.toLocaleString('vi-VN')} ₫
                        </p>
                        {prod.oldPrice > 0 && (
                            <p className="text-[12px] text-[#aaa] line-through">
                                {prod.oldPrice?.toLocaleString('vi-VN')} ₫
                            </p>
                        )}
                    </div>
                    <button
                        className="w-10 h-10 rounded-full bg-[#faf7f4] border border-[#eee] flex items-center justify-center hover:bg-[#b5624a] hover:text-white hover:border-[#b5624a] transition-all"
                        onClick={(e) => handleAddToCart(e, prod)}
                        title="Thêm vào giỏ"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-[#faf7f4] min-h-screen">
            {/* ── HERO SLIDER (3 Images, Effect Fade, Autoplay) ── */}
            <div className="w-full h-[70vh] min-h-[600px]">
                <Swiper
                    modules={[Pagination, Autoplay, EffectFade]}
                    effect="fade"
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop={true}
                    className="w-full h-full hero-swiper"
                >
                    {dynamicHeroSlides.map((slide, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img
                                    className="absolute inset-0 w-full h-full object-cover z-0"
                                    src={slide.image}
                                    alt={slide.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-[1]" />
                                <div className="relative z-[2] text-center max-w-3xl px-6 animate-slide-up">
                                    <h1 className="text-white mb-6 leading-[1.1] text-[48px] md:text-[64px] lg:text-[72px] font-display drop-shadow-lg">
                                        {slide.title}
                                    </h1>
                                    <p className="text-[15px] md:text-[18px] text-white/90 mb-10 leading-[1.6] max-w-xl mx-auto font-light">
                                        {slide.subtitle}
                                    </p>
                                    <button
                                        className="bg-[#b5624a] text-white border-none py-3.5 px-10 text-[13px] font-bold tracking-[2px] uppercase rounded-full 
                                                   cursor-pointer transition-all duration-300 hover:bg-white hover:text-[#b5624a] shadow-lg hover:shadow-xl hover:-translate-y-1"
                                        onClick={() =>
                                            navigate(
                                                slide.buttonLink || '/shop',
                                            )
                                        }
                                    >
                                        {slide.buttonText || 'Khám phá ngay'}
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* ── DANH MỤC (Category Slider with Next/Prev) ── */}
            <div className="py-24 px-5 md:px-12 lg:px-20 bg-white">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <span className="text-[#b5624a] text-[11px] font-display font-bold uppercase tracking-[3px] block mb-2">
                            Champa Clay
                        </span>
                        <h2 className="text-[32px] md:text-[42px] font-display text-[#1a1a1a] leading-none">
                            Danh Mục Sản Phẩm
                        </h2>
                    </div>
                    {/* Custom Nav Buttons */}
                    <div className="hidden md:flex gap-3">
                        <button
                            ref={prevRef}
                            className="w-10 h-10 rounded-full border border-[#ddd] flex items-center justify-center text-[#555] hover:bg-[#b5624a] hover:text-white hover:border-[#b5624a] transition-all"
                        >
                            <FiChevronLeft size={20} />
                        </button>
                        <button
                            ref={nextRef}
                            className="w-10 h-10 rounded-full border border-[#ddd] flex items-center justify-center text-[#555] hover:bg-[#b5624a] hover:text-white hover:border-[#b5624a] transition-all"
                        >
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    onInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                        swiper.navigation.init();
                        swiper.navigation.update();
                    }}
                    spaceBetween={24}
                    breakpoints={{
                        0: { slidesPerView: 1.2 },
                        480: { slidesPerView: 2.2 },
                        768: { slidesPerView: 3.5 },
                        1024: { slidesPerView: 4.5 },
                        1280: { slidesPerView: 5 },
                    }}
                    className="w-full pb-5"
                >
                    {(categories.length === 0
                        ? [
                              {
                                  image: '/assets/image/home/categories1.jpg',
                                  name: 'Bình hoa gốm',
                              },
                              {
                                  image: '/assets/image/home/categories2.jpg',
                                  name: 'Chậu trồng cây',
                              },
                              {
                                  image: '/assets/image/home/categories3.jpg',
                                  name: 'Gạch men',
                              },
                              {
                                  image: '/assets/image/home/categories4.jpg',
                                  name: 'Trang trí nhà cửa',
                              },
                              {
                                  image: '/assets/image/home/categories5.jpg',
                                  name: 'Đồ dùng nhà bếp',
                              },
                          ]
                        : categories
                    ).map((cat, idx) => (
                        <SwiperSlide key={cat.id || idx}>
                            <div
                                className="cursor-pointer group block"
                                onClick={() =>
                                    navigate(`/shop?categoryId=${cat.id || ''}`)
                                }
                            >
                                <div className="bg-[#fcf9f5] rounded-2xl overflow-hidden mb-4 h-[240px] md:h-[280px] shadow-sm relative">
                                    <img
                                        src={
                                            cat.imageUrl ||
                                            cat.image ||
                                            '/assets/image/home/categories1.jpg'
                                        }
                                        alt={cat.name}
                                        className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                                </div>
                                <h3 className="text-[16px] text-[#1a1a1a] font-display font-medium text-center group-hover:text-[#b5624a] transition-colors">
                                    {cat.name}
                                </h3>
                                {(cat.productCount || 0) > 0 && (
                                    <p className="text-center text-[12px] text-[#888] font-light mt-1">
                                        {cat.productCount} sản phẩm
                                    </p>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* ── SẢN PHẨM MỚI ── */}
            <div className="py-24 px-5 md:px-12 lg:px-20 bg-[#faf7f4]">
                <div className="text-center mb-16">
                    <span className="text-[#b5624a] text-[11px] font-displayfont-bold uppercase tracking-[3px] block mb-2">
                        Bộ Sưu Tập 2024
                    </span>
                    <h2 className="text-[36px] md:text-[46px] font-display text-[#1a1a1a] leading-none">
                        Sản Phẩm Mới
                    </h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-[300px] bg-[#eee] animate-pulse rounded-xl"
                            ></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {newProducts.slice(0, 8).map(renderProductCard)}
                    </div>
                )}

                <div className="text-center mt-12">
                    <button
                        onClick={() => navigate('/shop')}
                        className="inline-block border-b-2 border-[#1a1a1a] text-[#1a1a1a] pb-1 text-[13px] font-display font-bold uppercase tracking-[2px] hover:text-[#b5624a] hover:border-[#b5624a] transition-colors"
                    >
                        Xem Tất Cả Đồ Mới
                    </button>
                </div>
            </div>

            {/* ── REDESIGNED PROMO BANNER (Chỉ hiện khi isVisible = true) ── */}
            {promoBlock && (
                <div className="bg-[#e6ddcf] text-[#1a1a1a]">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Ảnh bên trái */}
                        <div className="relative h-[400px] lg:h-[600px] overflow-hidden group">
                            <img
                                src={
                                    promoData.image ||
                                    'https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?q=80&w=1200&auto=format&fit=crop'
                                }
                                alt="Khuyến mãi"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]"
                            />
                        </div>
                        {/* Content bên phải */}
                        <div className="flex flex-col justify-center p-12 lg:p-24 relative overflow-hidden">
                            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white rounded-full blur-[100px] opacity-40"></div>
                            <span className="text-[#b5624a] text-[12px] font-bold uppercase tracking-[4px] mb-4 relative z-10">
                                {promoData.tag || 'Ưu Đãi Đặc Biệt'}
                            </span>
                            <h2
                                className="text-[42px] md:text-[56px] font-display leading-[1.1] mb-6 relative z-10 text-[#1a1a1a]"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        promoData.title?.replace(
                                            '\n',
                                            '<br/>',
                                        ) ||
                                        'Khơi Nguồn <br/> <span className="italic text-[#8a3e2a]">Sự Tĩnh Lặng</span>',
                                }}
                            ></h2>
                            <p className="text-[#555] text-[16px] leading-[1.8] mb-10 max-w-md font-light relative z-10">
                                {promoData.description ||
                                    'Giảm đến 40% cho toàn bộ sưu tập chậu trồng cây và đồ trang trí. Mang thiên nhiên vào nhà với phong cách tối giản mộc mạc nhất.'}
                            </p>
                            <button
                                className="bg-[#1a1a1a] hover:bg-[#b5624a] text-white py-4 px-10 text-[13px] font-bold uppercase tracking-[2px] rounded-full transition-all duration-300 w-fit relative z-10"
                                onClick={() =>
                                    navigate(promoData.buttonLink || '/shop')
                                }
                            >
                                {promoData.buttonText || 'Khám phá ưu đãi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── SẢN PHẨM NỔI BẬT (Featured Products) ── */}
            <div className="py-24 px-5 md:px-12 lg:px-20 bg-white">
                <div className="text-center mb-16">
                    <span className="text-[#b5624a] text-[11px] font-display font-bold uppercase tracking-[3px] block mb-2">
                        Được Yêu Thích Nhất
                    </span>
                    <h2 className="text-[36px] md:text-[46px] font-display text-[#1a1a1a] leading-none">
                        Sản Phẩm Nổi Bật
                    </h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-[300px] bg-[#eee] animate-pulse rounded-xl"
                            ></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {bestSellers.slice(0, 8).map(renderProductCard)}
                    </div>
                )}
            </div>

            {/* ── REDESIGNED TESTIMONIALS (Slider) ── */}
            <div className="py-24 px-5 md:px-12 lg:px-20 bg-[#faf7f4] text-center border-t border-[#eee]">
                <h2 className="mb-14 text-[28px] md:text-[36px] font-display text-[#1a1a1a]">
                    Khách Hàng Nói Gì?
                </h2>
                <div className="max-w-[900px] mx-auto">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 6000 }}
                        loop={true}
                        spaceBetween={40}
                        className="w-full testimonial-swiper pb-16"
                    >
                        {testimonials.map((t, index) => (
                            <SwiperSlide key={index}>
                                <div className="bg-white p-10 md:p-14 rounded-3xl shadow-sm mx-2">
                                    <div className="flex justify-center mb-6 text-[#b5624a]">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FiStar
                                                key={star}
                                                fill="currentColor"
                                                size={20}
                                                className="mx-1"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[18px] md:text-[22px] text-[#444] leading-[1.8] mb-10 font-display italic">
                                        "{t.text}"
                                    </p>
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={t.avatar}
                                            alt={t.name}
                                            className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-[#eee8df]"
                                        />
                                        <h4 className="text-[16px] text-[#1a1a1a] font-bold uppercase tracking-[1px] mb-1">
                                            {t.name}
                                        </h4>
                                        <p className="text-[13px] text-[#b5624a] font-light">
                                            {t.role}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* Global styles for Swiper overrides */}
            <style>{`
                .hero-swiper .swiper-pagination-bullet {
                    background: white;
                    opacity: 0.5;
                    width: 10px;
                    height: 10px;
                }
                .hero-swiper .swiper-pagination-bullet-active {
                    opacity: 1;
                    background: #b5624a;
                    width: 24px;
                    border-radius: 5px;
                }
                .testimonial-swiper .swiper-pagination-bullet {
                    background: #ccc;
                    opacity: 1;
                }
                .testimonial-swiper .swiper-pagination-bullet-active {
                    background: #b5624a;
                    width: 20px;
                    border-radius: 5px;
                }
            `}</style>
        </div>
    );
}
