# Ceramic Shop Admin - Frontend

Hệ thống quản trị (Admin Dashboard) của cửa hàng Gốm Sứ, được xây dựng trên kiến trúc **React 19**, **Redux Toolkit**, **TanStack Query**, và **Tailwind CSS**.

---

## 🚀 Hướng Dẫn Sử Dụng Admin Tab System

Dự án này sử dụng một kiến trúc **Quản lý Tab thông minh (IDE-like Tab System)** thay cho điều hướng trang thông thường. Việc này giúp giữ lại toàn bộ dữ liệu (vị trí scroll, form state) khi chuyển qua lại giữa các trang quản trị.

### 1. Cơ chế hoạt động của Tab
- Các tab được quản lý tập trung bởi `tabsSlice.js` (Redux) và tự động lưu xuống `sessionStorage` (bảo toàn tab khi F5).
- Mỗi lần bạn truy cập một đường dẫn thuộc admin (ví dụ: `/admin/products`), hệ thống sẽ tự động bắt URL thông qua file cấu hình `adminRoutesMap.js` và mở ra một Tab tương ứng.
- Khi chuyển đổi qua lại giữa các tab, các Component không bị hủy đi (unmount) mà chỉ bị ẩn đi (`display: none`). Do đó mọi State cục bộ (như nội dung đang gõ dở) đều được **giữ nguyên vẹn**.

### 2. Sử dụng Hook Cảnh Báo Mất Dữ Liệu (`useDirtyForm`)
Khi bạn đang viết dở một form (Tạo sản phẩm, sửa bài viết) và lỡ tay tắt Tab hoặc F5, bạn **CẦN** sử dụng hook này để hệ thống bung cảnh báo.

```jsx
import { useForm } from 'react-hook-form';
import useDirtyForm from '@/hooks/useDirtyForm';

export default function ProductForm() {
  const { formState: { isDirty } } = useForm();
  
  // Chỉ cần truyền trạng thái isDirty của form vào hook này:
  // Hook sẽ chặn toàn bộ các thao tác nguy hiểm: F5, tắt trình duyệt, bấm dấu X trên Tab, Close Others, Close All
  useDirtyForm(isDirty);

  return <form>...</form>;
}
```

### 3. Sử dụng Hook Tự Động Tải Lại Dữ Liệu (`useAutoRefetch`)
Vì các Tab **không bị unmount**, các cơ chế như `refetchOnMount` của React Query sẽ không hoạt động khi bạn bấm quay lại một tab cũ. Để dữ liệu danh sách/chi tiết luôn được làm mới (fresh) mỗi khi tab đó được bật lên (Active), hãy dùng hook sau:

```jsx
import { useQuery } from '@tanstack/react-query'; 
import useAutoRefetch from '@/hooks/useAutoRefetch';

export default function OrdersList() {
  const { data, refetch } = useQuery({ queryKey: ['orders'], queryFn: fetchOrders });

  // Hook này sẽ ngầm gọi hàm refetch() mỗi khi người dùng 
  // chuyển từ tab khác về lại tab Orders này!
  useAutoRefetch(refetch);

  return <div>Danh sách đơn hàng...</div>;
}
```

### 4. Cách Thêm Một Trang Mới Vào Tab System
Để một trang mới được Tab System nhận diện và mở đúng tên, bạn **bắt buộc** phải khai báo đường dẫn của nó trong `src/routes/adminRoutesMap.js`:

```javascript
// src/routes/adminRoutesMap.js
import { lazy } from 'react';

export const adminRoutesMap = {
  '/admin/products': {
    title: 'Sản Phẩm',
    component: lazy(() => import('@/pages/Admin/Products'))
  },
  '/admin/new-feature': {
    title: 'Tính Năng Mới',
    component: lazy(() => import('@/pages/Admin/NewFeature'))
  }
};
```
Hệ thống sẽ tự động map đường dẫn với Title và Icon mặc định.

---

## 🛠 Công Nghệ (Tech Stack)
- **Framework:** React 19 + Vite
- **Styling:** TailwindCSS + Shadcn UI
- **State Management:** Redux Toolkit
- **Data Fetching:** TanStack Query v5
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
