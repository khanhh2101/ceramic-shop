export default function CheckoutForm({
    register,
    errors,
    provinces,
    districts,
    wards,
    isNewStructure,
    setIsNewStructure,
    selectedProvince,
    selectedDistrict
}) {
    return (
        <div className="bg-white p-8 md:p-10 rounded-sm shadow-sm">
            <h2 className="text-[18px] mb-6 uppercase tracking-[1px] border-b border-[#eee] pb-4 font-display">
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
