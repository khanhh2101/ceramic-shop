import React from 'react';
import { useGlobalSettings } from '@/pages/Customer/Home/hooks/useHomeData';

const TITLES = {
    shipping: "Chính Sách Giao Hàng",
    returns: "Chính Sách Đổi Trả",
    care: "Hướng Dẫn Bảo Quản",
    faq: "Câu Hỏi Thường Gặp (FAQ)",
    privacy: "Chính Sách Bảo Mật",
    terms: "Điều Khoản Dịch Vụ"
};

const DB_KEYS = {
    shipping: "policy_shipping",
    returns: "policy_returns",
    care: "policy_care",
    faq: "policy_faq",
    privacy: "policy_privacy",
    terms: "policy_terms"
};

export default function SupportContent({ activeTab }) {
    const { data: settings = {}, isLoading } = useGlobalSettings();

    if (isLoading) {
        return (
            <div className="bg-white rounded-3xl shadow-sm border border-[#eee] p-8 md:p-12 min-h-[600px] flex items-center justify-center">
                <div className="text-[#888]">Đang tải nội dung...</div>
            </div>
        );
    }

    const title = TITLES[activeTab] || "Hỗ Trợ";
    const contentKey = DB_KEYS[activeTab];
    const htmlContent = contentKey ? settings[contentKey] : null;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-[#eee] p-8 md:p-12 min-h-[600px]">
            <div className="animate-fade-in text-[#333]">
                <h2 className="text-[28px] text-[#1a1a1a] font-display mb-6 border-b border-[#eee] pb-4">
                    {title}
                </h2>
                
                {htmlContent ? (
                    <div 
                        className="support-dynamic-content text-[15px] leading-[1.8] font-light space-y-4"
                        dangerouslySetInnerHTML={{ __html: htmlContent }} 
                    />
                ) : (
                    <div className="text-[15px] leading-[1.8] font-light text-[#888]">
                        <p>Nội dung đang được cập nhật...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
