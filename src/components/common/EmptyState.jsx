import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EmptyState({ 
  icon: Icon = Inbox, 
  title = "Không có dữ liệu", 
  description = "Hiện tại chưa có dữ liệu nào để hiển thị trong mục này.",
  action,
  className = ""
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px] animate-in fade-in zoom-in-95 duration-300", className)}>
      <div className="w-24 h-24 bg-gray-50/80 rounded-full flex items-center justify-center mb-5 ring-8 ring-gray-50/50">
        <Icon className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
