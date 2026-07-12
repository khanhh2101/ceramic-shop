import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useSmartFilter } from '@/hooks/useSmartFilter';
import { FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { adminOrderApi } from './api/adminOrderApi';
import AdminOrderTable from './components/AdminOrderTable';
import AdminOrderModal from './components/AdminOrderModal';
import Pagination from '@/components/common/Pagination';
import { formatCurrency, formatDateTime } from '@/utils';
import { getErrorMessage } from '@/utils';

export default function AdminOrders() {
    const queryClient = useQueryClient();
    const [masterStatuses, setMasterStatuses] = useState([]);

    const {
        pageIndex, pageSize, searchTerm, searchInput, setSearchInput,
        filters, setFilter, setPageIndex, clearFilters, handleSearchImmediate
    } = useSmartFilter({
        status: ''
    });

    const statusFilter = filters.status;

    // Modal State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const location = useLocation();



    // Handle opening modal if ?id= is present in URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const orderId = queryParams.get('id');
        if (orderId) {
            handleOpenModal(orderId);
        }
    }, [location.search]);

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const res = await adminOrderApi.getMasterStatuses();
                setMasterStatuses(Array.isArray(res) ? res : (res?.data || res?.items || []));
            } catch (err) {
                console.error('Failed to load order statuses', err);
            }
        };
        fetchMasterData();
    }, []);

    const invalidateOrderCaches = () => {
        queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['lowStock'] });
        queryClient.invalidateQueries({ queryKey: ['ledger'] });
    };

    // React Query for Orders
    const { data: ordersData, isLoading: loading } = useQuery({
        queryKey: ['adminOrders', { searchTerm, statusFilter, pageIndex, pageSize }],
        queryFn: async () => {
            const params = { 
                pageIndex, 
                pageSize,
                sortBy: 'createdAt',
                sortDesc: true
            };
            if (statusFilter !== '') params.statusId = statusFilter;
            if (searchTerm.trim() !== '') params.search = searchTerm.trim();
            
            const res = await adminOrderApi.getOrders(params);
            return {
                items: Array.isArray(res) ? res : (res?.data || res?.items || []),
                totalPages: res?.totalPages || 1,
                totalCount: res?.totalCount || 0
            };
        },
        placeholderData: keepPreviousData
    });

    const orders = ordersData?.items || [];
    const totalPages = ordersData?.totalPages || 1;

    const handleOpenModal = async (orderId) => {
        try {
            const res = await adminOrderApi.getOrderDetails(orderId);
            setSelectedOrder(res?.data || res);
            setIsModalOpen(true);
        } catch (err) {
            toast.error('Không thể tải chi tiết đơn hàng');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!selectedOrder) return;
        
        // Warn if changing back from completed/cancelled
        if ((selectedOrder.statusId === 4000007 || selectedOrder.statusId === 4000008) && 
            !window.confirm('Đơn hàng này đã hoàn thành hoặc bị hủy. Bạn có chắc chắn muốn thay đổi trạng thái không?')) {
            return;
        }

        try {
            setUpdatingStatus(true);
            await adminOrderApi.updateOrderStatus(selectedOrder.id, newStatus);
            toast.success('Cập nhật trạng thái thành công');
            
            // Update local state for the modal
            setSelectedOrder({ ...selectedOrder, statusId: parseInt(newStatus) });
            
            // Refresh the list
            invalidateOrderCaches();
        } catch (err) {
            /* toast handled by api */
        } finally {
            setUpdatingStatus(false);
        }
    };



    const getImageUrl = (url) => {
        if (!url) return 'https://placehold.co/600x800/eeeeee/999999?text=Gom+Nau';
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        // Lấy baseUrl từ api instance (bỏ đi /api ở cuối nếu có)
        const baseUrl = api.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:5011';
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };



    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearchImmediate();
    };

    return (
        <div className="flex flex-col h-full space-y-4 p-2 relative">
            {/* HEADER */}
            <div className="flex-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-display">Đơn hàng</h2>
                    <p className="text-sm text-gray-500 mt-1">Quản lý và xử lý đơn đặt hàng</p>
                </div>
            </div>

            {/* FILTER & SEARCH */}
            <div className="flex-none bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <FiSearch size={18} />
                    </span>
                    <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all"
                        placeholder="Tìm theo mã đơn, tên hoặc SĐT khách..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                
                {/* Specific Filters */}
                <div className="w-full lg:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setFilter('status', e.target.value)}
                        className="w-full lg:w-auto bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                    >
                        <option value="">Tất cả trạng thái</option>
                        {masterStatuses.map(status => (
                            <option key={status.genCd} value={status.genCd}>{status.genNameVn}</option>
                        ))}
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

            {/* ORDERS TABLE & PAGINATION */}
            <div className="flex-1 overflow-hidden flex flex-col space-y-4">
                <AdminOrderTable 
                    orders={orders}
                    loading={loading}
                    handleOpenModal={handleOpenModal}
                    formatCurrency={formatCurrency}
                    formatDate={formatDateTime}
                    getImageUrl={getImageUrl}
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

            {/* ORDER DETAIL MODAL */}
            <AdminOrderModal 
                isModalOpen={isModalOpen}
                handleCloseModal={handleCloseModal}
                selectedOrder={selectedOrder}
                formatDate={formatDateTime}
                formatCurrency={formatCurrency}
                getImageUrl={getImageUrl}
                updatingStatus={updatingStatus}
                handleUpdateStatus={handleUpdateStatus}
            />
        </div>
    );
}
