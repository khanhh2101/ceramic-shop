import './NewsletterStyle.css';

function Newsletter() {
    return (
        <div className="newsletter">
            <div className="newsletter-tag">🏷️</div>
            <h2 className="newsletter-title">Join Our Newsletter</h2>
            <p className="newsletter-description">
                Join our email subscription now to get updates on promotions and
                coupons.
            </p>
            <p className="newsletter-discount">
                $15 discount get your first order
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
