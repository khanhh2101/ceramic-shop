import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { adminLogin, selectAuthLoading, selectAuthError, selectIsAuthenticated, selectIsAdmin, clearError } from '../../store/slices/authSlice';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/admin';

  const [formData, setFormData] = useState({ email: '', password: '' });

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuth = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  // Clear error khi unmount hoặc mới vào trang
  useEffect(() => {
    dispatch(clearError());
    
    // Nếu đã là admin và đang ở trang login, tự động redirect
    if (isAuth && isAdmin) {
      navigate(returnUrl, { replace: true });
    }
  }, [dispatch, isAuth, isAdmin, navigate, returnUrl]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      const resultAction = await dispatch(adminLogin(formData)).unwrap();
      toast.success('Đăng nhập Quản trị viên thành công!');
      navigate(returnUrl, { replace: true });
    } catch (err) {
      // toast error is optional since we show the error text below
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1f2937] rounded-2xl shadow-2xl p-8 border border-[#374151]">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#b5624a]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShield size={32} className="text-[#b5624a]" />
          </div>
          <h2 className="text-[28px] font-display text-white mb-2">Gốm Nâu Admin</h2>
          <p className="text-[#9ca3af] text-[14px]">Khu vực dành riêng cho Quản trị viên</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[13px] p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[13px] font-medium text-[#d1d5db] mb-2 uppercase tracking-[1px]">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#6b7280]">
                <FiMail size={18} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#374151] border-none text-white text-[15px] rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-[#b5624a] outline-none transition-all placeholder:text-[#6b7280]"
                placeholder="admin@gmail.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#d1d5db] mb-2 uppercase tracking-[1px]">Mật Khẩu</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#6b7280]">
                <FiLock size={18} />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#374151] border-none text-white text-[15px] rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-[#b5624a] outline-none transition-all placeholder:text-[#6b7280]"
                placeholder="••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#b5624a] hover:bg-[#9a513b] text-white py-4 rounded-xl text-[14px] font-bold uppercase tracking-[2px] transition-all disabled:opacity-70 mt-4 flex justify-center items-center h-[52px]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Đăng Nhập Quản Trị'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
           <a href="/" className="text-[#9ca3af] hover:text-white text-[13px] transition-colors">
              &larr; Trở về Cửa hàng
           </a>
        </div>
      </div>
    </div>
  );
}
