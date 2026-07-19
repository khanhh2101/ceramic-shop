// Query configurations for react-query Polling & StaleTime

export const QUERY_CONFIGS = {
  // CRITICAL: Dữ liệu biến động liên tục, cần real-time mạnh (VD: Dashboard, Orders, Purchase Orders)
  CRITICAL: {
    refetchInterval: 15000,     // Tự động tải lại sau mỗi 15 giây
    staleTime: 30000,           // Dữ liệu cũ sau 30 giây
  },
  
  // HIGH: Dữ liệu biến động khá thường xuyên (VD: Products list, Product details, Inventory, Cart)
  HIGH: {
    refetchInterval: 30000,     // Tự động tải lại sau mỗi 30 giây
    staleTime: 60000,           // Dữ liệu cũ sau 60 giây (1 phút)
  },

  // MODERATE: Dữ liệu ít biến động hơn, hoặc trang ít tính khẩn cấp (VD: Reviews, Blogs, Admin Users, Coupons)
  MODERATE: {
    refetchInterval: 60000,     // Tự động tải lại sau mỗi 60 giây (1 phút)
    staleTime: 120000,          // Dữ liệu cũ sau 120 giây (2 phút)
  },

  // STATIC: Dữ liệu gần như không bao giờ đổi trừ khi có người cố tình sửa (VD: Categories, Master Data, Locations)
  STATIC: {
    refetchInterval: 300000,    // Tự động tải lại sau mỗi 5 phút
    staleTime: 3600000,         // Dữ liệu cũ sau 1 tiếng
  }
};
