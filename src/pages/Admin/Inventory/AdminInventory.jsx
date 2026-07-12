import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Archive, AlertTriangle, List } from 'lucide-react';
import TabRenderer from '@/components/Layout/components/TabRenderer';
import { toast } from 'react-hot-toast';

import adminInventoryApi from './api/adminInventoryApi';
import { adminProductApi } from '@/pages/Admin/Products/api/adminProductApi';

import InventoryOverview from './components/InventoryOverview';
import InventoryLedger from './components/InventoryLedger';
import InventoryAdjustForm from './components/InventoryAdjustForm';

export default function AdminInventory() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [ledger, setLedger] = useState({ items: [], totalCount: 0 });
  const [loading, setLoading] = useState(false);
  
  const [ledgerParams, setLedgerParams] = useState({ page: 1, pageSize: 20 });
  
  // States cho Form Điều chỉnh kho
  const [products, setProducts] = useState([]);
  const [masterColors, setMasterColors] = useState([]);
  const [adjustForm, setAdjustForm] = useState({
    productId: '',
    colorId: '',
    type: 1,
    quantity: 1,
    referenceId: '',
    note: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLowStock();
    fetchProducts();
    fetchMasterColors();
  }, []);

  const fetchMasterColors = async () => {
    try {
      const resColor = await adminProductApi.getColors();
      const arr = Array.isArray(resColor) ? resColor : (resColor?.data || []);
      const mapped = arr.map(item => ({
        id: item.genCd,
        name: item.genNameVn,
        hexColor: item.color
      }));
      setMasterColors(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'ledger') {
      fetchLedger();
    }
  }, [activeTab, ledgerParams]);

  const fetchLowStock = async () => {
    try {
      const res = await adminInventoryApi.getLowStock(15);
      if (res?.success || res?.isSuccess) {
        setLowStockProducts(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await adminProductApi.getProducts({ pageSize: 1000 });
      if (res?.success || res?.isSuccess) {
        setProducts(res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const res = await adminInventoryApi.getLedger(ledgerParams);
      // Backend returns PagedResponse directly, so res is { data: [...], totalCount: ... }
      if (res && res.data) {
        setLedger({ items: res.data, totalCount: res.totalCount });
      } else if (res?.success || res?.isSuccess) {
        setLedger({ items: res.data?.data || [], totalCount: res.data?.totalCount || 0 });
      }
    } catch (err) {
      toast.error('Lỗi khi tải sổ kho');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    if (!adjustForm.productId) {
      toast.error('Vui lòng chọn sản phẩm');
      return;
    }
    
    try {
      const res = await adminInventoryApi.adjustStock({
        productId: Number(adjustForm.productId),
        colorId: adjustForm.colorId ? Number(adjustForm.colorId) : null,
        type: Number(adjustForm.type),
        quantity: Number(adjustForm.quantity),
        referenceId: adjustForm.referenceId,
        note: adjustForm.note
      });
      
      if (res?.success || res?.isSuccess) {
        toast.success(res.message || 'Cập nhật kho thành công');
        setAdjustForm({ productId: '', colorId: '', type: 1, quantity: 1, referenceId: '', note: '' });
        setIsModalOpen(false);
        fetchLowStock();
        if (activeTab === 'ledger') fetchLedger();
        fetchProducts(); // Cập nhật lại danh sách sản phẩm trong dropdown
        queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['lowStock'] });
        queryClient.invalidateQueries({ queryKey: ['ledger'] });
      } else {
        toast.error(res?.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      toast.error('Lỗi khi điều chỉnh kho');
    }
  };

  const handleAdjustClick = (productId) => {
    setAdjustForm({ ...adjustForm, productId: productId.toString(), type: 1 });
    setIsModalOpen(true);
  };

  const tabsConfig = [
    {
      id: 'overview',
      label: 'Cảnh báo sắp hết hàng',
      icon: AlertTriangle,
      content: (
        <InventoryOverview 
          lowStockProducts={lowStockProducts}
          onAdjustClick={handleAdjustClick}
        />
      )
    },
    {
      id: 'ledger',
      label: 'Sổ kho (Lịch sử)',
      icon: List,
      content: (
        <InventoryLedger 
          ledger={ledger}
          loading={loading}
          ledgerParams={ledgerParams}
          onPageChange={(page) => setLedgerParams(p => ({ ...p, page }))}
        />
      )
    }
  ];

  return (
    <div className="flex flex-col h-full space-y-4 p-2 relative">
      <div className="flex-none flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2">
            <Archive className="text-[#b5624a]" /> Quản Lý Kho Hàng Gốm Sứ
          </h2>
          <p className="text-gray-500 text-sm mt-1">Kiểm soát tồn kho, ghi nhận nhập xuất và báo hỏng sản phẩm</p>
        </div>
        <button 
          onClick={() => {
            setAdjustForm({ productId: '', type: 1, quantity: 1, referenceId: '', note: '' });
            setIsModalOpen(true);
          }}
          className="bg-[#b5624a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#9a513b] transition-colors flex items-center gap-2"
        >
          <Archive size={16} /> Ghi Nhận Biến Động
        </button>
      </div>

      <div className="flex-none flex bg-white rounded-t-xl border border-gray-100 overflow-hidden shrink-0">
        {tabsConfig.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-colors border-b-2 outline-none ${
                activeTab === tab.id 
                ? 'border-[#b5624a] text-[#b5624a] bg-[#b5624a]/5' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </div>
      
      <div className="flex-1 relative">
        {tabsConfig.find(t => t.id === activeTab)?.content}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
              <InventoryAdjustForm 
                products={products}
                masterColors={masterColors}
                adjustForm={adjustForm}
                setAdjustForm={setAdjustForm}
                onSubmit={handleAdjustStock}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
