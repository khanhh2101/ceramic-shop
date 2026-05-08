import './HomeStyle.css';

function Home() {
    const categories = [
        {
            image: '/assets/image/categories/cat1.jpg',
            name: 'Bình Vase',
            price: '$100',
        },
        {
            image: '/assets/image/categories/cat2.jpg',
            name: 'Ripple Vase',
            price: '$110',
        },
        {
            image: '/assets/image/categories/cat3.jpg',
            name: 'Bath Vase',
            price: '$90',
        },
        {
            image: '/assets/image/categories/cat4.jpg',
            name: 'Glass Decor',
            price: '$130',
        },
        {
            image: '/assets/image/categories/cat5.jpg',
            name: 'Glass Bowl',
            price: '$125',
        },
    ];

    const products = [
        {
            image: '/assets/image/products/prod1.jpg',
            date: 'Ractbed & dnors ada',
            price: '€32.99',
            label: 'On Sale',
        },
        {
            image: '/assets/image/products/prod2.jpg',
            date: 'Ractbed & dnors ada',
            price: '€32.99',
            label: 'On Sale',
        },
        {
            image: '/assets/image/products/prod3.jpg',
            date: 'Ractbed & dnors ada',
            price: '€32.99',
            label: 'On Sale',
        },
        {
            image: '/assets/image/products/prod4.jpg',
            date: 'Reactbed & dnors ada',
            price: '€32.99',
            label: 'On Sale',
        },
        {
            image: '/assets/image/products/prod5.jpg',
            date: 'Reactbed & dnors ada',
            price: '€32.99',
            label: 'On Sale',
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

    const blogs = [
        {
            image: '/assets/image/blog/blog1.jpg',
            author: 'By American Spa Staff',
            date: 'Apr 15, 2024',
            title: 'Stoneware hand thrown pottery mugs',
            description:
                'Unique handcrafted designs of stoneware pottery mugs...',
        },
        {
            image: '/assets/image/blog/blog2.jpg',
            author: 'By Rachel Burt',
            date: 'Apr 15, 2024',
            title: 'Handcrafted Stoneware Mugs',
            description:
                'Unique handcrafted designs of stoneware pottery mugs...',
        },
        {
            image: '/assets/image/blog/blog3.jpg',
            author: 'By American Spa Staff',
            date: 'Apr 15, 2024',
            title: 'Limited Edition Handmaking MG',
            description: '',
        },
        {
            image: '/assets/image/blog/blog4.jpg',
            author: '',
            date: 'Apr 15, 2024',
            title: 'MCG Stoneware Mugs Old Design',
            description: '',
        },
        {
            image: '/assets/image/blog/blog5.jpg',
            author: '',
            date: 'Apr 15, 2024',
            title: 'Need Coastal Cup Woman',
            description: '',
        },
        {
            image: '/assets/image/blog/blog6.jpg',
            author: '',
            date: 'Apr 15, 2024',
            title: 'Plan Landscape Adventure',
            description: '',
        },
    ];

    const brands = ['CERIM', 'AZTECA', 'RAGNO', 'VENUS'];

    return (
        <div className="home-page">
            {/* ── HERO ── */}
            <div className="home-hero">
                <div className="home-hero__content">
                    <h1 className="home-hero__title">
                        Feel it. Feel the Uniqueness.
                    </h1>
                    <p className="home-hero__subtitle">
                        fulfillment of the highest quality that we are proud to
                        offer our customers.
                    </p>
                    <button className="btn-dark">Buy Now</button>
                </div>
                <div className="home-hero__image">
                    <img src="/assets/image/hero/hero.png" alt="Hero" />
                </div>
            </div>

            {/* ── TRUSTED BRANDS ── */}
            <div className="home-brands">
                <p className="home-brands__title">They trusted us</p>
                <div className="home-brands__list">
                    {brands.map((brand, index) => (
                        <div key={index} className="home-brands__item">
                            {brand}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── CATEGORIES ── */}
            <div className="home-categories">
                <div className="home-categories__header">
                    <h2 className="home-categories__title">Categories</h2>
                    <p className="home-categories__desc">
                        FCU Filament Made of CLU is mostly the first spun that
                        print and finally checks, second, set up the team
                        assembles you will have every control quality check.
                    </p>
                </div>
                <div className="home-categories__grid">
                    {categories.map((cat, index) => (
                        <div key={index} className="home-cat-card">
                            <div className="home-cat-card__image">
                                <img src={cat.image} alt={cat.name} />
                            </div>
                            <p className="home-cat-card__name">{cat.name}</p>
                            <p className="home-cat-card__price">{cat.price}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── ABOUT US ── */}
            <div className="home-about">
                <h2 className="home-about__title">About Us</h2>
                <p className="home-about__subtitle">
                    FCU Filament Made of CLU is mostly the first spun
                </p>
                <div className="home-about__features">
                    <div className="home-about__feature">
                        <div className="home-about__icon">🚚</div>
                        <h4>EU Shipping</h4>
                        <p>We ship fast and efficiently across Europe.</p>
                    </div>
                    <div className="home-about__feature">
                        <div className="home-about__icon">⭐</div>
                        <h4>High Quality</h4>
                        <p>
                            All our products have the highest quality available.
                        </p>
                    </div>
                    <div className="home-about__feature">
                        <div className="home-about__icon">🛡️</div>
                        <h4>Safety Payment</h4>
                        <p>
                            It is Safe to use MasterCard, Visa, PayPal safely
                            here.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── PROMO BANNER ── */}
            <div className="home-promo">
                <div className="home-promo__content">
                    <h2 className="home-promo__title">
                        We personalize the most beautiful and sustainable
                        products for your brand to shine in real life.
                    </h2>
                    <button className="btn-dark">View all products</button>
                </div>
            </div>

            {/* ── PRODUCTS ── */}
            <div className="home-products">
                <div className="home-products__grid">
                    {products.map((prod, index) => (
                        <div key={index} className="home-prod-card">
                            <div className="home-prod-card__image">
                                <img src={prod.image} alt={prod.date} />
                                <span className="home-prod-card__badge">
                                    {prod.label}
                                </span>
                            </div>
                            <p className="home-prod-card__date">{prod.date}</p>
                            <p className="home-prod-card__price">
                                {prod.price}
                            </p>
                            <button className="home-prod-card__btn">
                                On Sale
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── TESTIMONIALS ── */}
            <div className="home-testimonials">
                <h2 className="home-testimonials__title">
                    What our client say
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
                <h2 className="home-blog__title">See Our Latest Blog & News</h2>
                <div className="home-blog__featured">
                    <div className="home-blog__featured-image">
                        <img src={blogs[0].image} alt={blogs[0].title} />
                    </div>
                    <div className="home-blog__featured-content">
                        <p className="home-blog__meta">
                            {blogs[0].author} · {blogs[0].date}
                        </p>
                        <h3 className="home-blog__featured-title">
                            {blogs[0].title}
                        </h3>
                        <p className="home-blog__featured-desc">
                            {blogs[0].description}
                        </p>
                    </div>
                    <div className="home-blog__featured-image">
                        <img src={blogs[1].image} alt={blogs[1].title} />
                    </div>
                    <div className="home-blog__featured-content">
                        <p className="home-blog__meta">
                            {blogs[1].author} · {blogs[1].date}
                        </p>
                        <h3 className="home-blog__featured-title">
                            {blogs[1].title}
                        </h3>
                        <p className="home-blog__featured-desc">
                            {blogs[1].description}
                        </p>
                    </div>
                </div>
                <div className="home-blog__grid">
                    {blogs.slice(2).map((blog, index) => (
                        <div key={index} className="home-blog-card">
                            <div className="home-blog-card__image">
                                <img src={blog.image} alt={blog.title} />
                            </div>
                            <p className="home-blog-card__date">{blog.date}</p>
                            <h3 className="home-blog-card__title">
                                {blog.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
