import React from 'react';
import { FiUser, FiCalendar, FiLock, FiUnlock } from 'react-icons/fi';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export default function AdminUserModal({
    isEditModalOpen,
    setIsEditModalOpen,
    editingUser,
    editFullName, setEditFullName,
    editPhone, setEditPhone,
    editDateOfBirth, setEditDateOfBirth,
    editRole, setEditRole,
    editIsLocked, setEditIsLocked,
    handleSaveEdit,
    formatDate
}) {
    if (!editingUser) return null;

    return (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Chỉnh sửa Người dùng">
            <div className="space-y-6 w-full max-w-[550px]">
                {/* Header / Avatar */}
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {editingUser.avatarUrl ? (
                            <img src={editingUser.avatarUrl} alt={editingUser.fullName} className="w-full h-full object-cover" />
                        ) : (
                            <FiUser className="text-gray-400" size={28} />
                        )}
                    </div>
                    <div>
                        <p className="text-lg font-bold text-gray-900">{editingUser.fullName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">
                                ID: {editingUser.id.substring(0, 8)}...
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <FiCalendar size={10} />
                                Tham gia: {formatDate(editingUser.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Họ và tên"
                            value={editFullName}
                            onChange={(e) => setEditFullName(e.target.value)}
                            placeholder="Nhập họ tên đầy đủ"
                        />
                        <Input
                            label="Email (Không thể thay đổi)"
                            value={editingUser.email}
                            disabled
                            className="opacity-75 cursor-not-allowed bg-gray-50"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Số điện thoại"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            placeholder="Nhập số điện thoại"
                        />
                        <Input
                            label="Ngày sinh"
                            type="date"
                            value={editDateOfBirth}
                            onChange={(e) => setEditDateOfBirth(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Role */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phân quyền</label>
                            <select
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all"
                            >
                                <option value="Customer">Khách hàng</option>
                                <option value="Admin">Quản trị viên (Admin)</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Trạng thái</label>
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setEditIsLocked(false)}
                                    className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${!editIsLocked ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <FiUnlock size={14} /> Hoạt động
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditIsLocked(true)}
                                    className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${editIsLocked ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <FiLock size={14} /> Khóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSaveEdit}>Lưu thay đổi</Button>
                </div>
            </div>
        </Modal>
    );
}
