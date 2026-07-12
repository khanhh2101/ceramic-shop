import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import PurchaseOrderList from './components/PurchaseOrderList';
import PurchaseOrderForm from './components/PurchaseOrderForm';

export default function AdminPurchaseOrders() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setIsModalOpen(false);
    setRefreshKey(prev => prev + 1); // Thay đổi key để remount component List, ép fetch lại data
    queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['lowStock'] });
    queryClient.invalidateQueries({ queryKey: ['ledger'] });
    queryClient.invalidateQueries({ queryKey: ['adminPurchaseOrders'] });
  };

  return (
    <div className="flex flex-col h-full space-y-4 p-2 relative">
      <div className="flex-none shrink-0">
        <h2 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2">
          <Package className="text-[#b5624a]" /> Quản Lý Nhập Hàng
        </h2>
        <p className="text-gray-500 text-sm mt-1">Lập phiếu nhập, duyệt và tự động cộng tồn kho, tính giá vốn MAC</p>
      </div>

      <div className="flex-1">
        <PurchaseOrderList key={refreshKey} onAddNew={() => setIsModalOpen(true)} />
      </div>

      {isModalOpen && (
        <PurchaseOrderForm 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleSuccess} 
        />
      )}
    </div>
  );
}
