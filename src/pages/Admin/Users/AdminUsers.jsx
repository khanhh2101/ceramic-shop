import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSmartFilter } from '@/hooks/useSmartFilter';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/common/ConfirmModal';
import Pagination from '@/components/common/Pagination';
import { adminUserApi } from './api/adminUserApi';
import AdminUserTable from './components/AdminUserTable';
import AdminUserModal from './components/AdminUserModal';
import { getErrorMessage } from '@/utils';
import { useAdminUsers } from '@/pages/Admin/Users/hooks/useAdminUsers';

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const {
      pageIndex, pageSize, searchTerm, searchInput, setSearchInput,
      filters, setFilter, setPageIndex, clearFilters, handleSearchImmediate
  } = useSmartFilter({
      role: '',
      status: ''
  });

  const roleFilter = filters.role;
  const statusFilter = filters.status;

  const invalidateUserCaches = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const { data: usersData, isLoading: loading } = useAdminUsers({
      pageIndex,
      pageSize,
      search: searchTerm.trim() || undefined,
      role: roleFilter !== '' ? roleFilter : undefined,
      isLocked: statusFilter !== '' ? statusFilter === 'true' : undefined
  });

  const users = usersData?.items || [];
  const totalPages = usersData?.totalPages || 1;

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
      await adminUserApi.updateUser(editingUser.id, {
        fullName: editFullName,
        phone: editPhone || null,
        dateOfBirth: editDateOfBirth || null
      });

      if (editRole !== editingUser.role) {
        await adminUserApi.updateUserRole(editingUser.id, editRole);
      }

      if (editIsLocked !== editingUser.isLocked) {
        await adminUserApi.updateUserStatus(editingUser.id, editIsLocked);
      }

      toast.success('Cập nhật người dùng thành công');
      setIsEditModalOpen(false);
      invalidateUserCaches();
    } catch (err) {
      /* toast handled by api */
    }
  };

  const handleOpenDelete = (user) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await adminUserApi.deleteUser(deletingUser.id);
      toast.success('Xóa tài khoản thành công');
      setIsDeleteModalOpen(false);
      invalidateUserCaches();
    } catch (err) {
      /* toast handled by api */
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { 
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(date);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchImmediate();
  };

  return (
    <div className="flex flex-col h-full space-y-4 p-2 relative">
      <div className="flex-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Khách hàng</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản người dùng và khách hàng</p>
        </div>
      </div>

      <div className="flex-none bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FiSearch size={18} />
              </span>
              <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all"
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
              />
          </div>

          {/* Specific Filters */}
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <select
                  value={roleFilter}
                  onChange={(e) => setFilter('role', e.target.value)}
                  className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
              >
                  <option value="">Tất cả vai trò</option>
                  <option value="Admin">Admin</option>
                  <option value="Customer">Customer</option>
              </select>
              <select
                  value={statusFilter}
                  onChange={(e) => setFilter('status', e.target.value)}
                  className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
              >
                  <option value="">Tất cả trạng thái</option>
                  <option value="false">Đang hoạt động</option>
                  <option value="true">Bị khóa</option>
              </select>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
              <button 
                  onClick={handleSearchImmediate}
                  className="flex-1 lg:flex-none bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                  <FiSearch size={16} />
                  Tìm kiếm
              </button>
              <button 
                  onClick={clearFilters}
                  className="flex-1 lg:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  title="Làm mới bộ lọc"
              >
                  <FiRefreshCw size={16} />
                  Làm mới
              </button>
          </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col space-y-4">
        <AdminUserTable 
          filteredUsers={users}
          loading={loading}
          handleOpenEdit={handleOpenEdit}
          handleOpenDelete={handleOpenDelete}
          formatDate={formatDate}
        />
        
        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
            <div className="flex-none bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-center">
                <Pagination 
                    currentPage={pageIndex}
                    totalPages={totalPages}
                    onPageChange={(page) => setPageIndex(page)}
                />
            </div>
        )}
      </div>

      <AdminUserModal 
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editingUser={editingUser}
        editFullName={editFullName}
        setEditFullName={setEditFullName}
        editPhone={editPhone}
        setEditPhone={setEditPhone}
        editDateOfBirth={editDateOfBirth}
        setEditDateOfBirth={setEditDateOfBirth}
        editRole={editRole}
        setEditRole={setEditRole}
        editIsLocked={editIsLocked}
        setEditIsLocked={setEditIsLocked}
        handleSaveEdit={handleSaveEdit}
        formatDate={formatDate}
      />

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
