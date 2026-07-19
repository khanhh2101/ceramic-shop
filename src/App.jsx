import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import store from './store';
import './i18n';

// ── Layouts cũ (giữ nguyên) ──
import MainLayout from './components/Layout/MainLayout';
import AdminLayout from './components/Layout/AdminLayout';

// ── Route Guard ──
import ProtectedRoute from './routes/ProtectedRoute';


// ── Public Pages (dùng lại pages cũ + pages mới được cập nhật) ──
import Home from './pages/Customer/Home/index';             // Trang chủ cũ
import Shop from './pages/Customer/Shop/index';             // Trang shop cũ
import Details from './pages/Customer/Details/index';       // Chi tiết sản phẩm cũ

// ── Pages mới (Tailwind + kết nối BE mới) ──
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import AdminLoginPage from './pages/Auth/AdminLoginPage';
import BlogPage from './pages/Customer/Blog/BlogPage';
import BlogDetailPage from './pages/Customer/Blog/BlogDetailPage';
import AboutPage from './pages/Customer/About';
import ContactPage from './pages/Customer/Contact';
import SupportPage from './pages/Customer/Support';

// ── Protected Pages ──
import CartPage from './pages/Customer/Cart';
import CheckoutPage from './pages/Customer/Checkout';
import WishlistPage from './pages/Customer/Wishlist';
import ProfilePage from './pages/Customer/Profile/index';
import { OrdersPage, OrderDetailPage, OrderTrackPage } from './pages/Customer/Orders';

// ── Admin Pages ──
import AdminDashboard from './pages/Admin/Dashboard';
import AdminProducts from './pages/Admin/Products';
import AdminOrders from './pages/Admin/Orders';
import AdminUsers from './pages/Admin/Users/AdminUsers';
import AdminBlogs from './pages/Admin/Blogs';
import AdminCategories from './pages/Admin/Categories';
import AdminCoupons from './pages/Admin/Coupons/AdminCoupons';
import AdminReviews from './pages/Admin/Reviews/AdminReviews';

import { AdminSettings, AdminLocations } from './pages/Admin/Settings';
import AdminMedia from './pages/Admin/Media';
import AdminMasterData from './pages/Admin/MasterData/AdminMasterData';
import AdminInventory from './pages/Admin/Inventory/AdminInventory';
import AdminPurchaseOrders from './pages/Admin/PurchaseOrders/AdminPurchaseOrders';
import RolesAndPermissions from './pages/Admin/System/RolesAndPermissions';
import Groups from './pages/Admin/System/Groups';
import MenuManager from './pages/Admin/System/MenuManager';
import AdminAccounts from './pages/Admin/System/AdminAccounts';


// ── Not Found ──
import NotFoundPage from './pages/Customer/NotFound';
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
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}

function AppContent() {
  return (
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
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="purchase-orders" element={<AdminPurchaseOrders />} />
                <Route path="rbac-roles" element={<RolesAndPermissions />} />
                <Route path="rbac-groups" element={<Groups />} />
                <Route path="rbac-menus" element={<MenuManager />} />
                <Route path="rbac-accounts" element={<AdminAccounts />} />

              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <ReactQueryDevtools initialIsOpen={false} />
        </BrowserRouter>
  );
}
