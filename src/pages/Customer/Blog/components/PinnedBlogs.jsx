import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';

export default function PinnedBlogs({ blogs }) {
    if (!blogs || blogs.length === 0) return null;

    return (
        <section className="pinned-section" aria-label="Bài viết nổi bật">
            <div className="section-header">
                <FiStar className="text-[#b5624a] fill-[#b5624a]" size={24} style={{ color: '#b5624a', fill: '#b5624a' }} />
                <h2 className="section-header-title">Bài Viết Nổi Bật</h2>
            </div>
            <div className="pinned-grid">
                {blogs.slice(0, 2).map((blog) => (
                    <article key={blog.id} className="pinned-card">
                        <img 
                            src={blog.thumbnailUrl} 
                            alt={blog.title} 
                            className="pinned-card-img"
                        />
                        <div className="pinned-card-overlay"></div>
                        <div className="pinned-card-content">
                            <span className="blog-badge">
                                {blog.category}
                            </span>
                            <h3 className="pinned-card-title">
                                <Link to={`/blog/${blog.slug}`}>
                                    {blog.title}
                                </Link>
                            </h3>
                            <p className="pinned-card-desc">
                                {blog.excerpt}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
