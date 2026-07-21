import { useParams, Link } from 'react-router-dom';
import { useOrderTrack } from './hooks/useOrdersQueries';
import { FiX } from 'react-icons/fi';
import OrderTimeline from './components/OrderTimeline';
import './Orders.css';
import { getErrorMessage } from '@/utils';

export default function OrderTrackPage() {
    const { trackingToken } = useParams();
    const { data: order, isLoading: loading, error: queryError } = useOrderTrack(trackingToken);

    const isExpired = queryError?.response?.status === 410;
    const error = queryError 
        ? (isExpired ? 'Đường dẫn theo dõi đơn hàng đã hết hạn.' : getErrorMessage(queryError, 'Không tìm thấy thông tin đơn hàng hoặc đường dẫn không hợp lệ.'))
        : null;

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-[#888]">Đang tải thông tin đơn hàng...</div>;
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf7f4] px-5 text-center">
                <div className="w-20 h-20 bg-[#f5f5f5] rounded-full flex items-center justify-center mb-6 text-[#ccc]">
                    <FiX size={40} />
                </div>
                <h2 className="text-[24px] text-[#1a1a1a] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {isExpired ? 'Link hết hạn' : 'Không tìm thấy đơn hàng'}
                </h2>
                <p className="text-[#888] mb-8 max-w-md">
                    {error}
                </p>
                <Link to="/shop" className="btn-continue-shopping">
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="order-details-main">
            <div className="orders-container">
                <div className="order-track-header">
                    <h2 className="order-track-subtitle">Theo dõi đơn hàng</h2>
                    <h1 className="order-track-title">
                        Đơn hàng #{order.orderCode || order.id}
                    </h1>
                </div>

                <div className="order-header-wrap">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[16px] text-[#1a1a1a] font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                                Trạng thái hiện tại:
                            </span>
                            <span 
                                className="order-list-status"
                                style={{ backgroundColor: order.statusColor || '#888' }}
                            >
                                {order.statusText}
                            </span>
                        </div>
                        <p className="order-header-date">
                            Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                <OrderTimeline order={order} />

                <div className="order-content-grid">
                    <div className="order-content-main">
                        <div className="order-card">
                            <h2 className="order-card-title">Sản phẩm đã đặt</h2>
                            <div>
                                {order.items?.map((item) => (
                                    <div key={item.productId} className="order-item">
                                        <div className="order-item-img-wrap">
                                            <img 
                                                src={item.productImageUrl || 'https://placehold.co/600x800/eeeeee/999999?text=Gom+Nau'} 
                                                alt={item.productName}
                                                className="order-item-img"
                                            />
                                        </div>
                                        <div className="order-item-details">
                                            <span className="order-item-name">
                                                {item.productName}
                                            </span>
                                            <div className="order-item-meta">
                                                {item.sku ? (
                                                    <span>SKU: {item.sku}</span>
                                                ) : item.productCode ? (
                                                    <span>SKU: {item.productCode}</span>
                                                ) : null}
                                                {(item.sku || item.productCode) && item.color && <span>|</span>}
                                                {item.color && (
                                                    <span>Màu: <span className="capitalize">{item.color}</span></span>
                                                )}
                                            </div>
                                            <p className="order-item-qty">Số lượng: {item.quantity}</p>
                                            <p className="order-item-price">
                                                {(item.totalPrice || item.unitPrice * item.quantity || 0).toLocaleString('vi-VN')} ₫
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="order-content-side">
                        <div className="order-card">
                            <h2 className="order-card-title">Thông tin giao hàng</h2>
                            <div className="order-info-list">
                                <p><strong className="order-info-label">Người nhận:</strong> {order.receiverName || 'N/A'}</p>
                                <p><strong className="order-info-label">Điện thoại:</strong> {order.receiverPhone || 'N/A'}</p>
                                <p><strong className="order-info-label">Địa chỉ:</strong> {order.addressDetail ? `${order.addressDetail}, ${order.ward}, ${order.district}, ${order.province}` : 'N/A'}</p>
                                <p>
                                    <strong className="order-info-label">Phương thức thanh toán:</strong> 
                                    <span className="order-info-badge">{order.paymentMethodText || 'COD'}</span>
                                </p>
                            </div>
                        </div>

                        <div className="order-card alt">
                            <h2 className="order-card-title">Tổng tiền</h2>
                            <div className="order-total-list">
                                <div className="order-total-row">
                                    <span>Tạm tính</span>
                                    <span>{(order.subTotal || 0).toLocaleString('vi-VN')} ₫</span>
                                </div>
                                <div className="order-total-row">
                                    <span>Phí giao hàng</span>
                                    <span>{(order.shippingFee || 0) === 0 ? 'Miễn phí' : (order.shippingFee).toLocaleString('vi-VN') + ' ₫'}</span>
                                </div>
                                {(order.discount > 0) && (
                                    <div className="order-total-row discount">
                                        <span>Giảm giá{order.couponCode ? ` (Mã: ${order.couponCode})` : ''}</span>
                                        <span>-{(order.discount || 0).toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                )}
                                <div className="order-total-final">
                                    <span>Tổng cộng</span>
                                    <span className="order-total-final-price">{(order.total || 0).toLocaleString('vi-VN')} ₫</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
