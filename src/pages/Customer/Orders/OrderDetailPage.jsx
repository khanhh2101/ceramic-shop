import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addToCartServer } from '@/store/slices/cartSlice';
import { orderApi } from './api/orderApi';
import { useOrderDetails } from '@/pages/Customer/Orders/hooks/useOrdersQueries';
import { FiArrowLeft, FiCheckCircle, FiRefreshCcw } from 'react-icons/fi';
import OrderTimeline from './components/OrderTimeline';
import ReviewModal from './components/ReviewModal';
import './Orders.css';

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
            await orderApi.createReview(payload);
            toast.success('Đánh giá của bạn đã được gửi và đang chờ duyệt!');
            setReviewModalOpen(false);
            fetchOrderDetail(); // Refresh order details
        } catch (err) {
            /* toast handled by api */
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
            const res = await orderApi.getByCode(orderCode);
            setOrder(res?.data);
        } catch (err) {
            setError(getErrorMessage(err, 'Không thể tải thông tin đơn hàng'));
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
                <p className="text-[#e53e3e] mb-4">{error?.message || 'Không tìm thấy đơn hàng'}</p>
                <Link to="/orders" className="text-[12px] uppercase tracking-[1px] border-b border-[#1a1a1a] pb-0.5 text-[#1a1a1a]">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    return (
        <div className="order-details-main">
            <div className="orders-container">
                <Link to="/orders" className="order-details-back">
                    <FiArrowLeft /> Quay lại danh sách đơn hàng
                </Link>

                <div className="order-header-wrap">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="order-header-title">
                                Đơn hàng #{order.orderCode || order.id}
                            </h1>
                            <span 
                                className="order-list-status"
                                style={{ backgroundColor: order.statusColor || '#888' }}
                            >
                                {order.statusText}
                            </span>
                        </div>
                        <p className="order-header-date">
                            Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    
                    <div>
                        <button 
                            onClick={handleReorder}
                            disabled={reordering}
                            className="btn-reorder"
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

                <OrderTimeline order={order} />

                <div className="order-content-grid">
                    <div className="order-content-main">
                        <div className="order-card">
                            <h2 className="order-card-title">Sản phẩm đã đặt</h2>
                            <div>
                                {order.items?.map((item) => (
                                    <div key={item.productId} className="order-item">
                                        <Link to={`/product/${item.productSlug}`} className="order-item-img-wrap">
                                            <img 
                                                src={item.productImageUrl || 'https://placehold.co/600x800/eeeeee/999999?text=Gom+Nau'} 
                                                alt={item.productName}
                                                className="order-item-img"
                                            />
                                        </Link>
                                        <div className="order-item-details">
                                            <Link to={`/product/${item.productSlug}`} className="order-item-name">
                                                {item.productName}
                                            </Link>
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
                                        {order.statusId === 4000007 && (
                                            <div className="order-item-action">
                                                {item.isReviewed ? (
                                                    <span className="btn-reviewed">
                                                        <FiCheckCircle size={14} /> Đã đánh giá
                                                    </span>
                                                ) : (
                                                    <button 
                                                        onClick={() => openReviewModal(item)}
                                                        className="btn-review"
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

                            {order.note && (
                                <div className="mt-4 pt-4 border-t border-stone-200">
                                    <p className="text-sm text-stone-500 mb-1">Ghi chú của bạn:</p>
                                    <p className="text-sm text-stone-800 italic bg-stone-50 p-3 rounded-md">"{order.note}"</p>
                                </div>
                            )}
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

            <ReviewModal 
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                selectedProduct={selectedProduct}
                rating={rating}
                setRating={setRating}
                regReview={regReview}
                handleReviewSubmit={handleReviewSubmit}
                errReview={errReview}
                onReviewSubmit={onReviewSubmit}
                submittingReview={submittingReview}
            />
        </div>
    );
}
