import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import './FooterStyle.css';

function Footer() {
    const navigate = useNavigate();
    const socialLinks = [
        { href: '#', icon: <FaFacebookF /> },
        { href: '#', icon: <FaInstagram /> },
        { href: '#', icon: <FaTiktok /> },
    ];
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div>
                    <div className="footer-brand">Gốm Nâu</div>
                    <p className="footer-desc">
                        Đồ gốm Chăm thủ công chất lượng cao, được chế tác tỉ mỉ
                        bởi các nghệ nhân lành nghề tại làng gốm Bàu Trúc cổ
                        làng.
                    </p>

                    <div className="follow-us">
                        <h4>Theo dõi chúng tôi</h4>
                        <div className="social-links">
                            {socialLinks.map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    className="social-icon"
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                    <button
                        className="footer-contact-btn"
                        onClick={() => navigate('/contact')}
                    >
                        {' '}
                        Liên hệ →
                    </button>
                </div>

                <div className="footer-col">
                    <h4>About Us</h4>
                    <ul>
                        <li>
                            <a onClick={() => navigate('/About')}>Câu chuyện</a>
                        </li>
                        <li>
                            <a onClick={() => navigate('/About')}>
                                Đội ngũ nhân sự
                            </a>
                        </li>
                        <li>
                            <a href="#">Giải thưởng</a>
                        </li>
                        <li>
                            <a href="#">Chính sách riêng tư</a>
                        </li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Sản phẩm</h4>
                    <ul>
                        <li>
                            <a onClick={() => filterShop('Dinnerware')}>
                                Gốm gia dụng
                            </a>
                        </li>
                        <li>
                            <a onClick={() => filterShop('Ceramic')}>
                                Bình hoa
                            </a>
                        </li>
                        <li>
                            <a onClick={() => filterShop('Decor Art')}>
                                Gạch ốp tường
                            </a>
                        </li>
                        <li>
                            <a onClick={() => filterShop('Gifts sets')}>
                                Tượng
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Hỗ trợ</h4>
                    <ul>
                        <li>
                            <a onClick={() => navigate('contact')}>Liên hệ</a>
                        </li>
                        <li>
                            <a href="#">Giao hàng</a>
                        </li>
                        <li>
                            <a href="#">Hoàn hàng</a>
                        </li>
                        <li>
                            <a href="#">FAQ</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© 2025 Gôm Nâu Shop. All Rights Reserved.</span>
                <div className="footer-bottom-links">
                    <a href="#">Điều kiện & Điều khoản</a>
                    <a href="#">Chính sách riêng tư</a>
                </div>
            </div>
        </footer>
    );
}
export default Footer;
