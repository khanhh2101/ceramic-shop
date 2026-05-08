import './BlogStyle.css';

function Blog() {
    const featuredPost = {
        image: '/assets/image/blogimage/blog1.png',
        author: 'By American Spa Staff',
        date: 'Apr 15, 2024, 2:30am',
        title: 'Blending Art and Functionality in Interface Design',
        description:
            'Crafted from natural clay, ceramic mugs is sustainable and biodegradable. It is a stylish way to reduce environmental impact with minimal energy and chemicals used.',
    };

    const posts = [
        {
            image: '/assets/image/blogimage/blog2.png',
            date: 'February 28, 2024',
            title: 'Blending Art and Functionality in Interface Design',
        },
        {
            image: '/assets/image/blogimage/blog3.png',
            date: 'February 28, 2024',
            title: 'Merging Aesthetics and Usability in Interface Design',
        },
        {
            image: '/assets/image/blogimage/blog4.png',
            date: 'February 28, 2024',
            title: 'How Ceramic Jewelry Blends Art with Functionality',
        },
        {
            image: '/assets/image/blogimage/blog5.png',
            date: 'February 28, 2024',
            title: 'Why Ceramic Jewelry is Making a Comeback',
        },
        {
            image: '/assets/image/blogimage/blog6.png',
            date: 'February 28, 2024',
            title: 'How Ceramic Jewelry Adds a Pop of Personality',
        },
        {
            image: '/assets/image/blogimage/blog7.png',
            date: 'February 28, 2024',
            title: 'The Natural Beauty of Ceramic Accessories',
        },
    ];

    return (
        <div className="blog-page">
            {/* ── HERO ── */}
            <div className="blog-hero">
                <p className="blog-hero__subtitle">News Blog</p>
                <h1 className="blog-hero__title">Latest News</h1>
            </div>

            {/* ── FEATURED POST ── */}
            <div className="blog-featured">
                <div className="blog-featured__image">
                    <img src={featuredPost.image} alt={featuredPost.title} />
                </div>
                <div className="blog-featured__content">
                    <p className="blog-featured__meta">
                        {featuredPost.author} · {featuredPost.date}
                    </p>
                    <h2 className="blog-featured__title">
                        {featuredPost.title}
                    </h2>
                    <p className="blog-featured__description">
                        {featuredPost.description}
                    </p>
                    <a className="blog-read-more" href="#">
                        Read more
                    </a>
                </div>
            </div>

            {/* ── POSTS GRID ── */}
            <div className="blog-grid">
                {posts.map((post, index) => (
                    <div key={index} className="blog-card">
                        <div className="blog-card__image">
                            <img src={post.image} alt={post.title} />
                        </div>
                        <div className="blog-card__content">
                            <p className="blog-card__date">{post.date}</p>
                            <h3 className="blog-card__title">{post.title}</h3>
                            <a className="blog-read-more" href="#">
                                Read more
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Blog;
