import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiClock, FiUser, FiChevronLeft, FiShare2, FiFacebook, FiTwitter, FiLink, FiBookmark } from 'react-icons/fi';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import { useBlogDetails } from '@/pages/Customer/Blog/hooks/useBlogs';
import './Blog.css';

export default function BlogDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { data: article, isLoading: loading } = useBlogDetails(slug);
    
    const blog = article ? {
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.metaDescription,
        content: article.contentHtml,
        thumbnailUrl: article.thumbnailUrl,
        createdAt: article.createdAt,
        author: article.authorName || 'Gốm Nâu',
        category: article.categoryNames?.length > 0 ? article.categoryNames[0] : 'Tạp chí',
        tags: [],
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription
    } : null;

    useEffect(() => {
        window.scrollTo(0, 0);
        if (blog) {
            document.title = `${blog.metaTitle || blog.title} - Gốm Nâu`;
        }
    }, [slug, blog]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Đã sao chép đường dẫn bài viết!');
    };

    if (loading) {
        return (
            <div className="blog-main" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '3rem', height: '3rem', border: '4px solid #b5624a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }}></div>
                <p style={{ color: '#888', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' }}>Đang tải trang tạp chí...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="blog-main" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', color: '#1a1a1a', marginBottom: '1rem' }}>Không tìm thấy bài viết</h2>
                <button onClick={() => navigate('/blog')} style={{ color: '#b5624a', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '2px', fontWeight: 700 }}>
                    ← Quay lại trang Blog
                </button>
            </div>
        );
    }

    const cleanHtml = DOMPurify.sanitize(blog.content, { 
        ADD_TAGS: ['mark', 'iframe'],
        ADD_ATTR: ['style', 'width', 'height', 'target', 'href', 'allowfullscreen'] 
    });

    return (
        <main className="blog-main">
            
            <Helmet>
                <title>{blog.metaTitle || blog.title}</title>
                <meta name="description" content={blog.metaDescription || blog.excerpt} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": blog.title,
                        "image": blog.thumbnailUrl,
                        "author": {
                            "@type": "Person",
                            "name": blog.author
                        },
                        "datePublished": blog.createdAt
                    })}
                </script>
            </Helmet>

            {/* ── HERO BANNER (Full bleed cover) ── */}
            <div className="blog-detail-hero">
                <img 
                    src={blog.thumbnailUrl} 
                    alt={blog.title} 
                    className="blog-hero-img"
                    style={{ opacity: 1, filter: 'none', transition: 'transform 10s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div className="blog-hero-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)' }}></div>
                
                <div className="blog-detail-hero-content" style={{ paddingBottom: '5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link to={`/blog/category/${blog.category.toLowerCase()}`} className="blog-badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.375rem 1rem' }}>
                            {blog.category}
                        </Link>
                    </div>
                    <h1 className="blog-detail-title">
                        {blog.title}
                    </h1>
                    <div className="blog-detail-meta">
                        <span className="blog-detail-meta-item"><FiUser size={16} color="#b5624a" /> {blog.author}</span>
                        <span style={{ width: '4px', height: '4px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '50%' }}></span>
                        <span className="blog-detail-meta-item"><FiClock size={16} color="#b5624a" /> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
            </div>

            {/* ── BREADCRUMB & TOOLBAR ── */}
            <div style={{ backgroundColor: 'white', borderBottom: '1px solid #eee', position: 'sticky', top: '68px', zIndex: 40, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button 
                        onClick={() => navigate('/blog')}
                        className="blog-back"
                        style={{ margin: 0, color: '#888' }}
                    >
                        <FiChevronLeft size={16} /> Tạp chí
                    </button>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button style={{ color: '#888', background: 'none', border: 'none', cursor: 'pointer' }} title="Lưu bài viết"><FiBookmark size={20} /></button>
                        <button onClick={handleCopyLink} style={{ color: '#888', background: 'none', border: 'none', cursor: 'pointer' }} title="Chia sẻ"><FiShare2 size={20} /></button>
                    </div>
                </div>
            </div>

            {/* ── ARTICLE CONTENT CONTAINER ── */}
            <article style={{ maxWidth: '760px', margin: '0 auto', padding: '5rem 1.5rem 4rem' }}>
                
                {/* Excerpt Summary */}
                <p style={{ fontSize: '24px', fontFamily: 'var(--font-display)', color: '#b5624a', lineHeight: 1.6, marginBottom: '4rem', textAlign: 'center', fontStyle: 'italic', padding: '0 1rem' }}>
                    "{blog.excerpt}"
                </p>

                {/* Content Body */}
                <div className="blog-detail-body">
                    <style>{`
                        .drop-cap::first-letter {
                            float: left;
                            font-size: 80px;
                            line-height: 60px;
                            padding-top: 4px;
                            padding-right: 12px;
                            padding-left: 3px;
                            font-family: 'Playfair Display', serif;
                            color: #b5624a;
                        }
                        blockquote::before {
                            content: '“';
                            display: block;
                            font-size: 80px;
                            color: #eee8df;
                            line-height: 0;
                            margin-bottom: 20px;
                            font-family: 'Playfair Display', serif;
                            text-align: center;
                        }
                        cite {
                            display: block;
                            margin-top: 15px;
                            font-size: 14px;
                            color: #888;
                            font-style: normal;
                            font-family: sans-serif;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                        }
                    `}</style>
                    <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
                </div>
                
                {/* TAGS & SHARE FOOTER */}
                <div className="blog-detail-footer">
                    <div className="blog-detail-tags">
                        {blog.tags?.map((tag, idx) => (
                            <Link 
                                key={idx} 
                                to={`/blog/tag/${tag.toLowerCase()}`}
                                className="tag-link"
                                style={{ padding: '0.5rem 1.25rem', backgroundColor: 'white', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#888' }}
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>

                    <div className="blog-detail-share">
                        <button className="blog-detail-share-btn" style={{ hoverBackgroundColor: '#3b5998' }}>
                            <FiFacebook size={18} />
                        </button>
                        <button className="blog-detail-share-btn" style={{ hoverBackgroundColor: '#1DA1F2' }}>
                            <FiTwitter size={18} />
                        </button>
                        <button onClick={handleCopyLink} className="blog-detail-share-btn" style={{ hoverBackgroundColor: '#b5624a' }}>
                            <FiLink size={18} />
                        </button>
                    </div>
                </div>
            </article>

            {/* ── AUTHOR BOX ── */}
            <div style={{ maxWidth: '760px', margin: '0 auto 5rem', padding: '0 1.5rem' }}>
                <div className="blog-empty" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '2rem', textAlign: 'left' }}>
                    <div style={{ width: '6rem', height: '6rem', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt={blog.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#b5624a', marginBottom: '0.5rem' }}>Tác giả</h4>
                        <h3 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', color: '#1a1a1a', marginBottom: '0.75rem' }}>{blog.author}</h3>
                        <p style={{ color: '#555', fontSize: '15px', fontWeight: 300, lineHeight: 1.8, maxWidth: '500px' }}>
                            Là một người yêu gốm và nghệ thuật thủ công, Hương Trà dành nhiều năm khám phá vẻ đẹp bình dị của các làng nghề truyền thống Việt Nam. Cô luôn tin rằng mỗi món đồ gốm đều có linh hồn riêng.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── RELATED ARTICLES ── */}
            <div style={{ backgroundColor: 'white', padding: '5rem 0', borderTop: '1px solid #eee' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <h2 className="blog-related-title">Đọc Tiếp</h2>
                    <div className="posts-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        {[
                            { title: 'Câu Chuyện Đằng Sau "Gốm Nâu"', img: 'https://images.unsplash.com/photo-1565193566173-6a0d0d860d5b?q=80&w=800&auto=format&fit=crop', cat: 'Thương hiệu' },
                            { title: 'Xu Hướng Trang Trí Nội Thất Cùng Gốm Mộc', img: 'https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?q=80&w=800&auto=format&fit=crop', cat: 'Thiết kế' },
                            { title: 'Cách Bảo Quản Gốm Sứ Trong Nhà', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop', cat: 'Đời sống' },
                        ].map((item, i) => (
                            <Link to={`/blog/related-${i}`} key={i} className="post-card group" style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}>
                                <div className="post-card-img-link" style={{ height: '240px', borderRadius: '0.75rem', marginBottom: '1.25rem' }}>
                                    <img src={item.img} alt={item.title} className="post-card-img" />
                                </div>
                                <span className="post-card-cat">{item.cat}</span>
                                <h3 className="post-card-title">{item.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </main>
    );
}
