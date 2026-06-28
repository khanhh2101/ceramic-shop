import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import uiReducer from './slices/uiSlice';

// ── Redux Store ───────────────────────────────────────────────────────────────
// Quản lý global state của ứng dụng:
// - auth: thông tin user đăng nhập, token
// - cart: giỏ hàng (sync với server khi đã login, localStorage khi chưa login)
// - wishlist: danh sách yêu thích
// - ui: trạng thái giao diện (modal, loading, theme)

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },

  // Redux DevTools tự động bật trong development
  devTools: import.meta.env.DEV,
});

export default store;

// Xuất kiểu (dùng cho useSelector/useDispatch)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
