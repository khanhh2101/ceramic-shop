import React from 'react';

export default function ContactHero({ contactHero }) {
    if (contactHero) {
        return (
            <div className="contact-hero">
                <div className="contact-hero-img-wrapper">
                    <img 
                        src={contactHero.image || "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop"} 
                        alt={contactHero.title}
                        className="contact-hero-img"
                    />
                    <div className="contact-hero-overlay"></div>
                </div>
                <div className="contact-hero-content">
                    <h1 className="contact-hero-title">
                        {contactHero.title}
                    </h1>
                    <p className="contact-hero-desc">
                        {contactHero.description}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="contact-hero">
            <div className="contact-hero-img-wrapper">
                <img 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop" 
                    alt="Contact Banner"
                    className="contact-hero-img"
                />
                <div className="contact-hero-overlay"></div>
            </div>
            <div className="contact-hero-content">
                <h1 className="contact-hero-title">
                    Trò Chuyện Cùng Gốm Nâu
                </h1>
                <p className="contact-hero-desc">
                    Bạn có câu hỏi, ý tưởng hay cần tư vấn? Đừng ngần ngại để lại lời nhắn, chúng tôi luôn sẵn sàng lắng nghe.
                </p>
            </div>
        </div>
    );
}
