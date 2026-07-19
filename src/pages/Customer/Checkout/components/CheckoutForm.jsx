import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CheckoutForm({
    register,
    errors,
    provinces,
    districts,
    wards,
    isNewStructure,
    setIsNewStructure,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    setValue,
    hasAddresses,
    onOpenAddressModal,
    onClearForm,
    onRevertToSaved,
    watch,
    isEnteringNewAddress,
    setIsEnteringNewAddress
}) {
    const receiverName = watch('receiverName');
    const receiverPhone = watch('receiverPhone');
    const receiverEmail = watch('receiverEmail');
    const addressDetail = watch('addressDetail');
    
    const provinceName = provinces.find(p => p.code.toString() === selectedProvince?.toString())?.name || '';
    const districtName = districts.find(d => d.code.toString() === selectedDistrict?.toString())?.name || '';
    const wardName = wards.find(w => w.code.toString() === selectedWard?.toString())?.name || '';

    return (
        <div className="bg-white p-8 md:p-10 rounded-sm shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-[#eee] pb-4">
                <h2 className="text-[18px] uppercase tracking-[1px] font-display m-0">
                    Thông tin thanh toán
                </h2>
            </div>

            {/* ADDRESS CARD (READ ONLY) */}
            {hasAddresses && !isEnteringNewAddress && (
                <div className="mb-8 animate-fade-in">
                    <div className="border border-[#c4a882] bg-[#faf7f4] rounded-sm p-5 relative shadow-sm">
                        <div className="absolute top-5 right-5">
                            <button type="button" onClick={onOpenAddressModal} className="text-[#c4a882] hover:underline text-[13px] font-medium">Thay đổi</button>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <svg className="text-[#c4a882]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span className="font-bold text-[#1a1a1a] text-[15px]">{receiverName || 'Chưa có tên'}</span>
                            <span className="text-gray-400 mx-1">|</span>
                            <span className="font-bold text-[#1a1a1a] text-[15px]">{receiverPhone || 'Chưa có SĐT'}</span>
                        </div>
                        <div className="text-[14px] text-gray-600 space-y-1 ml-7">
                            <p>{receiverEmail}</p>
                            <p>{addressDetail}</p>
                            <p>{wardName && `${wardName}, `}{districtName && `${districtName}, `}{provinceName}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-4">
                        <button type="button" onClick={onClearForm} className="text-[#666] text-[13px] hover:text-[#1a1a1a] hover:underline flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                            Giao đến một địa chỉ khác
                        </button>
                    </div>
                </div>
            )}

            {/* EDITABLE FORM */}
            <div className={hasAddresses && !isEnteringNewAddress ? 'hidden' : 'block animate-fade-in'}>
                {hasAddresses && (
                    <div className="flex justify-between items-center mb-5 bg-gray-50 p-3 rounded-sm border border-gray-100">
                        <span className="text-[13px] text-gray-600 font-medium">Nhập địa chỉ nhận hàng mới</span>
                        <button type="button" onClick={onRevertToSaved} className="text-[#c4a882] hover:underline text-[13px] font-medium flex items-center gap-1">
                            ← Quay lại địa chỉ đã chọn
                        </button>
                    </div>
                )}
                
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
                            onChange={() => {
                                setIsNewStructure(false);
                                setValue('province', '');
                                setValue('district', '');
                                setValue('ward', '');
                            }} 
                            className="w-4 h-4 accent-[#c4a882]" 
                        />
                        Sử dụng địa chỉ cũ (Trước 1/7/2025)
                    </label>
                    <label className="flex items-center gap-2 text-[13px] text-[#1a1a1a] cursor-pointer">
                        <input 
                            type="radio" 
                            checked={isNewStructure} 
                            onChange={() => {
                                setIsNewStructure(true);
                                setValue('province', '');
                                setValue('district', '');
                                setValue('ward', '');
                            }} 
                            className="w-4 h-4 accent-[#c4a882]" 
                        />
                        Sử dụng địa chỉ mới (Từ 1/7/2025)
                    </label>
                </div>
                <div>
                    <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Tỉnh/Thành phố *</label>
                    <input type="hidden" {...register('province', { required: 'Chọn Tỉnh/Thành phố' })} />
                    <Select 
                        value={selectedProvince?.toString()} 
                        onValueChange={(val) => {
                            setValue('province', val, { shouldValidate: true });
                            setValue('district', '');
                            setValue('ward', '');
                        }}
                    >
                        <SelectTrigger className={`w-full p-3 border ${errors.province ? 'border-red-500' : 'border-[#ddd]'} rounded-sm text-[14px] outline-none focus:ring-1 focus:ring-[#c4a882] transition-colors bg-white h-[46px]`}>
                            <SelectValue placeholder="Chọn Tỉnh/Thành" />
                        </SelectTrigger>
                        <SelectContent className="bg-white max-h-[300px]">
                            {provinces.map(p => (
                                <SelectItem key={p.code} value={p.code.toString()}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.province && <p className="text-red-500 text-[12px] mt-1">{errors.province.message}</p>}
                </div>

                {!isNewStructure && (
                    <div>
                        <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Quận/Huyện *</label>
                        <input type="hidden" {...register('district', { required: 'Chọn Quận/Huyện' })} />
                        <Select 
                            value={selectedDistrict?.toString()} 
                            onValueChange={(val) => {
                                setValue('district', val, { shouldValidate: true });
                                setValue('ward', '');
                            }}
                            disabled={!selectedProvince || districts.length === 0}
                        >
                            <SelectTrigger className={`w-full p-3 border ${errors.district ? 'border-red-500' : 'border-[#ddd]'} rounded-sm text-[14px] outline-none focus:ring-1 focus:ring-[#c4a882] transition-colors bg-white h-[46px]`}>
                                <SelectValue placeholder="Chọn Quận/Huyện" />
                            </SelectTrigger>
                            <SelectContent className="bg-white max-h-[300px]">
                                {districts.map(d => (
                                    <SelectItem key={d.code} value={d.code.toString()}>{d.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.district && <p className="text-red-500 text-[12px] mt-1">{errors.district.message}</p>}
                    </div>
                )}

                <div className={isNewStructure ? "md:col-span-1" : "md:col-span-2"}>
                    <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Phường/Xã *</label>
                    <input type="hidden" {...register('ward', { required: 'Chọn Phường/Xã' })} />
                    <Select 
                        value={selectedWard?.toString()} 
                        onValueChange={(val) => {
                            setValue('ward', val, { shouldValidate: true });
                        }}
                        disabled={(isNewStructure ? !selectedProvince : !selectedDistrict) || wards.length === 0}
                    >
                        <SelectTrigger className={`w-full p-3 border ${errors.ward ? 'border-red-500' : 'border-[#ddd]'} rounded-sm text-[14px] outline-none focus:ring-1 focus:ring-[#c4a882] transition-colors bg-white h-[46px]`}>
                            <SelectValue placeholder="Chọn Phường/Xã" />
                        </SelectTrigger>
                        <SelectContent className="bg-white max-h-[300px]">
                            {wards.map(w => (
                                <SelectItem key={w.code} value={w.code.toString()}>{w.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
            </div> {/* END OF EDITABLE FORM BLOCK */}

            <div className="mb-8">
                <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Ghi chú đơn hàng (Tùy chọn)</label>
                <textarea
                    className="w-full p-3 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors h-[120px] resize-y"
                    placeholder="Ghi chú về giao hàng, đóng gói..."
                    {...register('note')}
                />
            </div>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <h2 className="text-[18px] mb-4 uppercase tracking-[1px] border-b border-[#eee] pb-4 font-display">
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
    );
}
