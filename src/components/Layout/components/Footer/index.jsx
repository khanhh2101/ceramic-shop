import { useNavigate } from 'react-router-dom';
import './FooterStyle.css';

function Footer() {
    const navigate = useNavigate();
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div>
                    <div className="footer-brand">⚬ CERAMIC SHOP</div>
                    <p className="footer-desc">
                        Gốm thủ công Việt Nam chất lượng cao, được chế tác tỉ mỉ
                        bởi những nghệ nhân lành nghề tại làng gốm Bát Tràng.
                    </p>
                    <button onClick={() => navigate('/contact')}>
                        {' '}
                        CONTACT US →
                    </button>
                </div>

                <div className="footer-col">
                    <h4>About Us</h4>
                    <ul>
                        <li>
                            <a onClick={() => navigate('about')}>Story</a>
                        </li>
                        <li>
                            <a onClick={() => navigate('about')}>Our Team</a>
                        </li>
                        <li>
                            <a href="#">Awards</a>
                        </li>
                        <li>
                            <a href="#">Privacy Policy</a>
                        </li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Product</h4>
                    <ul>
                        <li>
                            <a onClick={() => filterShop('Dinnerware')}>
                                Tableware
                            </a>
                        </li>
                        <li>
                            <a onClick={() => filterShop('Ceramic')}>Gốm</a>
                        </li>
                        <li>
                            <a onClick={() => filterShop('Decor Art')}>Decor</a>
                        </li>
                        <li>
                            <a onClick={() => filterShop('Gifts sets')}>
                                Gift Sets
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Support</h4>
                    <ul>
                        <li>
                            <a onClick={() => navigate('contact')}>Contact</a>
                        </li>
                        <li>
                            <a href="#">Delivery</a>
                        </li>
                        <li>
                            <a href="#">Return</a>
                        </li>
                        <li>
                            <a href="#">FAQ</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© 2024 Ceramic Shop. All Rights Reserved.</span>
                <div className="footer-bottom-links">
                    <a href="#">Terms & Conditions</a>
                    <a href="#">Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
}
export default Footer;
