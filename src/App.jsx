import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import store from './store';
import './i18n';

// ── Layouts cũ (giữ nguyên) ──
import MainLayout from './components/Layout/MainLayout';
import AdminLayout from './components/Layout/AdminLayout';

// ── Route Guard ──
import ProtectedRoute from './routes/ProtectedRoute';

// ── Public Pages (dùng lại pages cũ + pages mới được cập nhật) ──
import Home from './pages/Home/index';             // Trang chủ cũ
import Shop from './pages/Shop/index';             // Trang shop cũ  
import Details from './pages/Details/index';       // Chi tiết sản phẩm cũ

// ── Pages mới (Tailwind + kết nối BE mới) ──
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import AdminLoginPage from './pages/Auth/AdminLoginPage';
import BlogPage from './pages/Blog/BlogPage';
import BlogDetailPage from './pages/Blog/BlogDetailPage';
import AboutPage from './pages/About/AboutPage';
import ContactPage from './pages/Contact/ContactPage';
import SupportPage from './pages/Support/SupportPage';

// ── Protected Pages ──
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import WishlistPage from './pages/Wishlist/WishlistPage';
import ProfilePage from './pages/Profile/ProfilePage';
import OrdersPage from './pages/Orders/OrdersPage';
import OrderDetailPage from './pages/Orders/OrderDetailPage';
import OrderTrackPage from './pages/Orders/OrderTrackPage';

// ── Admin Pages ──
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/Products/AdminProducts';
import AdminOrders from './pages/Admin/Orders/AdminOrders';
import AdminUsers from './pages/Admin/Users/AdminUsers';
import AdminBlogs from './pages/Admin/Blogs/AdminBlogs';
import AdminCategories from './pages/Admin/Categories/AdminCategories';
import AdminCoupons from './pages/Admin/Coupons/AdminCoupons';
import AdminReviews from './pages/Admin/Reviews/AdminReviews';

import AdminSettings from './pages/Admin/Settings/AdminSettings';
import AdminLocations from './pages/Admin/Settings/AdminLocations';
import AdminMedia from './pages/Admin/Media/AdminMedia';
import AdminMasterData from './pages/Admin/MasterData/AdminMasterData';

// ── Not Found ──
import NotFoundPage from './pages/NotFound/NotFoundPage';

// React Query client – cache 5 phút
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {/* Toast notifications */}
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' },
            }}
            containerStyle={{ zIndex: 999999 }}
          />

          <Routes>
            {/* ── Layout chính (Navbar + Footer) ── */}
            <Route element={<MainLayout />}>
              {/* Trang public */}
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:slug" element={<Details />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/category/:categoryId" element={<BlogPage />} />
              <Route path="blog/tag/:tagId" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogDetailPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="support/:tab" element={<SupportPage />} />

              {/* Auth (Đã di chuyển ra ngoài MainLayout) */}

              {/* Cart (public, không cần login) */}
              <Route path="cart" element={<CartPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="track/:trackingToken" element={<OrderTrackPage />} />

              {/* Protected – phải đăng nhập */}
              <Route element={<ProtectedRoute />}>
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:orderCode" element={<OrderDetailPage />} />
              </Route>
            </Route>

            {/* ── Auth Layout (Độc lập, không có Header/Footer) ── */}
            <Route path="auth/login" element={<LoginPage />} />
            <Route path="auth/register" element={<RegisterPage />} />
            <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />

            {/* ── Admin Auth ── */}
            <Route path="admin/login" element={<AdminLoginPage />} />

            {/* ── Admin Layout (Admin only) ── */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="reviews" element={<AdminReviews />} />

                <Route path="media" element={<AdminMedia />} />
                <Route path="master-data" element={<AdminMasterData />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="locations" element={<AdminLocations />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}
