import {
    createSlice,
    createAsyncThunk,
    createSelector,
} from '@reduxjs/toolkit';
import { logout } from './authSlice';
import api from '../../services/api';
import { getErrorMessage } from '@/utils';

// ── Cart Slice ────────────────────────────────────────────────────────────────
// Giỏ hàng hai chế độ:
// - Chưa đăng nhập: lưu trong localStorage (guestCart)
// - Đã đăng nhập: sync với server + cache trong state

// ── Async Thunks ──

// Lấy giỏ hàng từ server (khi đã đăng nhập)
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/cart');
            return res;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    },
);

// Thêm vào giỏ (server-side)
export const addToCartServer = createAsyncThunk(
    'cart/addToCartServer',
    async ({ productId, quantity, color, colorId }, { rejectWithValue }) => {
        try {
            const res = await api.post('/cart', {
                productId,
                quantity,
                color,
                colorId,
            });
            return res;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    },
);

// Cập nhật số lượng (server-side)
export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ id, quantity }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/cart/${id}`, {
                productId: 0,
                quantity,
            });
            const finalQuantity = res?.data ?? res ?? quantity;
            return {
                id,
                quantity:
                    typeof finalQuantity === 'number'
                        ? finalQuantity
                        : quantity,
            };
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    },
);

// Xóa item (server-side)
export const removeCartItem = createAsyncThunk(
    'cart/removeCartItem',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/cart/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    },
);

// Merge localStorage cart vào server sau khi đăng nhập
export const mergeCart = createAsyncThunk(
    'cart/mergeCart',
    async (items, { rejectWithValue }) => {
        try {
            const res = await api.post('/cart/merge', { items });
            return res;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    },
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
        items: [], // Server cart (khi đã login)
        guestItems: loadGuestCart(), // Local cart (khi chưa login)
        selectedItemIds: [], // Chứa id (khi login) hoặc itemKey (khi guest)
        loading: false,
        error: null,
    },

    reducers: {
        // Thêm vào giỏ GUEST (chưa đăng nhập)
        addToGuestCart(state, action) {
            const { productId, quantity, color, colorId, product } =
                action.payload;
            const itemKey = `${productId}_${colorId || color || 'default'}`;
            const existing = state.guestItems.find(
                (i) => i.itemKey === itemKey,
            );

            if (existing) {
                existing.quantity = Math.min(
                    existing.quantity + quantity,
                    product.stockQuantity || 99,
                );
            } else {
                state.guestItems.push({
                    productId,
                    quantity,
                    color,
                    colorId,
                    product,
                    itemKey,
                });
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
                    state.guestItems = state.guestItems.filter(
                        (i) => i.itemKey !== itemKey,
                    );
                } else {
                    item.quantity = quantity;
                }
                saveGuestCart(state.guestItems);
            }
        },

        removeGuestCartItem(state, action) {
            state.guestItems = state.guestItems.filter(
                (i) => i.itemKey !== action.payload,
            );
            state.selectedItemIds = state.selectedItemIds.filter(
                (id) => id !== action.payload,
            );
            saveGuestCart(state.guestItems);
        },

        clearGuestCart(state) {
            state.guestItems = [];
            state.selectedItemIds = [];
            localStorage.removeItem(GUEST_CART_KEY);
        },

        syncCartWithProducts(state, action) {
            const fetchedProducts = action.payload || [];
            if (!Array.isArray(fetchedProducts) || fetchedProducts.length === 0)
                return;

            let updatedGuest = false;
            // Cập nhật Guest Cart nếu có sản phẩm tương ứng thay đổi (giá, tồn kho)
            state.guestItems.forEach((item) => {
                const pId = String(
                    item.productId || item.product?.id || item.product?.Id,
                );
                const freshProduct = fetchedProducts.find(
                    (p) => String(p.id || p.Id) === pId,
                );

                if (freshProduct && item.product) {
                    if (
                        item.product.price !== freshProduct.price ||
                        item.product.stockQuantity !==
                            freshProduct.stockQuantity ||
                        item.product.isActive !== freshProduct.isActive ||
                        item.product.name !== freshProduct.name
                    ) {
                        item.product = { ...item.product, ...freshProduct };

                        // Xử lý nếu hết hàng hoặc bị ẩn
                        if (
                            !freshProduct.isActive ||
                            freshProduct.stockQuantity <= 0
                        ) {
                            // Bỏ chọn sản phẩm khỏi danh sách thanh toán nếu không hợp lệ
                            state.selectedItemIds =
                                state.selectedItemIds.filter(
                                    (id) => id !== item.itemKey,
                                );
                        } else if (item.quantity > freshProduct.stockQuantity) {
                            item.quantity = freshProduct.stockQuantity;
                        }
                        updatedGuest = true;
                    }
                }
            });

            if (updatedGuest) saveGuestCart(state.guestItems);

            // Cập nhật Server Cart (UI state)
            state.items.forEach((item) => {
                const pId = String(
                    item.productId || item.product?.id || item.product?.Id,
                );
                const freshProduct = fetchedProducts.find(
                    (p) => String(p.id || p.Id) === pId,
                );

                if (freshProduct) {
                    if (
                        item.price !== freshProduct.price ||
                        item.product?.price !== freshProduct.price ||
                        item.product?.stockQuantity !==
                            freshProduct.stockQuantity ||
                        item.product?.isActive !== freshProduct.isActive
                    ) {
                        item.price = freshProduct.price;
                        if (item.product) {
                            item.product = { ...item.product, ...freshProduct };
                        }

                        // Xử lý nếu hết hàng hoặc bị ẩn
                        const itemId = item.id || item.Id;
                        if (
                            !freshProduct.isActive ||
                            freshProduct.stockQuantity <= 0
                        ) {
                            state.selectedItemIds =
                                state.selectedItemIds.filter(
                                    (id) => id !== itemId,
                                );
                        } else if (item.quantity > freshProduct.stockQuantity) {
                            item.quantity = freshProduct.stockQuantity;
                        }
                    }
                }
            });
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
                state.selectedItemIds = state.selectedItemIds.filter(
                    (i) => i !== id,
                );
            } else {
                state.selectedItemIds.push(id);
            }
        },

        toggleSelectAll(state, action) {
            const { isAuth } = action.payload;
            if (isAuth) {
                const validItems = state.items.filter((i) => {
                    const isActive = i.isActive ?? i.IsActive ?? true;
                    const stockQty = i.stockQuantity ?? i.StockQuantity ?? 0;
                    return isActive !== false && stockQty > 0;
                });
                if (
                    state.selectedItemIds.length === validItems.length &&
                    validItems.length > 0
                ) {
                    state.selectedItemIds = [];
                } else {
                    state.selectedItemIds = validItems.map((i) => i.id ?? i.Id);
                }
            } else {
                const validItems = state.guestItems.filter((i) => {
                    const isActive =
                        i.product?.isActive ?? i.product?.IsActive ?? true;
                    const stockQty =
                        i.product?.stockQuantity ??
                        i.product?.StockQuantity ??
                        0;
                    return isActive !== false && stockQty > 0;
                });
                if (
                    state.selectedItemIds.length === validItems.length &&
                    validItems.length > 0
                ) {
                    state.selectedItemIds = [];
                } else {
                    state.selectedItemIds = validItems.map((i) => i.itemKey);
                }
            }
        },

        clearSelection(state) {
            state.selectedItemIds = [];
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload?.data || action.payload?.items || [];
                state.loading = false;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToCartServer.fulfilled, (state, action) => {
                const payloadData = action.payload?.data || action.payload;
                const idx = state.items.findIndex(
                    (i) => i.id === payloadData.id,
                );
                if (idx >= 0) {
                    state.items[idx] = payloadData;
                } else {
                    state.items.push(payloadData);
                }

                if (!state.selectedItemIds.includes(payloadData.id)) {
                    state.selectedItemIds.push(payloadData.id);
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
                state.items = state.items.filter(
                    (i) => i.id !== action.payload,
                );
                state.selectedItemIds = state.selectedItemIds.filter(
                    (id) => id !== action.payload,
                );
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.items = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload?.data || action.payload?.items || [];
                state.guestItems = [];
                state.selectedItemIds = [];
                localStorage.removeItem(GUEST_CART_KEY);
            })
            .addCase(logout, (state) => {
                state.items = [];
                state.guestItems = [];
                state.selectedItemIds = [];
                localStorage.removeItem(GUEST_CART_KEY);
            });
    },
});

export const {
    addToGuestCart,
    updateGuestCartItem,
    removeGuestCartItem,
    clearGuestCart,
    clearCart,
    toggleSelectItem,
    toggleSelectAll,
    clearSelection,
    syncCartWithProducts,
} = cartSlice.actions;

// ── Selectors ──
const selectAuthState = (state) => state.auth.isAuthenticated;
const selectServerItems = (state) => state.cart.items;
const selectGuestItems = (state) => state.cart.guestItems;

export const selectGuestCartItems = (state) => state.cart.guestItems;
export const selectSelectedItemIds = (state) => state.cart.selectedItemIds;
export const selectCartLoading = (state) => state.cart.loading;

export const selectCartItems = createSelector(
    [selectAuthState, selectServerItems, selectGuestItems],
    (isAuthenticated, serverItems, guestItems) => {
        if (isAuthenticated) return serverItems;
        return guestItems.map((item) => {
            const totalAllocated =
                item.product?.colors
                    ?.filter((c) => c.id !== 0)
                    ?.reduce((sum, c) => sum + (c.stockQuantity || 0), 0) || 0;
            const unallocatedStock =
                (item.product?.stockQuantity || 0) - totalAllocated;

            let finalStock = item.product?.stockQuantity || 0;
            if (item.colorId != null && item.colorId !== 0) {
                finalStock =
                    item.product?.colors?.find((pc) => pc.id === item.colorId)
                        ?.stockQuantity || 0;
            } else {
                // colorId is null, undefined, or 0
                finalStock = unallocatedStock > 0 ? unallocatedStock : 0;
            }

            return {
                id: item.itemKey, // Dùng itemKey thay vì productId làm id
                itemKey: item.itemKey,
                productId: item.productId,
                productName: item.product?.name || 'Sản phẩm',
                productCode: item.product?.code || null,
                productSlug: item.product?.slug || item.productId,
                productImageUrl:
                    item.product?.primaryImageUrl ||
                    item.product?.images?.[0]?.url ||
                    null,
                price: item.product?.price || 0,
                quantity: item.quantity,
                stockQuantity: finalStock,
                isActive: item.product?.isActive ?? true,
                color: item.color,
                colorId: item.colorId,
            };
        });
    },
);

export const selectCartCount = createSelector(
    [selectAuthState, selectServerItems, selectGuestItems],
    (isAuthenticated, serverItems, guestItems) =>
        isAuthenticated
            ? serverItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0)
            : guestItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0),
);

export const selectCartTotal = createSelector(
    [selectAuthState, selectServerItems, selectGuestItems],
    (isAuthenticated, serverItems, guestItems) =>
        isAuthenticated
            ? serverItems.reduce(
                  (sum, i) =>
                      sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
                  0,
              )
            : guestItems.reduce(
                  (sum, i) =>
                      sum +
                      (Number(i.product?.price) || 0) *
                          (Number(i.quantity) || 0),
                  0,
              ),
);

export const selectSelectedCartItems = createSelector(
    [selectCartItems, selectSelectedItemIds],
    (items, selectedItemIds) =>
        items.filter((i) => selectedItemIds.includes(i.id || i.itemKey)),
);

export const selectSelectedCartTotal = createSelector(
    [selectSelectedCartItems],
    (selectedItems) =>
        selectedItems.reduce(
            (sum, i) =>
                sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
            0,
        ),
);

export const selectIsAllSelected = createSelector(
    [selectCartItems, selectSelectedItemIds],
    (items, selectedItemIds) => {
        const validItems = items.filter((i) => {
            const isActive = i.isActive ?? i.IsActive ?? true;
            const stockQty = i.stockQuantity ?? i.StockQuantity ?? 0;
            return isActive !== false && stockQty > 0;
        });
        if (validItems.length === 0) return false;
        return selectedItemIds.length === validItems.length;
    },
);

export default cartSlice.reducer;
