import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import './ShopDetails.css';

function ShopDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedImage, setSelectedImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('details');

    // ── MOCK DATA (thay bằng API sau) ──
    const mockProduct = {
        id: 1,
        name: 'Marin White Dinner Plate',
        price: 35,
        oldPrice: 50,
        rating: 4.5,
        reviews: 1256,
        stock: 'In stock',
        description:
            'Đĩa ăn phong cách Địa Trung Hải, men xanh biển đặc trưng tạo nét riêng độc đáo.',
        dimensions:
            'Đường kính: 27cm | Chiều cao: 3cm | Chất liệu: Gốm sứ cao cấp',
        colors: ['white', 'black', 'brown'],
        images: '/assets/image/products/prod1.jpg',

        category: 'Dinnerware',
    };

    const socialShare = [
        { href: '#', icon: <FaFacebookF /> },
        { href: '#', icon: <FaInstagram /> },
        { href: '#', icon: <FaTiktok /> },
    ];

    const mockSimilar = [
        {
            id: 2,
            name: 'Porcelain Dinner Plate',
            price: 49,
            image: '/assets/image/products/prod2.jpg',
            description:
                'Lorem ipsum dolor sit amet conse bolli tetur adipiscing elit tortor eu.',
        },
        {
            id: 3,
            name: 'Ophelia Matte Natural Vase',
            price: 70,
            image: '/assets/image/products/prod3.jpg',
            description: 'Lorem ipsum dolor sit amet conse bolli tetur.',
        },
        {
            id: 4,
            name: 'Porcelain Dinner Plate',
            price: 49,
            image: '/assets/image/products/prod4.jpg',
            description:
                'Lorem ipsum dolor sit amet conse bolli tetur adipiscing elit tortor eu.',
        },
        {
            id: 5,
            name: 'Luana Bowl',
            price: 68,
            image: '/assets/image/products/prod5.jpg',
            description: 'Lorem ipsum dolor sit amet conse.',
        },
    ];

    useEffect(() => {
        setLoading(true);

        //  ── SAU NÀY THAY BẰNG API THẬT ──
        // fetch(`http://localhost:5000/api/products/${id}`)
        //     .then(res => res.json())
        //     .then(data => {
        //         setProduct(data);
        //         setSelectedColor(data.colors[0]);
        //         setSelectedImage(data.images[0]);
        //         setLoading(false);
        //     })
        //     .catch(err => {
        //         setError(err.message);
        //         setLoading(false);
        //     });

        // fetch(`http://localhost:5000/api/products/similar/${id}`)
        //     .then(res => res.json())
        //     .then(data => setSimilarProducts(data));

        // DÙNG MOCK DATA TẠM THỜI
        setTimeout(() => {
            setProduct(mockProduct);
            setSimilarProducts(mockSimilar);
            setSelectedColor(mockProduct.colors[0]);
            setSelectedImage(mockProduct.images[0]);
            setLoading(false);
        }, 500);
    }, [id]);

    const handleQuantiy = () => {
        if (type === 'decrease' && quantity > 1) setQuantity(quantity - 1);
        if (type === 'increse') setQuantity(quantity + 1);
    };

    const colorMap = {
        white: '#FFFFFF',
        brown: '#785538ff',
        black: '#2C2C2C',
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={i < Math.floor(rating) ? 'star active' : 'star'}
            >
                ★
            </span>
        ));
    };

    if (loading) return <div className="pd-loading">Đang tải...</div>;
    if (error) return <div className="pd-error">Lỗi: {error}</div>;
    if (!product) return null;

    return (
        <div className="shop-detail">
            {/* ── BREADCRUMB ── */}
            <div className="detail-breadcrumb">
                <span onClick={() => navigate('/')}>Home</span>
                <span className="detail-breadcrumb__separator">/</span>
                <span onClick={() => navigate('/shop')}>Shop</span>
                <span className="detail-breadcrumb__separator">/</span>
                <span className="detail-breadcrumb__current">
                    {product.name}
                </span>
            </div>
            // - Detail Grid -
            <div className="detail-grid">
                {/* - Image -  */}
                <div class="detail-image">
                    <div className="detail-main-image">
                        <img src={selectedImage} alt={product.name} />
                    </div>
                </div>
                {/* - Information -  */}
                <div className="detail-info">
                    {/* - Product name -  */}
                    <h2 className="detail-name">{product.name}</h2>

                    {/* - Rating -  */}
                    <div className="detail-rating">
                        <div className="detail-stars">
                            {renderStars(product.rating)}{' '}
                        </div>
                        <span className="detail-reviews">
                            ({product.reviews} Reviews){' '}
                        </span>
                        <span className="detail-stock">{product.stock}</span>
                    </div>

                    {/* - Price -  */}
                    <div className="detail-price">
                        <span className="detail-price-new">
                            ${product.price}
                        </span>
                        {product.oldPrice && (
                            <span className="detail-price-old">
                                ${product.oldPrice}
                            </span>
                        )}
                    </div>

                    {/* - Color -  */}
                    <div className="detail-color">
                        <p className="detail-color-label">
                            Color: <span>{selectedColor}</span>
                        </p>
                        <div className="detail-color-list">
                            {product.colors.map((color) => (
                                <div
                                    key={color}
                                    className={`detail-color-swatch ${selectedColor === color ? 'active' : ''}`}
                                    onClick={() => setSelectedColor(color)}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>
                    {/* - Quanlity & Add to cart -  */}
                    <div className="detail-actions">
                        <div className="detail-quantity">
                            <button onClick={() => handleQuantity('decrease')}>
                                -
                            </button>
                            <span>{quantity}</span>
                            <button onClick={() => handleQuantity('increase')}>
                                +
                            </button>
                        </div>
                        <button className="detail-btn-cart">Add to cart</button>
                    </div>

                    {/* - Buy now & Wishlist -  */}
                    <div className="detail-action2">
                        <button className="detail-btn-buy">Buy now</button>
                        <button className="detail-btn-wish">♡</button>
                    </div>

                    {/* - Share -  */}
                    <div className="detail-share">
                        <span>Chia sẻ:</span>
                        <div className="detail-share-icons">
                            {socialShare.map((item, i) => (
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

                    {/* - Tab -  */}
                    <div className="detail-tabs">
                        <div className="detail-tabs-header">
                            {['details', 'dimension', 'review'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`detail-tab-btn ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setAcitveTab(tab)}
                                >
                                    {tab === 'details'
                                        ? Detail
                                        : tab === 'dimensions'
                                          ? 'Dimensions'
                                          : 'Reviews'}
                                </button>
                            ))}
                        </div>
                        <div className="detail-tab_content">
                            {activeTab === 'details' && (
                                <p>{product.description}</p>
                            )}
                            {activeTab === 'dimensions' && (
                                <p>{product.dimensions}</p>
                            )}
                            {activeTab === 'reviews' && (
                                <p>
                                    {product.rating}/5 - Dựa trên{' '}
                                    {product.reviews} đánh giá.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* ── SIMILAR ITEMS ── */}
            <div className="detail-similar">
                <h2 className="detail-similar-title">Similar Items</h2>
                <div className="detail-similar-grid">
                    {similarProducts.map((item) => (
                        <div
                            key={item.id}
                            className="detail-similar-card"
                            onClick={() => navigate(`/product/${item.id}`)}
                        >
                            <div className="detail-similar-card-image">
                                <img src={item.image} alt={item.name} />
                            </div>
                            <p className="detail-similar-card-name">
                                {' '}
                                {item.name}
                            </p>
                            <p className="detail-similar-card-price">
                                {' '}
                                {item.price}
                            </p>
                            <p className="detail-similar-card-description">
                                {' '}
                                {item.description}
                            </p>
                            <button className="detail-similar-card-btn">
                                {' '}
                                Add to cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ShopDetails;
