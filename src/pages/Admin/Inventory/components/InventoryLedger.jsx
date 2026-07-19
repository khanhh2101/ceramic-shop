import React, { useMemo } from 'react';
import { Table } from 'antd';
import { ArrowDownRight, ArrowUpRight, AlertOctagon, RotateCcw } from 'lucide-react';

const TransactionTypeConfig = {
  1: { label: 'Nhập kho', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: ArrowDownRight },
  2: { label: 'Xuất kho', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: ArrowUpRight },
  3: { label: 'Báo hỏng', color: 'bg-red-50 text-red-700 border-red-200', icon: AlertOctagon },
  4: { label: 'Hoàn trả', color: 'bg-orange-50 text-orange-700 border-orange-200', icon: RotateCcw }
};

export default function InventoryLedger({ ledger, loading, ledgerParams, onTableChange }) {
  const totalPages = Math.ceil(ledger.totalCount / ledgerParams.pageSize) || 1;

  const columns = useMemo(() => [
      { 
          title: 'Mã GD', 
          dataIndex: 'id', 
          width: 100,
          render: (id) => (
              <span className="font-bold text-gray-700 text-sm">#{id}</span>
          )
      },
      { 
          title: 'Thời Gian', 
          dataIndex: 'createdAt', 
          width: 160, 
          render: (createdAt) => (
              <div className="flex flex-col">
                  <span className="font-bold text-gray-900 text-xs">
                      {new Date(createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  <span className="text-[10px] font-medium text-gray-500">
                      {new Date(createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
              </div>
          )
      },
      { 
          title: 'Sản Phẩm', 
          key: 'product', 
          render: (_, row) => (
            <div className="flex items-center gap-3 w-full py-1">
                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center p-0.5">
                    <img src={row.productImageUrl || 'https://placehold.co/600x600/f3f4f6/a1a1aa?text=Image'} className="w-full h-full object-cover rounded-md" alt="" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-bold text-gray-900 text-xs truncate" title={row.productName}>{row.productName}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{row.productCode || 'NO-SKU'}</span>
                        {row.colorName && (
                            <span className="text-[10px] font-bold text-[#b5624a] bg-[#b5624a]/10 px-1.5 py-0.5 rounded border border-[#b5624a]/20">
                                Màu: {row.colorName}
                            </span>
                        )}
                    </div>
                </div>
            </div>
          )
      },
      { 
          title: 'Loại Giao Dịch', 
          dataIndex: 'type', 
          width: 150, 
          render: (type) => {
              const config = TransactionTypeConfig[type] || { label: 'Khác', color: 'bg-gray-50 text-gray-700 border-gray-200', icon: ArrowUpRight };
              const Icon = config.icon;
              return (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border shadow-sm ${config.color}`}>
                      <Icon size={12} strokeWidth={3} />
                      {config.label}
                  </span>
              );
          }
      },
      { 
          title: 'Số Lượng', 
          dataIndex: 'quantity', 
          width: 120, 
          render: (quantity, row) => {
              const isDeduction = [2, 3].includes(row.type);
              return (
                  <span className={`font-black text-sm px-2 py-1 rounded-md ${isDeduction ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'}`}>
                    {isDeduction ? '-' : '+'}{quantity}
                  </span>
              );
          }
      },
      { 
          title: 'Tham Chiếu', 
          dataIndex: 'referenceId', 
          width: 160,
          render: (referenceId) => (
              referenceId ? 
              <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">{referenceId}</span> : 
              <span className="text-gray-400 text-xs">---</span>
          )
      },
      { 
          title: 'Ghi Chú', 
          dataIndex: 'note', 
          render: (note) => <span className="text-xs font-medium text-gray-500 truncate block" title={note}>{note || '---'}</span> 
      },
      { 
          title: 'Người Tạo', 
          dataIndex: 'createdBy', 
          width: 140,
          render: (createdBy) => <span className="text-xs font-bold text-gray-700">{createdBy || 'Hệ thống'}</span> 
      },
  ], []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden p-4">
        <Table
            columns={columns}
            dataSource={ledger.items || []}
            rowKey="id"
            loading={loading}
            pagination={{ 
                current: ledgerParams.page, 
                pageSize: ledgerParams.pageSize, 
                total: ledger.totalCount, 
                onChange: onTableChange,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100']
            }}
            scroll={{ x: 'max-content', y: 'calc(100vh - 320px)' }}
        />
    </div>
  );
}
