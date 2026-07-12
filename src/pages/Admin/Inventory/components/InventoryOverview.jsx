import React, { useMemo } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import DataTable from '@/components/common/DataTable';

export default function InventoryOverview({ lowStockProducts, onAdjustClick }) {
    const columns = useMemo(() => [
        {
            headerName: 'Sản Phẩm',
            field: 'name',
            flex: 2,
            minWidth: '300px',
            cellRenderer: (p) => (
                <div className="flex items-center gap-4 h-full w-full py-1.5">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center p-0.5 shadow-sm">
                        <img
                            src={p.primaryImageUrl || 'https://placehold.co/600x600/f3f4f6/a1a1aa?text=Image'}
                            alt={p.name}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate" title={p.name}>
                            {p.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                                {p.code || 'NO-SKU'}
                            </span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            headerName: 'Danh Mục',
            field: 'categoryName',
            width: '200px',
            cellRenderer: (p) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-50 border border-gray-200 text-gray-700">
                    {p.categoryName || 'Không có'}
                </span>
            )
        },
        {
            headerName: 'Tồn Kho Hiện Tại',
            field: 'stockQuantity',
            width: '160px',
            cellRenderer: (p) => (
                <div className="flex flex-col justify-center h-full gap-1">
                    <span className={`inline-flex w-fit items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm ${p.stockQuantity === 0 ? 'text-red-700 bg-red-50 border-red-100' : 'text-orange-700 bg-orange-50 border-orange-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.stockQuantity === 0 ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`}></span>
                        Tổng: {p.stockQuantity === 0 ? 'Hết hàng' : p.stockQuantity}
                    </span>
                    {p.colors && p.colors.length > 0 && (
                        <div className="flex flex-col gap-0.5 mt-0.5">
                            {p.colors.filter(c => c.stockQuantity <= 15).map((c, idx) => (
                                <span key={idx} className={`text-[10px] font-bold flex items-center gap-1.5 whitespace-nowrap ${c.stockQuantity === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                                    <span className="w-1.5 h-1.5 rounded-full border border-gray-200" style={{ backgroundColor: c.hexColor || '#ccc' }}></span>
                                    {c.name}: {c.stockQuantity}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )
        },
        {
            headerName: 'Hành Động',
            width: '150px',
            headerClassName: 'justify-end pr-6',
            cellClassName: 'pr-6',
            cellRenderer: (p) => (
                <div className="flex items-center justify-end h-full">
                    <button 
                        onClick={() => onAdjustClick(p.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#b5624a]/10 hover:bg-[#b5624a] text-[#b5624a] hover:text-white transition-all text-xs font-bold border border-[#b5624a]/20 hover:border-[#b5624a] shadow-sm"
                    >
                        <Plus size={14} /> Nhập Thêm
                    </button>
                </div>
            )
        }
    ], [onAdjustClick]);

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-red-50/50 shrink-0">
                <h3 className="font-bold text-red-700 flex items-center gap-2">
                    <AlertTriangle className="text-red-500" size={20} />
                    Sản phẩm cảnh báo tồn kho (Dưới 15 SP)
                </h3>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200 shadow-sm">
                    {lowStockProducts.length} sản phẩm
                </span>
            </div>
            <div className="flex-1 overflow-hidden min-h-[300px]">
                <DataTable
                    columns={columns}
                    data={lowStockProducts}
                    loading={false}
                    emptyMessage="Tất cả sản phẩm đều có số lượng an toàn."
                    wrapperClassName="h-full flex flex-col"
                />
            </div>
        </div>
    );
}
