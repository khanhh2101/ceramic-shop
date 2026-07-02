import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, updateCurrentUser } from '../../store/slices/authSlice';
import { userService } from '../../services';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiMail, FiPhone, FiMapPin, FiCamera, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiPackage } from 'react-icons/fi';
import Modal from '../../components/common/Modal';

export default function ProfilePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
            const res = await userService.getAddresses();
            setAddresses(res.data?.data || res.data || []);
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
            
            // Upload avatar trước nếu có
            if (avatarFile) {
                const resAvatar = await userService.uploadAvatar(avatarFile);
                avatarUrl = resAvatar.data?.data?.url || resAvatar.data?.url || resAvatar.data?.data;
            }

            // Update thông tin
            const payload = { ...data, avatarUrl };
            if (payload.dateOfBirth === '') {
                payload.dateOfBirth = null;
            }
            
            const res = await userService.updateProfile(payload);
            
            // Cập nhật Redux store
            dispatch(updateCurrentUser({ ...user, ...payload }));
            toast.success('Cập nhật hồ sơ thành công!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại');
        } finally {
            setIsUpdating(false);
        }
    };

    const onChangePassword = async (data) => {
        setIsUpdating(true);
        try {
            await userService.changePassword({
                currentPassword: data.oldPassword,
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmPassword
            });
            toast.success('Đổi mật khẩu thành công!');
            resetPass();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
        } finally {
            setIsUpdating(false);
        }
    };

    // ── Address Handlers ──
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
            const payload = {
                ...data,
                provinceCode: '',
                districtCode: '',
                wardCode: ''
            };
            
            if (editingAddressId) {
                await userService.updateAddress(editingAddressId, payload);
                toast.success('Cập nhật địa chỉ thành công');
            } else {
                await userService.addAddress(payload);
                toast.success('Thêm địa chỉ thành công');
            }
            setIsAddressModalOpen(false);
            fetchAddresses();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu địa chỉ');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
            try {
                await userService.deleteAddress(id);
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
            await userService.updateAddress(addr.id, { ...addr, isDefault: true });
            toast.success('Đã thay đổi địa chỉ mặc định');
            fetchAddresses();
        } catch (error) {
            toast.error('Không thể đổi địa chỉ mặc định');
        }
    };

    return (
        <div className="bg-[#faf7f4] min-h-screen pb-16">
            {/* ── Hero Banner ── */}
            <div className="relative h-[25vh] min-h-[200px] mb-12 flex items-center justify-center bg-[#eee8df] overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?q=80&w=2000&auto=format&fit=crop" 
                        alt="Profile Cover"
                        className="w-full h-full object-cover opacity-60 grayscale-[20%]"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="relative z-10 text-center px-5 max-w-[800px] mx-auto text-white">
                    <h1 className="text-[32px] md:text-[40px] mb-2 font-display">
                        Hồ sơ của bạn
                    </h1>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-5 md:px-10">
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* SIDEBAR */}
                    <div className="w-full md:w-[280px] shrink-0">
                        <div className="bg-white p-6 rounded-sm shadow-sm flex flex-col items-center text-center">
                            <div className="relative w-24 h-24 rounded-full mb-4 group">
                                <img 
                                    src={previewAvatar || '/assets/image/avatars/av1.jpg'} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover rounded-full border-4 border-[#faf7f4]"
                                />
                                <label className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center 
                                                  text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                    <FiCamera size={20} className="mb-1" />
                                    <span className="text-[10px] uppercase tracking-[1px]">Thay đổi</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={onAvatarChange} />
                                </label>
                            </div>
                            <h2 className="text-[18px] text-[#1a1a1a] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                                {user?.fullName || 'Người dùng'}
                            </h2>
                            <p className="text-[13px] text-[#888] mb-6">{user?.email}</p>

                            <div className="w-full space-y-1">
                                <button 
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-[13px] tracking-[1px] uppercase transition-colors rounded-sm
                                        ${activeTab === 'profile' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:bg-[#faf7f4]'}`}
                                >
                                    <FiUser size={16} /> Thông tin cá nhân
                                </button>
                                <button 
                                    onClick={() => navigate('/orders')}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-[13px] tracking-[1px] uppercase transition-colors rounded-sm text-[#555] hover:bg-[#faf7f4]"
                                >
                                    <FiPackage size={16} /> Đơn hàng của tôi
                                </button>
                                <button 
                                    onClick={() => setActiveTab('address')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-[13px] tracking-[1px] uppercase transition-colors rounded-sm
                                        ${activeTab === 'address' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:bg-[#faf7f4]'}`}
                                >
                                    <FiMapPin size={16} /> Sổ địa chỉ
                                </button>
                                <button 
                                    onClick={() => setActiveTab('password')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-[13px] tracking-[1px] uppercase transition-colors rounded-sm
                                        ${activeTab === 'password' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:bg-[#faf7f4]'}`}
                                >
                                    <FiLock size={16} /> Đổi mật khẩu
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="flex-1">
                        <div className="bg-white p-8 md:p-10 rounded-sm shadow-sm min-h-[400px]">
                            
                            {/* TAB: PROFILE */}
                            {activeTab === 'profile' && (
                                <div>
                                    <h2 className="text-[22px] mb-6 text-[#1a1a1a] pb-4 border-b border-[#eee]" style={{ fontFamily: 'var(--font-display)' }}>
                                        Thông tin cá nhân
                                    </h2>
                                    
                                    <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-5 max-w-lg">
                                        <div>
                                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Email</label>
                                            <div className="relative">
                                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
                                                <input 
                                                    type="email" 
                                                    value={user?.email || ''} 
                                                    disabled 
                                                    className="w-full p-3 pl-10 border border-[#eee] bg-[#faf7f4] rounded-sm text-[14px] text-[#888] cursor-not-allowed"
                                                />
                                            </div>
                                            <p className="text-[11px] text-[#aaa] mt-1 italic">Email không thể thay đổi</p>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Họ và tên *</label>
                                            <div className="relative">
                                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
                                                <input
                                                    type="text"
                                                    className="w-full p-3 pl-10 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors"
                                                    {...regProfile('fullName', { required: 'Vui lòng nhập họ tên' })}
                                                />
                                            </div>
                                            {errProfile.fullName && <p className="text-red-500 text-[12px] mt-1">{errProfile.fullName.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Số điện thoại</label>
                                            <div className="relative">
                                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
                                                <input
                                                    type="text"
                                                    className="w-full p-3 pl-10 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors"
                                                    {...regProfile('phone')}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Ngày sinh</label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    className="w-full p-3 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors"
                                                    {...regProfile('dateOfBirth')}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="px-8 py-3 bg-[#1a1a1a] text-white text-[12px] tracking-[2px] uppercase mt-4
                                                    transition-colors duration-200 hover:bg-[#444] disabled:opacity-70"
                                        >
                                            {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* TAB: PASSWORD */}
                            {activeTab === 'password' && (
                                <div>
                                    <h2 className="text-[22px] mb-6 text-[#1a1a1a] pb-4 border-b border-[#eee]" style={{ fontFamily: 'var(--font-display)' }}>
                                        Đổi mật khẩu
                                    </h2>
                                    
                                    <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-5 max-w-lg">
                                        <div>
                                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Mật khẩu hiện tại *</label>
                                            <input
                                                type="password"
                                                className="w-full p-3 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors"
                                                {...regPass('oldPassword', { required: 'Vui lòng nhập mật khẩu cũ' })}
                                            />
                                            {errPass.oldPassword && <p className="text-red-500 text-[12px] mt-1">{errPass.oldPassword.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Mật khẩu mới *</label>
                                            <input
                                                type="password"
                                                className="w-full p-3 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors"
                                                {...regPass('newPassword', { 
                                                    required: 'Vui lòng nhập mật khẩu mới',
                                                    minLength: { value: 6, message: 'Mật khẩu phải dài ít nhất 6 ký tự' }
                                                })}
                                            />
                                            {errPass.newPassword && <p className="text-red-500 text-[12px] mt-1">{errPass.newPassword.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[11px] tracking-[2px] uppercase text-[#888] mb-2 font-medium">Xác nhận mật khẩu mới *</label>
                                            <input
                                                type="password"
                                                className="w-full p-3 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#c4a882] transition-colors"
                                                {...regPass('confirmPassword', { 
                                                    required: 'Vui lòng xác nhận mật khẩu',
                                                    validate: value => value === newPassword || 'Mật khẩu xác nhận không khớp'
                                                })}
                                            />
                                            {errPass.confirmPassword && <p className="text-red-500 text-[12px] mt-1">{errPass.confirmPassword.message}</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="px-8 py-3 bg-[#c4a882] text-white text-[12px] tracking-[2px] uppercase mt-4
                                                    transition-colors duration-200 hover:bg-[#b5624a] border-none disabled:opacity-70"
                                        >
                                            {isUpdating ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* TAB: ADDRESS */}
                            {activeTab === 'address' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#eee]">
                                        <h2 className="text-[22px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
                                            Sổ địa chỉ
                                        </h2>
                                        <button 
                                            onClick={() => handleOpenAddressModal()}
                                            className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2 text-[12px] uppercase tracking-[1px] rounded-sm hover:bg-[#333] transition-colors"
                                        >
                                            <FiPlus size={14} /> Thêm địa chỉ mới
                                        </button>
                                    </div>
                                    
                                    {addresses.length === 0 ? (
                                        <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-200 rounded-sm">
                                            <FiMapPin size={32} className="mx-auto text-gray-300 mb-3" />
                                            <p className="text-[#888]">Bạn chưa lưu địa chỉ nào.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {addresses.map(addr => (
                                                <div key={addr.id} className={`p-5 border rounded-sm transition-all ${addr.isDefault ? 'border-[#b5624a] bg-[#b5624a]/5' : 'border-[#eee] bg-white'}`}>
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h3 className="font-bold text-[#1a1a1a]">{addr.receiverName}</h3>
                                                                <span className="text-gray-300">|</span>
                                                                <span className="text-[#555]">{addr.phone}</span>
                                                                {addr.isDefault && (
                                                                    <span className="text-[10px] bg-[#b5624a] text-white px-2 py-0.5 rounded-full uppercase tracking-[1px] ml-2">Mặc định</span>
                                                                )}
                                                            </div>
                                                            <p className="text-[#555] text-[14px] mt-2">{addr.detail}</p>
                                                            <p className="text-[#888] text-[14px] mt-1">
                                                                {addr.ward && `${addr.ward}, `}{addr.district && `${addr.district}, `}{addr.province}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                                                            {!addr.isDefault && (
                                                                <button 
                                                                    onClick={() => handleSetDefaultAddress(addr)}
                                                                    className="text-[12px] text-blue-600 hover:underline cursor-pointer"
                                                                >
                                                                    Đặt mặc định
                                                                </button>
                                                            )}
                                                            <button 
                                                                onClick={() => handleOpenAddressModal(addr)}
                                                                className="text-gray-500 hover:text-[#1a1a1a] transition-colors"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <FiEdit2 size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteAddress(addr.id)}
                                                                className="text-red-400 hover:text-red-600 transition-colors"
                                                                title="Xóa"
                                                            >
                                                                <FiTrash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
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
