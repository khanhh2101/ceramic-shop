import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { selectSelectedCartItems, selectSelectedCartTotal, selectCartLoading, removeCartItem, removeGuestCartItem, clearSelection, selectSelectedItemIds } from '@/store/slices/cartSlice';
import { selectUser, selectIsAuthenticated } from '@/store/slices/authSlice';
import { orderService } from '@/services';
import { checkoutApi } from './api/checkoutApi';
import { useAddresses } from '../Profile/hooks/useProfileQueries';
import { useProvinces, useDistricts, useWards } from '@/hooks/queries/useLocations';
import { usePublicCoupons } from './hooks/useCheckoutQueries';
import Modal from '@/components/common/Modal';
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
    const selectedItemIds = useSelector(selectSelectedItemIds);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shippingFee, setShippingFee] = useState(0);
    
    // Coupon States
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState('');
    const [orderDiscountAmount, setOrderDiscountAmount] = useState(0);
    const [shippingDiscountAmount, setShippingDiscountAmount] = useState(0);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    // React Query Hooks
    const { data: publicCoupons = [] } = usePublicCoupons();
    const { data: savedAddresses = [] } = useAddresses({ enabled: isAuth });

    // Location States
    const [isNewStructure, setIsNewStructure] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isEnteringNewAddress, setIsEnteringNewAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

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

    const { data: provinces = [] } = useProvinces(isNewStructure);
    const { data: districts = [] } = useDistricts(selectedProvince, { enabled: !isNewStructure });
    const { data: wards = [] } = useWards(
        isNewStructure ? selectedProvince : selectedDistrict, 
        isNewStructure,
        { enabled: !!(isNewStructure ? selectedProvince : selectedDistrict) }
    );

    const [isInitialized, setIsInitialized] = useState(false);

    const applyAddressToForm = async (addr, loadedProvinces) => {
        setSelectedAddress(addr);
        setValue('receiverName', addr.receiverName);
        setValue('receiverPhone', addr.phone);
        setValue('receiverEmail', addr.receiverEmail || user?.email || '');
        setValue('addressDetail', addr.detail);
        
        const isNew = !addr.district;
        setIsNewStructure(isNew);
        
        let pCode = addr.provinceCode?.toString();
        let dCode = addr.districtCode?.toString();
        let wCode = addr.wardCode?.toString();

        if (!pCode && addr.province && loadedProvinces.length > 0) {
            const foundP = loadedProvinces.find(p => p.name === addr.province);
            if (foundP) pCode = foundP.code.toString();
        }

        if (pCode) {
            if (isNew && !wCode && addr.ward) {
                try {
                    const res = await checkoutApi.getWards(pCode, true);
                    const foundW = (res?.data || []).find(w => w.name === addr.ward);
                    if (foundW) wCode = foundW.code.toString();
                } catch (e) { console.error(e); }
            } else if (!isNew && !dCode && addr.district) {
                try {
                    const res = await checkoutApi.getDistricts(pCode);
                    const foundD = (res?.data || []).find(d => d.name === addr.district);
                    if (foundD) dCode = foundD.code.toString();
                    
                    if (dCode && !wCode && addr.ward) {
                        const wRes = await checkoutApi.getWards(dCode, false);
                        const foundW = (wRes?.data || []).find(w => w.name === addr.ward);
                        if (foundW) wCode = foundW.code.toString();
                    }
                } catch (e) { console.error(e); }
            }
        }

        setValue('province', pCode || '', { shouldValidate: !!pCode });
        setValue('district', dCode || '', { shouldValidate: !!dCode });
        setValue('ward', wCode || '', { shouldValidate: !!wCode });
    };

    useEffect(() => {
        if (!isAuth) {
            if (!isInitialized) setIsInitialized(true);
            return;
        }
        
        if (savedAddresses.length > 0 && provinces.length > 0 && !isInitialized) {
            const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
            const isNew = !defaultAddr.district;
            setIsNewStructure(isNew);
            applyAddressToForm(defaultAddr, provinces);
            setIsEnteringNewAddress(false);
            setIsInitialized(true);
        } else if (savedAddresses.length === 0 && provinces.length > 0 && !isInitialized) {
            setIsInitialized(true);
            setValue('province', '');
            setValue('district', '');
            setValue('ward', '');
            setIsEnteringNewAddress(true);
        }
    }, [savedAddresses, provinces, isInitialized, isAuth, setValue]);

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
        // If the cart has finished loading and there are no valid cart items to checkout, kick them out
        if (!isCartLoading && cartItems.length === 0) {
            toast.error('Giỏ hàng trống hoặc chưa chọn sản phẩm hợp lệ!');
            navigate('/cart');
        }
    }, [isCartLoading, cartItems.length, navigate]);

    const handleSelectAddress = async (addr) => {
        await applyAddressToForm(addr, provinces);
        setIsEnteringNewAddress(false);
        setIsAddressModalOpen(false);
    };

    const handleClearForm = () => {
        setValue('receiverName', '');
        setValue('receiverPhone', '');
        setValue('addressDetail', '');
        setValue('province', '');
        setValue('district', '');
        setValue('ward', '');
        setIsEnteringNewAddress(true);
        setIsAddressModalOpen(false);
    };

    const handleRevertToSaved = async () => {
        setIsEnteringNewAddress(false);
        if (selectedAddress) {
            await applyAddressToForm(selectedAddress, provinces);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Vui lòng nhập mã giảm giá');
            return;
        }

        setIsApplyingCoupon(true);
        try {
            const res = await checkoutApi.validateCoupon({
                code: couponCode.trim(),
                orderTotal: cartTotal,
                shippingFee: shippingFee
            });

            if (res.data?.isValid || res.isValid) {
                const data = res.data || res;
                toast.success(data.message || 'Áp dụng mã giảm giá thành công!');
                
                if (data.isShippingDiscount) {
                    setShippingDiscountAmount(data.discountAmount || 0);
                    setOrderDiscountAmount(0);
                } else {
                    setOrderDiscountAmount(data.discountAmount || 0);
                    setShippingDiscountAmount(0);
                }
                
                setAppliedCoupon(couponCode.trim());
            } else {
                toast.error(res.data?.message || res.message || 'Mã giảm giá không hợp lệ');
                setOrderDiscountAmount(0);
                setShippingDiscountAmount(0);
                setAppliedCoupon('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi kiểm tra mã giảm giá');
            setOrderDiscountAmount(0);
            setShippingDiscountAmount(0);
            setAppliedCoupon('');
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode('');
        setAppliedCoupon('');
        setOrderDiscountAmount(0);
        setShippingDiscountAmount(0);
        toast.success('Đã gỡ mã giảm giá');
    };

    const onError = (errors) => {
        console.log("Form validation errors:", errors);
        if (errors.receiverName || errors.receiverEmail || errors.receiverPhone || errors.province || errors.district || errors.ward || errors.addressDetail) {
            toast.error('Vui lòng nhập đầy đủ và chính xác thông tin giao hàng!');
            if (!isEnteringNewAddress) {
                setIsEnteringNewAddress(true);
            }
        }
    };

    const onSubmit = async (data) => {
        if (cartItems.length === 0) return;
        setIsSubmitting(true);

        try {
            const provinceName = provinces.find(p => p.code.toString() === data.province)?.name || '';
            const districtName = districts.find(d => d.code.toString() === data.district)?.name || '';
            const wardName = wards.find(w => w.code.toString() === data.ward)?.name || '';
            const fullAddress = `${data.addressDetail}, ${wardName}, ${districtName}, ${provinceName}`;

            const finalShippingFee = Math.max(0, shippingFee - shippingDiscountAmount);
            const subTotal = cartTotal - orderDiscountAmount;
            const finalTotal = Math.max(0, subTotal + finalShippingFee);

            const payload = {
                receiverName: data.receiverName,
                receiverPhone: data.receiverPhone,
                receiverEmail: data.receiverEmail,
                province: provinceName || data.province,
                district: isNewStructure ? '' : (districtName || data.district),
                ward: wardName || data.ward,
                addressDetail: data.addressDetail,
                note: data.note || '',
                paymentMethod: parseInt(data.paymentMethod),
                couponCode: appliedCoupon || null,
                items: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    colorId: item.colorId || null,
                    color: item.color
                }))
            };

            const res = await orderService.create(payload);
            toast.success('Đặt hàng thành công!');
            
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
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Wait for the full cart items to be loaded before rendering the checkout form
    if (isCartLoading || cartItems.length === 0) {
        return (
            <div className="bg-[#faf7f4] min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#c4a882] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const finalShippingFee = Math.max(0, shippingFee - shippingDiscountAmount);
    const grandTotal = Math.max(0, cartTotal - orderDiscountAmount + finalShippingFee);

    return (
        <div className="bg-[#faf7f4] min-h-screen py-16">
            <div className="max-w-[1200px] mx-auto px-5 md:px-10">
                <h1 className="text-[32px] mb-8 text-[#1a1a1a] font-display">
                    Thanh Toán
                </h1>

                <form onSubmit={handleSubmit(onSubmit, onError)} className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
                    
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
                        selectedWard={selectedWard}
                        setValue={setValue}
                        hasAddresses={isAuth && savedAddresses.length > 0}
                        onOpenAddressModal={() => setIsAddressModalOpen(true)}
                        onClearForm={handleClearForm}
                        onRevertToSaved={handleRevertToSaved}
                        watch={watch}
                        isEnteringNewAddress={isEnteringNewAddress}
                        setIsEnteringNewAddress={setIsEnteringNewAddress}
                    />

                    <OrderSummary 
                        cartItems={cartItems}
                        cartTotal={cartTotal}
                        shippingFee={shippingFee}
                        orderDiscountAmount={orderDiscountAmount}
                        shippingDiscountAmount={shippingDiscountAmount}
                        grandTotal={grandTotal}
                        isSubmitting={isSubmitting}
                        
                        couponCode={couponCode}
                        setCouponCode={setCouponCode}
                        appliedCoupon={appliedCoupon}
                        isApplyingCoupon={isApplyingCoupon}
                        onApplyCoupon={handleApplyCoupon}
                        onRemoveCoupon={handleRemoveCoupon}
                        publicCoupons={publicCoupons}
                    />
                </form>
            </div>

            {isAuth && savedAddresses.length > 0 && (
                <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} maxWidth="max-w-xl">
                    <div className="p-2">
                        <h2 className="text-[20px] font-display uppercase tracking-[1px] mb-6 text-center text-[#1a1a1a]">
                            Chọn địa chỉ đã lưu
                        </h2>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {savedAddresses.map(addr => (
                                <div 
                                    key={addr.id} 
                                    className="p-4 border border-[#ddd] rounded-sm cursor-pointer hover:border-[#c4a882] hover:bg-[#faf7f4] transition-all"
                                    onClick={() => handleSelectAddress(addr)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-semibold text-[#1a1a1a]">{addr.receiverName}</div>
                                        {addr.isDefault && <span className="bg-[#c4a882] text-white text-[10px] px-2 py-1 rounded-sm uppercase tracking-[1px]">Mặc định</span>}
                                    </div>
                                    <div className="text-[13px] text-[#666] space-y-1">
                                        <p><span className="font-medium text-[#444]">SĐT:</span> {addr.phone}</p>
                                        {addr.receiverEmail && <p><span className="font-medium text-[#444]">Email:</span> {addr.receiverEmail}</p>}
                                        <p><span className="font-medium text-[#444]">Địa chỉ:</span> {addr.detail}, {addr.ward}{addr.district ? `, ${addr.district}` : ''}, {addr.province}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-[#eee] text-center">
                            <button 
                                type="button" 
                                onClick={handleClearForm}
                                className="inline-flex items-center gap-2 text-[#c4a882] hover:underline font-medium text-[14px]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                                Giao đến một địa chỉ khác (Tự nhập tay)
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
