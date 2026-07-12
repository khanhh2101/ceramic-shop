import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroSlider({ slides }) {
    const navigate = useNavigate();

    return (
        <div className="w-full h-[70vh] min-h-[500px]">
            <Swiper
                modules={[Pagination, Autoplay, EffectFade]}
                effect="fade"
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="w-full h-full hero-swiper"
            >
                {slides.map((slide, idx) => (
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
                                    onClick={() => navigate(slide.buttonLink || '/shop')}
                                >
                                    {slide.buttonText || 'Khám phá ngay'}
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
