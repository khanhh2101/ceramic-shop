import { Outlet, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAdmin, logout } from '../../store/slices/authSlice';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers, FiFileText,
  FiSettings, FiTag, FiTruck, FiImage, FiHome, FiLogOut, FiStar, FiDatabase, FiMapPin, FiBell, FiTrash2, FiVolume2, FiVolumeX, FiCheckCircle
} from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import toast from 'react-hot-toast';
import api from '../../services/api';
import ConfirmModal from '../common/ConfirmModal';

const ADMIN_LINKS = [
  { to: '/admin', icon: <FiGrid />, label: 'Tổng quan', end: true },
  { to: '/admin/products', icon: <FiShoppingBag />, label: 'Sản phẩm' },
  { to: '/admin/categories', icon: <FiTag />, label: 'Danh mục' },
  { to: '/admin/orders', icon: <FiPackage />, label: 'Đơn hàng' },
  { to: '/admin/users', icon: <FiUsers />, label: 'Người dùng' },
  { to: '/admin/blogs', icon: <FiFileText />, label: 'Blog' },
  { to: '/admin/reviews', icon: <FiStar />, label: 'Đánh giá' },
  { to: '/admin/coupons', icon: <FiTag />, label: 'Mã giảm giá' },

  { to: '/admin/media', icon: <FiImage />, label: 'Media' },
  { to: '/admin/master-data', icon: <FiDatabase />, label: 'Master Data' },
  { to: '/admin/settings', icon: <FiSettings />, label: 'Cài đặt' },
  { to: '/admin/locations', icon: <FiMapPin />, label: 'Khu vực & Giao hàng' },
];

