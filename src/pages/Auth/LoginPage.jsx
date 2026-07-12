import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { login, selectAuthLoading } from '@/store/slices/authSlice';
import { mergeCart, selectGuestCartItems } from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';
import AuthLayout from './components/AuthLayout';

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/';
    const loading = useSelector(selectAuthLoading);
    const guestItems = useSelector(selectGuestCartItems);
    const [showPass, setShowPass] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const afterLogin = async () => {
        if (guestItems.length > 0) {
            try {
                await dispatch(mergeCart(guestItems.map((i) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    color: i.color,
                    colorId: i.colorId
                })))).unwrap();
            } catch (err) {
                console.error('Merge cart failed:', err);
                toast.error('Lỗi khi đồng bộ giỏ hàng, vui lòng thử lại.');
            }
        }
        toast.success('Đăng nhập thành công! 🎉');
        navigate(returnUrl, { replace: true });
    };

    const onSubmit = async (data) => {
        const result = await dispatch(login(data));
        if (!result.error) await afterLogin();
        else toast.error(result.payload || 'Đăng nhập thất bại');
    };

    const handleSocial = (provider) => {
        toast(`Đăng nhập ${provider} đang được phát triển.`, { icon: 'ℹ️' });
    };

    return (
        <AuthLayout
            imageSrc="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1500&auto=format&fit=crop"
            quote="&quot;Linh hồn của đất, tinh hoa của lửa&quot;"
            quoteSub="Mỗi sản phẩm gốm là một câu chuyện được kể bằng sự tĩnh lặng và đôi bàn tay khéo léo."
        >
            <div className="mb-10">
                <h1 className="font-display text-[32px] text-[#1a1a1a] mb-2">Chào mừng trở lại!</h1>
                <p className="text-[#888] text-[14px]">Đăng nhập để tiếp tục trải nghiệm mua sắm.</p>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                    type="button"
                    onClick={() => handleSocial('Google')}
                    className="flex items-center justify-center gap-3 px-4 py-3 border border-[#ddd] rounded-sm
                                hover:bg-[#faf7f4] transition-colors text-[13px] font-medium text-[#1a1a1a]"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                    Google
                </button>
                <button
                    type="button"
                    onClick={() => handleSocial('Facebook')}
                    className="flex items-center justify-center gap-3 px-4 py-3 border border-[#ddd] rounded-sm
                                hover:bg-[#faf7f4] transition-colors text-[13px] font-medium text-[#1a1a1a]"
                >
                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-4 h-4" />
                    Facebook
                </button>
            </div>

            <div className="relative mb-8 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#eee]"></div></div>
                <span className="relative bg-white px-4 text-[12px] uppercase tracking-[1px] text-[#aaa]">Hoặc đăng nhập bằng email</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Email</label>
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

                <div>
                    <div className="flex justify-between mb-2">
                        <label className="block text-[11px] tracking-[2px] uppercase text-[#888] font-medium">Mật khẩu</label>
                        <Link to="/auth/forgot-password" className="text-[11px] text-[#c4a882] hover:text-[#b5624a] transition-colors">
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
                        <input
                            type={showPass ? 'text' : 'password'}
                            className="w-full p-3 pl-11 pr-11 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors bg-[#faf7f4] focus:bg-white"
                            placeholder="••••••••"
                            {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#1a1a1a]"
                        >
                            {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-[12px] mt-1">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#1a1a1a] text-white text-[12px] tracking-[2px] uppercase mt-4
                                transition-colors duration-200 hover:bg-[#444] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
            </form>

            <p className="text-center text-[13px] text-[#888] mt-8">
                Chưa có tài khoản?{' '}
                <Link to="/auth/register" className="text-[#1a1a1a] font-medium border-b border-[#1a1a1a] pb-0.5 hover:text-[#c4a882] hover:border-[#c4a882] transition-colors">
                    Đăng ký ngay
                </Link>
            </p>
        </AuthLayout>
    );
}
