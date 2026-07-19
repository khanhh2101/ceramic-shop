import { useState } from 'react';
import { useSmartFilter } from '@/hooks/useSmartFilter';
import { FiSearch, FiRefreshCw, FiUserPlus, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Pagination from '@/components/common/Pagination';
import { useAdminAccounts, useAssignGroupsToUser, useAdminGroupsList, useCreateAdminAccount } from './hooks/useAdminAccounts';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { Select } from 'antd'; // Use AntD select for multiple

export default function AdminAccounts() {
    const {
        pageIndex, pageSize, searchTerm, searchInput, setSearchInput,
        setPageIndex, clearFilters, handleSearchImmediate
    } = useSmartFilter({});

    const { data: accountsData, isLoading: loading } = useAdminAccounts({
        page: pageIndex,
        pageSize,
        search: searchTerm.trim() || undefined
    });

    const accounts = accountsData?.items || [];
    const totalPages = accountsData?.totalPages || 1;

    // Assignment Modal State
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedGroupIds, setSelectedGroupIds] = useState([]);

    // Create Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'Staff',
        groupIds: []
    });

    const createMutation = useCreateAdminAccount();

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await createMutation.mutateAsync(createForm);
            setIsCreateModalOpen(false);
            setCreateForm({ email: '', password: '', fullName: '', role: 'Staff', groupIds: [] });
        } catch (err) {
            // Error handled in hook
        }
    };


    const { data: groupsData } = useAdminGroupsList();
    const groups = groupsData || [];

    const assignMutation = useAssignGroupsToUser();

    const handleOpenAssign = (user) => {
        setSelectedUser(user);
        setSelectedGroupIds(user.groups?.map(g => g.id) || []);
        setIsAssignModalOpen(true);
    };

    const handleSaveAssignment = async () => {
        if (!selectedUser) return;
        try {
            await assignMutation.mutateAsync({
                userId: selectedUser.id,
                groupIds: selectedGroupIds
            });
            toast.success('Gán nhóm thành công');
            setIsAssignModalOpen(false);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearchImmediate();
    };

    const groupOptions = groups.map(g => ({ label: g.name, value: g.id }));

    return (
        <div className="flex flex-col h-full space-y-4 p-2 relative">
            <div className="flex-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-display">Tài khoản nội bộ</h2>
                    <p className="text-sm text-gray-500 mt-1">Quản lý và cấp quyền Nhóm cho tài khoản Quản trị viên/Nhân viên</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                        <FiUserPlus size={18} />
                        Thêm tài khoản
                    </button>
                </div>
            </div>

            <div className="flex-none bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <FiSearch size={18} />
                    </span>
                    <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all"
                        placeholder="Tìm kiếm tài khoản nội bộ..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <button onClick={handleSearchImmediate} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                        <FiSearch size={16} /> Tìm
                    </button>
                    <button onClick={clearFilters} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                        <FiRefreshCw size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap">Tài khoản</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap">Role</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap min-w-[200px]">Thuộc Nhóm</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-8">Đang tải...</td></tr>
                            ) : accounts.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-8">Không tìm thấy tài khoản nào.</td></tr>
                            ) : (
                                accounts.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{user.fullName}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {user.groups && user.groups.length > 0 ? (
                                                    user.groups.map(g => (
                                                        <span key={g.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                                            {g.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Chưa có nhóm</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleOpenAssign(user)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                            >
                                                <FiShield size={14} /> Gán nhóm
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 flex justify-center">
                        <Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
                    </div>
                )}
            </div>

            {/* Modal Gán Nhóm */}
            {selectedUser && (
                <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Cấp quyền Nhóm">
                    <div className="space-y-4 w-full max-w-[450px]">
                        <div>
                            <p className="text-sm text-gray-500">Tài khoản</p>
                            <p className="font-bold text-gray-900">{selectedUser.fullName} ({selectedUser.email})</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Chọn Nhóm</label>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Chọn một hoặc nhiều nhóm"
                                value={selectedGroupIds}
                                onChange={(val) => setSelectedGroupIds(val)}
                                options={groupOptions}
                                optionFilterProp="label"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>Hủy</Button>
                            <Button variant="primary" onClick={handleSaveAssignment} isLoading={assignMutation.isLoading}>Lưu cập nhật</Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Modal Tạo Tài Khoản */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Thêm tài khoản nội bộ">
                <form onSubmit={handleCreateSubmit} className="space-y-4 w-full max-w-[500px]">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Họ và tên *</label>
                        <input
                            required
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            value={createForm.fullName}
                            onChange={e => setCreateForm(prev => ({ ...prev, fullName: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                        <input
                            required
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            value={createForm.email}
                            onChange={e => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu *</label>
                        <input
                            required
                            type="password"
                            minLength={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            value={createForm.password}
                            onChange={e => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vai trò (Role) *</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            value={createForm.role}
                            onChange={e => setCreateForm(prev => ({ ...prev, role: e.target.value }))}
                        >
                            <option value="Staff">Nhân viên (Staff)</option>
                            <option value="Admin">Quản trị viên (Admin)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gán Nhóm (Tùy chọn)</label>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Chọn nhóm"
                            value={createForm.groupIds}
                            onChange={(val) => setCreateForm(prev => ({ ...prev, groupIds: val }))}
                            options={groupOptions}
                            optionFilterProp="label"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Hủy</Button>
                        <Button type="submit" variant="primary" isLoading={createMutation.isLoading}>Tạo tài khoản</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
