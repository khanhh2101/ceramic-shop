import React from 'react';
import { FiUser, FiLock, FiMapPin, FiCamera, FiPackage } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function ProfileSidebar({ user, previewAvatar, onAvatarChange, activeTab, setActiveTab }) {
    const navigate = useNavigate();

    return (
        <div className="profile-sidebar">
            <div className="profile-sidebar-card">
                <div className="profile-avatar-wrap">
                    <img
                        src={previewAvatar || '/assets/image/avatars/av1.jpg'}
                        alt="Avatar"
                        className="profile-avatar-img"
                    />
                    <label className="profile-avatar-overlay">
                        <FiCamera size={20} className="mb-1" />
                        <span className="profile-avatar-text">Thay đổi</span>
                        <input type="file" className="hidden" accept="image/*" onChange={onAvatarChange} />
                    </label>
                </div>
                <h2 className="profile-name">
                    {user?.fullName || 'Người dùng'}
                </h2>
                <p className="profile-email">{user?.email}</p>

                <div className="profile-nav">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`profile-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    >
                        <FiUser size={16} /> Thông tin cá nhân
                    </button>
                    <button
                        onClick={() => navigate('/orders')}
                        className="profile-nav-btn"
                    >
                        <FiPackage size={16} /> Đơn hàng của tôi
                    </button>
                    <button
                        onClick={() => setActiveTab('address')}
                        className={`profile-nav-btn ${activeTab === 'address' ? 'active' : ''}`}
                    >
                        <FiMapPin size={16} /> Sổ địa chỉ
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`profile-nav-btn ${activeTab === 'password' ? 'active' : ''}`}
                    >
                        <FiLock size={16} /> Đổi mật khẩu
                    </button>
                </div>
            </div>
        </div>
    );
}
