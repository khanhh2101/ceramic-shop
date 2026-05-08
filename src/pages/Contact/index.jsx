import './ContactStyle.css';

function Contact() {
    return (
        <div className="contact-page">
            {/* -HERO- */}
            <div className="blog-hero">
                <h1 className="blog-hero__subtitle">Contact Us</h1>
                <p className="blog-hero__title">Follow Us</p>
            </div>
            {/* ── HEADER ── */}
            <div className="contact-header">
                <h1 className="contact-header__title">Connect with Us</h1>
                <p className="contact-header__subtitle">
                    We are always ready to listen and support you
                </p>
            </div>

            {/* ── CONTACT INFO ── */}
            <div className="contact-info">
                <div className="contact-info__item">
                    <h4 className="contact-info__label">WORKING HOURS</h4>
                    <p className="contact-info__value">
                        Monday - Friday: 8:00 AM - 5:00 PM
                    </p>
                </div>
                <div className="contact-info__item">
                    <h4 className="contact-info__label">EMAIL</h4>
                    <p className="contact-info__value">info@ceramicshop.vn</p>
                </div>
                <div className="contact-info__item">
                    <h4 className="contact-info__label">PHONE NUMBER</h4>
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
