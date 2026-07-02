import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services';
import { FiPackage, FiTruck, FiCheckCircle, FiX } from 'react-icons/fi';

export default function OrderTrackPage() {
    const { trackingToken } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (trackingToken) {
            fetchOrderTrack();
        }
    }, [trackingToken]);

    const fetchOrderTrack = async () => {
        setLoading(true);
        try {
            const res = await orderService.getByTrackingToken(trackingToken);
            setOrder(res.data?.data);
        } catch (err) {
            if (err.response?.status === 410) {
                setIsExpired(true);
                setError('Đường dẫn theo dõi đơn hàng đã hết hạn.');
            } else {
                setError(err.response?.data?.message || 'Không tìm thấy thông tin đơn hàng hoặc đường dẫn không hợp lệ.');
            }
        } finally {
            setLoading(false);
        }
    };

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
                <Link to="/shop" className="px-8 py-3 bg-[#1a1a1a] text-white text-[12px] uppercase tracking-[2px] rounded-sm hover:bg-[#c4a882] transition-colors">
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#faf7f4] min-h-screen py-16">
            <div className="max-w-[1000px] mx-auto px-5 md:px-10">
                <div className="text-center mb-10">
                    <h2 className="text-[13px] uppercase tracking-[2px] text-[#c4a882] mb-3 font-medium">
                        Theo dõi đơn hàng
                    </h2>
                    <h1 className="text-[32px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
                        Đơn hàng #{order.orderCode || order.id}
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#ddd]">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[16px] text-[#1a1a1a] font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                                Trạng thái hiện tại:
                            </span>
                            <span 
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                                style={{ backgroundColor: order.statusColor || '#888' }}
                            >
                                {order.statusText}
                            </span>
                        </div>
                        <p className="text-[13px] text-[#888]">
                            Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                {/* TIMELINE */}
                <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm mb-8 overflow-hidden">
                    {order.statusId === 4000008 || order.statusId === 4000004 ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-4">
                                <FiX size={32} />
                            </div>
                            <h3 className="text-[18px] text-[#1a1a1a] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                                {order.statusId === 4000008 ? 'Đơn hàng đã bị hủy' : 'Thanh toán thất bại'}
                            </h3>
                            <p className="text-[14px] text-[#888]">
                                Đơn hàng của bạn đã bị hủy hoặc thanh toán không thành công.
                            </p>
                        </div>
                    ) : (
                        <div className="relative flex justify-between items-center w-full max-w-3xl mx-auto">
                            {/* Thanh xám nền */}
                            <div className="absolute left-[10%] right-[10%] top-[24px] h-[2px] bg-[#f0f0f0] -z-10 hidden md:block"></div>
                            
                            {/* Thanh màu vàng (tiến trình) */}
                            {(() => {
                                const stepOrderMap = { 4000001: 0, 4000002: 0, 4000003: 0, 4000005: 1, 4000006: 2, 4000007: 3 };
                                const currentLevel = stepOrderMap[order.statusId] !== undefined ? stepOrderMap[order.statusId] : 0;
                                const progressWidth = currentLevel === 0 ? '0%' : currentLevel === 1 ? '33.33%' : currentLevel === 2 ? '66.66%' : '100%';
                                return (
                                    <div 
                                        className="absolute left-[10%] top-[24px] h-[2px] bg-[#c4a882] -z-10 hidden md:block transition-all duration-700 ease-in-out" 
                                        style={{ width: `calc(${progressWidth} * 0.8)` }} 
                                    ></div>
                                );
                            })()}

                            {[
                                { title: 'Chờ xác nhận', id: 4000001, icon: <FiPackage /> },
                                { title: 'Đang xử lý', id: 4000005, icon: <FiPackage /> },
                                { title: 'Đang giao', id: 4000006, icon: <FiTruck /> },
                                { title: 'Hoàn thành', id: 4000007, icon: <FiCheckCircle /> }
                            ].map((step, idx) => {
                                const stepOrderMap = { 4000001: 0, 4000002: 0, 4000003: 0, 4000005: 1, 4000006: 2, 4000007: 3 };
                                const currentLevel = stepOrderMap[order.statusId] !== undefined ? stepOrderMap[order.statusId] : 0;
                                const stepLevel = stepOrderMap[step.id];
                                const isActive = currentLevel >= stepLevel;
                                const isCurrent = currentLevel === stepLevel;

                                return (
                                    <div key={idx} className="relative z-10 flex flex-col items-center w-1/4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 shadow-sm
                                            ${isActive 
                                                ? 'bg-[#c4a882] text-white border-[3px] border-white ring-4 ring-[#c4a882]/20' 
                                                : 'bg-white text-[#ccc] border-[3px] border-[#f0f0f0]'
                                            }
                                            ${isCurrent ? 'scale-110' : ''}
                                        `}>
                                            {step.icon}
                                        </div>
                                        <div className="text-center mt-3">
                                            <p className={`text-[13px] md:text-[14px] font-medium transition-colors duration-300 ${isActive ? 'text-[#1a1a1a]' : 'text-[#aaa]'}`} style={{ fontFamily: 'var(--font-display)' }}>
                                                {step.title}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* CHI TIẾT SẢN PHẨM */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-sm shadow-sm">
                            <h2 className="text-[18px] uppercase tracking-[1px] border-b border-[#eee] pb-4 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                                Sản phẩm đã đặt
                            </h2>
                            <div className="space-y-6">
                                {order.items?.map((item) => (
                                    <div key={item.productId} className="flex items-start gap-4 pb-6 border-b border-[#f5f5f5] last:border-0 last:pb-0">
                                        <Link to={`/product/${item.productSlug}`} className="w-20 h-20 bg-[#faf7f4] rounded-sm overflow-hidden shrink-0 block hover:opacity-80 transition-opacity">
                                            <img 
                                                src={item.productImageUrl || '/assets/image/placeholder.jpg'} 
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        </Link>
                                        <div className="flex-1">
                                            <Link to={`/product/${item.productSlug}`} className="text-[14px] text-[#1a1a1a] mb-1 leading-[1.5] block hover:text-[#c4a882] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                                                {item.productName}
                                            </Link>
                                            <div className="text-[12px] text-[#888] mb-1 flex items-center gap-2 flex-wrap">
                                                {item.productCode && (
                                                    <span>SKU: {item.productCode}</span>
                                                )}
                                                {item.productCode && item.color && <span>|</span>}
                                                {item.color && (
                                                    <span>Màu: <span className="capitalize">{item.color}</span></span>
                                                )}
                                            </div>
                                            <p className="text-[12px] text-[#888] mb-2">Số lượng: {item.quantity}</p>
                                            <p className="text-[14px] text-[var(--terracotta)] font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                                                {(item.totalPrice || item.unitPrice * item.quantity || 0).toLocaleString('vi-VN')} ₫
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* THÔNG TIN & TỔNG TIỀN */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-sm shadow-sm">
                            <h2 className="text-[18px] uppercase tracking-[1px] border-b border-[#eee] pb-4 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                                Thông tin giao hàng
                            </h2>
                            <div className="text-[13px] text-[#555] space-y-3 leading-[1.6]">
                                <p><strong className="text-[#1a1a1a] font-medium block mb-1">Người nhận:</strong> {order.receiverName || 'N/A'}</p>
                                <p><strong className="text-[#1a1a1a] font-medium block mb-1">Điện thoại:</strong> {order.receiverPhone || 'N/A'}</p>
                                <p><strong className="text-[#1a1a1a] font-medium block mb-1">Địa chỉ:</strong> {order.addressDetail ? `${order.addressDetail}, ${order.ward}, ${order.district}, ${order.province}` : 'N/A'}</p>
                                <p><strong className="text-[#1a1a1a] font-medium block mb-1">Phương thức thanh toán:</strong> 
                                    <span className="uppercase inline-block ml-1 bg-[#f5f5f5] px-2 py-0.5 rounded-sm text-[11px]">{order.paymentMethodText || 'COD'}</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#eee8df] p-8 rounded-sm shadow-sm">
                            <h2 className="text-[18px] uppercase tracking-[1px] border-b border-[#d8d0c4] pb-4 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                                Tổng tiền
                            </h2>
                            <div className="space-y-3 text-[14px] text-[#555]">
                                <div className="flex justify-between">
                                    <span>Tạm tính</span>
                                    <span>{(order.subTotal || 0).toLocaleString('vi-VN')} ₫</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phí giao hàng</span>
                                    <span>{(order.shippingFee || 0) === 0 ? 'Miễn phí' : (order.shippingFee).toLocaleString('vi-VN') + ' ₫'}</span>
                                </div>
                                {(order.discount > 0) && (
                                    <div className="flex justify-between text-[#e53e3e]">
                                        <span>Giảm giá</span>
                                        <span>-{(order.discount || 0).toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-4 mt-4 border-t border-[#d8d0c4] text-[20px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
                                    <span>Tổng cộng</span>
                                    <span className="text-[var(--terracotta)]">{(order.total || 0).toLocaleString('vi-VN')} ₫</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
