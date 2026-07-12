import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { useTranslation } from 'react-i18next';
import { selectIsAuthenticated, selectUser, selectIsAdmin, logout } from '@/store/slices/authSlice';
import { selectCartCount } from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';
import { FiGlobe, FiUser, FiSettings, FiLogOut, FiLogIn, FiX } from 'react-icons/fi';

// ── Header Component ──────────────────────────────────────────────────────────
// Giữ đúng thiết kế gốc: logo SVG + GỐM NÂU, nav links uppercase,
// icon actions (search, wishlist, cart + badge), admin button.
// Chuyển CSS sang Tailwind.

function Header({ onCartClick }) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const isAuth = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const isAdmin = useSelector(selectIsAdmin);
    const cartCount = useSelector(selectCartCount);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        toast.success(t('common.success', 'Đã đăng xuất.'));
        navigate('/');
    };

    const navLinks = [
        { path: '/', label: t('nav.home', 'Home') },
        { path: '/shop', label: t('nav.shop', 'Shop') },
        { path: '/about', label: t('nav.about', 'About') },
        { path: '/blog', label: t('nav.blog', 'Blog') },
        { path: '/contact', label: t('nav.contact', 'Contact') },
    ];

    return (
        <nav
            className="sticky top-0 z-[100] bg-white border-b border-gray-200
                        px-12 flex items-center justify-between h-[90px] backdrop-blur-sm relative"
        >
            {/* ── Left: Nav Links ── */}
            <div className="flex gap-9">
                {navLinks.map((link) => (
                    <a
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        className={`text-[13px] tracking-[1.5px] uppercase cursor-pointer
                                   transition-colors duration-300
                                   ${location.pathname === link.path
                                ? 'text-[#5c3a21] font-medium'
                                : 'text-gray-500 hover:text-[#5c3a21]'
                            }`}
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        {link.label}
                    </a>
                ))}
            </div>

            {/* ── Center: Logo ── */}
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer mt-1"
                onClick={() => navigate('/')}
            >
                <img
                    src="/assets/image/home/logo.svg"
                    alt="Champa Clay Logo"
                    className="w-14 h-16 object-contain"
                />
                <span className="font-[var(--font-display)] text-[10px] tracking-[3px] text-[#5c3a21] font-semibold  uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    CHAMPA CLAY
                </span>
            </div>

            {/* ── Right: Actions (Search, Wishlist, Cart, User/Admin) ── */}
            <div className="flex gap-5 items-center">
                {/* Search */}
                <div className="flex items-center">
                    {isSearchOpen && (
                        <form onSubmit={handleSearchSubmit} className="mr-3 animate-fade-in-up">
                            <input
                                type="text"
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm sản phẩm..."
                                className="w-[160px] text-[13px] border-b border-gray-300 pb-1 focus:outline-none focus:border-[#5c3a21] bg-transparent text-[#1a1a1a]"
                            />
                        </form>
                    )}
                    <button
                        onClick={toggleSearch}
                        title="Tìm kiếm"
                        className="bg-transparent border-none cursor-pointer text-gray-500
                                   hover:text-[#5c3a21] transition-colors duration-300 relative"
                    >
                        {isSearchOpen ? <FiX size={18} /> : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="1.5">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Wishlist */}
                <button
                    onClick={() => navigate('/wishlist')}
                    title="Yêu thích"
                    className="bg-transparent border-none cursor-pointer text-gray-500
                               hover:text-[#5c3a21] transition-colors duration-300 relative"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                {/* Cart */}
                <button
                    onClick={onCartClick || (() => navigate('/cart'))}
                    title="Giỏ hàng"
                    className="bg-transparent border-none cursor-pointer text-gray-500
                               hover:text-[#5c3a21] transition-colors duration-300 relative"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-[18px] h-[18px] rounded-full
                                        bg-[#5c3a21] text-white text-[10px]
                                        flex items-center justify-center font-semibold">
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </button>

                {/* Language Switcher */}
                <div className="flex items-center border-r border-gray-200 pr-4 mr-1">
                    <button
                        onClick={() => i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')}
                        title="Đổi ngôn ngữ"
                        className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-gray-500
                                   hover:text-[#5c3a21] transition-colors duration-300"
                    >
                        <FiGlobe size={18} />
                        <span className="text-[11px] font-bold tracking-[1px] uppercase mt-0.5">
                            {i18n.language === 'vi' ? 'VN' : 'EN'}
                        </span>
                    </button>
                </div>

                {/* User / Auth */}
                {isAuth ? (
                    <div className="flex items-center gap-4">
                        {isAdmin && (
                            <button
                                onClick={() => navigate('/admin')}
                                title="Admin"
                                className="bg-transparent border-none cursor-pointer text-gray-500
                                          hover:text-[#5c3a21] transition-all duration-300"
                            >
                                <FiSettings size={18} />
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/profile')}
                            title="Hồ sơ"
                            className="bg-transparent border-none cursor-pointer text-gray-500
                                      hover:text-[#5c3a21] transition-all duration-300"
                        >
                            <FiUser size={18} />
                        </button>
                        <button
                            onClick={handleLogout}
                            title="Đăng xuất"
                            className="bg-transparent border-none cursor-pointer text-gray-500
                                       hover:text-red-500 transition-colors duration-300"
                        >
                            <FiLogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/auth/login')}
                        title="Đăng nhập"
                        className="bg-transparent border-none cursor-pointer text-gray-500
                                  hover:text-[#5c3a21] transition-all duration-300 flex items-center gap-1.5"
                    >
                        <FiLogIn size={18} />
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Header;
