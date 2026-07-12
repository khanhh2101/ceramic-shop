import { useState, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingBag, FiHeart, FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { selectIsAuthenticated, selectUser, selectIsAdmin, logout } from '@/store/slices/authSlice';
import { selectCartCount } from '@/store/slices/cartSlice';
import { toggleMobileMenu, selectMobileMenuOpen, closeMobileMenu } from '@/store/slices/uiSlice';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import toast from 'react-hot-toast';

// ── Navbar Component ──────────────────────────────────────────────────────────
// Header chính của trang, sticky top.
// Tự động ẩn background khi scroll về đầu (transparent effect).

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/shop', label: 'Cửa hàng' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'Về chúng tôi' },
  { to: '/contact', label: 'Liên hệ' },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const cartCount = useSelector(selectCartCount);
  const mobileOpen = useSelector(selectMobileMenuOpen);
  const { settings } = useSiteSettings();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = useCallback(() => {
    dispatch(logout());
    toast.success('Đăng xuất thành công.');
    navigate('/');
    setUserMenuOpen(false);
  }, [dispatch, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-nav">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center overflow-hidden">
              {settings.store_logo ? (
                  <img src={settings.store_logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                  <span className="text-white font-bold text-lg font-display">G</span>
              )}
            </div>
            <span className="font-display font-bold text-xl text-gray-900 hidden sm:block">
              {settings.store_name || 'Gốm Nâu'}
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 hover:text-primary-600
                  ${isActive ? 'text-primary-600' : 'text-gray-600'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* ── Search + Actions ── */}
          <div className="flex items-center gap-1 sm:gap-2">

            {/* Search form (desktop) */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="w-48 pl-9 pr-4 py-2 text-sm rounded-full border border-gray-200
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:w-64
                             transition-all duration-300 bg-gray-50"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </form>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 rounded-xl hover:bg-primary-50 text-gray-600 hover:text-primary-600
                         transition-colors duration-200"
              title="Yêu thích"
            >
              <FiHeart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl hover:bg-primary-50 text-gray-600 hover:text-primary-600
                         transition-colors duration-200"
              title="Giỏ hàng"
            >
              <FiShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-600
                                 text-white text-xs flex items-center justify-center font-bold
                                 animate-fade-in">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuth ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100
                             transition-colors duration-200"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-sm">
                        {user?.fullName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg
                                   border border-gray-100 z-20 animate-fade-in overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {user?.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <MenuLink to="/profile" icon={<FiUser />} onClick={() => setUserMenuOpen(false)}>
                          Hồ sơ của tôi
                        </MenuLink>
                        <MenuLink to="/orders" icon={<FiPackage />} onClick={() => setUserMenuOpen(false)}>
                          Đơn hàng
                        </MenuLink>
                        {isAdmin && (
                          <MenuLink to="/admin" icon={<FiSettings />} onClick={() => setUserMenuOpen(false)}>
                            Quản trị admin
                          </MenuLink>
                        )}
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                                     text-red-600 hover:bg-red-50 transition-colors duration-150"
                        >
                          <FiLogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="btn-primary btn-sm hidden sm:flex"
              >
                Đăng nhập
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <FiX className="w-5 h-5 text-gray-700" />
              ) : (
                <FiMenu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 animate-slide-up">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="input-field pl-10"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </form>

            {/* Mobile nav links */}
            <div className="space-y-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => dispatch(closeMobileMenu())}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl font-medium text-sm transition-colors duration-150
                    ${isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {!isAuth && (
                <Link
                  to="/auth/login"
                  onClick={() => dispatch(closeMobileMenu())}
                  className="block px-4 py-3 rounded-xl font-medium text-sm text-primary-700
                             bg-primary-50 mt-2"
                >
                  Đăng nhập / Đăng ký
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// ── Helper: Dropdown menu link ──
function MenuLink({ to, icon, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                 hover:bg-gray-50 transition-colors duration-150"
    >
      <span className="w-4 h-4 text-gray-400">{icon}</span>
      {children}
    </Link>
  );
}
