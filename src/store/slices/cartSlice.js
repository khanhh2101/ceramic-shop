import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Cart Slice ────────────────────────────────────────────────────────────────
// Giỏ hàng hai chế độ:
// - Chưa đăng nhập: lưu trong localStorage (guestCart)
// - Đã đăng nhập: sync với server + cache trong state

// ── Async Thunks ──

// Lấy giỏ hàng từ server (khi đã đăng nhập)
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

// Thêm vào giỏ (server-side)
export const addToCartServer = createAsyncThunk(
  'cart/addToCartServer',
  async ({ productId, quantity, color }, { rejectWithValue }) => {
    try {
      const res = await api.post('/cart', { productId, quantity, color });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// Cập nhật số lượng (server-side)
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      await api.put(`/cart/${id}`, { productId: 0, quantity });
      return { id, quantity };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// Xóa item (server-side)
export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/cart/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// Merge localStorage cart vào server sau khi đăng nhập
export const mergeCart = createAsyncThunk(
  'cart/mergeCart',
  async (items, { rejectWithValue }) => {
    try {
      const res = await api.post('/cart/merge', { items });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ── Local Storage helpers ──
const GUEST_CART_KEY = 'guestCart';

function loadGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveGuestCart(items) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

// ── Slice ──
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],       // Server cart (khi đã login)
    guestItems: loadGuestCart(), // Local cart (khi chưa login)
    selectedItemIds: [], // Chứa id (khi login) hoặc itemKey (khi guest)
    loading: false,
    error: null,
  },

  reducers: {
    // Thêm vào giỏ GUEST (chưa đăng nhập)
    addToGuestCart(state, action) {
      const { productId, quantity, color, product } = action.payload;
      const itemKey = `${productId}_${color || 'default'}`;
      const existing = state.guestItems.find((i) => i.itemKey === itemKey);
      
      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + quantity,
          product.stockQuantity || 99
        );
      } else {
        state.guestItems.push({ productId, quantity, color, product, itemKey });
      }
      
      if (!state.selectedItemIds.includes(itemKey)) {
        state.selectedItemIds.push(itemKey);
      }
      
      saveGuestCart(state.guestItems);
    },

    updateGuestCartItem(state, action) {
      const { itemKey, quantity } = action.payload;
      const item = state.guestItems.find((i) => i.itemKey === itemKey);
      if (item) {
        if (quantity <= 0) {
          state.guestItems = state.guestItems.filter((i) => i.itemKey !== itemKey);
        } else {
          item.quantity = quantity;
        }
        saveGuestCart(state.guestItems);
      }
    },

    removeGuestCartItem(state, action) {
      state.guestItems = state.guestItems.filter((i) => i.itemKey !== action.payload);
      state.selectedItemIds = state.selectedItemIds.filter(id => id !== action.payload);
      saveGuestCart(state.guestItems);
    },

    clearGuestCart(state) {
      state.guestItems = [];
      state.selectedItemIds = [];
      localStorage.removeItem(GUEST_CART_KEY);
    },

    clearCart(state) {
      state.items = [];
      state.guestItems = [];
      state.selectedItemIds = [];
      localStorage.removeItem(GUEST_CART_KEY);
    },

    toggleSelectItem(state, action) {
      const id = action.payload;
      if (state.selectedItemIds.includes(id)) {
        state.selectedItemIds = state.selectedItemIds.filter(i => i !== id);
      } else {
        state.selectedItemIds.push(id);
      }
    },

    toggleSelectAll(state, action) {
      const { isAuth } = action.payload;
      if (isAuth) {
        const validItems = state.items.filter(i => i.isActive !== false && i.stockQuantity > 0);
        if (state.selectedItemIds.length === validItems.length && validItems.length > 0) {
          state.selectedItemIds = [];
        } else {
          state.selectedItemIds = validItems.map(i => i.id);
        }
      } else {
        const validItems = state.guestItems.filter(i => (i.product?.isActive ?? true) && (i.product?.stockQuantity ?? 0) > 0);
        if (state.selectedItemIds.length === validItems.length && validItems.length > 0) {
          state.selectedItemIds = [];
        } else {
          state.selectedItemIds = validItems.map(i => i.itemKey);
        }
      }
    },

    clearSelection(state) {
      state.selectedItemIds = [];
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCartServer.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx >= 0) {
          state.items[idx] = action.payload;
        } else {
          state.items.push(action.payload);
        }
        
        if (!state.selectedItemIds.includes(action.payload.id)) {
          state.selectedItemIds.push(action.payload.id);
        }
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { id, quantity } = action.payload;
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        } else {
          const item = state.items.find((i) => i.id === id);
          if (item) item.quantity = quantity;
        }
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
        state.selectedItemIds = state.selectedItemIds.filter(id => id !== action.payload);
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.guestItems = [];
        localStorage.removeItem(GUEST_CART_KEY);
      });
  },
});

export const {
  addToGuestCart, updateGuestCartItem, removeGuestCartItem,
  clearGuestCart, clearCart, toggleSelectItem, toggleSelectAll, clearSelection
} = cartSlice.actions;

// ── Selectors ──
export const selectCartItems = (state) => {
  if (state.auth.isAuthenticated) return state.cart.items;
  return state.cart.guestItems.map(item => ({
    id: item.itemKey, // Dùng itemKey thay vì productId làm id
    itemKey: item.itemKey,
    productId: item.productId,
    productName: item.product?.name || 'Sản phẩm',
    productCode: item.product?.code || null,
    productSlug: item.product?.slug || item.productId,
    productImageUrl: item.product?.primaryImageUrl || item.product?.images?.[0]?.url || null,
    price: item.product?.price || 0,
    quantity: item.quantity,
    stockQuantity: item.product?.stockQuantity || 0,
    isActive: item.product?.isActive ?? true,
    color: item.color
  }));
};

export const selectGuestCartItems = (state) => state.cart.guestItems;

export const selectCartCount = (state) =>
  state.auth.isAuthenticated 
    ? state.cart.items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0)
    : state.cart.guestItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);

export const selectCartTotal = (state) =>
  state.auth.isAuthenticated
    ? state.cart.items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0)
    : state.cart.guestItems.reduce((sum, i) => sum + (Number(i.product?.price) || 0) * (Number(i.quantity) || 0), 0);

export const selectSelectedItemIds = (state) => state.cart.selectedItemIds;

export const selectSelectedCartItems = (state) => {
  const items = selectCartItems(state);
  return items.filter(i => state.cart.selectedItemIds.includes(i.id || i.itemKey));
};

export const selectSelectedCartTotal = (state) => {
  const selectedItems = selectSelectedCartItems(state);
  return selectedItems.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0);
};

export const selectIsAllSelected = (state) => {
  const items = selectCartItems(state);
  const validItems = items.filter(i => i.isActive !== false && i.stockQuantity > 0);
  if (validItems.length === 0) return false;
  return state.cart.selectedItemIds.length === validItems.length;
};

export const selectCartLoading = (state) => state.cart.loading;

export default cartSlice.reducer;
