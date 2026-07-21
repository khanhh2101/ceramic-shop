import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { register as registerAction, selectAuthLoading } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import AuthLayout from './components/AuthLayout';

export default function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectAuthLoading);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm({ mode: 'onChange' });
    const password = watch('password');

    // Trigger validation for confirmPassword whenever password changes
    useEffect(() => {
        if (password) {
            trigger('confirmPassword');
        }
    }, [password, trigger]);

    const onSubmit = async (data) => {
        const result = await dispatch(registerAction(data));
        if (!result.error) {
            toast.success('Đăng ký thành công! 🎉');
            if (result.payload && result.payload.accessToken) {
                navigate('/');
            } else {
                navigate('/auth/login');
            }
        } else {
            toast.error(result.payload || 'Đăng ký thất bại');
        }
    };

    return (
        <AuthLayout
            imageSrc="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1500&auto=format&fit=crop"
            quote="&quot;Mang nghệ thuật vào đời sống&quot;"
            quoteSub="Hãy trở thành một phần của cộng đồng yêu gốm và khám phá những tác phẩm độc bản."
            reverse={true}
        >
            <div className="mb-10">
                <h1 className="font-display text-[32px] text-[#1a1a1a] mb-2">Tạo tài khoản</h1>
                <p className="text-[#888] text-[14px]">Điền thông tin dưới đây để đăng ký.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Họ và tên *</label>
                    <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
                        <input
                            type="text"
                            className="w-full p-3 pl-11 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors bg-[#faf7f4] focus:bg-white"
                            placeholder="Nguyễn Văn A"
                            {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
                        />
                    </div>
                    {errors.fullName && <p className="text-red-500 text-[12px] mt-1">{errors.fullName.message}</p>}
                </div>

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

                <div>
                    <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Mật khẩu *</label>
                    <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
                        <input
                            type={showPass ? 'text' : 'password'}
                            className="w-full p-3 pl-11 pr-11 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors bg-[#faf7f4] focus:bg-white"
                            placeholder="••••••••"
                            {...register('password', { 
                                required: 'Vui lòng nhập mật khẩu',
                                minLength: { value: 6, message: 'Ít nhất 6 ký tự' }
                            })}
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

                <div>
                    <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Xác nhận mật khẩu *</label>
                    <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
                        <input
                            type={showConfirmPass ? 'text' : 'password'}
                            className="w-full p-3 pl-11 pr-11 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors bg-[#faf7f4] focus:bg-white"
                            placeholder="••••••••"
                            {...register('confirmPassword', {
                                required: 'Vui lòng xác nhận mật khẩu',
                                validate: value => value === password || 'Mật khẩu không khớp'
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#1a1a1a]"
                        >
                            {showConfirmPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-[12px] mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#1a1a1a] text-white text-[12px] tracking-[2px] uppercase mt-4
                             transition-colors duration-200 hover:bg-[#444] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
            </form>

            <p className="text-center text-[13px] text-[#888] mt-8">
                Đã có tài khoản?{' '}
                <Link to="/auth/login" className="text-[#1a1a1a] font-medium border-b border-[#1a1a1a] pb-0.5 hover:text-[#c4a882] hover:border-[#c4a882] transition-colors">
                    Đăng nhập
                </Link>
            </p>
        </AuthLayout>
    );
}
