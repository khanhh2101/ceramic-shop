import { useEffect, useState } from 'react';
import './HomeStyle.css';

function Home() {
    const categories = [
        {
            image: '/assets/image/home/categories1.jpg',
            name: 'Ceramic Vase',
        },
        {
            image: '/assets/image/home/categories2.jpg',
            name: 'Ceramic Planter',
        },
        {
            image: '/assets/image/home/categories3.jpg',
            name: 'Ceramic Tiles',
        },
        {
            image: '/assets/image/home/categories4.jpg',
            name: 'Home Decor',
        },
        {
            image: '/assets/image/home/categories5.jpg',
            name: 'Kitchenware',
        },
    ];

    const testimonials = [
        {
            name: 'Jenny Wilson',
            role: 'Product Designer',
            avatar: '/assets/image/avatars/av1.jpg',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
        },
        {
            name: 'Devon Lane',
            role: 'CEO, Company',
            avatar: '/assets/image/avatars/av2.jpg',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
        },
    ];

    const brands = ['CERIM', 'AZTECA', 'RAGNO', 'VENUS'];

    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     fetch('http://localhost:5000/api/products/bestseller')
    //         .then((res) => {
    //             if (!res.ok) throw new Error('Error when loading data');
    //             return res.json();
    //         })
    //         .then((data) => {
    //             setBestSellers(data);
    //             setLoading(false);
    //         })
    //         .catch((err) => {
    //             setError(err.message);
    //             setLoading(false);
    //         });
    // }, []);

    // if (loading) return <div className="bs-loading">Loading...</div>;
    // if (error) return <div className="bs-error">Error: {error}</div>;

    const [blog, setBlog] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    // useEffect(() => {
    //     fetch('http://localhost:5000/api/blogs/latest')
    //         .then(res => {
    //             if (!res.ok) throw new Error('Lỗi khi tải dữ liệu');
    //             return res.json();
    //         })
    //         .then(data => {
    //             setBlog(data[0]); // ← lấy bài viết đầu tiên
    //             setLoading(false);
    //         })
    //         .catch(err => {
    //             setError(err.message);
    //             setLoading(false);
    //         });
    // }, []);

    // if (loading) return <div>Đang tải...</div>;
    // if (error) return <div>Lỗi: {error}</div>;
    // if (!blog) return null;

    return (
        <div className="home-page">
            {/* ── HERO ── */}
            <div className="home-hero">
                <img
                    className="home-hero-bg"
                    src="/assets/image/home/home.png"
                    alt="hero background"
                />
                <div className="home-hero__overlay" />

                <div className="home-hero-content">
                    <h1 className="home-hero__title">
                        Feel it. Feel the Uniqueness.
                    </h1>
                    <p className="home-hero__subtitle">
                        fulfillment of the highest quality that we are proud to
                        offer our customers.
                    </p>
                    <button className="btn-dark">Shopping</button>
                </div>
            </div>

            {/* ── CATEGORIES ── */}
            <div className="home-categories">
                <h2 className="home-categories__title">Danh mục</h2>

                <div className="home-categories__scroll">
                    {categories.map((cat, index) => (
                        <div key={index} className="home-cat-card">
                            <div className="home-cat-card__image">
                                <img src={cat.image} alt={cat.name} />
                            </div>
                            <p className="home-cat-card__name">{cat.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── PROMO BANNER ── */}
            <div className="promo-banner">
                <div className="promo-left">
                    <div className="promo-tag">Khuyến mãi đặc biệt</div>
                    <h2 className="promo-title">
                        GIẢM ĐẾN 40%
                        <br />
                        BỘ SƯU TẬP CHẬU TRỒNG CÂY
                    </h2>
                    <p className="promo-desc">
                        Ưu đãi có hạn cho bộ sưu tập chậu trồng cây, bền bỉ,
                        thẩm mĩ, thông thoát và không gây úng cây.
                    </p>
                    <button className="btn btn-dark" onclick="navigate('shop')">
                        MUA NGAY →
                    </button>
                </div>
                <div className="promo-right">
                    <div class="promo-image">
                        <img src="./assets/image/home/promo.jpg" />
                    </div>
                </div>
            </div>

            {/* ── PRODUCTS ── */}
            <div className="home-products">
                <h2 className="home-best-seller">Sản phẩm bán chạy</h2>
                <div className="home-products__grid">
                    {bestSellers.map((prod, index) => (
                        <div key={index} className="home-prod-card">
                            <div className="home-prod-card__image">
                                <img src={prod.image} alt={prod.date} />
                            </div>
                            <p className="home-prod-card__date">{prod.date}</p>
                            <p className="home-prod-card__price">
                                {prod.price}
                            </p>
                            <button className="home-prod-card__btn">
                                THÊM VÀO GIỎ
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── TESTIMONIALS ── */}
            <div className="home-testimonials">
                <h2 className="home-testimonials__title">
                    Đánh giá từ Khách hàng
                </h2>
                <div className="home-testimonials__grid">
                    {testimonials.map((t, index) => (
                        <div key={index} className="home-testimonial-card">
                            <p className="home-testimonial-card__text">
                                "{t.text}"
                            </p>
                            <div className="home-testimonial-card__author">
                                <img src={t.avatar} alt={t.name} />
                                <div>
                                    <h4>{t.name}</h4>
                                    <p>{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── BLOG ── */}

            <div className="home-blog">
                <h2 className="home-blog__title">Blog</h2>
                <div className="home-blog__featured">
                    <div className="home-blog__featured-content">
                        {/* <p className="home-blog__meta">{blog.author}</p>
                        <h3 className="home-blog__featured-title">
                            {blog.title}
                        </h3>
                        <p className="home-blog__featured-desc">
                            {blog.description}
                        </p>
                        <a className="home-blog__read-more" href="#">
                            READ MORE
                        </a> */}
                    </div>
                    <div className="home-blog__featured-image">
                        {/* <img src={blog.imageUrl} alt={blog.title} /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
