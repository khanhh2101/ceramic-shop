import axios from 'axios';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils';

// ── Axios instance cấu hình sẵn ──────────────────────────────────────────────
// Tất cả request API đều dùng instance này để:
// 1. Tự động thêm Authorization header
// 2. Tự động refresh token khi 401
// 3. Xử lý lỗi thống nhất

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5011';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000, // 30 giây
  withCredentials: true, // Gửi cookie đính kèm request
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ──
// Thêm access token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──
// Khi nhận 401 (token hết hạn) → tự động refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  // Response thành công → tự động bóc data
  (response) => response.data,

  // Response lỗi
  async (error) => {
    const originalRequest = error.config;

    // Nếu 401 (Unauthorized) và chưa retry lần nào
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Bỏ qua logic refresh token nếu đây là request đăng nhập/đăng ký
      if (originalRequest.url.includes('/auth/login') || 
          originalRequest.url.includes('/auth/admin-login') || 
          originalRequest.url.includes('/auth/register')) {
        return Promise.reject(error);
      }

      // Nếu đang refresh → đưa request vào queue chờ
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        // Không có token → đăng xuất
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh token, cookie refreshToken sẽ tự động được gửi
        const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, {
          accessToken
        }, {
          withCredentials: true // Đảm bảo axios gửi cookie
        });

        const newToken = data.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        // Refresh token giờ nằm trong HttpOnly cookie, không lưu localStorage nữa

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại → đăng xuất
        processQueue(refreshError, null);
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (originalRequest && !originalRequest.skipToast) {
      /* toast handled by api */
    }

    return Promise.reject(error);
  }
);

function clearAuthAndRedirect() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  window.location.href = '/auth/login';
}

export default api;
