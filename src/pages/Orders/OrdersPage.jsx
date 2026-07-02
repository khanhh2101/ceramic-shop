import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await orderService.getMyOrders();
            setOrders(res.data?.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return { text: 'Chờ xử lý', color: 'text-[#d97706]', bg: 'bg-[#fef3c7]', icon: <FiClock /> };
            case 'processing':
                return { text: 'Đang xử lý', color: 'text-[#2563eb]', bg: 'bg-[#dbeafe]', icon: <FiPackage /> };
            case 'shipped':
                return { text: 'Đang giao', color: 'text-[#7c3aed]', bg: 'bg-[#ede9fe]', icon: <FiPackage /> };
            case 'delivered':
                return { text: 'Hoàn thành', color: 'text-[#059669]', bg: 'bg-[#d1fae5]', icon: <FiCheckCircle /> };
            case 'cancelled':
                return { text: 'Đã hủy', color: 'text-[#dc2626]', bg: 'bg-[#fee2e2]', icon: <FiXCircle /> };
            default:
                return { text: status || 'Không rõ', color: 'text-[#6b7280]', bg: 'bg-[#f3f4f6]', icon: <FiPackage /> };
        }
    };

    return (
        <div className="bg-[#faf7f4] min-h-screen pb-16">
            {/* ── Hero Banner ── */}
            <div className="relative h-[25vh] min-h-[200px] mb-12 flex items-center justify-center bg-[#eee8df] overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=2000&auto=format&fit=crop" 
                        alt="Orders Cover"
                        className="w-full h-full object-cover opacity-60 grayscale-[10%]"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="relative z-10 text-center px-5 max-w-[800px] mx-auto text-white">
                    <h1 className="text-[32px] md:text-[40px] mb-2 font-display">
                        Đơn hàng của tôi
                    </h1>
                    <p className="text-[14px] font-light opacity-90 max-w-[500px] mx-auto">
                        Quản lý và theo dõi trạng thái các món đồ gốm đang trên đường đến tay bạn
                    </p>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-5 md:px-10">

                {loading ? (
                    <div className="text-center py-20 text-[#888]">Đang tải danh sách đơn hàng...</div>
                ) : error ? (
                    <div className="text-center py-20 text-[#e53e3e]">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-16 text-center rounded-sm shadow-sm">
                        <div className="w-20 h-20 bg-[#faf7f4] rounded-full flex items-center justify-center mx-auto mb-6 text-[#c4a882] text-3xl">
                            <FiPackage />
                        </div>
                        <h2 className="text-[20px] mb-4 text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>Bạn chưa có đơn hàng nào</h2>
                        <p className="text-[#888] mb-8 text-[14px]">Có vẻ như bạn chưa đặt món đồ gốm nào. Hãy khám phá cửa hàng ngay!</p>
                        <Link 
                            to="/shop" 
                            className="inline-block px-8 py-3 bg-[#1a1a1a] text-white text-[12px] uppercase tracking-[2px] 
                                     hover:bg-[#444] transition-colors duration-200"
                        >
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            const totalItems = order.itemCount || 0;
                            const firstItemImage = order.firstItemImage || '/assets/image/placeholder.jpg';

                            return (
                                <div key={order.id} className="bg-white p-6 md:p-8 rounded-sm shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group">
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <span className="text-[16px] font-medium text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
                                                #{order.orderCode || order.id}
                                            </span>
                                            <span 
                                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-white shadow-sm"
                                                style={{ backgroundColor: order.statusColor || '#888' }}
                                            >
                                                <FiPackage />
                                                {order.statusText}
                                            </span>
                                            <span className="text-[13px] text-[#aaa]">
                                                {new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 bg-[#faf7f4] shrink-0 rounded-sm overflow-hidden border border-[#eee]">
                                                <img 
                                                    src={firstItemImage} 
                                                    alt="Sản phẩm"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-[14px] text-[#1a1a1a] mb-1 line-clamp-1" style={{ fontFamily: 'var(--font-display)' }}>
                                                    {totalItems > 0 ? `${totalItems} sản phẩm` : 'Sản phẩm gốm'}
                                                </p>
                                                {totalItems > 1 && (
                                                    <p className="text-[12px] text-[#888]">Bao gồm nhiều mặt hàng</p>
                                                )}
                                                <p className="text-[14px] text-[var(--terracotta)] font-medium mt-2" style={{ fontFamily: 'var(--font-display)' }}>
                                                    {(order.total || 0).toLocaleString('vi-VN')} ₫
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-[#eee] pt-4 md:pt-0 md:pl-6 text-right">
                                        <Link 
                                            to={`/orders/${order.orderCode || order.id}`}
                                            className="inline-block w-full md:w-auto text-center px-6 py-2.5 border border-[#1a1a1a] text-[#1a1a1a] 
                                                     text-[12px] uppercase tracking-[1px] hover:bg-[#1a1a1a] hover:text-white transition-colors duration-200"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
