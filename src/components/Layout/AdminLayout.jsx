import { Outlet, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAdmin, selectUser, logout } from '@/store/slices/authSlice';
import {
  LayoutDashboard, ShoppingBag, Tag, Package, Users, FileText,
  Settings, Image as ImageIcon, Database, MapPin, LogOut, Home, Bell, Volume2, VolumeX,
  Star, FileText as FileTextIcon, Send, CheckCircle, Trash2, Ticket, Store, Megaphone, ChevronRight, PanelLeft, Archive
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import ConfirmModal from '../common/ConfirmModal';
import { Button } from '../ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import AdminProfileMenu from './components/AdminProfileMenu';
import AdminTabs from './components/AdminTabs';
import TabRenderer from './components/TabRenderer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import EmptyState from '../common/EmptyState';

// Shadcn Sidebar & Collapsible
import {
Sidebar,
SidebarContent,
SidebarHeader,
SidebarMenu,
SidebarMenuButton,
SidebarMenuItem,
SidebarProvider,
SidebarTrigger,
SidebarFooter,
SidebarInset,
SidebarMenuAction,
SidebarMenuSub,
SidebarMenuSubItem,
SidebarMenuSubButton,
SidebarGroup,
SidebarGroupLabel,
useSidebar
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"




const ICONS_MAP = {
  LayoutDashboard, ShoppingBag, Tag, Package, Users, FileText,
  Settings, ImageIcon, Database, MapPin, Star, Ticket, Archive
};
function getIconComponent(iconName) {
  if (!iconName) return null;
  return ICONS_MAP[iconName] || null;
}

const MENU_GROUPS = [
  {
    title: '',
    items: [
      { title: 'Tổng quan', url: '/admin', icon: LayoutDashboard, end: true }
    ]
  },{
    title: 'CỬA HÀNG',
    items: [
      { title: 'Sản phẩm', url: '/admin/products', icon: ShoppingBag },
      { title: 'Danh mục', url: '/admin/categories', icon: Tag },
      { title: 'Kho hàng', url: '/admin/inventory', icon: Archive },
      { title: 'Nhập hàng', url: '/admin/purchase-orders', icon: Package },
      { title: 'Mã giảm giá', url: '/admin/coupons', icon: Ticket },
    ]
  },
  {
    title: 'BÁN HÀNG & CSKH',
    items: [
      { title: 'Đơn hàng', url: '/admin/orders', icon: Package },
      { title: 'Đánh giá', url: '/admin/reviews', icon: Star },
      { title: 'Khách hàng', url: '/admin/users', icon: Users },
    ]
  },
  {
    title: 'MARKETING & BÀI VIẾT',
    items: [
      { title: 'Blog', url: '/admin/blogs', icon: FileTextIcon },
    ]
  },
  {
    title: 'PHÂN QUYỀN',
    items: [
      { title: 'Tài khoản nội bộ', url: '/admin/rbac-accounts', icon: Users },
      { title: 'Vai trò & Phân quyền', url: '/admin/rbac-roles', icon: Users },
      { title: 'Nhóm người dùng', url: '/admin/rbac-groups', icon: Users },
      { title: 'Menu động', url: '/admin/rbac-menus', icon: LayoutDashboard },
    ]
  },
  {
    title: 'HỆ THỐNG',
    items: [
      { title: 'Media', url: '/admin/media', icon: ImageIcon },
      { title: 'Master Data', url: '/admin/master-data', icon: Database },
      { title: 'Khu vực & Giao hàng', url: '/admin/locations', icon: MapPin },
      { title: 'Cài đặt chung', url: '/admin/settings', icon: Settings },
    ]
  }
];

export default function AdminLayout() {
  const isAdmin = useSelector(selectIsAdmin);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSiteSettings();
  const queryClient = useQueryClient();

  const { data: dynamicMenuData, isLoading: isLoadingMenu } = useQuery({
    queryKey: ['admin-menus'],
    queryFn: async () => {
      const res = await api.get('/admin-menus/my-menu');
      return res?.data?.data || [];
    },
    enabled: isAdmin,
    staleTime: 5 * 60 * 1000,
  });


  const token = localStorage.getItem('accessToken');

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showOrderNotifDropdown, setShowOrderNotifDropdown] = useState(false);
  const [showReviewNotifDropdown, setShowReviewNotifDropdown] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    action: null,
    data: null,
    loading: false,
    title: '',
    message: '',
    confirmText: 'Xác nhận'
  });

  const [orderSoundEnabled, setOrderSoundEnabled] = useState(() => {
    return localStorage.getItem('adminOrderSoundEnabled') !== 'false';
  });
  const orderSoundEnabledRef = useRef(orderSoundEnabled);
  useEffect(() => {
    orderSoundEnabledRef.current = orderSoundEnabled;
  }, [orderSoundEnabled]);

  const [reviewSoundEnabled, setReviewSoundEnabled] = useState(() => {
    return localStorage.getItem('adminReviewSoundEnabled') !== 'false';
  });
  const reviewSoundEnabledRef = useRef(reviewSoundEnabled);
  useEffect(() => {
    reviewSoundEnabledRef.current = reviewSoundEnabled;
  }, [reviewSoundEnabled]);

  const toggleOrderSound = () => {
    setOrderSoundEnabled(prev => {
      const newVal = !prev;
      localStorage.setItem('adminOrderSoundEnabled', newVal);
      return newVal;
    });
  };

  const toggleReviewSound = () => {
    setReviewSoundEnabled(prev => {
      const newVal = !prev;
      localStorage.setItem('adminReviewSoundEnabled', newVal);
      return newVal;
    });
  };

  useEffect(() => {
    if (!isAdmin) return;

    fetchNotifications();
    fetchUnreadCount();

    const handleRefresh = () => {
        fetchNotifications();
        fetchUnreadCount();
    };
    window.addEventListener('refreshNotifications', handleRefresh);

    const playNotificationSound = () => {
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

    const newConnection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5011/hubs/admin', {
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build();

    newConnection.start()
        .then(() => {
            newConnection.on('ReceiveNotification', (msg) => {
                const msgLower = (msg || '').toLowerCase();
                if (msgLower.includes('đơn hàng') && orderSoundEnabledRef.current) {
                    playNotificationSound();
                } else if (msgLower.includes('đánh giá') && reviewSoundEnabledRef.current) {
                    playNotificationSound();
                }
                toast.success(msg);
                fetchNotifications();
                fetchUnreadCount();
                queryClient.invalidateQueries();
            });
        })
        .catch(e => console.log('SignalR Admin Hub connection failed: ', e));

    return () => {
        if (newConnection) {
            newConnection.stop();
        }
        window.removeEventListener('refreshNotifications', handleRefresh);
    };
  }, [isAdmin, token]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res?.data || []);
    } catch (err) {
      console.log('Error fetching notifications');
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res?.data || 0);
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
      setShowOrderNotifDropdown(false);
      setShowReviewNotifDropdown(false);

      if (notif.type === 1) {
        navigate(`/admin/orders?id=${notif.referenceId}`);
      } else if (notif.type === 2) {
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

  const handleDeleteAllOrderNotifs = (orderIds) => {
    setConfirmState({
      isOpen: true,
      action: 'DELETE_ALL_ORDER_NOTIFS',
      data: orderIds,
      loading: false,
      title: 'Xóa thông báo',
      message: 'Bạn có chắc chắn muốn xóa tất cả thông báo đơn hàng không?',
      confirmText: 'Xóa tất cả'
    });
  };

  const handleDeleteAllReviewNotifs = (reviewIds) => {
    setConfirmState({
      isOpen: true,
      action: 'DELETE_ALL_REVIEW_NOTIFS',
      data: reviewIds,
      loading: false,
      title: 'Xóa thông báo',
      message: 'Bạn có chắc chắn muốn xóa tất cả thông báo đánh giá không?',
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
      } else if (action === 'DELETE_ALL_ORDER_NOTIFS') {
        const orderIds = data;
        await Promise.all(orderIds.map(id => api.delete(`/notifications/${id}`)));
        setNotifications(prev => prev.filter(n => !orderIds.includes(n.id)));
        fetchUnreadCount();
        toast.success('Đã xóa tất cả thông báo đơn hàng');
      } else if (action === 'DELETE_ALL_REVIEW_NOTIFS') {
        const reviewIds = data;
        await Promise.all(reviewIds.map(id => api.delete(`/notifications/${id}`)));
        setNotifications(prev => prev.filter(n => !reviewIds.includes(n.id)));
        fetchUnreadCount();
        toast.success('Đã xóa tất cả thông báo đánh giá');
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

  const orderNotifications = notifications.filter(n => n.type === 1);
  const reviewNotifications = notifications.filter(n => n.type === 2);
  const unreadOrderCount = orderNotifications.filter(n => !n.isRead).length;
  const unreadReviewCount = reviewNotifications.filter(n => !n.isRead).length;

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Đã đăng xuất.');
    navigate('/');
  };

  return (
    <SidebarProvider className="h-screen w-full overflow-hidden">
      {/* ── Sidebar (Shadcn) ── */}
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="h-14 flex items-center px-4 border-b bg-background group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
          {/* Expanded State */}
          <div
            className="flex items-center gap-3 w-full group-data-[collapsible=icon]:hidden cursor-pointer"
            onClick={() => navigate('/admin')}
          >
            <img
                src={settings?.store_logo || "/assets/image/home/logo.svg"}
                alt="Logo"
                className="w-9 h-9 object-contain flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] tracking-[1.5px] text-primary font-bold uppercase truncate"
                  style={{ fontFamily: 'var(--font-display)' }}>
                  CHAMPA CLAY
              </span>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-medium">Admin Panel</span>
            </div>
          </div>

          {/* Collapsed State Logo */}
          <div
            className="hidden items-center justify-center w-full h-full group-data-[collapsible=icon]:flex cursor-pointer"
            onClick={() => navigate('/admin')}
          >
            <img
                src={settings?.store_logo || "/assets/image/home/logo.svg"}
                alt="Logo"
                className="w-9 h-9 object-contain"
            />
          </div>
        </SidebarHeader>

        <SidebarContent className="pt-4 bg-[#f4f6f8]">
          {isLoadingMenu ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Đang tải Menu...</div>
          ) : dynamicMenuData && dynamicMenuData.length > 0 ? (
            dynamicMenuData.map((group) => {
              // Group là root menu
              return (
                <SidebarGroup key={group.id} className="pt-2 pb-2">
                  {group.titleKey && (
                    <SidebarGroupLabel className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">
                      {group.titleKey}
                    </SidebarGroupLabel>
                  )}
                  <SidebarMenu>
                    {group.children?.map((item) => {
                      const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                      const IconComp = getIconComponent(item.icon);
                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton asChild tooltip={item.titleKey} isActive={isActive}>
                            <NavLink to={item.path} end={item.path === '/admin'} className="flex items-center w-full">
                              {IconComp && <IconComp />}
                              <span>{item.titleKey}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroup>
              );
            })
          ) : (
            // Fallback tĩnh khi API lỗi hoặc trống (để tránh trắng trơn khi mới dev)
            MENU_GROUPS.map((group, index) => (
              <SidebarGroup key={index} className="pt-2 pb-2">
                {group.title && (
                  <SidebarGroupLabel className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">
                    {group.title}
                  </SidebarGroupLabel>
                )}
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.url || (item.url !== '/admin' && location.pathname.startsWith(item.url));
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                          <NavLink to={item.url} end={item.end} className="flex items-center w-full">
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>
            ))
          )}
        </SidebarContent>

        <SidebarFooter className="border-t p-3 bg-[#f4f6f8]">

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="!p-0 h-auto">
                <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-2 mb-2 w-full text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded-md transition-colors font-medium text-[13px]">
                  <Home className="w-4 h-4 flex-shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">Xem cửa hàng</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleLogout} className="!p-0 h-auto">
                <button className="flex items-center gap-3 px-4 py-2 mt-2 w-full text-destructive hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors font-medium text-[13px]">
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">Đăng xuất</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* ── Main content wrapper ── */}
      <SidebarInset className="flex-1 flex flex-col min-w-0 bg-muted/30">
        {/* Top bar Header */}
        <header className="h-14 flex items-center justify-between px-4 border-b bg-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-gray-500 hover:text-foreground hover:bg-gray-200 transition-colors w-7 h-7" />

            <div className="hidden md:flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-slate-700 tracking-wide">
                {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-[11px] text-slate-500 capitalize">
                {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Thông báo Đơn Hàng */}
              <div className="flex items-center gap-0.5">
                <Popover open={showOrderNotifDropdown} onOpenChange={setShowOrderNotifDropdown}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost" size="icon"
                      className="relative rounded-full text-muted-foreground hover:bg-muted/50"
                    >
                      <Package className="w-5 h-5" />
                      {unreadOrderCount > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-[#b5624a] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                          {unreadOrderCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>

                <PopoverContent side="bottom" align="end" sideOffset={8} className="w-80 p-0 bg-background border shadow-lg rounded-xl overflow-hidden z-[9999] animate-in fade-in">
                    <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
                      <span className="font-semibold text-sm flex items-center gap-2">
                        Đơn hàng mới
                        <button
                          onClick={toggleOrderSound}
                          className="text-muted-foreground hover:text-foreground transition-colors p-1"
                          title={orderSoundEnabled ? "Tắt âm báo đơn hàng" : "Bật âm báo đơn hàng"}
                        >
                          {orderSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        </button>
                      </span>
                      <div className="flex gap-2">
                        {unreadOrderCount > 0 && (
                          <button
                            onClick={async () => {
                              await Promise.all(orderNotifications.filter(n => !n.isRead).map(n => api.put(`/notifications/${n.id}/read`)));
                              fetchNotifications();
                              fetchUnreadCount();
                            }}
                            className="text-xs text-primary hover:underline"
                          >
                            Đã đọc
                          </button>
                        )}
                        {orderNotifications.length > 0 && (
                          <button
                            onClick={() => handleDeleteAllOrderNotifs(orderNotifications.map(n => n.id))}
                            className="text-xs text-destructive hover:underline"
                          >
                            Xóa tất cả
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto custom-scrollbar bg-background relative">
                      {orderNotifications.length === 0 ? (
                        <EmptyState
                          icon={Package}
                          title="Không có đơn hàng"
                          description="Hiện tại bạn chưa có thông báo đơn hàng nào."
                          className="min-h-[250px] p-6 bg-transparent"
                        />
                      ) : (
                        orderNotifications.map(notif => (
                          <div
                            key={notif.id}
                            onClick={() => markAsRead(notif)}
                            className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors group ${!notif.isRead ? 'bg-primary/5' : ''}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-3">
                                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!notif.isRead ? 'bg-[#b5624a]' : 'bg-transparent'}`} />
                                <div>
                                  <p className={`text-sm ${!notif.isRead ? 'font-medium' : 'text-muted-foreground'}`}>
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {notif.message}
                                  </p>
                                  <span className="text-[10px] text-muted-foreground/70 mt-2 block">
                                    {new Date(notif.createdAt).toLocaleString('vi-VN')}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => handleDeleteNotification(e, notif.id)}
                                className="text-muted-foreground/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                title="Xóa thông báo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                </PopoverContent>
              </Popover>
              </div>

              {/* Thông báo Đánh giá */}
              <div className="flex items-center gap-0.5">
              <Popover open={showReviewNotifDropdown} onOpenChange={setShowReviewNotifDropdown}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost" size="icon"
                    className="relative rounded-full text-muted-foreground hover:bg-muted/50"
                  >
                    <Star className="w-5 h-5" />
                    {unreadReviewCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-yellow-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                        {unreadReviewCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent side="bottom" align="end" sideOffset={8} className="w-80 p-0 bg-background border shadow-lg rounded-xl overflow-hidden z-[9999] animate-in fade-in">
                    <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
                      <span className="font-semibold text-sm flex items-center gap-2">
                        Đánh giá mới
                        <button
                          onClick={toggleReviewSound}
                          className="text-muted-foreground hover:text-foreground transition-colors p-1"
                          title={reviewSoundEnabled ? "Tắt âm báo đánh giá" : "Bật âm báo đánh giá"}
                        >
                          {reviewSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        </button>
                      </span>
                      <div className="flex gap-2">
                        {unreadReviewCount > 0 && (
                          <button
                            onClick={async () => {
                              await Promise.all(reviewNotifications.filter(n => !n.isRead).map(n => api.put(`/notifications/${n.id}/read`)));
                              fetchNotifications();
                              fetchUnreadCount();
                            }}
                            className="text-xs text-primary hover:underline"
                          >
                            Đã đọc
                          </button>
                        )}
                        {reviewNotifications.length > 0 && (
                          <button
                            onClick={() => handleDeleteAllReviewNotifs(reviewNotifications.map(n => n.id))}
                            className="text-xs text-destructive hover:underline"
                          >
                            Xóa tất cả
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto custom-scrollbar bg-background relative">
                      {reviewNotifications.length === 0 ? (
                        <EmptyState
                          icon={Star}
                          title="Không có đánh giá"
                          description="Hiện tại bạn chưa có thông báo đánh giá nào."
                          className="min-h-[250px] p-6 bg-transparent"
                        />
                      ) : (
                        reviewNotifications.map(notif => (
                          <div
                            key={notif.id}
                            onClick={() => markAsRead(notif)}
                            className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors group ${!notif.isRead ? 'bg-primary/5' : ''}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-3">
                                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!notif.isRead ? 'bg-yellow-500' : 'bg-transparent'}`} />
                                <div>
                                  <p className={`text-sm ${!notif.isRead ? 'font-medium' : 'text-muted-foreground'}`}>
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {notif.message.includes('sao') ? (
                                      <span className="flex items-center gap-1 mt-0.5 mb-1">
                                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                                        <span className="font-semibold text-foreground">
                                          {notif.message.match(/(\d+)\s*sao/)?.[1] || 5} sao
                                        </span>
                                        <span>- {notif.message.split('vừa')[0]}</span>
                                      </span>
                                    ) : (
                                      notif.message
                                    )}
                                  </p>
                                  <span className="text-[10px] text-muted-foreground/70 mt-2 block">
                                    {new Date(notif.createdAt).toLocaleString('vi-VN')}
                                  </span>
                                  {!notif.isRead && (
                                    <div className="mt-2 flex gap-2">
                                      <button
                                        onClick={(e) => handleQuickApproveReview(e, notif.referenceId, notif.id)}
                                        className="text-[10px] font-medium bg-green-500/10 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-md border border-green-500/20 hover:bg-green-500/20 flex items-center gap-1 transition-colors"
                                      >
                                        <CheckCircle className="w-3 h-3" /> Phê duyệt
                                      </button>
                                      <button
                                        onClick={(e) => handleQuickRejectReview(e, notif.referenceId, notif.id)}
                                        className="text-[10px] font-medium bg-destructive/10 text-destructive px-2.5 py-1 rounded-md border border-destructive/20 hover:bg-destructive/20 flex items-center gap-1 transition-colors"
                                      >
                                        <Trash2 className="w-3 h-3" /> Từ chối
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={(e) => handleDeleteNotification(e, notif.id)}
                                className="text-muted-foreground/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                title="Xóa thông báo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                </PopoverContent>
              </Popover>
              </div>
            </div>

            <div className="w-px h-6 bg-border mx-2"></div>

            <div className="flex items-center gap-3">
              <AdminProfileMenu />
            </div>
          </div>
        </header>        {/* Admin Tabs */}
        <AdminTabs />

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden bg-white relative flex flex-col">
          <TabRenderer />
        </main>
      </SidebarInset>

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
    </SidebarProvider>
  );
}
