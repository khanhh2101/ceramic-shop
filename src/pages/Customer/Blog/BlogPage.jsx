import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { blogApi } from './api/blogApi';

import BlogHero from './components/BlogHero';
import PinnedBlogs from './components/PinnedBlogs';
import BlogList from './components/BlogList';
import BlogSidebar from './components/BlogSidebar';
import './Blog.css';

export default function BlogPage() {
    const { categoryId, tagId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const searchQuery = searchParams.get('q') || '';
    
    const [allBlogs, setAllBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(searchQuery);

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
                const response = await blogApi.getArticles();
                const dataList = Array.isArray(response) ? response : (response?.items || response?.data || []);
                const rawBlogs = dataList.map((article) => ({
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

        if (categoryId) {
            result = result.filter(b => b.category.toLowerCase() === categoryId.toLowerCase());
        }

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

    const categories = Array.from(new Set(allBlogs.map(b => b.category))).filter(Boolean);
    const tags = Array.from(new Set(allBlogs.flatMap(b => b.tags))).filter(Boolean);

    const pinnedBlogs = filteredBlogs.filter(b => b.isPinned);
    const unpinnedBlogs = filteredBlogs.filter(b => !b.isPinned);
    const newBlogs = unpinnedBlogs.slice(0, 2); 
    const remainingBlogs = unpinnedBlogs.slice(2);

    return (
        <main className="blog-main">
            <BlogHero 
                title="Tạp Chí Gốm Nâu"
                description="Nơi chia sẻ kiến thức chuyên sâu về nghệ thuật thủ công, bí quyết bảo quản gốm sứ và cảm hứng sống tối giản."
                bgImage="https://images.unsplash.com/photo-1565193566173-6a0d0d860d5b?q=80&w=2000&auto=format&fit=crop"
            />

            <div className="blog-container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem 0', color: '#888' }}>
                        Đang tải bài viết...
                    </div>
                ) : (
                    <>
                        <PinnedBlogs blogs={pinnedBlogs} />

                        <div className="blog-content-layout">
                            <BlogList 
                                filteredBlogs={filteredBlogs} 
                                newBlogs={newBlogs} 
                                remainingBlogs={remainingBlogs} 
                            />
                            <BlogSidebar 
                                searchInput={searchInput}
                                setSearchInput={setSearchInput}
                                handleSearchSubmit={handleSearchSubmit}
                                categories={categories}
                                tags={tags}
                            />
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