export default function AdminLayout() {
  const isAdmin = useSelector(selectIsAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Get token from localStorage since Redux doesn't store the actual token string in this app
  const token = localStorage.getItem('accessToken');
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    action: null, // 'DELETE_ALL_NOTIFS' | 'DELETE_NOTIF' | 'REJECT_REVIEW'
    data: null,
    loading: false,
    title: '',
    message: '',
    confirmText: 'Xác nhận'
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('adminSoundEnabled') !== 'false';
  });
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const newVal = !prev;
      localStorage.setItem('adminSoundEnabled', newVal);
      return newVal;
    });
  };

  useEffect(() => {
    if (!isAdmin) return;

    fetchNotifications();
    fetchUnreadCount();

    const playNotificationSound = () => {
      if (!soundEnabledRef.current) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } catch(e) {
        console.log('Audio disabled by browser');
      }
    };

    // SignalR connection
    const newConnection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5011/hubs/admin', {
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build();

    newConnection.start()
        .then(() => {
            newConnection.on('ReceiveNotification', (msg) => {
                playNotificationSound();
                toast.success(msg);
                fetchNotifications();
                fetchUnreadCount();
            });
        })
        .catch(e => console.log('SignalR Admin Hub connection failed: ', e));

    return () => {
        if (newConnection) {
            newConnection.stop();
        }
    };
  }, [isAdmin, token]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.log('Error fetching notifications');
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data?.data || 0);
    } catch (err) {
      console.log('Error fetching unread count');
    }
  };

  const markAsRead = async (notif) => {
    try {
      if (!notif.isRead) {
        await api.put(`/notifications/${notif.id}/read`);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
      }
      setShowNotifDropdown(false);
      
      // Navigate to the respective screen
      if (notif.type === 1) { // OrderCreated
        navigate(`/admin/orders?id=${notif.referenceId}`);
      } else if (notif.type === 2) { // ReviewSubmitted
        navigate(`/admin/reviews?id=${notif.referenceId}`);
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDeleteNotification = (e, id) => {
    e.stopPropagation();
    setConfirmState({
      isOpen: true,
      action: 'DELETE_NOTIF',
      data: id,
      loading: false,
      title: 'Xóa thông báo',
      message: 'Bạn có chắc chắn muốn xóa thông báo này?',
      confirmText: 'Xóa'
    });
  };

  const handleDeleteAllNotifications = () => {
    setConfirmState({
      isOpen: true,
      action: 'DELETE_ALL_NOTIFS',
      data: null,
      loading: false,
      title: 'Xóa tất cả',
      message: 'Bạn có chắc chắn muốn xóa tất cả thông báo không?',
      confirmText: 'Xóa tất cả'
    });
  };

  const handleQuickApproveReview = async (e, reviewId, notifId) => {
    e.stopPropagation();
    try {
      await api.patch(`/reviews/${reviewId}/toggle`);
      toast.success('Đã duyệt đánh giá');
      await api.delete(`/notifications/${notifId}`);
      setNotifications(prev => prev.filter(n => n.id !== notifId));
      fetchUnreadCount();
    } catch (err) {
      toast.error('Có lỗi khi duyệt đánh giá');
    }
  };

  const handleQuickRejectReview = (e, reviewId, notifId) => {
    e.stopPropagation();
    setConfirmState({
      isOpen: true,
      action: 'REJECT_REVIEW',
      data: { reviewId, notifId },
      loading: false,
      title: 'Từ chối đánh giá',
      message: 'Bạn có chắc chắn muốn từ chối và xóa vĩnh viễn đánh giá này không?',
      confirmText: 'Không phê duyệt'
    });
  };

  const executeConfirmAction = async () => {
    setConfirmState(prev => ({ ...prev, loading: true }));
    try {
      const { action, data } = confirmState;
      if (action === 'DELETE_NOTIF') {
        await api.delete(`/notifications/${data}`);
        setNotifications(prev => prev.filter(n => n.id !== data));
        fetchUnreadCount();
        toast.success('Đã xóa thông báo');
      } else if (action === 'DELETE_ALL_NOTIFS') {
        await api.delete('/notifications/all');
        setNotifications([]);
        setUnreadCount(0);
        toast.success('Đã xóa tất cả thông báo');
      } else if (action === 'REJECT_REVIEW') {
        await api.delete(`/reviews/${data.reviewId}`);
        toast.success('Đã xóa đánh giá');
        await api.delete(`/notifications/${data.notifId}`);
        setNotifications(prev => prev.filter(n => n.id !== data.notifId));
        fetchUnreadCount();
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi thực hiện thao tác');
    } finally {
      setConfirmState(prev => ({ ...prev, isOpen: false, loading: false }));
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ORDER') return n.type === 1;
    if (activeTab === 'REVIEW') return n.type === 2;
    return true;
  });

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Đã đăng xuất.');
    navigate('/');
  };

  return (
    <div className="h-screen overflow-hidden flex bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className="w-60 flex-shrink-0 bg-gray-900 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5c3a21] flex items-center justify-center">
              <span className="text-white font-bold text-base font-display">G</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Gốm Nâu</p>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {ADMIN_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-colors duration-150
                ${isActive
                  ? 'bg-[#5c3a21] text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`
              }
            >
              <span className="w-4 h-4">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: View store + Logout */}
        <div className="p-3 border-t border-gray-800 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                       text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors"
          >
            <FiHome className="w-4 h-4" />
            Xem cửa hàng
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                       text-red-400 hover:bg-red-950 hover:text-red-300 transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 relative">
          <h1 className="text-gray-900 font-semibold text-lg">Quản trị Admin</h1>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleSound}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              title={soundEnabled ? "Tắt âm thanh thông báo" : "Bật âm thanh thông báo"}
            >
              {soundEnabled ? <FiVolume2 className="w-5 h-5" /> : <FiVolumeX className="w-5 h-5" />}
            </button>
            <div className="relative">
            <button 
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-2 relative rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiBell className="w-6 h-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden z-50">
                <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <span className="font-semibold text-sm text-gray-800">Thông báo mới</span>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button 
                        onClick={async () => {
                          await api.put('/notifications/read-all');
                          setUnreadCount(0);
                          fetchNotifications();
                        }}
                        className="text-xs text-[#5c3a21] hover:underline"
                      >
                        Đã đọc tất cả
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button 
                        onClick={handleDeleteAllNotifications}
                        className="text-xs text-red-500 hover:underline flex items-center"
                        title="Xóa tất cả"
                      >
                        Xóa tất cả
                      </button>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex text-xs font-medium border-b border-gray-100 bg-white">
                  <button 
                    className={`flex-1 py-2 ${activeTab === 'ALL' ? 'text-[#5c3a21] border-b-2 border-[#5c3a21]' : 'text-gray-500 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('ALL')}
                  >
                    Tất cả
                  </button>
                  <button 
                    className={`flex-1 py-2 ${activeTab === 'ORDER' ? 'text-[#5c3a21] border-b-2 border-[#5c3a21]' : 'text-gray-500 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('ORDER')}
                  >
                    Đơn hàng
                  </button>
                  <button 
                    className={`flex-1 py-2 ${activeTab === 'REVIEW' ? 'text-[#5c3a21] border-b-2 border-[#5c3a21]' : 'text-gray-500 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('REVIEW')}
                  >
                    Đánh giá
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <p className="p-4 text-center text-sm text-gray-500">Không có thông báo nào</p>
                  ) : (
                    filteredNotifications.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => markAsRead(notif)}
                        className={`p-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors group ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />
                            <div>
                              <p className={`text-sm ${!notif.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notif.type === 2 && notif.message.includes('sao') ? (
                                  <span className="flex items-center gap-1 mt-0.5 mb-1">
                                    <FiStar className="text-yellow-400 fill-current" />
                                    <span className="font-semibold text-gray-700">
                                      {notif.message.match(/(\d+)\s*sao/)?.[1] || 5} sao
                                    </span>
                                    <span>- {notif.message.split('vừa')[0]}</span>
                                  </span>
                                ) : (
                                  notif.message
                                )}
                              </p>
                              <span className="text-[10px] text-gray-400 mt-2 block">
                                {new Date(notif.createdAt).toLocaleString('vi-VN')}
                              </span>
                              {notif.type === 2 && (
                                <div className="mt-2 flex gap-2">
                                  <button 
                                    onClick={(e) => handleQuickApproveReview(e, notif.referenceId, notif.id)}
                                    className="text-[10px] font-medium bg-green-50 text-green-600 px-2.5 py-1 rounded-md border border-green-200 hover:bg-green-100 flex items-center gap-1 transition-colors"
                                  >
                                    <FiCheckCircle size={10} /> Phê duyệt
                                  </button>
                                  <button 
                                    onClick={(e) => handleQuickRejectReview(e, notif.referenceId, notif.id)}
                                    className="text-[10px] font-medium bg-red-50 text-red-600 px-2.5 py-1 rounded-md border border-red-200 hover:bg-red-100 flex items-center gap-1 transition-colors"
                                  >
                                    <FiTrash2 size={10} /> Không phê duyệt
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={(e) => handleDeleteNotification(e, notif.id)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            title="Xóa thông báo"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={executeConfirmAction}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        type="danger"
        isLoading={confirmState.loading}
      />
    </div>
  );
}
