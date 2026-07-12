import api from './api';
import axios from 'axios';

// ── Product API service ───────────────────────────────────────────────────────
// Tập trung tất cả gọi API liên quan tới sản phẩm

export const productService = {
  // Lấy danh sách sản phẩm (có filter, phân trang)
  getProducts: (params) => api.get('/products', { params }),

  // Chi tiết sản phẩm
  getById: (id) => api.get(`/products/${id}`),

  // Sản phẩm tương tự
  getSimilar: (id) => api.get(`/products/${id}/similar`),

  // Sản phẩm bán chạy
  getBestsellers: (count = 8) => api.get('/products/bestsellers', { params: { count } }),

  // Admin: tạo sản phẩm
  create: (data) => api.post('/products', data),

  // Admin: cập nhật
  update: (id, data) => api.put(`/products/${id}`, data),

  // Admin: xóa (soft delete)
  delete: (id) => api.delete(`/products/${id}`),
};

// ── Category API service ──────────────────────────────────────────────────────
export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ── Review API service ────────────────────────────────────────────────────────
export const reviewService = {
  getByProduct: (productId, params) =>
    api.get(`/reviews/product/${productId}`, { params }),
  create: (data) => api.post('/reviews', data),
  hide: (id) => api.patch(`/reviews/${id}/hide`),
  getAdminReviews: (params) => api.get('/reviews/admin', { params }),
};

// ── Order API service ─────────────────────────────────────────────────────────
export const orderService = {
  create: (data) => api.post('/orders', data),
  validateCart: (data) => api.post('/orders/validate-cart', data),
  getMyOrders: (params) => api.get('/orders/my', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getByCode: (orderCode) => api.get(`/orders/code/${orderCode}`),
  getByTrackingToken: (trackingToken) => api.get(`/orders/track/${trackingToken}`),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
  // Admin
  getAll: (params) => api.get('/orders/admin', { params }),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

// ── Payment API service ───────────────────────────────────────────────────────
export const paymentService = {
  createMomo: (orderId) => api.post('/payments/momo/create', { orderId }),
  createVnPay: (orderId) => api.post('/payments/vnpay/create', { orderId }),
};

// ── Blog API service ──────────────────────────────────────────────────────────
export const blogService = {
  getAll: (params) => api.get('/blogs', { params }),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
  getLatest: (count) => api.get('/blogs/latest', { params: { count } }),
  // Admin
  getAllAdmin: (params) => api.get('/blogs/admin', { params }),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
};

// ── User API service ──────────────────────────────────────────────────────────
export const userService = {
  getMe: () => api.get('/users/me', { skipToast: true }),
  updateProfile: (data) => api.put('/users/me', data),
  uploadAvatar: async (file) => {
    // 1. Xin presigned URL
    const resUrl = await api.get('/users/me/avatar/presigned-url', { params: { fileName: file.name } });
    const { putUrl, minioKey } = resUrl.data;

    // 2. Upload trực tiếp bằng axios (không qua api.js để tránh chèn token JWT)
    await axios.put(putUrl, file, { headers: { 'Content-Type': file.type } });

    // 3. Confirm với backend
    return api.post('/users/me/avatar/confirm', { minioKey });
  },
  changePassword: (data) => api.post('/users/me/change-password', data),
  getAddresses: () => api.get('/users/me/addresses'),
  addAddress: (data) => api.post('/users/me/addresses', data),
  updateAddress: (id, data) => api.put(`/users/me/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/me/addresses/${id}`),
  getWishlist: () => api.get('/users/me/wishlist'),
  addWishlist: (productId) => api.post(`/users/me/wishlist/${productId}`),
  removeWishlist: (productId) => api.delete(`/users/me/wishlist/${productId}`),
  // Admin
  getAll: (params) => api.get('/users', { params }),
};

// ── Settings API service ──────────────────────────────────────────────────────
export const settingsService = {
  getPublic: () => api.get('/settings'),
  getHomeContent: () => api.get('/settings/home'),
  getTimeline: () => api.get('/settings/about/timeline'),
  submitContact: (data) => api.post('/settings/contact', data),
  // Admin
  getAll: () => api.get('/settings/admin'),
  updateBatch: (data) => api.put('/settings/admin', data),
  getHomeAdmin: () => api.get('/settings/home/admin'),
  updateHomeBlock: (blockKey, data) => api.put(`/settings/home/${blockKey}`, data),
  addTimeline: (data) => api.post('/settings/about/timeline', data),
  deleteTimeline: (id) => api.delete(`/settings/about/timeline/${id}`),
  getContacts: (params) => api.get('/settings/contact/admin', { params }),
  markContactRead: (id) => api.patch(`/settings/contact/admin/${id}/read`),
  getEmailTemplates: () => api.get('/settings/email-templates'),
  updateEmailTemplate: (slug, data) => api.put(`/settings/email-templates/${slug}`, data),
};

// ── Coupon API service ────────────────────────────────────────────────────────
export const couponService = {
  validate: (code, orderTotal) =>
    api.post('/coupons/validate', { code, orderTotal }),
  // Admin
  getAll: () => api.get('/coupons'),
  create: (data) => api.post('/coupons', data),
  delete: (id) => api.delete(`/coupons/${id}`),
};



// ── Media API service ─────────────────────────────────────────────────────────
export const mediaService = {
  upload: async (file, bucket = 'products', usedIn) => {
    const resUrl = await api.get('/media/presigned-url', { params: { fileName: file.name, bucket } });
    const { putUrl, minioKey, bucket: actualBucket } = resUrl.data;

    await axios.put(putUrl, file, { headers: { 'Content-Type': file.type } });

    return api.post('/media/confirm', {
      bucket: actualBucket,
      minioKey,
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
      usedIn
    });
  },
  uploadMultiple: async (files, bucket = 'products') => {
    const uploadPromises = files.map(async (file) => {
      const resUrl = await api.get('/media/presigned-url', { params: { fileName: file.name, bucket } });
      const { putUrl, minioKey, bucket: actualBucket } = resUrl.data;

      await axios.put(putUrl, file, { headers: { 'Content-Type': file.type } });

      const resConfirm = await api.post('/media/confirm', {
        bucket: actualBucket,
        minioKey,
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size
      });
      return resConfirm.data;
    });

    const results = await Promise.all(uploadPromises);
    return { data: { data: results, message: `Upload ${results.length} file thành công.` } };
  },
  uploadProductImages: async (productId, files) => {
    const uploadPromises = files.map(async (file) => {
      const resUrl = await api.get('/media/presigned-url', { params: { fileName: file.name, bucket: 'products' } });
      const { putUrl, minioKey } = resUrl.data;

      await axios.put(putUrl, file, { headers: { 'Content-Type': file.type } });

      return api.post(`/media/product/${productId}/images/confirm`, { minioKey });
    });

    await Promise.all(uploadPromises);
    return { data: { message: "Upload ảnh sản phẩm thành công." } };
  },
  getAll: (params) => api.get('/media', { params }),
  delete: (id) => api.delete(`/media/${id}`),
};
