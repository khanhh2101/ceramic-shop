import React from 'react';

export default function ProfilePassword({ regPass, handlePassSubmit, errPass, onChangePassword, isUpdating, newPassword }) {
    return (
        <div>
            <h2 className="profile-tab-title">Đổi mật khẩu</h2>
            <form onSubmit={handlePassSubmit(onChangePassword)} className="profile-form">
                <div className="profile-form-group">
                    <label className="profile-label">Mật khẩu hiện tại *</label>
                    <input
                        type="password"
                        className="profile-input"
                        {...regPass('oldPassword', { required: 'Vui lòng nhập mật khẩu cũ' })}
                    />
                    {errPass.oldPassword && <p className="profile-error">{errPass.oldPassword.message}</p>}
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Mật khẩu mới *</label>
                    <input
                        type="password"
                        className="profile-input"
                        {...regPass('newPassword', { 
                            required: 'Vui lòng nhập mật khẩu mới',
                            minLength: { value: 6, message: 'Mật khẩu phải dài ít nhất 6 ký tự' }
                        })}
                    />
                    {errPass.newPassword && <p className="profile-error">{errPass.newPassword.message}</p>}
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Xác nhận mật khẩu mới *</label>
                    <input
                        type="password"
                        className="profile-input"
                        {...regPass('confirmPassword', { 
                            required: 'Vui lòng xác nhận mật khẩu',
                            validate: value => value === newPassword || 'Mật khẩu xác nhận không khớp'
                        })}
                    />
                    {errPass.confirmPassword && <p className="profile-error">{errPass.confirmPassword.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isUpdating}
                    className="profile-submit-btn alt"
                >
                    {isUpdating ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                </button>
            </form>
        </div>
    );
}
