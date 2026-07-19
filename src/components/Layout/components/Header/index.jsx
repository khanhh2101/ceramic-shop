import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { useTranslation } from 'react-i18next';
import { selectIsAuthenticated, selectUser, selectIsAdmin, logout } from '@/store/slices/authSlice';
import { selectCartCount } from '@/store/slices/cartSlice';
import { useProducts } from '@/hooks/queries/useProducts';
import { formatCurrency } from '@/utils';
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
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const searchRef = useRef(null);

    // Debounce the search query to prevent making API calls on every keystroke
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery.trim());
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch search results automatically using React Query
    const { data: searchData, isLoading: isSearching } = useProducts(
        { search: debouncedSearch, limit: 5 },
        { enabled: debouncedSearch.length > 0 }
    );
    const searchResults = searchData?.items || [];

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        }
        if (isSearchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSearchOpen]);

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
                <div className="flex items-center relative" ref={searchRef}>
                    {isSearchOpen && (
                        <div className="mr-3">
                            <form onSubmit={handleSearchSubmit} className="animate-fade-in-up relative">
                                <input
                                    type="text"
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm sản phẩm..."
                                    className="w-[200px] text-[13px] border-b border-gray-300 pb-1 focus:outline-none focus:border-[#5c3a21] bg-transparent text-[#1a1a1a]"
                                />
                                {isSearching && <span className="absolute right-0 top-1 w-3 h-3 border-2 border-gray-300 border-t-[#5c3a21] rounded-full animate-spin"></span>}
                            </form>
                            
                            {/* Search Card Dropdown */}
                            {searchQuery.trim().length > 0 && (
                                <div className="absolute top-[calc(100%+20px)] right-6 w-[340px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl border border-gray-100 overflow-hidden z-[100] animate-fade-in-up">
                                    {searchResults.length > 0 ? (
                                        <div className="flex flex-col max-h-[420px] overflow-y-auto">
                                            {searchResults.map(product => (
                                                <div 
                                                    key={product.id}
                                                    onClick={() => {
                                                        navigate(`/product/${product.slug || product.id}`);
                                                        setIsSearchOpen(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className="flex items-center gap-3 p-3 hover:bg-[#faf7f4] cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                                                >
                                                    <img src={product.primaryImageUrl || 'https://placehold.co/100'} alt={product.name} className="w-14 h-14 object-cover rounded-md flex-shrink-0 bg-gray-100 mix-blend-multiply" />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-[13px] font-medium text-gray-900 line-clamp-2 leading-snug">{product.name}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[13px] font-bold text-[#b5624a]">{formatCurrency(product.price)}</span>
                                                            {product.oldPrice > product.price && (
                                                                <span className="text-[11px] text-gray-400 line-through">{formatCurrency(product.oldPrice)}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div 
                                                onClick={handleSearchSubmit}
                                                className="p-3 text-center text-[12px] font-bold tracking-widest uppercase text-[#b5624a] hover:bg-[#b5624a] hover:text-white cursor-pointer transition-colors border-t border-gray-100"
                                            >
                                                Xem tất cả kết quả
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-[13px] text-gray-500 font-medium">
                                            {isSearching ? 'Đang tìm kiếm...' : 'Không tìm thấy sản phẩm nào.'}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
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
