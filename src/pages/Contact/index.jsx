import './ContactStyle.css';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

function Contact() {
    const socialLinks = [
        { href: '#', icon: <FaFacebookF /> },
        { href: '#', icon: <FaInstagram /> },
        { href: '#', icon: <FaTiktok /> },
    ];
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
                    Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
                </p>
            </div>

            {/* ── CONTACT INFO ── */}
            <div className="contact-info">
                <div className="contact-info__item">
                    <h4 className="contact-info__label">Giờ hoạt động</h4>
                    <p className="contact-info__value">
                        Thứ 2 - Thứ 6: 8:00 AM - 5:00 PM
                    </p>
                </div>
                <div className="contact-info__item">
                    <h4 className="contact-info__label">EMAIL</h4>
                    <p className="contact-info__value">info@ceramicshop.vn</p>
                </div>
                <div className="contact-info__item">
                    <h4 className="contact-info__label">Số điện thoại</h4>
                    <p className="contact-info__value">(+84) 28 1234 5678</p>
                </div>
            </div>

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
