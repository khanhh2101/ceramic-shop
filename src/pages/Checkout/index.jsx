import './CheckoutStyle.css';

function Checkout() {
    const placeOrder = () => {
        // TODO: xử lý đặt hàng
        alert('Đặt hàng thành công!');
    };
    return (
        <div className="checkout-layout">
            <div className="checkout-form">
                <div classNamr="checkout-info">
                    <h2>Billing Details</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Fullname *</label>
                            <input placeholder="Dang Nu Hong Khanh" />
                        </div>
                        <div className="form-group">
                            <label>Email *</label>
                            <input placeholder="email@example.com" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone *</label>
                            <input placeholder="0912 345 678" />
                        </div>
                        <div className="form-group">
                            <label>Thành phố *</label>
                            <input placeholder="Ho Chi Minh City" />
                        </div>
                    </div>
                    <div className="form-group form-group--mb">
                        <label>Address *</label>
                        <input placeholder="22 Nguyen Thi Minh Khai, 3 District" />
                    </div>

                    <div className="form-group form-group--mb2">
                        <label>Note</label>
                        <textarea placeholder="Noting for your order..." />
                    </div>

                    <h2 className="payment-title">Payment</h2>
                    <div className="payment-methods">
                        <label className="payment-item">
                            <input
                                type="radio"
                                name="payment"
                                value="cod"
                                defaultChecked
                            />
                            Cash in Delivery (COD)
                        </label>
                        <label className="payment-item">
                            <input type="radio" name="payment" value="bank" />
                            Bank Transfer
                        </label>
                        <label className="payment-item">
                            <input
                                type="radio"
                                name="payment"
                                value="e-wallet"
                            />
                            E-Walellet (Momo, Apple Pay)
                        </label>
                        <label className="payment-item">
                            <input type="radio" name="payment" value="card" />
                            Credit Card/Debit Card
                        </label>
                    </div>

                    <button className="order-btn" onClick={placeOrder}>
                        Place Order
                    </button>
                </div>
            </div>
            <div className="checkout-summary">
                <h3>Your Order</h3>
                <div className="checkout-items">
                    {/* sau này map cart vào đây */}
                </div>

                <div className="checkout-totals">
                    <div className="totals-row">
                        <span>Subtotal</span>
                        <span>$0</span>
                    </div>
                    <div className="totals-row">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="totals-grand">
                        <span>Total</span>
                        <span className="totals-grand__price">$0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
