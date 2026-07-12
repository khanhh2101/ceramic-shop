import React from 'react';
import { Link } from 'react-router-dom';
import { FiFolder, FiClock, FiChevronRight } from 'react-icons/fi';

export default function BlogList({ filteredBlogs, newBlogs, remainingBlogs }) {
    if (filteredBlogs.length === 0) {
        return (
            <div className="blog-empty">
                <h2 className="blog-empty-title">Không tìm thấy bài viết</h2>
                <p className="blog-empty-desc">Rất tiếc, không có bài viết nào phù hợp với tìm kiếm hoặc danh mục bạn chọn.</p>
                <Link to="/blog" className="blog-empty-btn">
                    Xem tất cả bài viết
                </Link>
            </div>
        );
    }

    return (
        <div className="blog-posts-col">
            {/* Tin mới nhất */}
            <section className="latest-section" aria-label="Tin mới nhất">
                <h2 className="section-title">
                    Tin Mới Nhất
                </h2>
                <div className="latest-list">
                    {newBlogs.map((blog) => (
                        <article key={blog.id} className="latest-card group">
                            <Link to={`/blog/${blog.slug}`} className="latest-card-img-link">
                                <img 
                                    src={blog.thumbnailUrl} 
                                    alt={blog.title} 
                                    className="latest-card-img"
                                    loading="lazy"
                                />
                            </Link>
                            <div className="latest-card-content">
                                <div className="blog-meta">
                                    <span className="blog-meta-category"><FiFolder /> {blog.category}</span>
                                    <span>•</span>
                                    <span className="blog-meta-date"><FiClock /> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <h3 className="latest-card-title">
                                    <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                                </h3>
                                <p className="latest-card-desc">
                                    {blog.excerpt}
                                </p>
                                <Link to={`/blog/${blog.slug}`} className="blog-read-more">
                                    Đọc tiếp <FiChevronRight />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Tất cả bài viết grid */}
            {remainingBlogs.length > 0 && (
                <section aria-label="Tất cả bài viết">
                    <h2 className="section-title">
                        Bài Viết Khác
                    </h2>
                    <div className="posts-grid">
                        {remainingBlogs.map(blog => (
                            <article key={blog.id} className="post-card group">
                                <Link to={`/blog/${blog.slug}`} className="post-card-img-link">
                                    <img 
                                        src={blog.thumbnailUrl} 
                                        alt={blog.title} 
                                        className="post-card-img"
                                        loading="lazy"
                                    />
                                </Link>
                                <div className="post-card-content">
                                    <div className="post-card-cat">
                                        <FiFolder size={12} /> {blog.category}
                                    </div>
                                    <h3 className="post-card-title">
                                        <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                                    </h3>
                                    <p className="post-card-desc">
                                        {blog.excerpt}
                                    </p>
                                    <div className="post-card-date">
                                        <FiClock size={12} /> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
