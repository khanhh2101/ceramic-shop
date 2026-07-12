import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, setAvatar } from '@/store/slices/authSlice';
import { userService } from '@/services';
import { User, Key, Camera, X, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import ImageCropperModal from '@/components/common/ImageCropperModal';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function AdminProfileMenu() {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    
    // Password Modal State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [changingPassword, setChangingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    // Avatar State
    const fileInputRef = useRef(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const dropdownRef = useRef(null);
    
    // Cropper State
    const [cropImageSrc, setCropImageSrc] = useState(null);
    
    // View Avatar State
    const [isViewAvatarOpen, setIsViewAvatarOpen] = useState(false);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("Mật khẩu xác nhận không khớp!");
        }
        setChangingPassword(true);
        try {
            await userService.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
                confirmNewPassword: passwords.confirmPassword
            });
            toast.success("Đổi mật khẩu thành công!");
            setIsPasswordModalOpen(false);
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Đổi mật khẩu thất bại!");
        } finally {
            setChangingPassword(false);
        }
    };

    const handleAvatarFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset file input so we can select the same file again
        e.target.value = '';

        const reader = new FileReader();
        reader.onload = () => {
            setCropImageSrc(reader.result);
            setIsOpen(false);
        };
        reader.readAsDataURL(file);
    };

    const handleCropDone = async (croppedBlob) => {
        setCropImageSrc(null);
        setUploadingAvatar(true);
        const toastId = toast.loading("Đang tải ảnh lên...");
        try {
            // Ensure the blob has a name and type like a File
            const file = new File([croppedBlob], `avatar_${Date.now()}.jpg`, { type: 'image/jpeg' });
            
            const res = await userService.uploadAvatar(file);
            const userRes = await userService.getMe();
            const userData = userRes?.data || userRes;
            if (userData?.avatarUrl) {
                dispatch(setAvatar(userData.avatarUrl));
                toast.success("Cập nhật ảnh đại diện thành công!", { id: toastId });
            }
        } catch (err) {
            toast.error("Lỗi khi tải ảnh đại diện!", { id: toastId });
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleCancelCrop = () => {
        setCropImageSrc(null);
    };

    return (
        <div className="relative">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button 
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors focus:outline-none"
                    >
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </button>
                </PopoverTrigger>

                <PopoverContent side="right" align="end" sideOffset={16} className="w-56 p-0 bg-white border shadow-lg rounded-xl overflow-hidden z-[9999] animate-in fade-in">
                    <div className="p-4 border-b bg-muted/20">
                        <p className="font-semibold text-sm truncate">{user?.fullName || 'Administrator'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                        {user?.avatarUrl && (
                            <button 
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsViewAvatarOpen(true);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-colors text-left"
                            >
                                <ImageIcon className="w-4 h-4" />
                                Xem ảnh đại diện
                            </button>
                        )}
                        <button 
                            onClick={() => {
                                setIsOpen(false);
                                fileInputRef.current?.click();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-colors text-left"
                            disabled={uploadingAvatar}
                        >
                            <Camera className="w-4 h-4" />
                            Đổi ảnh đại diện
                        </button>
                        <button 
                            onClick={() => {
                                setIsOpen(false);
                                setIsPasswordModalOpen(true);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-colors text-left"
                        >
                            <Key className="w-4 h-4" />
                            Đổi mật khẩu
                        </button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Hidden File Input */}
            <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleAvatarFileChange} 
            />

            {/* Cropper Modal */}
            {cropImageSrc && (
                <ImageCropperModal
                    imageSrc={cropImageSrc}
                    onCropDone={handleCropDone}
                    onCancel={handleCancelCrop}
                />
            )}

            {/* View Avatar Modal */}
            <Modal 
                isOpen={isViewAvatarOpen} 
                onClose={() => setIsViewAvatarOpen(false)}
                contentClassName="bg-transparent shadow-none w-auto max-w-[90vw] overflow-hidden relative z-50 flex justify-center items-center"
                backdropClassName="bg-black/90 backdrop-blur-md"
            >
                <div className="relative group">
                    <button 
                        onClick={() => setIsViewAvatarOpen(false)} 
                        className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors p-2"
                    >
                        <X size={30} />
                    </button>
                    <img 
                        src={user?.avatarUrl} 
                        alt="Avatar Preview" 
                        className="max-w-full max-h-[85vh] rounded-full border-4 border-white/20 shadow-2xl object-cover aspect-square"
                    />
                </div>
            </Modal>

            {/* Change Password Modal */}
            <Modal 
                isOpen={isPasswordModalOpen} 
                onClose={() => !changingPassword && setIsPasswordModalOpen(false)}
                contentClassName="bg-white rounded-2xl shadow-xl w-[90vw] max-w-md overflow-hidden relative z-50"
            >
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">Đổi mật khẩu</h3>
                    <button onClick={() => !changingPassword && setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6">
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                            <input
                                type={showPassword.current ? "text" : "password"}
                                required
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                            <button type="button" onClick={() => togglePasswordVisibility('current')} className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
                                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                            <input
                                type={showPassword.new ? "text" : "password"}
                                required
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                                placeholder="Nhập mật khẩu mới"
                            />
                            <button type="button" onClick={() => togglePasswordVisibility('new')} className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
                                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                            <input
                                type={showPassword.confirm ? "text" : "password"}
                                required
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            <button type="button" onClick={() => togglePasswordVisibility('confirm')} className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
                                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsPasswordModalOpen(false)}
                                disabled={changingPassword}
                            >
                                Hủy
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={changingPassword}
                            >
                                {changingPassword ? 'Đang đổi...' : 'Cập nhật'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
