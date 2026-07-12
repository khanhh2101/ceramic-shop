import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderApi } from './api/orderApi';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import './Orders.css';
import { getErrorMessage } from '@/utils';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await orderApi.getMyOrders();
            setOrders(res?.data || []);
        } catch (err) {
            setError(getErrorMessage(err, 'Không thể tải danh sách đơn hàng'));
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return { text: 'Chờ xử lý', color: 'text-[#d97706]', bg: 'bg-[#fef3c7]', icon: <FiClock /> };
            case 'processing': return { text: 'Đang xử lý', color: 'text-[#2563eb]', bg: 'bg-[#dbeafe]', icon: <FiPackage /> };
            case 'shipped': return { text: 'Đang giao', color: 'text-[#7c3aed]', bg: 'bg-[#ede9fe]', icon: <FiPackage /> };
            case 'delivered': return { text: 'Hoàn thành', color: 'text-[#059669]', bg: 'bg-[#d1fae5]', icon: <FiCheckCircle /> };
            case 'cancelled': return { text: 'Đã hủy', color: 'text-[#dc2626]', bg: 'bg-[#fee2e2]', icon: <FiXCircle /> };
            default: return { text: status || 'Không rõ', color: 'text-[#6b7280]', bg: 'bg-[#f3f4f6]', icon: <FiPackage /> };
        }
    };

    return (
        <div className="orders-main">
            <div className="orders-hero">
                <div className="orders-hero-bg">
                    <img 
                        src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=2000&auto=format&fit=crop" 
                        alt="Orders Cover"
                        className="orders-hero-img"
                    />
                    <div className="orders-hero-overlay"></div>
                </div>
                <div className="orders-hero-content">
                    <h1 className="orders-hero-title">Đơn hàng của tôi</h1>
                    <p className="orders-hero-subtitle">
                        Quản lý và theo dõi trạng thái các món đồ gốm đang trên đường đến tay bạn
                    </p>
                </div>
            </div>

            <div className="orders-container">
                {loading ? (
                    <div className="text-center py-20 text-[#888]">Đang tải danh sách đơn hàng...</div>
                ) : error ? (
                    <div className="text-center py-20 text-[#e53e3e]">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="orders-empty-card">
                        <div className="orders-empty-icon">
                            <FiPackage />
                        </div>
                        <h2 className="orders-empty-title">Bạn chưa có đơn hàng nào</h2>
                        <p className="orders-empty-desc">Có vẻ như bạn chưa đặt món đồ gốm nào. Hãy khám phá cửa hàng ngay!</p>
                        <Link to="/shop" className="btn-continue-shopping">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div>
                        {orders.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            const totalItems = order.itemCount || 0;
                            const firstItemImage = order.firstItemImage || 'https://placehold.co/600x800/eeeeee/999999?text=Gom+Nau';

                            return (
                                <div key={order.id} className="order-list-card">
                                    <div className="order-list-info">
                                        <div className="order-list-header">
                                            <span className="order-list-id">
                                                #{order.orderCode || order.id}
                                            </span>
                                            <span 
                                                className="order-list-status"
                                                style={{ backgroundColor: order.statusColor || '#888' }}
                                            >
                                                <FiPackage />
                                                {order.statusText}
                                            </span>
                                            <span className="order-list-date">
                                                {new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>

                                        <div className="order-list-items-preview">
                                            <div className="order-list-thumb">
                                                <img 
                                                    src={firstItemImage} 
                                                    alt="Sản phẩm"
                                                />
                                            </div>
                                            <div className="order-list-summary">
                                                <p className="order-list-summary-title">
                                                    {totalItems > 0 ? `${totalItems} sản phẩm` : 'Sản phẩm gốm'}
                                                </p>
                                                {totalItems > 1 && (
                                                    <p className="order-list-summary-desc">Bao gồm nhiều mặt hàng</p>
                                                )}
                                                <p className="order-list-summary-price">
                                                    {(order.total || 0).toLocaleString('vi-VN')} ₫
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="order-list-action">
                                        <Link 
                                            to={`/orders/${order.orderCode || order.id}`}
                                            className="btn-view-details"
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
