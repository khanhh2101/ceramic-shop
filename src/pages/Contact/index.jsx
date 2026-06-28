import './ContactStyle.css';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import { useSiteSettings } from '../../hooks/useSiteSettings';

function Contact() {
    const { settings } = useSiteSettings();
    const socialLinks = [
        { href: settings.social_facebook || '#', icon: <FaFacebookF /> },
        { href: settings.social_instagram || '#', icon: <FaInstagram /> },
        { href: settings.social_youtube || '#', icon: <FaTiktok /> },
    ].filter(s => s.href && s.href !== '#');

    return (
        <div className="contact-page">
            {/* -HERO- */}
            <div className="blog-hero">
                <h1 className="contact-hero__subtitle">Liên hệ</h1>
                <div>
                    <p className="contact-hero__title">Theo dõi Gốm Nâu</p>
                    <div className="social-channels">
                        {socialLinks.map((item, i) => (
                            <a
                                key={i}
                                href={item.href}
                                className="channel-icon"
                            >
                                {item.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            {/* ── HEADER ── */}
            <div className="contact-header">
                <h1 className="contact-header__title">Kết nối với Chúng tôi</h1>
                <p className="contact-header__subtitle">
                    {settings.contact_description || 'Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn'}
                </p>
            </div>

            {/* ── CONTACT INFO ── */}
            <div className="contact-info">
                <div className="contact-info__item">
                    <h4 className="contact-info__label">Hotline CSKH</h4>
                    <p className="contact-info__value">
                        {settings.contact_hotline || settings.store_phone || '0901 234 567'}
                    </p>
                </div>
                <div className="contact-info__item">
                    <h4 className="contact-info__label">EMAIL</h4>
                    <p className="contact-info__value">{settings.contact_support_email || settings.store_email || 'info@ceramicshop.vn'}</p>
                </div>
                <div className="contact-info__item">
                    <h4 className="contact-info__label">Địa chỉ</h4>
                    <p className="contact-info__value">{settings.contact_address || settings.store_address || '123 Đường Gốm Sứ, Quận 1, TP.HCM'}</p>
                </div>
            </div>

            {/* ── MAP IFRAME ── */}
            {settings.contact_map_iframe && (
                <div className="w-full max-w-5xl mx-auto mb-16 overflow-hidden rounded-xl shadow-sm border border-[#eee]" dangerouslySetInnerHTML={{ __html: settings.contact_map_iframe }}>
                </div>
            )}

            {/* ── FORM ── */}
            <div className="contact-form">
                <div className="contact-form__row">
                    <div className="contact-form__group">
                        <label className="contact-form__label">HỌ TÊN</label>
                        <input
                            className="contact-form__input"
                            type="text"
                            placeholder="Nguyễn Văn A"
                        />
                    </div>
                    <div className="contact-form__group">
                        <label className="contact-form__label">EMAIL</label>
                        <input
                            className="contact-form__input"
                            type="email"
                            placeholder="email@example.com"
                        />
                    </div>
                </div>

                <div className="contact-form__row">
                    <div className="contact-form__group">
                        <label className="contact-form__label">
                            ĐIỆN THOẠI
                        </label>
                        <input
                            className="contact-form__input"
                            type="tel"
                            placeholder="(+84) 0912 345 678"
                        />
                    </div>
                    <div className="contact-form__group">
                        <label className="contact-form__label">CÔNG TY</label>
                        <input
                            className="contact-form__input"
                            type="text"
                            placeholder="Tên công ty"
                        />
                    </div>
                </div>

                <div className="contact-form__group">
                    <label className="contact-form__label">TIN NHẮN</label>
                    <textarea
                        className="contact-form__textarea"
                        placeholder="Nhập tin nhắn của bạn..."
                    />
                </div>

                <button className="contact-form__btn">GỬI TIN NHẮN →</button>
            </div>
        </div>
    );
}

export default Contact;
