import React from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaPinterestP, FaTiktok } from 'react-icons/fa';
import { SiZalo, SiYoutube } from 'react-icons/si';
import { useGlobalSettings } from '@/pages/Customer/Home/hooks/useHomeData';

export default function ContactInfo() {
    const { data: settings = {} } = useGlobalSettings();

    const activeSocials = [];
    if (settings.social_facebook || settings.store_facebook) activeSocials.push({ href: settings.social_facebook || settings.store_facebook, icon: <FaFacebookF size={20} />, className: 'fb', label: 'Facebook' });
    if (settings.social_instagram || settings.store_instagram) activeSocials.push({ href: settings.social_instagram || settings.store_instagram, icon: <FaInstagram size={22} />, className: 'ig', label: 'Instagram' });
    if (settings.social_zalo || settings.store_zalo) activeSocials.push({ href: settings.social_zalo || settings.store_zalo, icon: <SiZalo size={24} />, className: 'zl', label: 'Zalo' });
    if (settings.social_youtube || settings.store_youtube) activeSocials.push({ href: settings.social_youtube || settings.store_youtube, icon: <SiYoutube size={24} />, className: 'yt', label: 'YouTube' });
    
    if (activeSocials.length === 0) {
        // Fallback
        activeSocials.push({ href: 'https://facebook.com', icon: <FaFacebookF size={20} />, className: 'fb', label: 'Facebook' });
        activeSocials.push({ href: 'https://instagram.com', icon: <FaInstagram size={22} />, className: 'ig', label: 'Instagram' });
        activeSocials.push({ href: 'https://zalo.me', icon: <SiZalo size={24} />, className: 'zl', label: 'Zalo' });
    }
    return (
        <div className="contact-left-col">
            {/* Thông Tin */}
            <div className="contact-card">
                <h2 className="contact-card-title">Thông Tin Cửa Hàng</h2>
                
                <div className="contact-info-list">
                    <div className="contact-info-item">
                        <div className="contact-info-icon">
                            <FiMapPin size={22} />
                        </div>
                        <div>
                            <h3 className="contact-info-label">Địa chỉ</h3>
                            <p className="contact-info-text">
                                {settings.contact_address || settings.store_address || (
                                    <>
                                        123 Đường Gốm Sứ, Phường Nghệ Thuật<br />
                                        Quận 1, TP. Hồ Chí Minh
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                    
                    <div className="contact-info-item">
                        <div className="contact-info-icon">
                            <FiPhone size={22} />
                        </div>
                        <div>
                            <h3 className="contact-info-label">Điện thoại</h3>
                            <p className="contact-info-text">
                                {settings.contact_hotline || settings.store_phone || '0987 654 321'}<br />
                                T2 - CN: 08:00 - 21:00
                            </p>
                        </div>
                    </div>

                    <div className="contact-info-item">
                        <div className="contact-info-icon">
                            <FiMail size={22} />
                        </div>
                        <div>
                            <h3 className="contact-info-label">Email</h3>
                            <p className="contact-info-text">
                                {settings.contact_support_email || settings.store_email || 'hello@gomnau.vn'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mạng Xã Hội */}
            <div className="contact-card">
                <h2 className="contact-card-title">Kết Nối Với Chúng Tôi</h2>
                <p className="contact-socials-desc">
                    Theo dõi Gốm Nâu trên các nền tảng mạng xã hội để cập nhật những bộ sưu tập và câu chuyện mới nhất mỗi ngày.
                </p>
                
                <div className="contact-social-flex">
                    {activeSocials.map((item, idx) => (
                        <a key={idx} href={item.href} target="_blank" rel="noreferrer" className={`contact-social-icon ${item.className}`} aria-label={item.label}>
                            {item.icon}
                        </a>
                    ))}
                </div>
            </div>

            {/* Bản Đồ (Google Map) */}
            <div className="contact-card">
                <h2 className="contact-map-title">Bản Đồ Chỉ Đường</h2>
                <div className="contact-map-wrapper">
                    <iframe 
                        src={settings.contact_map_iframe || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4996.1546952984045!2d108.92442660030413!3d11.529083818088557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3170d115a7d3983d%3A0xff89f3dd865302e4!2zTMOgbmcgR-G7kW0gQsOgdSBUcsO6Yw!5e0!3m2!1svi!2s!4v1782126765923!5m2!1svi!2s"} 
                        className="contact-map-iframe" 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Map Làng Gốm Bàu Trúc"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
