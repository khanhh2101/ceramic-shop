import React from 'react';
import { Table, ConfigProvider } from 'antd';
import { PackageOpen } from 'lucide-react';
import viVN from 'antd/locale/vi_VN';

export default function AntTable({
    columns,
    dataSource,
    rowKey = "id",
    loading = false,
    pagination = false,
    scroll = { x: 'max-content', y: 'calc(100vh - 310px)' },
    emptyMessage = "Không tìm thấy dữ liệu",
    onChange,
    rowSelection
}) {
    // Process columns to automatically set fixed: 'right' for the "Hành Động" column
    const processedColumns = columns.map(col => {
        if (col.title === 'Hành Động' || col.title === 'Hành động' || col.title === 'Thao Tác' || col.key === 'action') {
            return { ...col, fixed: 'right' };
        }
        return col;
    });

    return (
        <ConfigProvider
            locale={viVN}
            theme={{
                token: {
                    colorPrimary: '#b5624a',
                    borderRadius: 6,
                    colorBorderSecondary: '#f3f4f6',
                    colorBgContainer: '#ffffff',
                    fontFamily: 'inherit',
                },
                components: {
                    Table: {
                        headerBg: '#f9fafb',
                        headerColor: '#6b7280',
                        rowHoverBg: '#faf7f4',
                        headerBorderRadius: 8,
                        borderColor: '#f3f4f6',
                    },
                    Pagination: {
                        colorPrimary: '#b5624a',
                        colorPrimaryHover: '#9a513b',
                    }
                },
            }}
        >
            <Table
                columns={processedColumns}
                dataSource={dataSource}
                rowKey={rowKey}
                loading={loading}
                pagination={pagination}
                scroll={scroll}
                onChange={onChange}
                rowSelection={rowSelection}
                locale={{
                    emptyText: (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                            <div className="bg-gray-50 p-4 rounded-full mb-3">
                                <PackageOpen size={32} className="text-gray-400" />
                            </div>
                            <span className="text-sm font-medium">{emptyMessage}</span>
                        </div>
                    )
                }}
            />
        </ConfigProvider>
    );
}
