import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, updateCurrentUser } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';

import { profileApi } from './api/profileApi';
import ProfileSidebar from './components/ProfileSidebar';
import ProfileInfo from './components/ProfileInfo';
import ProfilePassword from './components/ProfilePassword';
import ProfileAddress from './components/ProfileAddress';
import './Profile.css';
import { getErrorMessage } from '@/utils';

export default function ProfilePage() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password' | 'address'
    const [isUpdating, setIsUpdating] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState(user?.avatarUrl || null);

    // ── Address State ──
    const [addresses, setAddresses] = useState([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const { register: regAddr, handleSubmit: handleAddrSubmit, reset: resetAddr, formState: { errors: errAddr } } = useForm();

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

    const fetchAddresses = async () => {
        try {
            const res = await profileApi.getAddresses();
            setAddresses(res?.data || res || []);
        } catch (error) {
            console.error('Failed to fetch addresses', error);
        }
    };

    useEffect(() => {
        if (activeTab === 'address') {
            fetchAddresses();
        }
    }, [activeTab]);

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
        } catch (error) {
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
        } catch (error) {
            /* toast handled by api */
        } finally {
            setIsUpdating(false);
        }
    };

    const handleOpenAddressModal = (address = null) => {
        if (address) {
            setEditingAddressId(address.id);
            resetAddr({
                receiverName: address.receiverName,
                phone: address.phone,
                detail: address.detail,
                ward: address.ward,
                district: address.district,
                province: address.province,
                isDefault: address.isDefault
            });
        } else {
            setEditingAddressId(null);
            resetAddr({
                receiverName: user?.fullName || '',
                phone: user?.phone || '',
                detail: '',
                ward: '',
                district: '',
                province: '',
                isDefault: addresses.length === 0
            });
        }
        setIsAddressModalOpen(true);
    };

    const onSubmitAddress = async (data) => {
        setIsUpdating(true);
        try {
            const payload = { ...data, provinceCode: '', districtCode: '', wardCode: '' };
            if (editingAddressId) {
                await profileApi.updateAddress(editingAddressId, payload);
                toast.success('Cập nhật địa chỉ thành công');
            } else {
                await profileApi.addAddress(payload);
                toast.success('Thêm địa chỉ thành công');
            }
            setIsAddressModalOpen(false);
            fetchAddresses();
        } catch (error) {
            /* toast handled by api */
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
            try {
                await profileApi.deleteAddress(id);
                toast.success('Đã xóa địa chỉ');
                fetchAddresses();
            } catch (error) {
                toast.error('Không thể xóa địa chỉ');
            }
        }
    };

    const handleSetDefaultAddress = async (addr) => {
        if (addr.isDefault) return;
        try {
            await profileApi.updateAddress(addr.id, { ...addr, isDefault: true });
            toast.success('Đã thay đổi địa chỉ mặc định');
            fetchAddresses();
        } catch (error) {
            toast.error('Không thể đổi địa chỉ mặc định');
        }
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
            <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} title={editingAddressId ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}>
                <form onSubmit={handleAddrSubmit(onSubmitAddress)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Họ tên người nhận *</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882]"
                                {...regAddr('receiverName', { required: 'Nhập họ tên người nhận' })}
                            />
                            {errAddr.receiverName && <p className="text-red-500 text-[12px] mt-1">{errAddr.receiverName.message}</p>}
                        </div>
                        <div>
                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Số điện thoại *</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882]"
                                {...regAddr('phone', { required: 'Nhập số điện thoại' })}
                            />
                            {errAddr.phone && <p className="text-red-500 text-[12px] mt-1">{errAddr.phone.message}</p>}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Tỉnh/Thành phố *</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882]"
                                placeholder="VD: Hà Nội"
                                {...regAddr('province', { required: 'Nhập Tỉnh/Thành phố' })}
                            />
                            {errAddr.province && <p className="text-red-500 text-[12px] mt-1">{errAddr.province.message}</p>}
                        </div>
                        <div>
                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Quận/Huyện *</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882]"
                                placeholder="VD: Cầu Giấy"
                                {...regAddr('district', { required: 'Nhập Quận/Huyện' })}
                            />
                            {errAddr.district && <p className="text-red-500 text-[12px] mt-1">{errAddr.district.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Phường/Xã</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882]"
                                placeholder="VD: Dịch Vọng"
                                {...regAddr('ward')}
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Địa chỉ cụ thể *</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882]"
                                placeholder="Số nhà, Tên đường..."
                                {...regAddr('detail', { required: 'Nhập địa chỉ cụ thể' })}
                            />
                            {errAddr.detail && <p className="text-red-500 text-[12px] mt-1">{errAddr.detail.message}</p>}
                        </div>
                    </div>

                    <label className="flex items-center gap-2 mt-4 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-[#1a1a1a]" {...regAddr('isDefault')} />
                        <span className="text-[14px] text-[#1a1a1a]">Đặt làm địa chỉ mặc định</span>
                    </label>

                    <div className="flex justify-end gap-3 pt-6 border-t border-[#eee] mt-6">
                        <button type="button" onClick={() => setIsAddressModalOpen(false)} className="px-5 py-2 text-[12px] uppercase tracking-[1px] bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                            Hủy
                        </button>
                        <button type="submit" disabled={isUpdating} className="px-5 py-2 text-[12px] uppercase tracking-[1px] bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors disabled:opacity-70">
                            {isUpdating ? 'Đang lưu...' : 'Lưu địa chỉ'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
