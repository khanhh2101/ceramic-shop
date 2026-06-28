import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { FiSearch, FiTag, FiFolder, FiClock, FiStar, FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

export default function BlogPage() {
    const { categoryId, tagId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const searchQuery = searchParams.get('q') || '';
    
    const [allBlogs, setAllBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(searchQuery);

    // Dữ liệu SEO mẫu
    useEffect(() => {
        document.title = "Chuyện Của Gốm | Tạp chí Gốm Nâu - Cảm hứng & Lối sống";
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = "description";
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = "Đọc các bài viết mới nhất về nghệ thuật làm gốm, cách bảo quản gốm sứ và xu hướng trang trí nội thất phong cách tối giản từ Gốm Nâu.";
    }, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.get('/articles');
                const rawBlogs = response.data.data.map((article) => ({
                    id: article.id,
                    slug: article.slug,
                    title: article.title,
                    excerpt: article.metaDescription || article.title,
                    thumbnailUrl: article.thumbnailUrl || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop',
                    createdAt: article.createdAt,
                    category: article.categoryName || 'Tạp chí',
                    isPinned: article.isPinned,
                    tags: article.tags || []
                }));
                setAllBlogs(rawBlogs);
            } catch (error) {
                console.error("Lỗi fetch blog:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    // Filter Effect
    useEffect(() => {
        let result = [...allBlogs];

        // 1. Filter by category
        if (categoryId) {
            result = result.filter(b => b.category.toLowerCase() === categoryId.toLowerCase());
        }

        // 2. Filter by Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(b => 
                b.title.toLowerCase().includes(query) || 
                b.excerpt.toLowerCase().includes(query) ||
                b.category.toLowerCase().includes(query)
            );
        }

        if (tagId) {
            const tId = tagId.toLowerCase();
            result = result.filter(b => 
                (b.tags && b.tags.some(t => t.toLowerCase() === tId)) ||
                b.title.toLowerCase().includes(tId) || 
                b.excerpt.toLowerCase().includes(tId)
            );
        }

        setFilteredBlogs(result);
    }, [categoryId, tagId, searchQuery, allBlogs]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/blog?q=${encodeURIComponent(searchInput.trim())}`);
        } else {
            navigate('/blog');
        }
    };

    // Filter categories and tags for Sidebar (Dynamic from data)
    const categories = Array.from(new Set(allBlogs.map(b => b.category))).filter(Boolean);
    const tags = Array.from(new Set(allBlogs.flatMap(b => b.tags))).filter(Boolean);

    // Post separations
    const pinnedBlogs = filteredBlogs.filter(b => b.isPinned);
    const unpinnedBlogs = filteredBlogs.filter(b => !b.isPinned);
    const newBlogs = unpinnedBlogs.slice(0, 2); 
    const remainingBlogs = unpinnedBlogs.slice(2);

    return (
        <main className="bg-[#faf7f4] min-h-screen pb-24">
            {/* ── Hero Banner (SEO Optimized H1) ── */}
            <header className="relative h-[35vh] min-h-[300px] mb-12 flex items-center justify-center bg-[#eee8df] overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1565193566173-6a0d0d860d5b?q=80&w=2000&auto=format&fit=crop" 
                        alt="Tạp chí Gốm Nâu - Cảm hứng gốm sứ"
                        className="w-full h-full object-cover opacity-60 grayscale-[10%]"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
                <div className="relative z-10 text-center px-5 max-w-[800px] mx-auto text-white mt-12">
                    <h1 className="text-[36px] md:text-[56px] mb-4 font-display leading-[1.1] drop-shadow-lg">
                        Tạp Chí Gốm Nâu
                    </h1>
                    <p className="text-[15px] md:text-[18px] font-light opacity-90 max-w-[600px] mx-auto drop-shadow-md">
                        Nơi chia sẻ kiến thức chuyên sâu về nghệ thuật thủ công, bí quyết bảo quản gốm sứ và cảm hứng sống tối giản.
                    </p>
                </div>
            </header>

            <div className="max-w-[1300px] mx-auto px-5 md:px-10">
                {loading ? (
                    <div className="text-center py-20 text-[#888]">Đang tải bài viết...</div>
                ) : (
                    <>
                        {/* ── BÀI VIẾT ĐƯỢC GHIM (PINNED POSTS) ── */}
                        {pinnedBlogs.length > 0 && (
                            <section className="mb-20" aria-label="Bài viết nổi bật">
                                <div className="flex items-center gap-3 mb-8">
                                    <FiStar className="text-[#b5624a] fill-[#b5624a]" size={24} />
                                    <h2 className="text-[28px] text-[#1a1a1a] font-display">Bài Viết Nổi Bật</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {pinnedBlogs.slice(0, 2).map((blog) => (
                                        <article key={blog.id} className="group relative rounded-2xl overflow-hidden shadow-sm h-[350px] lg:h-[450px]">
                                            <img 
                                                src={blog.thumbnailUrl} 
                                                alt={blog.title} 
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                                <span className="inline-block px-3 py-1 bg-[#b5624a] text-[10px] font-bold uppercase tracking-[2px] rounded-full mb-4">
                                                    {blog.category}
                                                </span>
                                                <h3 className="text-[24px] lg:text-[32px] font-display mb-3 leading-[1.2] drop-shadow-md group-hover:text-[#f5ebe0] transition-colors">
                                                    <Link to={`/blog/${blog.slug}`} className="before:absolute before:inset-0">
                                                        {blog.title}
                                                    </Link>
                                                </h3>
                                                <p className="text-white/80 text-[14px] line-clamp-2 font-light">
                                                    {blog.excerpt}
                                                </p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ── BỐ CỤC CHÍNH: MAIN CONTENT & SIDEBAR ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
                            
                            {/* CỘT TRÁI: DANH SÁCH BÀI VIẾT */}
                            <div className="flex flex-col gap-16">
                                
                                {/* Search/Filter Info & Empty State */}
                                {filteredBlogs.length === 0 ? (
                                    <div className="bg-white p-10 rounded-xl border border-[#eee] text-center shadow-sm">
                                        <h2 className="text-[24px] text-[#1a1a1a] font-display mb-3">Không tìm thấy bài viết</h2>
                                        <p className="text-[#888] font-light mb-6">Rất tiếc, không có bài viết nào phù hợp với tìm kiếm hoặc danh mục bạn chọn.</p>
                                        <Link to="/blog" className="px-6 py-2.5 bg-[#b5624a] text-white text-[13px] font-bold uppercase tracking-[1px] rounded-full hover:bg-[#8a3e2a] transition-colors inline-block">
                                            Xem tất cả bài viết
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        {/* Tin mới nhất */}
                                        <section aria-label="Tin mới nhất">
                                    <h2 className="text-[24px] text-[#1a1a1a] font-display mb-8 border-b border-[#ddd] pb-4">
                                        Tin Mới Nhất
                                    </h2>
                                    <div className="flex flex-col gap-10">
                                        {newBlogs.map((blog) => (
                                            <article key={blog.id} className="flex flex-col md:flex-row gap-6 lg:gap-8 group">
                                                <Link to={`/blog/${blog.slug}`} className="w-full md:w-2/5 shrink-0 h-[240px] rounded-xl overflow-hidden block">
                                                    <img 
                                                        src={blog.thumbnailUrl} 
                                                        alt={blog.title} 
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                </Link>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <div className="flex items-center gap-3 text-[11px] text-[#888] uppercase tracking-[1px] font-medium mb-3">
                                                        <span className="text-[#b5624a] flex items-center gap-1"><FiFolder /> {blog.category}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1"><FiClock /> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                                                    </div>
                                                    <h3 className="text-[22px] lg:text-[28px] text-[#1a1a1a] font-display leading-[1.3] mb-4 group-hover:text-[#b5624a] transition-colors">
                                                        <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                                                    </h3>
                                                    <p className="text-[#555] text-[15px] leading-[1.7] mb-6 line-clamp-3">
                                                        {blog.excerpt}
                                                    </p>
                                                    <Link to={`/blog/${blog.slug}`} className="text-[12px] font-bold text-[#1a1a1a] uppercase tracking-[2px] flex items-center gap-2 group-hover:text-[#b5624a] w-fit">
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
                                                <h2 className="text-[24px] text-[#1a1a1a] font-display mb-8 border-b border-[#ddd] pb-4">
                                                    Bài Viết Khác
                                                </h2>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                    {remainingBlogs.map(blog => (
                                                        <article key={blog.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col border border-[#eee]">
                                                            <Link to={`/blog/${blog.slug}`} className="h-[200px] block overflow-hidden">
                                                                <img 
                                                                    src={blog.thumbnailUrl} 
                                                                    alt={blog.title} 
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                    loading="lazy"
                                                                />
                                                            </Link>
                                                            <div className="p-6 flex-1 flex flex-col">
                                                                <div className="text-[10px] text-[#b5624a] uppercase tracking-[2px] mb-2 font-bold flex items-center gap-1">
                                                                    <FiFolder size={12} /> {blog.category}
                                                                </div>
                                                                <h3 className="text-[18px] text-[#1a1a1a] mb-3 leading-[1.4] transition-colors group-hover:text-[#b5624a] font-display">
                                                                    <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                                                                </h3>
                                                                <p className="text-[#555] text-[13px] leading-[1.6] mb-4 line-clamp-2 flex-1">
                                                                    {blog.excerpt}
                                                                </p>
                                                                <div className="text-[11px] text-[#888] font-medium flex items-center gap-1 mt-auto">
                                                                    <FiClock size={12} /> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                                                                </div>
                                                            </div>
                                                        </article>
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* CỘT PHẢI: SIDEBAR (SEO Optimized Navigations) */}
                            <aside className="space-y-12">
                                {/* Search Box */}
                                <div className="bg-white p-6 rounded-xl border border-[#eee] shadow-sm">
                                    <h3 className="text-[16px] text-[#1a1a1a] font-bold uppercase tracking-[1px] mb-4 border-b border-[#eee] pb-3">Tìm Kiếm</h3>
                                    <form className="relative" role="search" aria-label="Tìm kiếm blog" onSubmit={handleSearchSubmit}>
                                        <input 
                                            type="search" 
                                            placeholder="Tìm bài viết..." 
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            className="w-full bg-[#faf7f4] border border-[#ddd] rounded-lg py-3 pl-4 pr-10 text-[14px] outline-none focus:border-[#b5624a] transition-colors"
                                        />
                                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#1a1a1a]" aria-label="Submit search">
                                            <FiSearch size={18} />
                                        </button>
                                    </form>
                                </div>

                                {/* Categories */}
                                <div className="bg-white p-6 rounded-xl border border-[#eee] shadow-sm">
                                    <h3 className="text-[16px] text-[#1a1a1a] font-bold uppercase tracking-[1px] mb-4 border-b border-[#eee] pb-3">Danh Mục</h3>
                                    <nav aria-label="Blog categories">
                                        <ul className="space-y-3">
                                            {categories.map((cat, idx) => (
                                                <li key={idx}>
                                                    <Link to={`/blog/category/${cat.toLowerCase()}`} className="flex items-center justify-between text-[#555] hover:text-[#b5624a] text-[14px] transition-colors group">
                                                        <span className="flex items-center gap-2">
                                                            <FiChevronRight className="text-[#ddd] group-hover:text-[#b5624a] transition-colors" size={14} /> 
                                                            {cat}
                                                        </span>
                                                        <span className="text-[11px] bg-[#faf7f4] px-2 py-0.5 rounded-full text-[#888]">
                                                            {Math.floor(Math.random() * 10) + 1}
                                                        </span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                </div>

                                {/* Popular Tags */}
                                <div className="bg-white p-6 rounded-xl border border-[#eee] shadow-sm">
                                    <h3 className="text-[16px] text-[#1a1a1a] font-bold uppercase tracking-[1px] mb-4 border-b border-[#eee] pb-3">Thẻ Phổ Biến (Tags)</h3>
                                    <nav aria-label="Blog tags">
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag, idx) => (
                                                <Link 
                                                    key={idx} 
                                                    to={`/blog/tag/${tag.toLowerCase()}`} 
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#faf7f4] text-[#555] text-[12px] font-medium rounded-full border border-[#eee] hover:border-[#b5624a] hover:text-[#b5624a] transition-all"
                                                >
                                                    <FiTag size={12} /> {tag}
                                                </Link>
                                            ))}
                                        </div>
                                    </nav>
                                </div>

                                {/* Banner QC / About */}
                                <div className="bg-[#b5624a] rounded-xl overflow-hidden text-center text-white p-8 relative shadow-md">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full mix-blend-overlay opacity-10 blur-xl"></div>
                                    <h3 className="text-[24px] font-display mb-3">Đam Mê Gốm Sứ?</h3>
                                    <p className="text-[14px] text-white/90 mb-6 font-light leading-relaxed">
                                        Đăng ký nhận bản tin để không bỏ lỡ những câu chuyện và xu hướng thiết kế mới nhất.
                                    </p>
                                    <form>
                                        <input 
                                            type="email" 
                                            placeholder="Email của bạn" 
                                            className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-[14px] text-white placeholder-white/60 outline-none focus:bg-white/20 mb-3"
                                        />
                                        <button className="w-full bg-white text-[#b5624a] font-bold uppercase tracking-[1px] text-[12px] py-3 rounded-lg hover:bg-[#faf7f4] transition-colors">
                                            Đăng ký ngay
                                        </button>
                                    </form>
                                </div>
                            </aside>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
