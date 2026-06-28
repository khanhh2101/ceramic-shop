import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Giả lập API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Đã gửi liên kết khôi phục mật khẩu!');
            setIsSent(true);
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* LEFT SIDE - IMAGE */}
            <div className="hidden lg:block lg:w-1/2 relative bg-[#faf7f4]">
                <img 
                    src="https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?q=80&w=1500&auto=format&fit=crop" 
                    alt="Ceramic aesthetic"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-12 left-12 right-12 text-white">
                    <h2 className="text-[36px] font-display mb-4 leading-[1.2]">
                        "Nghệ thuật của sự chờ đợi"
                    </h2>
                    <p className="text-[15px] font-light opacity-90 max-w-[400px]">
                        Hãy để chúng tôi giúp bạn tìm lại kết nối.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 xl:px-32 py-12">
                <Link to="/auth/login" className="inline-flex items-center gap-2 text-[#555] hover:text-[#1a1a1a] mb-12 self-start transition-colors">
                    <FiArrowLeft /> <span className="text-[13px] uppercase tracking-[1px]">Quay lại đăng nhập</span>
                </Link>

                <div className="w-full max-w-[440px] mx-auto lg:mx-0">
                    <div className="mb-10">
                        <h1 className="font-display text-[32px] text-[#1a1a1a] mb-2">Quên mật khẩu?</h1>
                        <p className="text-[#888] text-[14px]">
                            {isSent 
                                ? "Kiểm tra hộp thư đến của bạn để nhận liên kết khôi phục mật khẩu." 
                                : "Nhập email của bạn và chúng tôi sẽ gửi liên kết khôi phục mật khẩu."}
                        </p>
                    </div>

                    {!isSent ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Email *</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
                                    <input
                                        type="email"
                                        className="w-full p-3 pl-11 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors bg-[#faf7f4] focus:bg-white"
                                        placeholder="email@example.com"
                                        {...register('email', {
                                            required: 'Vui lòng nhập email',
                                            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email không hợp lệ' }
                                        })}
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-[#1a1a1a] text-white text-[12px] tracking-[2px] uppercase mt-4
                                         transition-colors duration-200 hover:bg-[#444] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang gửi...' : 'Gửi liên kết khôi phục'}
                            </button>
                        </form>
                    ) : (
                        <div className="p-6 bg-[#f0f9f4] border border-[#22a65d] rounded-sm text-center">
                            <h3 className="text-[16px] text-[#1a8f4e] font-medium mb-2">Đã gửi email thành công</h3>
                            <p className="text-[13px] text-[#22a65d] mb-4">Vui lòng kiểm tra email và làm theo hướng dẫn để đặt lại mật khẩu.</p>
                            <button
                                onClick={() => setIsSent(false)}
                                className="text-[12px] uppercase tracking-[1px] text-[#1a8f4e] border-b border-[#1a8f4e] pb-0.5 hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-colors"
                            >
                                Thử lại với email khác
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
