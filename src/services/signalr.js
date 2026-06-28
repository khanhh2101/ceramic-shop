import * as signalR from '@microsoft/signalr';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── SignalR Hub Connection ────────────────────────────────────────────────────
// Real-time review hub: mỗi trang Product Detail kết nối và join group của product đó.
// Khi có review mới → server broadcast → FE nhận ngay lập tức.

let connection = null;

// Khởi tạo kết nối (lazy singleton)
function getConnection() {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/reviews`, {
        // Gửi token qua query string (server đã cấu hình)
        accessTokenFactory: () => localStorage.getItem('accessToken') || '',
        // Fallback transport nếu WebSocket không dùng được
        transport: signalR.HttpTransportType.WebSockets |
                   signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000]) // Tự động reconnect
      .configureLogging(signalR.LogLevel.Warning)
      .build();
  }
  return connection;
}

// ── Hook: useReviewHub ────────────────────────────────────────────────────────
// Custom hook dùng trong trang Product Detail

export function useReviewHub(productId, onNewReview) {
  let conn = null;

  async function connect() {
    conn = getConnection();

    // Đăng ký handler nhận review mới
    conn.on('ReceiveReview', (review) => {
      if (typeof onNewReview === 'function') {
        onNewReview(review);
      }
    });

    // Kết nối nếu chưa kết nối
    if (conn.state === signalR.HubConnectionState.Disconnected) {
      await conn.start().catch(console.error);
    }

    // Join group của product này
    if (productId) {
      await conn.invoke('JoinProductGroup', productId).catch(console.error);
    }
  }

  async function disconnect() {
    if (conn && productId) {
      await conn.invoke('LeaveProductGroup', productId).catch(console.error);
      conn.off('ReceiveReview');
    }
  }

  return { connect, disconnect };
}

export default getConnection;
