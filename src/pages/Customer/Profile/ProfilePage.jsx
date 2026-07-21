import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { selectUser, updateCurrentUser } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddresses } from './hooks/useProfileQueries';
import { useProvinces, useDistricts, useWards } from '@/hooks/queries/useLocations';
import { profileApi } from './api/profileApi';
import ProfileSidebar from './components/ProfileSidebar';
import ProfileInfo from './components/ProfileInfo';
import ProfilePassword from './components/ProfilePassword';
import ProfileAddress from './components/ProfileAddress';
import './Profile.css';

export default function ProfilePage() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password' | 'address'
    const [isUpdating, setIsUpdating] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState(user?.avatarUrl || null);

    // ── Address State ──
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const queryClient = useQueryClient();
    const { register: regAddr, handleSubmit: handleAddrSubmit, reset: resetAddr, formState: { errors: errAddr }, watch: watchAddr, setValue: setAddrValue } = useForm();

    const selectedProvince = watchAddr('provinceCode');
    const selectedDistrict = watchAddr('districtCode');
    const selectedWard = watchAddr('wardCode');
    
    const [isNewStructure, setIsNewStructure] = useState(false);

    // Use React Query for Locations (only fetch when modal is open)
    const { data: provinces = [] } = useProvinces(isNewStructure, { enabled: isAddressModalOpen });
    const { data: districts = [] } = useDistricts(selectedProvince, { enabled: isAddressModalOpen && !isNewStructure });
    const { data: wards = [] } = useWards(
        isNewStructure ? selectedProvince : selectedDistrict, 
        isNewStructure, 
        { enabled: isAddressModalOpen && !!(isNewStructure ? selectedProvince : selectedDistrict) }
    );

    // Form profile
    const { register: regProfile, handleSubmit: handleProfileSubmit, formState: { errors: errProfile }, reset: resetProfile } = useForm({
        defaultValues: {
            fullName: user?.fullName || '',
            phone: user?.phone || '',
            dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
        }
    });

    // Form password
    const { register: regPass, handleSubmit: handlePassSubmit, formState: { errors: errPass }, reset: resetPass, watch } = useForm();
    const newPassword = watch('newPassword');

    useEffect(() => {
        if (user) {
            resetProfile({
                fullName: user.fullName || '',
                phone: user.phone || '',
                dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
            });
            setPreviewAvatar(user.avatarUrl || null);
        }
    }, [user, resetProfile]);

    const { data: addresses = [] } = useAddresses({
        enabled: activeTab === 'address'
    });

    const onAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreviewAvatar(URL.createObjectURL(file));
        }
    };

    const onUpdateProfile = async (data) => {
        setIsUpdating(true);
        try {
            let avatarUrl = user?.avatarUrl;
            if (avatarFile) {
                const resAvatar = await profileApi.uploadAvatar(avatarFile);
                avatarUrl = resAvatar.data?.data?.url || resAvatar.data?.url || resAvatar.data?.data;
            }
            const payload = { ...data, avatarUrl };
            if (payload.dateOfBirth === '') payload.dateOfBirth = null;
            
            await profileApi.updateProfile(payload);
            dispatch(updateCurrentUser({ ...user, ...payload }));
            toast.success('Cập nhật hồ sơ thành công!');
        } catch (_error) {
            /* toast handled by api */
        } finally {
            setIsUpdating(false);
        }
    };

    const onChangePassword = async (data) => {
        setIsUpdating(true);
        try {
            await profileApi.changePassword({
                currentPassword: data.oldPassword,
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmPassword
            });
            toast.success('Đổi mật khẩu thành công!');
            resetPass();
        } catch (_error) {
            /* toast handled by api */
        } finally {
            setIsUpdating(false);
        }
    };

    const handleOpenAddressModal = (address = null) => {
        if (address) {
            setEditingAddressId(address.id);
            const isNew = !address.district;
            setIsNewStructure(isNew);
            resetAddr({
                receiverName: address.receiverName,
                receiverEmail: address.receiverEmail || '',
                phone: address.phone,
                detail: address.detail,
                provinceCode: address.provinceCode?.toString() || '',
                districtCode: address.districtCode?.toString() || '',
                wardCode: address.wardCode?.toString() || '',
                isDefault: address.isDefault
            });
        } else {
            setEditingAddressId(null);
            setIsNewStructure(false);
            resetAddr({
                receiverName: user?.fullName || '',
                receiverEmail: user?.email || '',
                phone: user?.phone || '',
                detail: '',
                provinceCode: '',
                districtCode: '',
                wardCode: '',
                isDefault: addresses.length === 0
            });
        }
        setIsAddressModalOpen(true);
    };

    const addAddressMutation = useMutation({
        mutationFn: (data) => profileApi.addAddress(data),
        onSuccess: () => {
            toast.success('Thêm địa chỉ thành công');
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            setIsAddressModalOpen(false);
        },
        onError: () => toast.error('Lỗi khi thêm địa chỉ')
    });

    const updateAddressMutation = useMutation({
        mutationFn: ({ id, data }) => profileApi.updateAddress(id, data),
        onSuccess: () => {
            toast.success('Cập nhật địa chỉ thành công');
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            setIsAddressModalOpen(false);
        },
        onError: () => toast.error('Lỗi khi cập nhật địa chỉ')
    });

    const deleteAddressMutation = useMutation({
        mutationFn: (id) => profileApi.deleteAddress(id),
        onSuccess: () => {
            toast.success('Đã xóa địa chỉ');
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        },
        onError: () => toast.error('Không thể xóa địa chỉ')
    });

    const onSubmitAddress = (data) => {
        const provinceName = provinces.find(p => p.code.toString() === data.provinceCode)?.name || '';
        const districtName = districts.find(d => d.code.toString() === data.districtCode)?.name || '';
        const wardName = wards.find(w => w.code.toString() === data.wardCode)?.name || '';

        const payload = { 
            ...data, 
            province: provinceName,
            district: isNewStructure ? '' : districtName,
            ward: wardName
        };
        
        if (editingAddressId) {
            updateAddressMutation.mutate({ id: editingAddressId, data: payload });
        } else {
            addAddressMutation.mutate(payload);
        }
    };

    const handleDeleteAddress = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
            deleteAddressMutation.mutate(id);
        }
    };

    const handleSetDefaultAddress = (addr) => {
        if (addr.isDefault) return;
        updateAddressMutation.mutate({ id: addr.id, data: { ...addr, isDefault: true } });
    };

    return (
        <div className="profile-main">
            <div className="profile-hero">
                <div className="profile-hero-bg">
                    <img 
                        src="https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?q=80&w=2000&auto=format&fit=crop" 
                        alt="Profile Cover"
                        className="profile-hero-img"
                    />
                    <div className="profile-hero-overlay"></div>
                </div>
                <div className="profile-hero-content">
                    <h1 className="profile-hero-title">Hồ sơ của bạn</h1>
                </div>
            </div>

            <div className="profile-container">
                <div className="profile-layout">
                    
                    <ProfileSidebar 
                        user={user} 
                        previewAvatar={previewAvatar} 
                        onAvatarChange={onAvatarChange} 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                    />

                    <div className="profile-content">
                        <div className="profile-content-card">
                            {activeTab === 'profile' && (
                                <ProfileInfo 
                                    user={user}
                                    regProfile={regProfile}
                                    handleProfileSubmit={handleProfileSubmit}
                                    errProfile={errProfile}
                                    onUpdateProfile={onUpdateProfile}
                                    isUpdating={isUpdating}
                                />
                            )}
                            {activeTab === 'password' && (
                                <ProfilePassword 
                                    regPass={regPass}
                                    handlePassSubmit={handlePassSubmit}
                                    errPass={errPass}
                                    onChangePassword={onChangePassword}
                                    isUpdating={isUpdating}
                                    newPassword={newPassword}
                                />
                            )}
                            {activeTab === 'address' && (
                                <ProfileAddress 
                                    addresses={addresses}
                                    handleOpenAddressModal={handleOpenAddressModal}
                                    handleSetDefaultAddress={handleSetDefaultAddress}
                                    handleDeleteAddress={handleDeleteAddress}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Modal */}
            <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)}>
                <div className="p-6 md:p-8 bg-white relative overflow-y-auto custom-scrollbar flex-1">
                    <button 
                        onClick={() => setIsAddressModalOpen(false)}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-serif text-[#1a1a1a]">
                            {editingAddressId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">Điền thông tin để giao hàng thuận tiện hơn</p>
                    </div>

                    <form onSubmit={handleAddrSubmit(onSubmitAddress)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">Họ tên người nhận *</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-[14px] outline-none focus:border-[#c4a882] focus:bg-white transition-colors"
                                    placeholder="Nhập họ tên"
                                    {...regAddr('receiverName', { required: 'Nhập họ tên người nhận' })}
                                />
                                {errAddr.receiverName && <p className="text-red-500 text-[12px] mt-1">{errAddr.receiverName.message}</p>}
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">Số điện thoại *</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-[14px] outline-none focus:border-[#c4a882] focus:bg-white transition-colors"
                                    placeholder="Nhập SĐT liên hệ"
                                    {...regAddr('phone', { required: 'Nhập số điện thoại' })}
                                />
                                {errAddr.phone && <p className="text-red-500 text-[12px] mt-1">{errAddr.phone.message}</p>}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">Email *</label>
                            <input
                                type="email"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-[14px] outline-none focus:border-[#c4a882] focus:bg-white transition-colors"
                                placeholder="Nhập email liên hệ"
                                {...regAddr('receiverEmail', { 
                                    required: 'Nhập email liên hệ',
                                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email không hợp lệ' }
                                })}
                            />
                            {errAddr.receiverEmail && <p className="text-red-500 text-[12px] mt-1">{errAddr.receiverEmail.message}</p>}
                        </div>
                        
                        <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mb-2 mt-4 border-t border-gray-100 pt-4">
                            <label className="flex items-center gap-2 text-[13px] text-[#1a1a1a] cursor-pointer">
                                <input type="radio" checked={!isNewStructure} onChange={() => setIsNewStructure(false)} className="w-4 h-4 accent-[#c4a882]" />
                                Sử dụng địa chỉ cũ (Trước 1/7/2025)
                            </label>
                            <label className="flex items-center gap-2 text-[13px] text-[#1a1a1a] cursor-pointer">
                                <input type="radio" checked={isNewStructure} onChange={() => setIsNewStructure(true)} className="w-4 h-4 accent-[#c4a882]" />
                                Sử dụng địa chỉ mới (Từ 1/7/2025)
                            </label>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">Tỉnh/Thành phố *</label>
                                <input type="hidden" {...regAddr('provinceCode', { required: 'Chọn Tỉnh/Thành phố' })} />
                                <Select 
                                    value={selectedProvince?.toString()} 
                                    onValueChange={(val) => {
                                        setAddrValue('provinceCode', val, { shouldValidate: true });
                                        setAddrValue('districtCode', '');
                                        setAddrValue('wardCode', '');
                                    }}
                                >
                                    <SelectTrigger className={`w-full p-3 bg-gray-50 border ${errAddr.provinceCode ? 'border-red-500' : 'border-gray-200'} rounded-lg text-[14px] outline-none focus:border-[#c4a882] focus:bg-white h-[46px] transition-colors`}>
                                        <SelectValue placeholder="Chọn Tỉnh/Thành" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white max-h-[250px] z-[10000]">
                                        {provinces.map(p => (
                                            <SelectItem key={p.code} value={p.code.toString()}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errAddr.provinceCode && <p className="text-red-500 text-[12px] mt-1">{errAddr.provinceCode.message}</p>}
                            </div>

                            {!isNewStructure && (
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">Quận/Huyện *</label>
                                    <input type="hidden" {...regAddr('districtCode', { required: 'Chọn Quận/Huyện' })} />
                                    <Select 
                                        value={selectedDistrict?.toString()} 
                                        onValueChange={(val) => {
                                            setAddrValue('districtCode', val, { shouldValidate: true });
                                            setAddrValue('wardCode', '');
                                        }}
                                        disabled={!selectedProvince || districts.length === 0}
                                    >
                                        <SelectTrigger className={`w-full p-3 bg-gray-50 border ${errAddr.districtCode ? 'border-red-500' : 'border-gray-200'} rounded-lg text-[14px] outline-none focus:border-[#c4a882] focus:bg-white h-[46px] transition-colors`}>
                                            <SelectValue placeholder="Chọn Quận/Huyện" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white max-h-[250px] z-[10000]">
                                            {districts.map(d => (
                                                <SelectItem key={d.code} value={d.code.toString()}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errAddr.districtCode && <p className="text-red-500 text-[12px] mt-1">{errAddr.districtCode.message}</p>}
                                </div>
                            )}

                            <div className={isNewStructure ? "md:col-span-1" : "md:col-span-2"}>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">Phường/Xã *</label>
                                <input type="hidden" {...regAddr('wardCode', { required: 'Chọn Phường/Xã' })} />
                                <Select 
                                    value={selectedWard?.toString()} 
                                    onValueChange={(val) => {
                                        setAddrValue('wardCode', val, { shouldValidate: true });
                                    }}
                                    disabled={(isNewStructure ? !selectedProvince : !selectedDistrict) || wards.length === 0}
                                >
                                    <SelectTrigger className={`w-full p-3 bg-gray-50 border ${errAddr.wardCode ? 'border-red-500' : 'border-gray-200'} rounded-lg text-[14px] outline-none focus:border-[#c4a882] focus:bg-white h-[46px] transition-colors`}>
                                        <SelectValue placeholder="Chọn Phường/Xã" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white max-h-[250px] z-[10000]">
                                        {wards.map(w => (
                                            <SelectItem key={w.code} value={w.code.toString()}>{w.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errAddr.wardCode && <p className="text-red-500 text-[12px] mt-1">{errAddr.wardCode.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">Địa chỉ cụ thể *</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-[14px] outline-none focus:border-[#c4a882] focus:bg-white transition-colors"
                                placeholder="Số nhà, Tên đường..."
                                {...regAddr('detail', { required: 'Nhập địa chỉ cụ thể' })}
                            />
                            {errAddr.detail && <p className="text-red-500 text-[12px] mt-1">{errAddr.detail.message}</p>}
                        </div>

                        <label className="flex items-center gap-3 mt-2 cursor-pointer p-3 rounded-lg border border-transparent hover:bg-gray-50 transition-colors">
                            <input type="checkbox" className="w-4 h-4 accent-[#c4a882] rounded" {...regAddr('isDefault')} />
                            <span className="text-[14px] text-gray-700 font-medium">Đặt làm địa chỉ mặc định</span>
                        </label>

                        <div className="flex justify-end gap-3 pt-6 mt-2">
                            <button 
                                type="button" 
                                onClick={() => setIsAddressModalOpen(false)} 
                                className="px-6 py-3 text-[13px] uppercase tracking-wider font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                type="submit" 
                                disabled={addAddressMutation.isPending || updateAddressMutation.isPending} 
                                className="px-8 py-3 text-[13px] uppercase tracking-wider font-semibold rounded-lg bg-[#1a1a1a] text-white hover:bg-[#c4a882] transition-colors disabled:opacity-70 shadow-lg shadow-black/10"
                            >
                                {(addAddressMutation.isPending || updateAddressMutation.isPending) ? 'Đang lưu...' : 'Lưu địa chỉ'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
