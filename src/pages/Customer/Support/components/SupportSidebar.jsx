import React from 'react';
import { FiTruck, FiRefreshCw, FiDroplet, FiHelpCircle, FiShield, FiFileText } from 'react-icons/fi';

const tabs = [
    { id: 'shipping', label: 'Chính Sách Giao Hàng', icon: <FiTruck /> },
    { id: 'returns', label: 'Chính Sách Đổi Trả', icon: <FiRefreshCw /> },
    { id: 'care', label: 'Hướng Dẫn Bảo Quản', icon: <FiDroplet /> },
    { id: 'faq', label: 'Câu Hỏi Thường Gặp', icon: <FiHelpCircle /> },
    { id: 'privacy', label: 'Chính Sách Bảo Mật', icon: <FiShield /> },
    { id: 'terms', label: 'Điều Khoản Dịch Vụ', icon: <FiFileText /> },
];

export default function SupportSidebar({ activeTab, handleTabChange }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#eee] p-4 sticky top-24">
            <ul className="flex flex-col">
                {tabs.map((t) => (
                    <li key={t.id}>
                        <button
                            onClick={() => handleTabChange(t.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all ${
                                activeTab === t.id 
                                    ? 'bg-[#f5ebe0] text-[#b5624a]' 
                                    : 'text-[#555] hover:bg-[#faf7f4] hover:text-[#1a1a1a]'
                            }`}
                        >
                            <span className={`text-[18px] ${activeTab === t.id ? 'text-[#b5624a]' : 'text-[#888]'}`}>
                                {t.icon}
                            </span>
                            {t.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
