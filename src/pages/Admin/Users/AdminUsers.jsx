import { useState, useEffect } from 'react';
import { FiSearch, FiShield, FiUser, FiMail, FiCalendar, FiShoppingBag, FiEdit2, FiTrash2, FiLock, FiUnlock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/services/api';
import Modal from '@/components/common/Modal';
import ConfirmModal from '@/components/common/ConfirmModal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import ActionIconButton from '@/components/common/ActionIconButton';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users', { params: { pageSize: 50 } });
      const data = res.data.data || res.data;
      setUsers(Array.isArray(data) ? data : (data.items || []));
    } catch (err) {
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  // Form state
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDateOfBirth, setEditDateOfBirth] = useState('');
  const [editRole, setEditRole] = useState('Customer');
  const [editIsLocked, setEditIsLocked] = useState(false);

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditFullName(user.fullName || '');
    setEditPhone(user.phone || '');
    setEditDateOfBirth(user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '');
    setEditRole(user.role);
    setEditIsLocked(user.isLocked);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      // 1. Update Profile (FullName, Phone, DOB)
      await api.put(`/users/${editingUser.id}`, {
        fullName: editFullName,
        phone: editPhone || null,
        dateOfBirth: editDateOfBirth || null
      });

      // 2. Update Role if changed
      if (editRole !== editingUser.role) {
        await api.put(`/users/${editingUser.id}/role`, { role: editRole });
      }

      // 3. Update Status if changed
      if (editIsLocked !== editingUser.isLocked) {
        await api.put(`/users/${editingUser.id}/status`, { isLocked: editIsLocked });
      }

      toast.success('Cập nhật người dùng thành công');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
    }
  };

  const handleOpenDelete = (user) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/users/${deletingUser.id}`);
      toast.success('Xóa tài khoản thành công');
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể xóa tài khoản này');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { 
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(date);
  };

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 space-y-6 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Khách hàng</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản người dùng và khách hàng</p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={18} />
          </span>
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-[#b5624a]/30 border-t-[#b5624a] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Người dùng</th>
                  <th className="px-6 py-4 font-medium">Vai trò</th>
                  <th className="px-6 py-4 font-medium">Ngày tham gia</th>
                  <th className="px-6 py-4 font-medium">Trạng thái</th>
                  <th className="px-6 py-4 font-medium text-center">Đã mua</th>
                  <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <FiUser className="text-gray-400" size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{user.fullName}</p>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <FiMail size={12} />
                                {user.email}
                              </span>
                              <span className="text-gray-300">|</span>
                              <span className="flex items-center gap-1">
                                <span className="font-medium text-gray-400">📞</span>
                                {user.phone || 'Chưa có SĐT'}
                              </span>
                            </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'Admin' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                          <FiShield size={12} /> Quản trị viên
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          <FiUser size={12} /> Khách hàng
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.isLocked ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <FiLock size={12} /> Đã khóa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <FiUnlock size={12} /> Hoạt động
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <FiCalendar size={14} />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-900">
                        <FiShoppingBag className="text-gray-400" size={14} />
                        {user.orderCount} <span className="text-xs font-normal text-gray-500">đơn</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <ActionIconButton
                          icon={FiEdit2}
                          onClick={() => handleOpenEdit(user)}
                          title="Sửa"
                        />
                        <ActionIconButton
                          icon={FiTrash2}
                          variant="delete"
                          onClick={() => handleOpenDelete(user)}
                          title="Xóa"
                        />
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm">
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Chỉnh sửa Người dùng">
        {editingUser && (
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
        )}
      </Modal>

      {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa tài khoản "${deletingUser?.fullName}"? Hành động này không thể hoàn tác và chỉ thành công nếu người dùng chưa có dữ liệu ràng buộc.`}
        confirmText="Xóa tài khoản"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
}
