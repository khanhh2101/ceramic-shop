import { useState } from 'react';
import Header from '@/components/Layout/components/Header';
import Home from '@/pages/Home';
import Footer from '@/components/Layout/components/Footer';
import Newsletter from '@/components/Layout/components/Newsletter';
import CartSidebar from '@/pages/CartSidebar';

function DefaultLayout({ children }) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.qty,
        0,
    );
    return (
        <div>
            <Header onCartClick={() => setIsCartOpen(true)} />
            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                cartTotal={cartTotal}
            />
            <div className="container">
                <div className="content">{children}</div>
                <Newsletter />
                <Footer />
            </div>
        </div>
    );
}

export default DefaultLayout;
