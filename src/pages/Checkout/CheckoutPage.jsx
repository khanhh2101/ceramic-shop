import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { selectSelectedCartItems, selectSelectedCartTotal, selectCartLoading, removeCartItem, removeGuestCartItem, clearSelection } from '../../store/slices/cartSlice';
import { selectUser, selectIsAuthenticated } from '../../store/slices/authSlice';
import { orderService } from '../../services';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectSelectedCartItems);
    const cartTotal = useSelector(selectSelectedCartTotal);
    const user = useSelector(selectUser);
    const isAuth = useSelector(selectIsAuthenticated);
    const isCartLoading = useSelector(selectCartLoading);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shippingFee, setShippingFee] = useState(0);

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
        api.get(`/locations/provinces?isNewStructure=${isNewStructure}`)
            .then(res => {
                setProvinces(res.data?.data || []);
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
                api.get(`/locations/wards/${selectedProvince}?isNewStructure=true`)
                    .then(res => {
                        setWards(res.data?.data || []);
                        setValue('ward', ''); // Reset ward
                    })
                    .catch(() => toast.error('Không thể tải Phường/Xã'));
            } else {
                api.get(`/locations/districts/${selectedProvince}?isNewStructure=false`)
                    .then(res => {
                        setDistricts(res.data?.data || []);
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
            api.get(`/locations/wards/${selectedDistrict}?isNewStructure=false`)
                .then(res => {
                    setWards(res.data?.data || []);
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

        let query = `/locations/shipping-fee?provinceCode=${selectedProvince}&isNewStructure=${isNewStructure}`;
        if (!isNewStructure && selectedDistrict) {
            query += `&districtCode=${selectedDistrict}`;
        }
        if (selectedWard) {
            query += `&wardCode=${selectedWard}`;
        }

        api.get(query)
            .then(res => setShippingFee(res.data?.data || 30000))
            .catch(() => setShippingFee(30000));
            
    }, [selectedProvince, selectedDistrict, selectedWard, isNewStructure]);

    useEffect(() => {
        if (!isCartLoading && cartItems.length === 0) {
            toast.error('Giỏ hàng trống!');
            navigate('/shop');
        }
    }, [cartItems, isCartLoading, navigate]);

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
                ward: isNewStructure ? (wardName || data.ward) : `${wardName || data.ward}, ${districtName || data.district}`,
                addressDetail: data.addressDetail,
                note: data.note,
                paymentMethod: parseInt(data.paymentMethod),
                items: cartItems.map(i => ({
                    productId: i.productId,
                    quantity: i.quantity,
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
            
            const orderId = res.data?.data?.id || res.data?.id;
            if (orderId) {
                navigate(`/orders/${orderId}`);
            } else {
                navigate('/orders');
            }
        } catch (error) {
            if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                // Hiển thị chi tiết lỗi tồn kho
                error.response.data.errors.forEach(err => toast.error(err, { duration: 5000 }));
                toast.error("Vui lòng quay lại giỏ hàng để cập nhật số lượng.");
                
                // Điều hướng về giỏ hàng
                setTimeout(() => navigate('/cart'), 2000);
            } else {
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isCartLoading || cartItems.length === 0) return null;

    const grandTotal = cartTotal + shippingFee;

    return (
        <div className="bg-[#faf7f4] min-h-screen py-16">
            <div className="max-w-[1200px] mx-auto px-5 md:px-10">
                <h1 className="text-[32px] mb-8 text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
                    Thanh Toán
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
                    
                    {/* ── FORM THANH TOÁN ── */}
                    <div className="bg-white p-8 md:p-10 rounded-sm shadow-sm">
                        <h2 className="text-[18px] mb-6 uppercase tracking-[1px] border-b border-[#eee] pb-4" style={{ fontFamily: 'var(--font-display)' }}>
                            Thông tin thanh toán
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div>
                                <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Họ và tên *</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors"
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    {...register('receiverName', { required: 'Vui lòng nhập họ tên' })}
                                />
                                {errors.receiverName && <p className="text-red-500 text-[12px] mt-1">{errors.receiverName.message}</p>}
                            </div>
                            <div>
                                <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Email *</label>
                                <input
                                    type="email"
                                    className="w-full p-3 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors"
                                    placeholder="email@example.com"
                                    {...register('receiverEmail', { 
                                        required: 'Vui lòng nhập email',
                                        pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email không hợp lệ' }
                                    })}
                                />
                                {errors.receiverEmail && <p className="text-red-500 text-[12px] mt-1">{errors.receiverEmail.message}</p>}
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Số điện thoại *</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors"
                                placeholder="0912 345 678"
                                {...register('receiverPhone', { required: 'Vui lòng nhập số điện thoại' })}
                            />
                            {errors.receiverPhone && <p className="text-red-500 text-[12px] mt-1">{errors.receiverPhone.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mb-2">
                                <label className="flex items-center gap-2 text-[13px] text-[#1a1a1a] cursor-pointer">
                                    <input 
                                        type="radio" 
                                        checked={!isNewStructure} 
                                        onChange={() => setIsNewStructure(false)} 
                                        className="w-4 h-4 accent-[#c4a882]" 
                                    />
                                    Sử dụng địa chỉ cũ (Trước 1/7/2025)
                                </label>
                                <label className="flex items-center gap-2 text-[13px] text-[#1a1a1a] cursor-pointer">
                                    <input 
                                        type="radio" 
                                        checked={isNewStructure} 
                                        onChange={() => setIsNewStructure(true)} 
                                        className="w-4 h-4 accent-[#c4a882]" 
                                    />
                                    Sử dụng địa chỉ mới (Từ 1/7/2025)
                                </label>
                            </div>
                            <div>
                                <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Tỉnh/Thành phố *</label>
                                <select 
                                    className="w-full p-3 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors bg-white"
                                    {...register('province', { required: 'Chọn Tỉnh/Thành phố' })}
                                >
                                    <option value="">Chọn Tỉnh/Thành</option>
                                    {provinces.map(p => (
                                        <option key={p.code} value={p.code}>{p.name}</option>
                                    ))}
                                </select>
                                {errors.province && <p className="text-red-500 text-[12px] mt-1">{errors.province.message}</p>}
                            </div>

                            {!isNewStructure && (
                                <div>
                                    <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Quận/Huyện *</label>
                                    <select 
                                        className="w-full p-3 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors bg-white disabled:bg-gray-100 disabled:text-gray-400"
                                        {...register('district', { required: 'Chọn Quận/Huyện' })}
                                        disabled={!selectedProvince || districts.length === 0}
                                    >
                                        <option value="">Chọn Quận/Huyện</option>
                                        {districts.map(d => (
                                            <option key={d.code} value={d.code}>{d.name}</option>
                                        ))}
                                    </select>
                                    {errors.district && <p className="text-red-500 text-[12px] mt-1">{errors.district.message}</p>}
                                </div>
                            )}

                            <div className={isNewStructure ? "md:col-span-1" : "md:col-span-2"}>
                                <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Phường/Xã *</label>
                                <select 
                                    className="w-full p-3 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors bg-white disabled:bg-gray-100 disabled:text-gray-400"
                                    {...register('ward', { required: 'Chọn Phường/Xã' })}
                                    disabled={(isNewStructure ? !selectedProvince : !selectedDistrict) || wards.length === 0}
                                >
                                    <option value="">Chọn Phường/Xã</option>
                                    {wards.map(w => (
                                        <option key={w.code} value={w.code}>{w.name}</option>
                                    ))}
                                </select>
                                {errors.ward && <p className="text-red-500 text-[12px] mt-1">{errors.ward.message}</p>}
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Địa chỉ cụ thể *</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors"
                                placeholder="Số nhà, tên đường..."
                                {...register('addressDetail', { required: 'Vui lòng nhập địa chỉ' })}
                            />
                            {errors.addressDetail && <p className="text-red-500 text-[12px] mt-1">{errors.addressDetail.message}</p>}
                        </div>

                        <div className="mb-8">
                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Ghi chú đơn hàng (Tùy chọn)</label>
                            <textarea
                                className="w-full p-3 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors h-[120px] resize-y"
                                placeholder="Ghi chú về giao hàng, đóng gói..."
                                {...register('note')}
                            />
                        </div>

                        {/* PHƯƠNG THỨC THANH TOÁN */}
                        <h2 className="text-[18px] mb-4 uppercase tracking-[1px] border-b border-[#eee] pb-4" style={{ fontFamily: 'var(--font-display)' }}>
                            Phương thức thanh toán
                        </h2>
                        <div className="space-y-3 mb-8">
                            <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#ddd] rounded-sm hover:bg-[#faf7f4] transition-colors">
                                <input
                                    type="radio"
                                    value="0"
                                    className="w-4 h-4 accent-[#c4a882]"
                                    {...register('paymentMethod')}
                                />
                                <span className="text-[14px] text-[#1a1a1a]">Thanh toán khi nhận hàng (COD)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#ddd] rounded-sm opacity-50 cursor-not-allowed">
                                <input
                                    type="radio"
                                    value="2"
                                    disabled
                                    className="w-4 h-4"
                                />
                                <span className="text-[14px] text-[#1a1a1a]">Chuyển khoản ngân hàng / VNPay (Sắp ra mắt)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#ddd] rounded-sm opacity-50 cursor-not-allowed">
                                <input
                                    type="radio"
                                    value="1"
                                    disabled
                                    className="w-4 h-4"
                                />
                                <span className="text-[14px] text-[#1a1a1a]">Ví Momo (Sắp ra mắt)</span>
                            </label>
                        </div>
                    </div>

                    {/* ── TÓM TẮT ĐƠN HÀNG ── */}
                    <div className="bg-[#eee8df] p-8 sticky top-6 shadow-sm">
                        <h3 className="text-[22px] mb-5 text-[#1a1a1a] pb-4 border-b border-[#d8d0c4]" style={{ fontFamily: 'var(--font-display)' }}>
                            Đơn hàng của bạn
                        </h3>
                        
                        <div className="mb-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={item.id || item.productId} className="flex items-center gap-3 py-3 border-b border-[#d8d0c4]">
                                    <div className="w-14 h-14 bg-white shrink-0 rounded-sm overflow-hidden">
                                        <img 
                                            src={item.productImageUrl || '/assets/image/placeholder.jpg'} 
                                            alt={item.productName} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[13px] text-[#1a1a1a] mb-1 line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>
                                            {item.productName}
                                        </p>
                                        <div className="text-[11px] text-[#888] mb-1 flex items-center gap-1.5 flex-wrap">
                                            {item.productCode && (
                                                <span>SKU: {item.productCode}</span>
                                            )}
                                            {item.productCode && item.color && <span>|</span>}
                                            {item.color && (
                                                <span>Màu: <span className="capitalize">{item.color}</span></span>
                                            )}
                                        </div>
                                        <p className="text-[12px] text-[#888]">Số lượng: {item.quantity}</p>
                                    </div>
                                    <div className="text-[14px] text-[#b5624a] font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                                        {((item.price || 0) * item.quantity).toLocaleString('vi-VN')} ₫
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-[#d8d0c4] pt-4 mt-2">
                            <div className="flex justify-between py-2 text-[14px] text-[#555]">
                                <span>Tạm tính</span>
                                <span>{cartTotal.toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <div className="flex justify-between py-2 text-[14px] text-[#555] border-b border-[#d8d0c4] pb-4">
                                <span>Phí vận chuyển</span>
                                <span>{shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')} ₫`}</span>
                            </div>
                            
                            <div className="flex justify-between pt-5 mt-2 text-[22px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
                                <span>Tổng cộng</span>
                                <span className="text-[var(--terracotta)]">{grandTotal.toLocaleString('vi-VN')} ₫</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-[#1a1a1a] text-white text-[12px] tracking-[2px] uppercase mt-6
                                       transition-colors duration-200 hover:bg-[#444] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                        </button>
                    </div>
                </form>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
            `}</style>
        </div>
    );
}
