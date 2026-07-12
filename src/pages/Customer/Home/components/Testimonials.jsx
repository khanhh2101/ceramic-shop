import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FiStar } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Testimonials({ testimonials }) {
    return (
        <div className="py-24 px-5 md:px-12 lg:px-20 bg-[#faf7f4] text-center border-t border-[#eee]">
            <h2 className="mb-14 text-[28px] md:text-[36px] font-display text-[#1a1a1a]">Khách Hàng Nói Gì?</h2>
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
                                    {[1, 2, 3, 4, 5].map(star => <FiStar key={star} fill="currentColor" size={20} className="mx-1" />)}
                                </div>
                                <p className="text-[18px] md:text-[22px] text-[#444] leading-[1.8] mb-10 font-display italic">
                                    "{t.text}"
                                </p>
                                <div className="flex flex-col items-center">
                                    <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-[#eee8df]" />
                                    <h4 className="text-[16px] text-[#1a1a1a] font-bold uppercase tracking-[1px] mb-1">{t.name}</h4>
                                    <p className="text-[13px] text-[#b5624a] font-light">{t.role}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
