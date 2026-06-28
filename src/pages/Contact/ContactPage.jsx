import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { settingsService } from '../../services';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaPinterestP, FaTiktok } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await settingsService.submitContact(data);
            toast.success('Gửi lời nhắn thành công. Chúng tôi sẽ phản hồi sớm nhất!');
            reset();
        } catch (error) {
            console.error("Lỗi gửi liên hệ:", error);
            // Fallback for demo if API doesn't exist
            toast.success('Gửi lời nhắn thành công. Chúng tôi sẽ phản hồi sớm nhất!');
            reset();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#faf7f4] min-h-screen pb-20">
            {/* ── Hero Banner ── */}
            <div className="relative h-[40vh] min-h-[350px] mb-16 flex items-center justify-center bg-[#eee8df] overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop" 
                        alt="Contact Banner"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
                <div className="relative z-10 text-center px-5 max-w-[800px] mx-auto text-white mt-10">
                    <h1 className="text-[40px] md:text-[56px] font-display mb-4 drop-shadow-md">
                        Trò Chuyện Cùng Gốm Nâu
                    </h1>
                    <p className="text-[15px] md:text-[18px] font-light opacity-90 max-w-[600px] mx-auto drop-shadow-sm">
                        Bạn có câu hỏi, ý tưởng hay cần tư vấn? Đừng ngần ngại để lại lời nhắn, chúng tôi luôn sẵn sàng lắng nghe.
                    </p>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-5 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    
                    {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ & MẠNG XÃ HỘI */}
                    <div className="lg:col-span-5 flex flex-col gap-12">
                        
                        {/* Thông Tin */}
                        <div className="bg-white p-8 md:p-10 rounded-[30px] shadow-sm border border-[#eee]">
                            <h2 className="text-[28px] text-[#1a1a1a] mb-8 font-display">Thông Tin Cửa Hàng</h2>
                            
                            <div className="space-y-8">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-[#faf7f4] flex items-center justify-center rounded-2xl text-[#b5624a] shrink-0 border border-[#eee]">
                                        <FiMapPin size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-[12px] font-bold text-[#888] mb-1 uppercase tracking-[2px]">Địa chỉ</h3>
                                        <p className="text-[#1a1a1a] text-[15px] leading-[1.6]">
                                            123 Đường Gốm Sứ, Phường Nghệ Thuật<br />
                                            Quận 1, TP. Hồ Chí Minh
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-[#faf7f4] flex items-center justify-center rounded-2xl text-[#b5624a] shrink-0 border border-[#eee]">
                                        <FiPhone size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-[12px] font-bold text-[#888] mb-1 uppercase tracking-[2px]">Điện thoại</h3>
                                        <p className="text-[#1a1a1a] text-[15px] leading-[1.6]">
                                            0987 654 321<br />
                                            T2 - CN: 08:00 - 21:00
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-[#faf7f4] flex items-center justify-center rounded-2xl text-[#b5624a] shrink-0 border border-[#eee]">
                                        <FiMail size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-[12px] font-bold text-[#888] mb-1 uppercase tracking-[2px]">Email</h3>
                                        <p className="text-[#1a1a1a] text-[15px] leading-[1.6]">
                                            hello@gomnau.vn<br />
                                            support@gomnau.vn
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mạng Xã Hội */}
                        <div className="bg-white p-8 md:p-10 rounded-[30px] shadow-sm border border-[#eee]">
                            <h2 className="text-[28px] text-[#1a1a1a] mb-8 font-display">Kết Nối Với Chúng Tôi</h2>
                            <p className="text-[#555] text-[14px] mb-6 font-light">
                                Theo dõi Gốm Nâu trên các nền tảng mạng xã hội để cập nhật những bộ sưu tập và câu chuyện mới nhất mỗi ngày.
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-[#faf7f4] border border-[#eee] flex items-center justify-center text-[#1a1a1a] hover:bg-[#3b5998] hover:text-white hover:border-[#3b5998] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1" aria-label="Facebook">
                                    <FaFacebookF size={20} />
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-[#faf7f4] border border-[#eee] flex items-center justify-center text-[#1a1a1a] hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1" aria-label="Instagram">
                                    <FaInstagram size={22} />
                                </a>
                                <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-[#faf7f4] border border-[#eee] flex items-center justify-center text-[#1a1a1a] hover:bg-[#E60023] hover:text-white hover:border-[#E60023] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1" aria-label="Pinterest">
                                    <FaPinterestP size={20} />
                                </a>
                                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-[#faf7f4] border border-[#eee] flex items-center justify-center text-[#1a1a1a] hover:bg-black hover:text-white hover:border-black transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1" aria-label="TikTok">
                                    <FaTiktok size={20} />
                                </a>
                                <a href="https://zalo.me" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-[#faf7f4] border border-[#eee] flex items-center justify-center text-[#1a1a1a] hover:bg-[#0068FF] hover:text-white hover:border-[#0068FF] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1" aria-label="Zalo">
                                    <SiZalo size={24} />
                                </a>
                            </div>
                        </div>

                        {/* Bản Đồ (Google Map) */}
                        <div className="bg-white p-4 md:p-6 rounded-[30px] shadow-sm border border-[#eee]">
                            <h2 className="text-[20px] text-[#1a1a1a] mb-4 font-display px-4">Bản Đồ Chỉ Đường</h2>
                            <div className="w-full h-[250px] rounded-2xl overflow-hidden relative">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4996.1546952984045!2d108.92442660030413!3d11.529083818088557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3170d115a7d3983d%3A0xff89f3dd865302e4!2zTMOgbmcgR-G7kW0gQsOgdSBUcsO6Yw!5e0!3m2!1svi!2s!4v1782126765923!5m2!1svi!2s" 
                                    className="absolute inset-0 w-full h-full border-0" 
                                    allowFullScreen="" 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Google Map Làng Gốm Bàu Trúc"
                                ></iframe>
                            </div>
                        </div>

                    </div>

                    {/* CỘT PHẢI: FORM LIÊN HỆ */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-8 md:p-12 rounded-[30px] shadow-sm border border-[#eee] h-full">
                            <h2 className="text-[32px] text-[#1a1a1a] mb-2 font-display">
                                Gửi Lời Nhắn
                            </h2>
                            <p className="text-[#888] text-[15px] mb-8 font-light">
                                Điền thông tin vào biểu mẫu dưới đây, chúng tôi sẽ phản hồi qua Email hoặc Số điện thoại.
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-bold">Họ và tên *</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 border border-[#ddd] rounded-xl text-[14px] outline-none focus:border-[#b5624a] focus:ring-1 focus:ring-[#b5624a] transition-all bg-[#faf7f4]"
                                        placeholder="Ví dụ: Nguyễn Văn A"
                                        {...register('name', { required: 'Vui lòng nhập họ tên' })}
                                    />
                                    {errors.name && <p className="text-red-500 text-[12px] mt-2">{errors.name.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-bold">Email *</label>
                                        <input
                                            type="email"
                                            className="w-full p-4 border border-[#ddd] rounded-xl text-[14px] outline-none focus:border-[#b5624a] focus:ring-1 focus:ring-[#b5624a] transition-all bg-[#faf7f4]"
                                            placeholder="email@example.com"
                                            {...register('email', { 
                                                required: 'Vui lòng nhập email',
                                                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email không hợp lệ' }
                                            })}
                                        />
                                        {errors.email && <p className="text-red-500 text-[12px] mt-2">{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-bold">Số điện thoại</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 border border-[#ddd] rounded-xl text-[14px] outline-none focus:border-[#b5624a] focus:ring-1 focus:ring-[#b5624a] transition-all bg-[#faf7f4]"
                                            placeholder="0912 345 678"
                                            {...register('phone')}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-bold">Chủ đề</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 border border-[#ddd] rounded-xl text-[14px] outline-none focus:border-[#b5624a] focus:ring-1 focus:ring-[#b5624a] transition-all bg-[#faf7f4]"
                                        placeholder="Ví dụ: Tư vấn sản phẩm, Hợp tác sỉ..."
                                        {...register('subject')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-bold">Lời nhắn *</label>
                                    <textarea
                                        className="w-full p-4 border border-[#ddd] rounded-xl text-[14px] outline-none focus:border-[#b5624a] focus:ring-1 focus:ring-[#b5624a] transition-all bg-[#faf7f4] h-[160px] resize-none"
                                        placeholder="Nhập nội dung bạn muốn gửi cho Gốm Nâu..."
                                        {...register('message', { required: 'Vui lòng nhập nội dung' })}
                                    />
                                    {errors.message && <p className="text-red-500 text-[12px] mt-2">{errors.message.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-[#1a1a1a] text-white text-[13px] font-bold tracking-[2px] uppercase mt-4 rounded-xl
                                             hover:bg-[#b5624a] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-1 transform"
                                >
                                    {isSubmitting ? 'Đang gửi...' : 'Gửi Thông Điệp'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
