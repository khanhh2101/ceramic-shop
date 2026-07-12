import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import uiReducer from './slices/uiSlice';

import tabsReducer from './slices/tabsSlice';

// ── Redux Store ───────────────────────────────────────────────────────────────
// Quản lý global state của ứng dụng:
// - auth: thông tin user đăng nhập, token
// - cart: giỏ hàng (sync với server khi đã login, localStorage khi chưa login)
// - wishlist: danh sách yêu thích
// - ui: trạng thái giao diện (modal, loading, theme)
// - tabs: quản lý các tab đang mở trong Admin

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
    tabs: tabsReducer,
  },

  // Redux DevTools tự động bật trong development
  devTools: import.meta.env.DEV,
});

// Lưu state của Tabs vào sessionStorage mỗi khi có thay đổi
store.subscribe(() => {
  const state = store.getState();
  if (state.tabs) {
    sessionStorage.setItem('adminTabsState', JSON.stringify(state.tabs));
  }
});

export default store;

// Xuất kiểu (dùng cho useSelector/useDispatch)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
