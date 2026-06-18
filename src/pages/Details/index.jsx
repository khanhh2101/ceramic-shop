import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './Details.css';

function Details() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:23828/api/v1/products/id/${id}`)
            .then((res) => res.json())
            .then((result) => {
                if (!result.success) {
                    setError('fail getting details data');
                    setLoading(false);
                    return;
                }

                setProduct(result.data);
                setSelectedImage(result.data.primaryImageUrl);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleQuantity = (type) => {
        if (type === 'decrease' && quantity > 1) setQuantity(quantity - 1);
        if (type === 'increase') setQuantity(quantity + 1);
    };

    if (loading) return <div className="pd-loading">Đang tải...</div>;
    if (error) return <div className="pd-error">Lỗi: {error}</div>;
    if (!product) return null;

    return (
        <div className="product-detail">
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
            {/* // - Detail Grid - */}
            <div className="detail-grid">
                {/* - Image -  */}
                <div className="detail-image">
                    <div className="detail-main-image">
                        <img src={selectedImage} alt={product.name} />
                    </div>
                </div>
                {/* - Information -  */}
                <div className="detail-info">
                    {/* - Product name -  */}
                    <h2 className="detail-name">{product.name}</h2>
                    <div className="detail-meta">
                        <div className="detail-rating">
                            <div className="detail-stars">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <span
                                        key={i}
                                        className={
                                            i < Math.floor(product.rating)
                                                ? 'star active'
                                                : 'star'
                                        }
                                    >
                                        {' '}
                                        ★
                                    </span>
                                ))}{' '}
                            </div>
                            <span className="detail-reviews">
                                ({product.reviewCount} Đánh giá)
                            </span>
                        </div>
                        <p className="detail-stock">
                            {' '}
                            {product.stockQuantity > 0
                                ? '● Còn hàng'
                                : '● Hết hàng'}
                        </p>
                    </div>

                    {/* - Price -  */}
                    <div className="detail-price">
                        <span className="detail-price-new">
                            {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(product.price)}
                        </span>
                    </div>

                    {/* - Quanlity & Add to cart -  */}

                    <div className="detail-quantity">
                        <span
                            style={{
                                fontSize: '12px',
                                letterSpacing: '1px',
                                width: 'max-content',
                            }}
                        >
                            {' '}
                            Số lượng{' '}
                        </span>
                        <div className="detail-btn-quantity">
                            <button onClick={() => handleQuantity('decrease')}>
                                -
                            </button>
                            <span>{quantity}</span>
                            <button onClick={() => handleQuantity('increase')}>
                                +
                            </button>
                        </div>
                    </div>

                    <div className="detail-action">
                        <button
                            className="detail-btn-cart"
                            disabled={product.stockQuantity === 0}
                        >
                            {product.stockQuantity > 0
                                ? 'Thêm vào giỏ'
                                : 'Hết hàng'}
                        </button>
                        <button className="detail-btn-wish">♡</button>
                    </div>

                    {/* - Tab -  */}
                    <div className="detail-tabs">
                        <div className="detail-tabs-header">
                            {['description', 'dimensions', 'reviews'].map(
                                (tab) => (
                                    <button
                                        key={tab}
                                        className={`detail-tab-btn ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab === 'description'
                                            ? 'Mô tả'
                                            : tab === 'dimensions'
                                              ? 'Kích thước'
                                              : 'Đánh giá'}
                                    </button>
                                ),
                            )}
                        </div>
                        <div className="detail-tab_content">
                            {activeTab === 'description' && (
                                <p>{product.description}</p>
                            )}
                            {activeTab === 'dimensions' && (
                                <p>{product.dimensions}</p>
                            )}
                            {activeTab === 'reviews' && (
                                <p>{product.dimensions}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* ── SIMILAR ITEMS ── */}
            {/* <div className="detail-similar">
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
            </div> */}
        </div>
    );
}

export default Details;
