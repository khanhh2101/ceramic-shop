/**
 * Cung cấp các tiện ích xử lý LocalStorage an toàn
 */

export const storage = {
  // Lấy dữ liệu
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      // Nếu là JSON hợp lệ thì parse, không thì trả về string
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  },

  // Lưu dữ liệu
  set: (key, value) => {
    try {
      if (typeof value === 'object') {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`Error setting localStorage key "${key}":`, e);
    }
  },

  // Xóa dữ liệu
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e);
    }
  },

  // Xóa toàn bộ dữ liệu (cẩn thận khi dùng)
  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Error clearing localStorage:', e);
    }
  },

  // Các key dùng chung trong hệ thống
  keys: {
    USER: 'user',
    ACCESS_TOKEN: 'accessToken',
    GUEST_CART: 'guestCart',
    THEME: 'theme',
  }
};
