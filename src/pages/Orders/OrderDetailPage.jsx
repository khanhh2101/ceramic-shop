import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addToCartServer } from '../../store/slices/cartSlice';
import { orderService, reviewService } from '../../services';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiStar, FiX, FiRefreshCcw } from 'react-icons/fi';
import Modal from '../../components/common/Modal';

export default function OrderDetailPage() {
    const { orderCode } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reordering, setReordering] = useState(false);

    // Review Modal States
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [rating, setRating] = useState(5);

    const { register: regReview, handleSubmit: handleReviewSubmit, reset: resetReview, formState: { errors: errReview } } = useForm();

    const openReviewModal = (item) => {
        setSelectedProduct(item);
        setRating(5);
        resetReview({ title: '', content: '' });
        setReviewModalOpen(true);
    };

    const onReviewSubmit = async (data) => {
        if (!selectedProduct) return;
        setSubmittingReview(true);
        try {
            const payload = {
                productId: selectedProduct.productId,
                stars: rating,
                title: data.title,
                content: data.content
            };
            await reviewService.create(payload);
            toast.success('Đánh giá của bạn đã được gửi và đang chờ duyệt!');
            setReviewModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
        } finally {
            setSubmittingReview(false);
        }
    };

    useEffect(() => {
        if (orderCode) {
            fetchOrderDetail();
        }
    }, [orderCode]);

    const fetchOrderDetail = async () => {
        setLoading(true);
        try {
            const res = await orderService.getByCode(orderCode);
            setOrder(res.data?.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải thông tin đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async () => {
        if (!order || !order.items) return;
        setReordering(true);
        
        let addedCount = 0;
        let outOfStockCount = 0;

        for (const item of order.items) {
            if (item.isActive && item.stockQuantity > 0) {
                const quantityToAdd = Math.min(item.quantity, item.stockQuantity);
                try {
                    await dispatch(addToCartServer({ 
                        productId: item.productId, 
                        quantity: quantityToAdd, 
                        color: item.color 
                    })).unwrap();
                    addedCount++;
                } catch (err) {
                    outOfStockCount++;
                }
            } else {
                outOfStockCount++;
            }
        }
        
        setReordering(false);

        if (addedCount > 0) {
            toast.success(`Đã thêm ${addedCount} sản phẩm vào giỏ hàng.`);
            navigate('/cart');
        } else if (outOfStockCount > 0) {
            toast.error('Tất cả sản phẩm trong đơn hàng này đã hết hàng hoặc ngừng kinh doanh.');
        }
        
        if (addedCount > 0 && outOfStockCount > 0) {
            toast.error(`Có ${outOfStockCount} sản phẩm đã hết hàng, không thể thêm vào giỏ.`);
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
                                Đơn hàng #{order.orderCode || order.id}
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
                    
                    <div className="mt-4 md:mt-0">
                        <button 
                            onClick={handleReorder}
                            disabled={reordering}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white text-[12px] uppercase tracking-[1px] hover:bg-[#c4a882] transition-colors rounded-sm disabled:opacity-70"
                        >
                            {reordering ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <FiRefreshCcw />
                            )}
                            Đặt lại đơn hàng
                        </button>
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
                                {order.statusId === 4000008 
                                    ? 'Đơn hàng của bạn đã được hủy. Nếu bạn đã thanh toán, chúng tôi sẽ hoàn tiền trong thời gian sớm nhất.' 
                                    : 'Quá trình thanh toán không thành công. Vui lòng đặt lại đơn hàng mới.'}
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
                                        style={{ width: `calc(${progressWidth} * 0.8)` }} // 0.8 do left 10% right 10%
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
                                        {order.statusId === 4000007 && (
                                            <div className="shrink-0 flex flex-col justify-center">
                                                {item.isReviewed ? (
                                                    <span className="px-4 py-2 border border-[#888] text-[#888] text-[12px] uppercase tracking-[1px] rounded-sm whitespace-nowrap bg-[#faf7f4] flex items-center gap-1">
                                                        <FiCheckCircle size={14} /> Đã đánh giá
                                                    </span>
                                                ) : (
                                                    <button 
                                                        onClick={() => openReviewModal(item)}
                                                        className="px-4 py-2 border border-[#c4a882] text-[#c4a882] text-[12px] uppercase tracking-[1px] hover:bg-[#c4a882] hover:text-white transition-colors rounded-sm whitespace-nowrap"
                                                    >
                                                        Đánh giá
                                                    </button>
                                                )}
                                            </div>
                                        )}
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

            {/* Review Modal */}
            <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} maxWidth="max-w-md">
                <div className="relative p-6 md:p-8 bg-white">
                    {/* Nút Đóng */}
                    <button 
                        onClick={() => setReviewModalOpen(false)}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiX size={20} />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-[24px] text-[#1a1a1a] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                            Chia Sẻ Cảm Nhận
                        </h2>
                        <p className="text-[13px] text-[#888] leading-relaxed px-4">
                            Đánh giá của bạn giúp chúng tôi hoàn thiện chất lượng dịch vụ mỗi ngày.
                        </p>
                    </div>

                    <form onSubmit={handleReviewSubmit(onReviewSubmit)} className="space-y-6">
                        {/* Sản phẩm */}
                        <div className="flex flex-col items-center justify-center gap-3 pb-6 border-b border-[#f0f0f0]">
                            <div className="w-20 h-20 bg-[#faf7f4] rounded-full shadow-inner overflow-hidden border border-[#eee]">
                                <img 
                                    src={selectedProduct?.productImageUrl || '/assets/image/placeholder.jpg'} 
                                    alt={selectedProduct?.productName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-[14px] font-medium text-[#1a1a1a] text-center px-4" style={{ fontFamily: 'var(--font-display)' }}>
                                {selectedProduct?.productName}
                            </p>
                        </div>

                        {/* Chọn Sao */}
                        <div className="flex flex-col items-center py-2">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="p-1 transition-transform hover:scale-110 active:scale-95"
                                    >
                                        <FiStar 
                                            className={`w-9 h-9 transition-colors duration-300 ${
                                                star <= rating 
                                                    ? 'fill-[#c4a882] text-[#c4a882] drop-shadow-sm' 
                                                    : 'text-[#e5e7eb] hover:text-[#d1d5db]'
                                            }`} 
                                        />
                                    </button>
                                ))}
                            </div>
                            <div className="h-6 mt-2">
                                <span className="text-[13px] font-medium text-[#c4a882] uppercase tracking-widest">
                                    {rating === 5 ? 'Tuyệt vời' : rating === 4 ? 'Rất tốt' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Tạm được' : rating === 1 ? 'Rất tệ' : ''}
                                </span>
                            </div>
                        </div>

                        {/* Tiêu đề & Nội dung */}
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3.5 bg-[#f8f8f8] border border-transparent rounded-xl text-[14px] text-[#1a1a1a] transition-all duration-300 outline-none focus:bg-white focus:border-[#c4a882] focus:ring-4 focus:ring-[#c4a882]/10 placeholder:text-[#aaa]"
                                    placeholder="Tiêu đề đánh giá (VD: Sản phẩm rất đẹp!)"
                                    {...regReview('title', { required: 'Vui lòng nhập tiêu đề' })}
                                />
                                {errReview.title && <p className="text-[#e53e3e] text-[12px] mt-1.5 px-2">{errReview.title.message}</p>}
                            </div>

                            <div>
                                <textarea
                                    className="w-full px-4 py-3.5 bg-[#f8f8f8] border border-transparent rounded-xl text-[14px] text-[#1a1a1a] transition-all duration-300 outline-none focus:bg-white focus:border-[#c4a882] focus:ring-4 focus:ring-[#c4a882]/10 min-h-[120px] resize-none placeholder:text-[#aaa]"
                                    placeholder="Chia sẻ trải nghiệm của bạn về độ hoàn thiện, màu sắc, thiết kế..."
                                    {...regReview('content', { required: 'Vui lòng nhập nội dung đánh giá' })}
                                ></textarea>
                                {errReview.content && <p className="text-[#e53e3e] text-[12px] mt-1.5 px-2">{errReview.content.message}</p>}
                            </div>
                        </div>

                        {/* Nút hành động */}
                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={submittingReview} 
                                className="w-full py-4 text-[13px] uppercase tracking-[2px] font-medium bg-[#1a1a1a] text-[#c4a882] hover:bg-[#c4a882] hover:text-white hover:shadow-lg transition-all duration-300 rounded-xl disabled:opacity-70 flex items-center justify-center gap-3"
                            >
                                {submittingReview ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-[#c4a882]/30 border-t-[#c4a882] rounded-full animate-spin"></span>
                                        Đang gửi...
                                    </>
                                ) : (
                                    'Gửi Đánh Giá'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
