import React from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaPinterestP, FaTiktok } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

export default function ContactInfo() {
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
                                123 Đường Gốm Sứ, Phường Nghệ Thuật<br />
                                Quận 1, TP. Hồ Chí Minh
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
                                0987 654 321<br />
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
                                hello@gomnau.vn<br />
                                support@gomnau.vn
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
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="contact-social-icon fb" aria-label="Facebook">
                        <FaFacebookF size={20} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="contact-social-icon ig" aria-label="Instagram">
                        <FaInstagram size={22} />
                    </a>
                    <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="contact-social-icon pi" aria-label="Pinterest">
                        <FaPinterestP size={20} />
                    </a>
                    <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="contact-social-icon tk" aria-label="TikTok">
                        <FaTiktok size={20} />
                    </a>
                    <a href="https://zalo.me" target="_blank" rel="noreferrer" className="contact-social-icon zl" aria-label="Zalo">
                        <SiZalo size={24} />
                    </a>
                </div>
            </div>

            {/* Bản Đồ (Google Map) */}
            <div className="contact-card">
                <h2 className="contact-map-title">Bản Đồ Chỉ Đường</h2>
                <div className="contact-map-wrapper">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4996.1546952984045!2d108.92442660030413!3d11.529083818088557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3170d115a7d3983d%3A0xff89f3dd865302e4!2zTMOgbmcgR-G7kW0gQsOgdSBUcsO6Yw!5e0!3m2!1svi!2s!4v1782126765923!5m2!1svi!2s" 
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
