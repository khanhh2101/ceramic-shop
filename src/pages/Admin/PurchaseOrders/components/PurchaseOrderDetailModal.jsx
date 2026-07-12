import React, { useState, useEffect } from 'react';
import { adminPurchaseOrderApi } from '../api/adminPurchaseOrderApi';
import { X, PackageOpen, CheckCircle, Clock, XCircle, ChevronRight, FileText } from 'lucide-react';

export default function PurchaseOrderDetailModal({ isOpen, onClose, orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchDetail();
    }
    // Khóa cuộn khi mở modal
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, orderId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await adminPurchaseOrderApi.getPurchaseOrderById(orderId);
      if (res?.success) {
        setOrder(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 1: return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-bold flex items-center gap-1 w-fit"><Clock size={16} /> Chờ duyệt</span>;
      case 2: return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold flex items-center gap-1 w-fit"><CheckCircle size={16} /> Hoàn tất</span>;
      case 3: return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-bold flex items-center gap-1 w-fit"><XCircle size={16} /> Đã hủy</span>;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-gray-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#b5624a]/10 rounded-lg">
              <FileText className="text-[#b5624a]" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Chi Tiết Phiếu Nhập</h3>
              <p className="text-sm font-medium text-gray-500 mt-0.5">{order?.code || 'Đang tải...'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {loading || !order ? (
            <div className="flex flex-col items-center justify-center h-64">
              <span className="w-8 h-8 border-4 border-[#b5624a]/30 border-t-[#b5624a] rounded-full animate-spin mb-4"></span>
              <p className="text-gray-500 font-medium">Đang tải chi tiết...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Thông tin chung */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <ChevronRight size={18} className="text-[#b5624a]" /> Thông Tin Chung
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Trạng Thái</p>
                    {getStatusBadge(order.status)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ngày Lập</p>
                    <p className="font-semibold text-gray-900">{new Date(order.orderDate).toLocaleString('vi-VN')}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nhà Cung Cấp</p>
                    <p className="font-semibold text-gray-900">{order.supplierName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Người Lập</p>
                    <p className="font-semibold text-gray-900">{order.createdBy || 'Admin'}</p>
                  </div>
                </div>
                {order.note && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ghi Chú</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{order.note}</p>
                  </div>
                )}
              </div>

              {/* Danh sách mặt hàng */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2">
                    <PackageOpen size={18} className="text-[#b5624a]" /> Danh Sách Mặt Hàng
                  </h4>
                  <span className="text-xs font-bold text-[#b5624a] bg-[#b5624a]/10 px-3 py-1 rounded-full">
                    {order.items?.length || 0} mặt hàng
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
                      <tr>
                        <th className="py-4 px-6">Sản Phẩm</th>
                        <th className="py-4 px-6 text-center">Số Lượng</th>
                        <th className="py-4 px-6 text-right">Đơn Giá Nhập</th>
                        <th className="py-4 px-6 text-right">Thành Tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {order.items?.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                              <img src={item.productImageUrl || 'https://placehold.co/150x150/f3f4f6/a1a1aa?text=No+Image'} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{item.productName}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">{item.productCode || 'NO-SKU'}</span>
                                {item.colorName && (
                                  <span className="text-xs text-[#b5624a] font-bold bg-[#b5624a]/10 px-2 py-0.5 rounded-md border border-[#b5624a]/20">
                                    Màu: {item.colorName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="py-4 px-6 text-right font-medium text-gray-700">
                            {formatCurrency(item.unitCost)}
                          </td>
                          <td className="py-4 px-6 text-right font-black text-[#b5624a]">
                            {formatCurrency(item.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-200">
                      <tr>
                        <td colSpan="3" className="py-4 px-6 text-right font-bold text-gray-600">Tổng Giá Trị Phiếu Nhập:</td>
                        <td className="py-4 px-6 text-right font-black text-[#b5624a] text-xl">
                          {formatCurrency(order.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
