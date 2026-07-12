import React, { useMemo } from 'react';
import { FiEye, FiEyeOff, FiEdit2, FiTrash2, FiTag, FiBox, FiAlertCircle } from 'react-icons/fi';
import DataTable from '@/components/common/DataTable';

export default function AdminProductTable({ products, loading, handleToggleVisibility, handleOpenModal, handleDelete, formatCurrency }) {
    
    // Cell Renderers
    const ProductCellRenderer = (product) => {
        return (
            <div className={`flex items-center gap-4 h-full w-full py-1.5`}>
                <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center p-0.5 shadow-sm">
                    <img
                        src={product.primaryImageUrl || 'https://placehold.co/600x600/f3f4f6/a1a1aa?text=Image'}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
                <div className="flex flex-col justify-center overflow-hidden min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate group-hover:text-[#b5624a] transition-colors" title={product.name}>
                        {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                            {product.code || 'NO-SKU'}
                        </span>
                        {!product.isVisible && (
                            <span className="text-[10px] font-black bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                Đã ẩn
                            </span>
                        )}
                        {product.oldPrice > product.price && (
                            <span className="text-[10px] font-black bg-red-50 text-red-600 px-1.5 py-0.5 rounded-md uppercase tracking-wider border border-red-100">
                                Sale
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const PriceCellRenderer = (product) => {
        return (
            <div className="flex flex-col justify-center h-full">
                <span className="text-sm font-black text-[#b5624a] leading-tight">{formatCurrency(product.price)}</span>
                {product.oldPrice > product.price && (
                    <span className="text-xs font-bold text-gray-400 line-through leading-tight mt-0.5">{formatCurrency(product.oldPrice)}</span>
                )}
            </div>
        );
    };

    const TagsCellRenderer = (product) => {
        const tags = product.tags;
        if (!tags || tags.length === 0) return <span className="text-xs font-medium text-gray-400 flex items-center h-full">---</span>;
        
        return (
            <div className="flex flex-wrap items-center gap-1.5 py-2">
                {tags.slice(0, 3).map((tag, idx) => (
                    <span 
                        key={idx} 
                        className="px-2 py-0.5 text-[10px] font-bold rounded-md text-white whitespace-nowrap shadow-sm border border-black/5"
                        style={{ backgroundColor: tag.hexColor || '#9ca3af' }}
                    >
                        {tag.name}
                    </span>
                ))}
                {tags.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-gray-50 text-gray-400 border border-gray-100">
                        +{tags.length - 3}
                    </span>
                )}
            </div>
        );
    };

    const StatusCellRenderer = (product) => {
        const inStock = product.stockQuantity > 0;
        return (
            <div className="flex items-center h-full">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border shadow-sm ${!inStock ? 'text-red-700 bg-red-50 border-red-100' : 'text-emerald-700 bg-emerald-50 border-emerald-100'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${!inStock ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                    {inStock ? 'Còn hàng' : 'Hết hàng'}
                </span>
            </div>
        );
    };

    const ActionsCellRenderer = (product) => {
        return (
            <div className="flex items-center justify-end gap-2 h-full">
                <button
                    onClick={() => handleToggleVisibility(product.id)}
                    title={product.isVisible ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
                    className={`p-1.5 rounded-lg transition-all border shadow-sm ${product.isVisible ? 'text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100' : 'text-gray-500 bg-gray-100 border-gray-200 hover:bg-gray-200'}`}
                >
                    {product.isVisible ? <FiEye size={15} /> : <FiEyeOff size={15} />}
                </button>
                <button
                    onClick={() => handleOpenModal(product)}
                    title="Chỉnh sửa"
                    className="p-1.5 rounded-lg text-[#b5624a] bg-[#b5624a]/10 border border-[#b5624a]/20 hover:bg-[#b5624a]/20 transition-all shadow-sm"
                >
                    <FiEdit2 size={15} />
                </button>
                <button
                    onClick={() => handleDelete(product.id)}
                    title="Xóa"
                    className="p-1.5 rounded-lg text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 hover:text-red-700 transition-all shadow-sm"
                >
                    <FiTrash2 size={15} />
                </button>
            </div>
        );
    };

    const CategoryCellRenderer = (product) => {
        return (
            <div className="flex items-center h-full">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 shadow-sm whitespace-nowrap">
                    <FiTag size={12} className="text-[#b5624a]" />
                    {product.categoryName || 'Không có'}
                </span>
            </div>
        );
    };

    // Column Definitions
    const columns = useMemo(() => [
        { 
            headerName: 'Sản Phẩm', 
            field: 'name', 
            flex: 2, 
            minWidth: '320px',
            cellRenderer: ProductCellRenderer
        },
        { 
            headerName: 'Danh Mục', 
            field: 'categoryName', 
            width: '180px',
            cellRenderer: CategoryCellRenderer
        },
        { 
            headerName: 'Kho / Vị trí', 
            field: 'stockQuantity', 
            width: '140px',
            cellRenderer: (p) => (
                <div className="flex flex-col justify-center h-full gap-1">
                    <span className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                        <FiBox size={14} className="text-gray-400" /> Tồn: {p.stockQuantity}
                    </span>
                    {p.colors && p.colors.length > 0 && (
                        <div className="flex flex-col gap-0.5 mt-0.5">
                            {p.colors.map((c, idx) => (
                                <span key={idx} className="text-[10px] font-bold text-gray-600 flex items-center gap-1.5 whitespace-nowrap">
                                    <span className="w-2 h-2 rounded-full border border-gray-200" style={{ backgroundColor: c.hexColor || '#ccc' }}></span>
                                    {c.name}: {c.stockQuantity}
                                </span>
                            ))}
                        </div>
                    )}
                    {p.defectQuantity > 0 && (
                        <span className="text-[11px] font-bold text-orange-600 flex items-center gap-1 mt-0.5">
                            <FiAlertCircle size={12} /> Lỗi: {p.defectQuantity}
                        </span>
                    )}
                    {p.locationBin && (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                            Vị trí: {p.locationBin}
                        </span>
                    )}
                </div>
            )
        },
        { 
            headerName: 'Giá Bán', 
            field: 'price', 
            width: '140px',
            cellRenderer: PriceCellRenderer
        },
        { 
            headerName: 'Tags', 
            field: 'tags', 
            flex: 1,
            minWidth: '160px',
            cellRenderer: TagsCellRenderer
        },
        { 
            headerName: 'Trạng Thái', 
            field: 'inStock', 
            width: '130px',
            cellRenderer: StatusCellRenderer
        },
        { 
            headerName: 'Thao Tác', 
            width: '140px',
            cellRenderer: ActionsCellRenderer,
            headerClassName: 'justify-end pr-6',
            cellClassName: 'pr-2'
        }
    ], [handleToggleVisibility, handleOpenModal, handleDelete, formatCurrency]);

    return (
        <DataTable 
            columns={columns}
            data={products}
            loading={loading}
            rowClassName={(row) => (!row.isVisible ? 'bg-gray-50/50' : '')}
        />
    );
}
