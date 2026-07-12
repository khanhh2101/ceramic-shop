import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { getErrorMessage } from '@/utils';

// ── Auth Slice ────────────────────────────────────────────────────────────────
// Quản lý toàn bộ trạng thái xác thực:
// - user: thông tin user đang đăng nhập
// - isAuthenticated: có đang đăng nhập không
// - loading/error: trạng thái UI

// ── Async Thunks (gọi API) ──

export const register = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/register', data);
      return res?.data || res; // { accessToken, refreshToken, user }
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Đăng ký thất bại.'));
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', data);
      return res?.data || res;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Đăng nhập thất bại.'));
    }
  }
);

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/admin-login', data);
      return res?.data || res;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Đăng nhập thất bại.'));
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (idToken, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/google', { idToken });
      return res?.data || res;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Đăng nhập Google thất bại.'));
    }
  }
);

export const facebookLogin = createAsyncThunk(
  'auth/facebookLogin',
  async (idToken, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/facebook', { idToken });
      return res?.data || res;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Đăng nhập Facebook thất bại.'));
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      await api.put('/users/me', data);
      return data; // Trả về data để update state
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Cập nhật thất bại.'));
    }
  }
);

// ── Helper: lưu tokens vào localStorage ──
function saveTokens({ accessToken, refreshToken, user }) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('user', JSON.stringify(user));
}

// ── Initial State ──
const savedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
})();

const initialState = {
  user: savedUser,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

// ── Slice ──
const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    // Đăng xuất: xóa token + state
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },

    // Xóa error
    clearError(state) {
      state.error = null;
    },

    // Cập nhật avatar sau khi upload
    setAvatar(state, action) {
      if (state.user) {
        state.user.avatarUrl = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },

    // Cập nhật thông tin user ngay lập tức
    updateCurrentUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },

  extraReducers: (builder) => {
    // ── Xử lý chung cho mọi login action ──
    const handleAuthPending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleAuthFulfilled = (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      saveTokens(action.payload);
    };

    const handleAuthRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    // Register
    builder
      .addCase(register.pending, handleAuthPending)
      .addCase(register.fulfilled, handleAuthFulfilled)
      .addCase(register.rejected, handleAuthRejected);

    // Login
    builder
      .addCase(login.pending, handleAuthPending)
      .addCase(login.fulfilled, handleAuthFulfilled)
      .addCase(login.rejected, handleAuthRejected);

    // Admin Login
    builder
      .addCase(adminLogin.pending, handleAuthPending)
      .addCase(adminLogin.fulfilled, handleAuthFulfilled)
      .addCase(adminLogin.rejected, handleAuthRejected);

    // Google Login
    builder
      .addCase(googleLogin.pending, handleAuthPending)
      .addCase(googleLogin.fulfilled, handleAuthFulfilled)
      .addCase(googleLogin.rejected, handleAuthRejected);

    // Facebook Login
    builder
      .addCase(facebookLogin.pending, handleAuthPending)
      .addCase(facebookLogin.fulfilled, handleAuthFulfilled)
      .addCase(facebookLogin.rejected, handleAuthRejected);

    // Update Profile
    builder
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user.fullName = action.payload.fullName;
          state.user.phone = action.payload.phone;
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      });
  },
});

export const { logout, clearError, setAvatar, updateCurrentUser } = authSlice.actions;

// ── Selectors ──
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.user?.role === 'Admin';
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
