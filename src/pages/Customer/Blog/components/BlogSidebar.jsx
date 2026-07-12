import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiChevronRight, FiTag } from 'react-icons/fi';

export default function BlogSidebar({ searchInput, setSearchInput, handleSearchSubmit, categories, tags }) {
    return (
        <aside className="blog-sidebar">
            {/* Search Box */}
            <div className="sidebar-widget">
                <h3 className="sidebar-title">Tìm Kiếm</h3>
                <form className="search-form" role="search" aria-label="Tìm kiếm blog" onSubmit={handleSearchSubmit}>
                    <input 
                        type="search" 
                        placeholder="Tìm bài viết..." 
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn" aria-label="Submit search">
                        <FiSearch size={18} />
                    </button>
                </form>
            </div>

            {/* Categories */}
            <div className="sidebar-widget">
                <h3 className="sidebar-title">Danh Mục</h3>
                <nav aria-label="Blog categories">
                    <ul className="cat-list">
                        {categories.map((cat, idx) => (
                            <li key={idx}>
                                <Link to={`/blog/category/${cat.toLowerCase()}`} className="cat-link">
                                    <span className="cat-link-text">
                                        <FiChevronRight className="cat-link-icon" size={14} /> 
                                        {cat}
                                    </span>
                                    <span className="cat-count">
                                        {Math.floor(Math.random() * 10) + 1}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Popular Tags */}
            <div className="sidebar-widget">
                <h3 className="sidebar-title">Thẻ Phổ Biến (Tags)</h3>
                <nav aria-label="Blog tags">
                    <div className="tags-list">
                        {tags.map((tag, idx) => (
                            <Link 
                                key={idx} 
                                to={`/blog/tag/${tag.toLowerCase()}`} 
                                className="tag-link"
                            >
                                <FiTag size={12} /> {tag}
                            </Link>
                        ))}
                    </div>
                </nav>
            </div>

            {/* Banner QC / About */}
            <div className="sidebar-banner">
                <div className="sidebar-banner-glow"></div>
                <h3 className="sidebar-banner-title">Đam Mê Gốm Sứ?</h3>
                <p className="sidebar-banner-desc">
                    Đăng ký nhận bản tin để không bỏ lỡ những câu chuyện và xu hướng thiết kế mới nhất.
                </p>
                <form>
                    <input 
                        type="email" 
                        placeholder="Email của bạn" 
                        className="sidebar-banner-input"
                    />
                    <button type="button" className="sidebar-banner-btn">
                        Đăng ký ngay
                    </button>
                </form>
            </div>
        </aside>
    );
}
