import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { selectSelectedCartItems, selectSelectedCartTotal, selectCartLoading, removeCartItem, removeGuestCartItem, clearSelection } from '@/store/slices/cartSlice';
import { selectUser, selectIsAuthenticated } from '@/store/slices/authSlice';
import { orderService } from '@/services';
import { checkoutApi } from './api/checkoutApi';
import toast from 'react-hot-toast';
import CheckoutForm from './components/CheckoutForm';
import OrderSummary from './components/OrderSummary';
import './Checkout.css';
import { getErrorMessage } from '@/utils';

export default function Checkout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectSelectedCartItems);
    const cartTotal = useSelector(selectSelectedCartTotal);
    const user = useSelector(selectUser);
    const isAuth = useSelector(selectIsAuthenticated);
    const isCartLoading = useSelector(selectCartLoading);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shippingFee, setShippingFee] = useState(0);
    
    // Coupon States
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    // Location States
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [isNewStructure, setIsNewStructure] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            receiverName: user?.fullName || '',
            receiverEmail: user?.email || '',
            receiverPhone: user?.phone || '',
            ward: '',
            addressDetail: '',
            note: '',
            paymentMethod: '0', // COD
        },
    });

    const selectedProvince = watch('province');
    const selectedDistrict = watch('district');
    const selectedWard = watch('ward');

    // Fetch Provinces
    useEffect(() => {
        checkoutApi.getProvinces(isNewStructure)
            .then(res => {
                setProvinces(res?.data || []);
                setValue('province', '');
                setValue('district', '');
                setValue('ward', '');
            })
            .catch(() => toast.error('Không thể tải Tỉnh/Thành phố'));
    }, [isNewStructure, setValue]);

    // Fetch Districts (if Old Structure) or Wards (if New Structure) when Province changes
    useEffect(() => {
        if (selectedProvince) {
            if (isNewStructure) {
                checkoutApi.getWards(selectedProvince, true)
                    .then(res => {
                        setWards(res?.data || []);
                        setValue('ward', ''); // Reset ward
                    })
                    .catch(() => toast.error('Không thể tải Phường/Xã'));
            } else {
                checkoutApi.getDistricts(selectedProvince)
                    .then(res => {
                        setDistricts(res?.data || []);
                        setValue('district', ''); // Reset district
                        setWards([]);
                        setValue('ward', '');
                    })
                    .catch(() => toast.error('Không thể tải Quận/Huyện'));
            }
        } else {
            setDistricts([]);
            setWards([]);
            setValue('district', '');
            setValue('ward', '');
        }
    }, [selectedProvince, isNewStructure, setValue]);

    // Fetch Wards when District changes (Old Structure)
    useEffect(() => {
        if (!isNewStructure && selectedDistrict) {
            checkoutApi.getWards(selectedDistrict, false)
                .then(res => {
                    setWards(res?.data || []);
                    setValue('ward', ''); // Reset ward
                })
                .catch(() => toast.error('Không thể tải Phường/Xã'));
        } else if (!isNewStructure) {
            setWards([]);
            setValue('ward', '');
        }
    }, [selectedDistrict, isNewStructure, setValue]);

    // Calculate dynamic shipping fee
    useEffect(() => {
        if (!selectedProvince) {
            setShippingFee(0);
            return;
        }

        let params = {
            provinceCode: selectedProvince,
            isNewStructure: isNewStructure
        };
        if (!isNewStructure && selectedDistrict) {
            params.districtCode = selectedDistrict;
        }
        if (selectedWard) {
            params.wardCode = selectedWard;
        }

        checkoutApi.getShippingFee(params)
            .then(res => setShippingFee(res?.data || 30000))
            .catch(() => setShippingFee(30000));
            
    }, [selectedProvince, selectedDistrict, selectedWard, isNewStructure]);

    useEffect(() => {
        if (!isCartLoading && cartItems.length === 0) {
            toast.error('Giỏ hàng trống!');
            navigate('/shop');
        }
    }, [cartItems, isCartLoading, navigate]);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Vui lòng nhập mã giảm giá');
            return;
        }

        setIsApplyingCoupon(true);
        try {
            const res = await checkoutApi.validateCoupon({
                code: couponCode.trim(),
                orderTotal: cartTotal
            });

            if (res.data?.isValid || res.isValid) {
                const data = res.data || res;
                toast.success(data.message || 'Áp dụng mã giảm giá thành công!');
                setDiscountAmount(data.discountAmount || 0);
                setAppliedCoupon(couponCode.trim());
            } else {
                toast.error(res.data?.message || res.message || 'Mã giảm giá không hợp lệ');
                setDiscountAmount(0);
                setAppliedCoupon('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi kiểm tra mã giảm giá');
            setDiscountAmount(0);
            setAppliedCoupon('');
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode('');
        setAppliedCoupon('');
        setDiscountAmount(0);
        toast.success('Đã gỡ mã giảm giá');
    };

    const onSubmit = async (data) => {
        if (cartItems.length === 0) return;
        setIsSubmitting(true);

        try {
            // Get text names for location
            const provinceName = provinces.find(p => p.code.toString() === data.province)?.name || '';
            const districtName = districts.find(d => d.code.toString() === data.district)?.name || '';
            const wardName = wards.find(w => w.code.toString() === data.ward)?.name || '';

            const payload = {
                receiverName: data.receiverName,
                receiverPhone: data.receiverPhone,
                receiverEmail: data.receiverEmail,
                province: provinceName || data.province,
                district: isNewStructure ? '' : (districtName || data.district),
                ward: isNewStructure ? (wardName || data.ward) : `${wardName || data.ward}, ${districtName || data.district}`,
                addressDetail: data.addressDetail,
                note: data.note,
                paymentMethod: parseInt(data.paymentMethod),
                couponCode: appliedCoupon || null,
                items: cartItems.map(i => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    colorId: i.colorId || null,
                    color: i.color
                }))
            };

            const res = await orderService.create(payload);
            toast.success('Đặt hàng thành công!');
            
            // Chỉ xóa các item đã thanh toán khỏi giỏ hàng
            cartItems.forEach(item => {
                if (isAuth) {
                    dispatch(removeCartItem(item.id));
                } else {
                    dispatch(removeGuestCartItem(item.itemKey || item.productId));
                }
            });
            dispatch(clearSelection());
            
            const trackingToken = res?.data?.trackingToken || res?.trackingToken;
            const orderCode = res?.data?.orderCode || res?.orderCode;
            const orderId = res?.data?.orderId || res?.id || res?.data?.id;

            if (!isAuth && trackingToken) {
                navigate(`/track/${trackingToken}`);
            } else if (orderCode) {
                navigate(`/orders/${orderCode}`);
            } else if (orderId) {
                navigate(`/orders/${orderId}`);
            } else {
                navigate('/orders');
            }
        } catch (error) {
            if (error.response?.data?.error) {
                toast.error(error.response.error, { duration: 5000 });
                toast.error("Vui lòng quay lại giỏ hàng để cập nhật số lượng.");
                setTimeout(() => navigate('/cart'), 2000);
            } else {
                /* toast handled by api */
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isCartLoading || cartItems.length === 0) return null;

    const grandTotal = Math.max(0, cartTotal + shippingFee - discountAmount);

    return (
        <div className="bg-[#faf7f4] min-h-screen py-16">
            <div className="max-w-[1200px] mx-auto px-5 md:px-10">
                <h1 className="text-[32px] mb-8 text-[#1a1a1a] font-display">
                    Thanh Toán
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
                    
                    {/* ── FORM THANH TOÁN ── */}
                    <CheckoutForm 
                        register={register}
                        errors={errors}
                        provinces={provinces}
                        districts={districts}
                        wards={wards}
                        isNewStructure={isNewStructure}
                        setIsNewStructure={setIsNewStructure}
                        selectedProvince={selectedProvince}
                        selectedDistrict={selectedDistrict}
                    />

                    {/* ── TÓM TẮT ĐƠN HÀNG ── */}
                    <OrderSummary 
                        cartItems={cartItems}
                        cartTotal={cartTotal}
                        shippingFee={shippingFee}
                        discountAmount={discountAmount}
                        grandTotal={grandTotal}
                        isSubmitting={isSubmitting}
                        
                        couponCode={couponCode}
                        setCouponCode={setCouponCode}
                        appliedCoupon={appliedCoupon}
                        isApplyingCoupon={isApplyingCoupon}
                        onApplyCoupon={handleApplyCoupon}
                        onRemoveCoupon={handleRemoveCoupon}
                    />
                </form>
            </div>
        </div>
    );
}
