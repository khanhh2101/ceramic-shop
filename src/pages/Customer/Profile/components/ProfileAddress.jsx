import React from 'react';
import { FiPlus, FiMapPin, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function ProfileAddress({ addresses, handleOpenAddressModal, handleSetDefaultAddress, handleDeleteAddress }) {
    return (
        <div>
            <div className="profile-tab-title">
                Sổ địa chỉ
                <button 
                    onClick={() => handleOpenAddressModal()}
                    className="btn-add-address"
                >
                    <FiPlus size={14} /> Thêm địa chỉ mới
                </button>
            </div>
            
            {addresses.length === 0 ? (
                <div className="address-empty">
                    <FiMapPin size={32} className="address-empty-icon" />
                    <p className="address-empty-text">Bạn chưa lưu địa chỉ nào.</p>
                </div>
            ) : (
                <div className="address-list">
                    {addresses.map(addr => (
                        <div key={addr.id} className={`address-card ${addr.isDefault ? 'default' : 'normal'}`}>
                            <div>
                                <div className="address-card-header">
                                    <h3 className="address-card-name">{addr.receiverName}</h3>
                                    <span className="address-card-divider">|</span>
                                    <span className="address-card-phone">{addr.phone}</span>
                                    {addr.isDefault && (
                                        <span className="address-badge">Mặc định</span>
                                    )}
                                </div>
                                <p className="address-detail">{addr.detail}</p>
                                <p className="address-location">
                                    {addr.ward && `${addr.ward}, `}{addr.district && `${addr.district}, `}{addr.province}
                                </p>
                            </div>
                            <div className="address-actions">
                                {!addr.isDefault && (
                                    <button 
                                        onClick={() => handleSetDefaultAddress(addr)}
                                        className="btn-set-default"
                                    >
                                        Đặt mặc định
                                    </button>
                                )}
                                <button 
                                    onClick={() => handleOpenAddressModal(addr)}
                                    className="btn-icon edit"
                                    title="Chỉnh sửa"
                                >
                                    <FiEdit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => handleDeleteAddress(addr.id)}
                                    className="btn-icon delete"
                                    title="Xóa"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
