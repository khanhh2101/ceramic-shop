import { useNavigate } from 'react-router-dom';
import {
    FaFacebookF,
    FaInstagram,
    FaTiktok,
    FaPinterestP,
} from 'react-icons/fa';
import { SiZalo, SiYoutube } from 'react-icons/si';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { useGlobalSettings } from '@/pages/Customer/Home/hooks/useHomeData';

export default function Footer() {
    const navigate = useNavigate();
    const { data: settings = {} } = useGlobalSettings();

    const socialLinks = [
        {
            href: settings.store_facebook || 'https://facebook.com',
            icon: <FaFacebookF />,
            label: 'Facebook',
        },
        {
            href: settings.store_instagram || 'https://instagram.com',
            icon: <FaInstagram />,
            label: 'Instagram',
        },
        {
            href: settings.store_zalo || 'https://zalo.me',
            icon: <SiZalo />,
            label: 'Zalo',
        },
        {
            href: settings.store_youtube || 'https://youtube.com',
            icon: <SiYoutube />,
            label: 'YouTube',
        },
    ].filter(
        (item) =>
            (item.href &&
                item.href !== 'https://facebook.com' &&
                item.href !== 'https://instagram.com' &&
                item.href !== 'https://zalo.me' &&
                item.href !== 'https://youtube.com') ||
            settings.store_facebook,
    ); // simple check to hide empty ones

    // Better filter:
    const activeSocials = [];
    if (settings.social_facebook || settings.store_facebook)
        activeSocials.push({
            href: settings.social_facebook || settings.store_facebook,
            icon: <FaFacebookF />,
            label: 'Facebook',
        });
    if (settings.social_instagram || settings.store_instagram)
        activeSocials.push({
            href: settings.social_instagram || settings.store_instagram,
            icon: <FaInstagram />,
            label: 'Instagram',
        });
    if (settings.social_zalo || settings.store_zalo)
        activeSocials.push({
            href: settings.social_zalo || settings.store_zalo,
            icon: <SiZalo />,
            label: 'Zalo',
        });
    if (settings.social_youtube || settings.store_youtube)
        activeSocials.push({
            href: settings.social_youtube || settings.store_youtube,
            icon: <SiYoutube />,
            label: 'YouTube',
        });
    if (activeSocials.length === 0) {
        // Fallback
        activeSocials.push({
            href: 'https://facebook.com',
            icon: <FaFacebookF />,
            label: 'Facebook',
        });
        activeSocials.push({
            href: 'https://instagram.com',
            icon: <FaInstagram />,
            label: 'Instagram',
        });
    }

    const filterShop = (category) => {
        navigate('/shop');
    };

    return (
        <footer className="bg-[#433732] text-white pt-20 pb-10 border-t-4 border-[#b5624a]">
            <div className="max-w-[1200px] mx-auto px-5 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Cột 1: Brand Info & Social (Chiếm 4 cột) */}
                    <div className="lg:col-span-4 pr-0 lg:pr-8">
                        <div
                            className="text-[32px] mb-6 text-[#f5ebe0] cursor-pointer font-display drop-shadow-sm hover:text-white transition-colors"
                            onClick={() => navigate('/')}
                        >
                            {settings.store_name || 'Champa Clay'}
                        </div>
                        <p className="text-[14px] leading-[1.8] mb-8 text-[#aaa] font-light">
                            {settings.footer_about ||
                                'Chúng tôi tin rằng mỗi món đồ gốm đều mang trong mình một linh hồn. Champa Clay mang đến đồ gốm mộc mạc thủ công chất lượng cao, lưu giữ vẻ đẹp của Đất Mẹ và bàn tay nghệ nhân Việt.'}
                        </p>

                        <div>
                            <h4 className="text-white mb-4 text-[13px] uppercase tracking-[2px] font-bold">
                                Kết Nối Với Chúng Tôi
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {activeSocials.map((item, i) => (
                                    <a
                                        key={i}
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={item.label}
                                        className="w-10 h-10 rounded-full bg-white/10 border border-white/20
                                                   flex items-center justify-center text-white
                                                   transition-all duration-300 hover:bg-[#b5624a] hover:border-[#b5624a] hover:-translate-y-1 shadow-sm"
                                    >
                                        {item.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cột 2: Khám Phá (Chiếm 2 cột) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white mb-6 text-[15px] font-display text-[18px]">
                            Khám Phá
                        </h4>
                        <ul className="flex flex-col gap-4 list-none">
                            <li>
                                <button
                                    onClick={() => navigate('/about')}
                                    className="text-[#aaa] text-[14px] hover:text-[#b5624a] transition-colors duration-300 font-light flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-[#b5624a] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{' '}
                                    Về Champa Clay
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/shop')}
                                    className="text-[#aaa] text-[14px] hover:text-[#b5624a] transition-colors duration-300 font-light flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-[#b5624a] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{' '}
                                    Cửa Hàng
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/blog')}
                                    className="text-[#aaa] text-[14px] hover:text-[#b5624a] transition-colors duration-300 font-light flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-[#b5624a] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{' '}
                                    Tạp Chí Gốm
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="text-[#aaa] text-[14px] hover:text-[#b5624a] transition-colors duration-300 font-light flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-[#b5624a] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{' '}
                                    Liên Hệ
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ Trợ Khách Hàng (Chiếm 3 cột) */}
                    <div className="lg:col-span-3">
                        <h4 className="text-white mb-6 text-[15px] font-display text-[18px]">
                            Hỗ Trợ Khách Hàng
                        </h4>
                        <ul className="flex flex-col gap-4 list-none">
                            <li>
                                <button
                                    onClick={() =>
                                        navigate('/support/shipping')
                                    }
                                    className="text-[#aaa] text-[14px] hover:text-[#b5624a] transition-colors duration-300 font-light flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-[#b5624a] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{' '}
                                    Chính Sách Giao Hàng
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/support/returns')}
                                    className="text-[#aaa] text-[14px] hover:text-[#b5624a] transition-colors duration-300 font-light flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-[#b5624a] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{' '}
                                    Chính Sách Đổi Trả
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/support/care')}
                                    className="text-[#aaa] text-[14px] hover:text-[#b5624a] transition-colors duration-300 font-light flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-[#b5624a] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{' '}
                                    Hướng Dẫn Bảo Quản
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/support/faq')}
                                    className="text-[#aaa] text-[14px] hover:text-[#b5624a] transition-colors duration-300 font-light flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-[#b5624a] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{' '}
                                    Câu Hỏi Thường Gặp (FAQ)
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 4: Thông Tin Liên Hệ (Chiếm 3 cột) */}
                    <div className="lg:col-span-3">
                        <h4 className="text-white mb-6 text-[15px] font-display text-[18px]">
                            Thông Tin Liên Hệ
                        </h4>
                        <div className="flex flex-col gap-5">
                            <div className="flex items-start gap-3">
                                <FiMapPin
                                    className="text-[#b5624a] mt-1 shrink-0"
                                    size={18}
                                />
                                <p className="text-[#aaa] text-[14px] leading-[1.6] font-light">
                                    {settings.contact_address ||
                                        settings.store_address ||
                                        '123 Đường Gốm Sứ, Phường Nghệ Thuật, Quận 1, TP. Hồ Chí Minh'}
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <FiPhone
                                    className="text-[#b5624a] mt-1 shrink-0"
                                    size={18}
                                />
                                <div>
                                    <p className="text-[#aaa] text-[14px] leading-[1.6] font-light">
                                        {settings.contact_hotline ||
                                            settings.store_phone ||
                                            '0987 654 321'}
                                    </p>
                                    <p className="text-[#aaa] text-[12px] opacity-70 mt-1">
                                        (T2 - CN: 08:00 - 21:00)
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FiMail
                                    className="text-[#b5624a] mt-1 shrink-0"
                                    size={18}
                                />
                                <p className="text-[#aaa] text-[14px] leading-[1.6] font-light">
                                    {settings.contact_support_email ||
                                        settings.store_email ||
                                        'hello@gomnau.vn'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[#888] text-[13px] gap-4">
                    <span>
                        {settings.footer_copyright ||
                            `© ${new Date().getFullYear()} Champa Clay Shop. All Rights Reserved.`}
                    </span>
                    <div className="flex gap-6">
                        <button
                            onClick={() => navigate('/support/terms')}
                            className="hover:text-[#b5624a] transition-colors duration-300"
                        >
                            Điều Khoản Dịch Vụ
                        </button>
                        <button
                            onClick={() => navigate('/support/privacy')}
                            className="hover:text-[#b5624a] transition-colors duration-300"
                        >
                            Chính Sách Bảo Mật
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
