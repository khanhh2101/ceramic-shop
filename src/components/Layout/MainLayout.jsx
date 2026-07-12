import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '@/store/slices/cartSlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { fetchCart } from '@/store/slices/cartSlice';
import { FiArrowUp } from 'react-icons/fi';

import Header from './components/Header';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import CartSidebar from '@/pages/Customer/CartSidebar';
import { selectCartDrawerOpen, closeCartDrawer, toggleCartDrawer } from '@/store/slices/uiSlice';

// ── Main Layout ─── Header + Content + Newsletter + Footer
export default function MainLayout() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuthenticated);
  const isCartOpen = useSelector(selectCartDrawerOpen);
  
  // Lấy dữ liệu giỏ hàng từ Redux (bao gồm cả guest và auth)
  const cartItems = useSelector(selectCartItems);
  
  // Tính tổng tiền
  const validCartItems = Array.isArray(cartItems) ? cartItems : [];
  const cartTotal = validCartItems.reduce(
      (total, item) => total + (item.price || item.product?.price || 0) * item.quantity,
      0
  );

  // Auto scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Fetch cart on mount if authenticated
  useEffect(() => {
    if (isAuth) {
      dispatch(fetchCart());
    }
  }, [isAuth, dispatch]);

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* ── Header ── */}
      <Header onCartClick={() => dispatch(toggleCartDrawer())} />
      
      {/* ── Cart Sidebar ── */}
      <CartSidebar
          isOpen={isCartOpen}
          onClose={() => dispatch(closeCartDrawer())}
          cartItems={cartItems}
          cartTotal={cartTotal}
      />

      {/* ── Main Content ── */}
      <main className="flex-1 w-full bg-[var(--white)]">
        <Outlet />
      </main>

      {/* ── Newsletter & Footer ── */}
      <Newsletter />
      <Footer />

      {/* ── Scroll To Top Button ── */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 bg-[#b5624a] text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 z-50 hover:bg-[#1a1a1a] hover:-translate-y-1 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Cuộn lên đầu trang"
      >
        <FiArrowUp size={24} />
      </button>
    </div>
  );
}
