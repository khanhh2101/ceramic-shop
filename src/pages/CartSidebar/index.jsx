import './CartSidebarStyle.css';
import { useNavigate } from 'react-router-dom';

function CartSidebar({ isOpen, onClose, cartItems, cartTotal }) {
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose(); // ← đóng sidebar trước
        navigate('/checkout'); // ← sau đó chuyển trang
    };
    return (
        <>
            {/* Overlay */}
            <div
                className={`overlay ${isOpen ? 'show' : ''}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`cart-sidebar ${isOpen ? 'open' : ''}`}
                id="cartSidebar"
            >
                {/* Header */}
                <div className="cart-sidebar-header">
                    <h3>Giỏ hàng</h3>
                    <button className="close-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* Items */}
                <div className="cart-sidebar-items">
                    {cartItems.length === 0 ? (
                        <p className="cart-empty">Giỏ hàng trống</p>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} className="cart-mini-item">
                                <div className="cart-mini-img">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="cart-mini-info">
                                    <h4>{item.name}</h4>
                                    <p>
                                        ${item.price} × {item.qty}
                                    </p>
                                </div>
                                <button
                                    className="cart-mini-remove"
                                    onClick={() =>
                                        console.log('remove', item.id)
                                    }
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="cart-sidebar-footer">
                    <div className="cart-sidebar-total">
                        <span>Tổng cộng</span>
                        <span>${cartTotal}</span>
                    </div>
                    <button
                        className="cart-sidebar-btn"
                        onClick={handleCheckout}
                    >
                        Thanh toán →
                    </button>
                </div>
            </div>
        </>
    );
}

export default CartSidebar;
