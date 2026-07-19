import React from 'react';

export default function StatusBadge({
  status, // boolean | number | string
  type = 'default', // 'active' | 'visibility' | 'order' | 'default'
  textOverrides = {},
}) {
  const getBadgeProps = () => {
    switch (type) {
      case 'active':
        return status
          ? { text: textOverrides.true || 'Đang hoạt động', color: 'bg-green-100 text-green-700' }
          : { text: textOverrides.false || 'Ngừng hoạt động', color: 'bg-red-100 text-red-700' };
      
      case 'visibility':
        // status here means `isHidden`
        const isHidden = status === true || status === 'true';
        return isHidden
          ? { text: textOverrides.true || textOverrides['true'] || 'Đang ẩn', color: 'bg-orange-100 text-orange-700' }
          : { text: textOverrides.false || textOverrides['false'] || 'Hiển thị', color: 'bg-green-100 text-green-700' };

      case 'order':
        // 1: Pending, 2: Processing, 3: Shipped, 4: Delivered, 5: Cancelled
        switch (Number(status)) {
          case 1: return { text: textOverrides[1] || 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700' };
          case 2: return { text: textOverrides[2] || 'Đang xử lý', color: 'bg-blue-100 text-blue-700' };
          case 3: return { text: textOverrides[3] || 'Đang giao', color: 'bg-purple-100 text-purple-700' };
          case 4: return { text: textOverrides[4] || 'Hoàn tất', color: 'bg-green-100 text-green-700' };
          case 5: return { text: textOverrides[5] || 'Đã hủy', color: 'bg-red-100 text-red-700' };
          default: return { text: 'Không xác định', color: 'bg-gray-100 text-gray-700' };
        }

      default:
        return { text: status?.toString() || '', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const { text, color } = getBadgeProps();

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      {text}
    </span>
  );
}
