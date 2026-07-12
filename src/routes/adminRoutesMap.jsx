import React from 'react';

// Sử dụng React.lazy để tránh load toàn bộ các màn hình cùng lúc (code-splitting)
const AdminDashboard = React.lazy(() => import('@/pages/Admin/Dashboard'));
const AdminProducts = React.lazy(() => import('@/pages/Admin/Products'));
const AdminOrders = React.lazy(() => import('@/pages/Admin/Orders'));
const AdminUsers = React.lazy(() => import('@/pages/Admin/Users/AdminUsers'));
const AdminBlogs = React.lazy(() => import('@/pages/Admin/Blogs'));
const AdminCategories = React.lazy(() => import('@/pages/Admin/Categories'));
const AdminCoupons = React.lazy(() => import('@/pages/Admin/Coupons/AdminCoupons'));
const AdminReviews = React.lazy(() => import('@/pages/Admin/Reviews/AdminReviews'));

const AdminSettings = React.lazy(() => import('@/pages/Admin/Settings').then(module => ({ default: module.AdminSettings })));
const AdminLocations = React.lazy(() => import('@/pages/Admin/Settings').then(module => ({ default: module.AdminLocations })));

const AdminMedia = React.lazy(() => import('@/pages/Admin/Media'));
const AdminMasterData = React.lazy(() => import('@/pages/Admin/MasterData/AdminMasterData'));
const AdminInventory = React.lazy(() => import('@/pages/Admin/Inventory/AdminInventory'));
const AdminPurchaseOrders = React.lazy(() => import('@/pages/Admin/PurchaseOrders/AdminPurchaseOrders'));

export const adminRoutesMap = {
  '/admin': { component: AdminDashboard, title: 'Tổng Quan' },
  '/admin/products': { component: AdminProducts, title: 'Sản Phẩm' },
  '/admin/orders': { component: AdminOrders, title: 'Đơn Hàng' },
  '/admin/users': { component: AdminUsers, title: 'Người Dùng' },
  '/admin/blogs': { component: AdminBlogs, title: 'Bài Viết' },
  '/admin/categories': { component: AdminCategories, title: 'Danh Mục' },
  '/admin/coupons': { component: AdminCoupons, title: 'Mã Giảm Giá' },
  '/admin/reviews': { component: AdminReviews, title: 'Đánh Giá' },
  '/admin/media': { component: AdminMedia, title: 'Media' },
  '/admin/master-data': { component: AdminMasterData, title: 'Dữ Liệu Chuẩn' },
  '/admin/settings': { component: AdminSettings, title: 'Cài Đặt Hệ Thống' },
  '/admin/locations': { component: AdminLocations, title: 'Cửa Hàng' },
  '/admin/inventory': { component: AdminInventory, title: 'Kho Hàng' },
  '/admin/purchase-orders': { component: AdminPurchaseOrders, title: 'Nhập Hàng' },
};
