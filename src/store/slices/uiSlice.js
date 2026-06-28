import { createSlice } from '@reduxjs/toolkit';

// ── UI Slice ──────────────────────────────────────────────────────────────────
// Quản lý trạng thái giao diện toàn cục:
// - modal: mở/đóng modal
// - mobileMenu: menu mobile
// - searchOpen: thanh tìm kiếm
// - lang: ngôn ngữ hiện tại

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    mobileMenuOpen: false,
    searchOpen: false,
    cartDrawerOpen: false,
    lang: localStorage.getItem('lang') || 'vi',
    // Modal quản lý (dùng cho nhiều modal khác nhau)
    modal: {
      type: null,    // 'login', 'confirm-delete', etc.
      data: null,    // data kèm theo modal
    },
  },

  reducers: {
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
    },
    toggleSearch(state) {
      state.searchOpen = !state.searchOpen;
    },
    toggleCartDrawer(state) {
      state.cartDrawerOpen = !state.cartDrawerOpen;
    },
    closeCartDrawer(state) {
      state.cartDrawerOpen = false;
    },
    setLang(state, action) {
      state.lang = action.payload;
      localStorage.setItem('lang', action.payload);
    },
    openModal(state, action) {
      state.modal = { type: action.payload.type, data: action.payload.data || null };
    },
    closeModal(state) {
      state.modal = { type: null, data: null };
    },
  },
});

export const {
  toggleMobileMenu, closeMobileMenu,
  toggleSearch, toggleCartDrawer, closeCartDrawer,
  setLang, openModal, closeModal,
} = uiSlice.actions;

export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen;
export const selectSearchOpen = (state) => state.ui.searchOpen;
export const selectCartDrawerOpen = (state) => state.ui.cartDrawerOpen;
export const selectLang = (state) => state.ui.lang;
export const selectModal = (state) => state.ui.modal;

export default uiSlice.reducer;
