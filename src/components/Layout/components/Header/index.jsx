import { useNavigate } from 'react-router-dom';
import './HeaderStyle.css';

function Header({ onCartClick }) {
    const navigate = useNavigate();

    const toggleSearch = () => {
        console.log('Mở tìm kiếm');
        // TODO: sau này mở modal tìm kiếm
        alert('Tính năng tìm kiếm đang phát triển!');
    };

    const openCart = () => {
        console.log('Mở giỏ hàng');
        // TODO: mở giỏ hàng
    };

    const showAdmin = () => {
        console.log('Mở Admin');
        // TODO: chuyển đến trang admin
    };
    return (
        <nav className="nav">
            {/* Logo */}
            <div className="nav-logo" onClick={() => navigate('home')}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle
                        cx="14"
                        cy="14"
                        r="13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <circle
                        cx="14"
                        cy="14"
                        r="7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M14 1v26M1 14h26"
                        stroke="currentColor"
                        strokeWidth="1"
                        opacity=".4"
                    />
                </svg>
                <span>CERAMIC SHOP</span>
            </div>

            {/* Menu Links */}
            <div className="nav-links">
                <a
                    onClick={() => navigate('/')}
                    id="nav-home"
                    className={location.pathname === '/' ? 'active' : ''}
                >
                    Home
                </a>
                <a
                    onClick={() => navigate('/shop')}
                    id="nav-shop"
                    className={location.pathname === '/shop' ? 'active' : ''}
                >
                    Shop
                </a>
                <a
                    onClick={() => navigate('/about')}
                    id="nav-about"
                    className={location.pathname === '/about' ? 'active' : ''}
                >
                    About
                </a>
                <a
                    onClick={() => navigate('/blog')}
                    id="nav-blog"
                    className={location.pathname === '/blog' ? 'active' : ''}
                >
                    Blog
                </a>
                <a
                    onClick={() => navigate('/contact')}
                    id="nav-contact"
                    className={location.pathname === '/contact' ? 'active' : ''}
                >
                    Contact
                </a>
            </div>

            {/* Actions: Search, Wishlist, Cart, Admin */}
            <div className="nav-actions">
                {/* Search Button */}
                <button onClick={toggleSearch} title="Tìm kiếm">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </button>

                {/* Wishlist Button */}
                <button onClick={() => navigate('wishlist')} title="Yêu thích">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                {/* Cart Button */}
                <button onClick={onCartClick} title="Giỏ hàng">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <span className="cart-badge" id="cartCount">
                        0
                    </span>
                </button>

                {/* Admin Button */}
                <button onClick={showAdmin} title="Admin" className="admin-btn">
                    ADMIN
                </button>
            </div>
        </nav>
    );
}

export default Header;
