import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        setLoading(true);
        try {
            const res = await orderService.getById(id);
            setOrder(res.data?.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải thông tin đơn hàng');
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-[#888]">Đang tải chi tiết đơn hàng...</div>;
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf7f4] px-5">
                <p className="text-[#e53e3e] mb-4">{error || 'Không tìm thấy đơn hàng'}</p>
                <Link to="/orders" className="text-[12px] uppercase tracking-[1px] border-b border-[#1a1a1a] pb-0.5 text-[#1a1a1a]">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    // In MasterData: 4000001 (Pending), 4000002 (Awaiting Payment), 4000003 (Paid), 4000004 (Failed), 4000005 (Processing), 4000006 (Shipping), 4000007 (Completed), 4000008 (Cancelled)
    const isCancelled = order.statusId === 4000008;

    return (
        <div className="bg-[#faf7f4] min-h-screen py-16">
            <div className="max-w-[1000px] mx-auto px-5 md:px-10">
                <Link to="/orders" className="inline-flex items-center gap-2 text-[13px] text-[#555] hover:text-[#1a1a1a] mb-8 transition-colors">
                    <FiArrowLeft /> Quay lại danh sách đơn hàng
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#ddd]">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-[28px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
                                Đơn hàng #{order.id?.toString().slice(0, 8).toUpperCase() || order.id}
                            </h1>
                            <span 
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                                style={{ backgroundColor: order.statusColor || '#888' }}
                            >
                                {order.statusText}
                            </span>
                        </div>
                        <p className="text-[13px] text-[#888]">
                            Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                {/* TIMELINE */}
                {!isCancelled && (
                    <div className="bg-white p-8 rounded-sm shadow-sm mb-8">
                        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center">
                            {/* Đường kẻ ngang */}
                            <div className="absolute left-[24px] top-0 bottom-0 w-[2px] md:w-auto md:h-[2px] md:left-0 md:right-0 md:top-[24px] bg-[#f0f0f0] -z-0"></div>
                            
                            {[
                                { title: 'Chờ xử lý', id: 4000001, icon: <FiPackage /> },
                                { title: 'Đang xử lý', id: 4000005, icon: <FiPackage /> },
                                { title: 'Đang giao', id: 4000006, icon: <FiTruck /> },
                                { title: 'Hoàn thành', id: 4000007, icon: <FiCheckCircle /> }
                            ].map((step, idx, arr) => {
                                // Determine active based on current status.
                                // We consider it active if the order.statusId is >= step.id
                                // (assuming IDs are sequentially increasing for the main flow)
                                const stepOrderMap = { 4000001: 1, 4000002: 1, 4000003: 1, 4000004: 1, 4000005: 2, 4000006: 3, 4000007: 4 };
                                const currentLevel = stepOrderMap[order.statusId] || 1;
                                const stepLevel = stepOrderMap[step.id];
                                const isActive = currentLevel >= stepLevel;
                                return (
                                    <div key={idx} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 mb-8 md:mb-0 w-full md:w-1/4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors duration-300 shadow-sm
                                            ${isActive ? 'bg-[#c4a882] text-white border-4 border-white' : 'bg-[#fff] text-[#ccc] border-4 border-[#f0f0f0]'}`}
                                        >
                                            {step.icon}
                                        </div>
                                        <div className="md:text-center">
                                            <p className={`text-[14px] font-medium mb-1 ${isActive ? 'text-[#1a1a1a]' : 'text-[#aaa]'}`} style={{ fontFamily: 'var(--font-display)' }}>
                                                {step.title}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* CHI TIẾT SẢN PHẨM */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-sm shadow-sm">
                            <h2 className="text-[18px] uppercase tracking-[1px] border-b border-[#eee] pb-4 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                                Sản phẩm đã đặt
                            </h2>
                            <div className="space-y-6">
                                {order.orderItems?.map((item) => (
                                    <div key={item.id} className="flex items-start gap-4 pb-6 border-b border-[#f5f5f5] last:border-0 last:pb-0">
                                        <div className="w-20 h-20 bg-[#faf7f4] rounded-sm overflow-hidden shrink-0">
                                            <img 
                                                src={item.product?.primaryImageUrl || '/assets/image/placeholder.jpg'} 
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[14px] text-[#1a1a1a] mb-1 leading-[1.5]" style={{ fontFamily: 'var(--font-display)' }}>
                                                {item.productName || item.product?.name}
                                            </p>
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
                                                {((item.price || item.product?.price || 0) * item.quantity).toLocaleString('vi-VN')} ₫
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
                                <p><strong className="text-[#1a1a1a] font-medium block mb-1">Người nhận:</strong> {(order.shippingAddress && order.shippingAddress.includes('-')) ? order.shippingAddress.split('-')[0] : 'N/A'}</p>
                                <p><strong className="text-[#1a1a1a] font-medium block mb-1">Điện thoại:</strong> {order.phone || 'N/A'}</p>
                                <p><strong className="text-[#1a1a1a] font-medium block mb-1">Địa chỉ:</strong> {order.shippingAddress || 'N/A'}</p>
                                <p><strong className="text-[#1a1a1a] font-medium block mb-1">Phương thức thanh toán:</strong> 
                                    <span className="uppercase inline-block ml-1 bg-[#f5f5f5] px-2 py-0.5 rounded-sm text-[11px]">{order.paymentMethod || 'COD'}</span>
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
                                    <span>{(order.totalAmount || 0).toLocaleString('vi-VN')} ₫</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phí giao hàng</span>
                                    <span>Miễn phí</span>
                                </div>
                                <div className="flex justify-between pt-4 mt-4 border-t border-[#d8d0c4] text-[20px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
                                    <span>Tổng cộng</span>
                                    <span className="text-[var(--terracotta)]">{(order.totalAmount || 0).toLocaleString('vi-VN')} ₫</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
