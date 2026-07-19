import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { adminPurchaseOrderApi } from '../api/adminPurchaseOrderApi';
import { CheckCircle, Clock, XCircle, Search, Eye, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/common/ConfirmModal';
import PurchaseOrderDetailModal from './PurchaseOrderDetailModal';
import { useSmartFilter } from '@/hooks/useSmartFilter';
import Pagination from '@/components/common/Pagination';
import { useAdminPurchaseOrders } from '@/pages/Admin/PurchaseOrders/hooks/useAdminPurchaseOrders';

export default function PurchaseOrderList({ onAddNew }) {
  const queryClient = useQueryClient();
  const {
    pageIndex, pageSize, searchTerm, searchInput, setSearchInput,
    setPageIndex, handleSearchImmediate
  } = useSmartFilter({});

  const { data: ordersData, isLoading: loading } = useAdminPurchaseOrders({
    page: pageIndex,
    pageSize,
    search: searchTerm.trim() || undefined
  });

  const orders = ordersData?.items || [];
  const totalCount = ordersData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    orderId: null,
    loading: false
  });
  
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    orderId: null
  });


  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-medium flex items-center gap-1 w-fit"><Clock size={12} /> Chờ duyệt</span>;
      case 2:
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium flex items-center gap-1 w-fit"><CheckCircle size={12} /> Hoàn tất</span>;
      case 3:
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium flex items-center gap-1 w-fit"><XCircle size={12} /> Đã hủy</span>;
      default:
        return null;
    }
  };

  const handleComplete = async () => {
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      const res = await adminPurchaseOrderApi.completePurchaseOrder(confirmModal.orderId);
      if (res?.success) {
        toast.success(res.message || 'Đã duyệt phiếu nhập thành công');
        queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'purchaseorders'] });
      } else {
        toast.error(res?.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      toast.error('Lỗi khi duyệt phiếu nhập');
    } finally {
      setConfirmModal({ isOpen: false, orderId: null, loading: false });
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tìm mã phiếu nhập..." 
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a]"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchImmediate()}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
        <button 
          onClick={onAddNew}
          className="bg-[#b5624a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#a05540] transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Tạo Phiếu Nhập
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/50 text-gray-500 font-medium border-y border-gray-100">
            <tr>
              <th className="py-3 px-4">Mã Phiếu</th>
              <th className="py-3 px-4">Ngày Nhập</th>
              <th className="py-3 px-4">Nhà Cung Cấp</th>
              <th className="py-3 px-4 text-right">Tổng Tiền</th>
              <th className="py-3 px-4 text-center">Trạng Thái</th>
              <th className="py-3 px-4 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="6" className="py-8 text-center text-gray-400">Đang tải dữ liệu...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="6" className="py-8 text-center text-gray-400">Không có phiếu nhập nào</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-gray-900">{order.code}</td>
                  <td className="py-3 px-4">{new Date(order.orderDate).toLocaleString('vi-VN')}</td>
                  <td className="py-3 px-4">{order.supplierName || 'N/A'}</td>
                  <td className="py-3 px-4 text-right font-bold text-[#b5624a]">{formatCurrency(order.totalAmount)}</td>
                  <td className="py-3 px-4 flex justify-center">{getStatusBadge(order.status)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      {order.status === 1 && (
                        <button 
                          onClick={() => setConfirmModal({ isOpen: true, orderId: order.id, loading: false })}
                          className="px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 font-medium transition-colors"
                          title="Duyệt phiếu (Cộng tồn kho)"
                        >
                          Duyệt
                        </button>
                      )}
                      <button 
                        className="p-1.5 bg-gray-50 text-gray-400 hover:text-[#b5624a] hover:bg-[#b5624a]/10 rounded-lg transition-colors"
                        title="Xem chi tiết"
                        onClick={() => setDetailModal({ isOpen: true, orderId: order.id })}
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {!loading && totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination 
            currentPage={pageIndex}
            totalPages={totalPages}
            onPageChange={(page) => setPageIndex(page)}
          />
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, orderId: null, loading: false })}
        onConfirm={handleComplete}
        title="Duyệt Phiếu Nhập"
        message="Bạn có chắc chắn muốn duyệt phiếu nhập này? Sau khi duyệt, số lượng tồn kho sẽ được cộng thêm và giá vốn (MAC) sẽ được tính lại tự động."
        confirmText="Xác nhận Duyệt"
        type="primary"
        isLoading={confirmModal.loading}
      />

      <PurchaseOrderDetailModal 
        isOpen={detailModal.isOpen}
        orderId={detailModal.orderId}
        onClose={() => setDetailModal({ isOpen: false, orderId: null })}
      />
    </div>
  );
}
