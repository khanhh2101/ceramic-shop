import React from 'react';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';

export default function ProfileInfo({ user, regProfile, handleProfileSubmit, errProfile, onUpdateProfile, isUpdating }) {
    return (
        <div>
            <h2 className="profile-tab-title">Thông tin cá nhân</h2>
            <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="profile-form">
                <div className="profile-form-group">
                    <label className="profile-label">Email</label>
                    <div className="profile-input-wrap">
                        <FiMail className="profile-input-icon" />
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="profile-input has-icon"
                        />
                    </div>
                    <p className="profile-form-hint">Email không thể thay đổi</p>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Họ và tên *</label>
                    <div className="profile-input-wrap">
                        <FiUser className="profile-input-icon" />
                        <input
                            type="text"
                            className="profile-input has-icon"
                            {...regProfile('fullName', { required: 'Vui lòng nhập họ tên' })}
                        />
                    </div>
                    {errProfile.fullName && <p className="profile-error">{errProfile.fullName.message}</p>}
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Số điện thoại</label>
                    <div className="profile-input-wrap">
                        <FiPhone className="profile-input-icon" />
                        <input
                            type="text"
                            className="profile-input has-icon"
                            {...regProfile('phone')}
                        />
                    </div>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Ngày sinh</label>
                    <div className="profile-input-wrap">
                        <input
                            type="date"
                            className="profile-input"
                            {...regProfile('dateOfBirth')}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isUpdating}
                    className="profile-submit-btn"
                >
                    {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            </form>
        </div>
    );
}
