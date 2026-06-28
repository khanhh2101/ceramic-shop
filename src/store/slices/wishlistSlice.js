import { createSlice } from '@reduxjs/toolkit';

// Wishlist lưu trong localStorage – chỉ cần product ID
const WISHLIST_KEY = 'wishlist';

function loadWishlist() {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; }
  catch { return []; }
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    productIds: loadWishlist(),
  },
  reducers: {
    toggleWishlist(state, action) {
      const id = action.payload;
      if (state.productIds.includes(id)) {
        state.productIds = state.productIds.filter((i) => i !== id);
      } else {
        state.productIds.push(id);
      }
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.productIds));
    },
    setWishlist(state, action) {
      state.productIds = action.payload;
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(action.payload));
    },
  },
});

export const { toggleWishlist, setWishlist } = wishlistSlice.actions;
export const selectWishlistIds = (state) => state.wishlist.productIds;
export const selectIsInWishlist = (id) => (state) =>
  state.wishlist.productIds.includes(id);

export default wishlistSlice.reducer;
