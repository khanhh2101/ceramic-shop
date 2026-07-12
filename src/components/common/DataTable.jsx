import React from 'react';
import EmptyState from './EmptyState';

export default function DataTable({ 
    columns, 
    data, 
    keyExtractor = (item) => item.id, 
    loading, 
    emptyMessage = "Không tìm thấy dữ liệu", 
    rowClassName = () => '',
    wrapperClassName = "flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden max-h-[calc(100vh-180px)]"
}) {
    return (
        <div className={wrapperClassName}>
            {/* HEADER */}
            <div className="flex items-center py-3 px-6 bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0 min-w-max">
                {columns.map((col, idx) => (
                    <div 
                        key={`header-${idx}`} 
                        className={`shrink-0 ${col.headerClassName || ''}`}
                        style={{ width: col.width, flex: col.flex, minWidth: col.minWidth }}
                    >
                        {col.headerName}
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64 flex-1">
                    <div className="w-8 h-8 border-4 border-[#b5624a]/30 border-t-[#b5624a] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex-1 overflow-auto custom-scrollbar">
                    {data?.length > 0 ? (
                        <div className="flex flex-col divide-y divide-gray-100 min-w-max">
                            {data.map((row, rowIndex) => (
                                <div 
                                    key={keyExtractor(row, rowIndex)} 
                                    className={`flex items-center py-4 px-6 hover:bg-gray-50/50 transition-colors group ${rowClassName(row)}`}
                                >
                                    {columns.map((col, idx) => (
                                        <div 
                                            key={`cell-${idx}`} 
                                            className={`shrink-0 pr-4 ${col.cellClassName || ''}`}
                                            style={{ width: col.width, flex: col.flex, minWidth: col.minWidth }}
                                        >
                                            {col.cellRenderer ? col.cellRenderer(row) : row[col.field]}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState 
                            title={emptyMessage} 
                            description="Bạn có thể thêm dữ liệu mới hoặc thay đổi bộ lọc tìm kiếm."
                        />
                    )}
                </div>
            )}
        </div>
    );
}
