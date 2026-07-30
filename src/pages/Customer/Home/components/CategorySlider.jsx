import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';

export default function CategorySlider({ categories }) {
    const navigate = useNavigate();
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const displayCategories =
        categories.length === 0
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
            : categories;

    return (
        <div className="py-24 px-5 md:px-12 lg:px-20 bg-white">
            <div className="flex items-end justify-between mb-12">
                <div>
                    <span className="text-[#b5624a] text-[11px] font-bold uppercase tracking-[3px] block mb-2">
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
                {displayCategories.map((cat, idx) => (
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
    );
}
