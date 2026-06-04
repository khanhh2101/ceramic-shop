import './NewsletterStyle.css';

function Newsletter() {
    return (
        <div className="newsletter">
            <div className="newsletter-tag">🏷️</div>
            <h2 className="newsletter-title">
                Đăng ký nhận tin từ Gốm Nâu Champa
            </h2>
            <p className="newsletter-description">
                Theo dõi những bộ sưu tập mới, câu chuyện về nghề gốm Chăm Bàu
                Trúc cùng các ưu đãi dành riêng cho thành viên.
            </p>
            <p className="newsletter-discount">
                Nhận ưu đãi giảm 50.000 VND cho đơn hàng đầu tiên khi đăng ký.
            </p>
            <div className="newsletter-form">
                <input
                    className="newsletter-input"
                    type="email"
                    placeholder="Your Email"
                />
                <button className="newsletter-btn">Subscribe</button>
            </div>
        </div>
    );
}

export default Newsletter;
