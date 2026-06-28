import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin } from '../store/slices/authSlice';

// ── Protected Route Guard ─────────────────────────────────────────────────────
// Nếu chưa đăng nhập → redirect về trang login (hoặc admin/login), kèm returnUrl.
// Nếu adminOnly = true mà user không phải Admin → redirect về /admin/login.

export default function ProtectedRoute({ adminOnly = false }) {
  const isAuth = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  if (!isAuth) {
    const returnUrl = window.location.pathname + window.location.search;
    const loginPath = adminOnly ? '/admin/login' : '/auth/login';
    return <Navigate to={`${loginPath}?returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
