import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SupportSidebar from './components/SupportSidebar';
import SupportContent from './components/SupportContent';

export default function SupportPage() {
    const { tab } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(tab || 'shipping');

    useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        }
    }, [tab]);

    useEffect(() => {
        document.title = "Hỗ Trợ Khách Hàng - Gốm Nâu";
    }, []);

    const handleTabChange = (id) => {
        setActiveTab(id);
        navigate(`/support/${id}`);
    };

    return (
        <div className="bg-[#faf7f4] min-h-screen pb-20">
            {/* HERO BANNER */}
            <div className="bg-[#433732] pt-24 pb-16 text-center text-white px-5 border-b-4 border-[#b5624a]">
                <h1 className="text-[36px] md:text-[48px] font-display mb-4">Hỗ Trợ Khách Hàng</h1>
                <p className="text-[15px] text-[#d3c8b7] font-light max-w-[600px] mx-auto">
                    Mọi thông tin về chính sách, bảo mật và các câu hỏi thường gặp khi mua sắm tại Gốm Nâu.
                </p>
            </div>

            <div className="max-w-[1200px] mx-auto px-5 md:px-10 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-3">
                        <SupportSidebar activeTab={activeTab} handleTabChange={handleTabChange} />
                    </div>
                    <div className="lg:col-span-9">
                        <SupportContent activeTab={activeTab} />
                    </div>
                </div>
            </div>
        </div>
    );
}
