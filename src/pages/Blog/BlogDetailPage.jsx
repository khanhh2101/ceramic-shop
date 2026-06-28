import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiClock, FiUser, FiChevronLeft, FiShare2, FiFacebook, FiTwitter, FiLink, FiBookmark } from 'react-icons/fi';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';

// Mock content for demonstration - Enhanced for typography
const MOCK_CONTENT = `
<p class="drop-cap">Làng gốm Bàu Trúc nằm ở ven biển miền Trung là một trong những làng gốm cổ xưa nhất Đông Nam Á. Điều đặc biệt ở đây là các nghệ nhân không sử dụng bàn xoay, mà hoàn toàn dùng tay để vuốt và tạo hình cho gốm. Khác với những làng nghề gốm khác, nơi máy móc và công nghệ đã can thiệp sâu vào quá trình sản xuất, Bàu Trúc vẫn giữ vẹn nguyên nét thô mộc của hàng ngàn năm trước.</p>

<h2>Chất đất đặc biệt tạo nên linh hồn</h2>
<p>Đất sét được lấy từ sông Quao, mang đặc tính dẻo, mịn và chịu nhiệt cực tốt. Khi nung, gốm không cần tráng men mà tự lên màu đỏ gạch, nâu đen hoặc vệt khói tự nhiên rất đặc trưng do kỹ thuật nung lộ thiên (nung ngoài trời bằng rơm rạ, củi). Quá trình nhào nặn đất đòi hỏi sự kiên nhẫn phi thường.</p>

<blockquote>
    <p>"Gốm Bàu Trúc không có hai sản phẩm nào giống nhau y hệt. Mỗi chiếc bình, chiếc vại đều mang dấu ấn của ngọn lửa và nhịp thở của người thợ vuốt gốm."</p>
    <cite>— Nghệ nhân Đàng Xem</cite>
</blockquote>

<h2>Kỹ thuật nung lộ thiên</h2>
<p>Sản phẩm sau khi phơi khô sẽ được chất thành đống ngoài bãi đất trống. Người thợ phủ rơm, củi và trấu lên trên rồi đốt. Nhiệt độ và hướng gió sẽ quyết định màu sắc cuối cùng của từng mẻ gốm. Vết nám đen trên nền đất đỏ là "đặc sản" vô giá mà không một lò nung điện nào làm ra được.</p>

<figure>
    <img src="https://images.unsplash.com/photo-1565193566173-6a0d0d860d5b?q=80&w=1200&auto=format&fit=crop" alt="Quy trình nung gốm" />
    <figcaption>Những chiếc bình gốm mộc mạc mang vết nám khói lửa tự nhiên sau khi nung.</figcaption>
</figure>

<p>Ngày nay, gốm mộc không chỉ là vật dụng sinh hoạt mà đã trở thành điểm nhấn tinh tế trong không gian nội thất tối giản, mang hơi thở của đất mẹ vào từng góc nhà. Sự giao thoa giữa nghệ thuật truyền thống và lối sống hiện đại đang mở ra một chương mới cho làng gốm cổ.</p>
`;

export default function BlogDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/articles/slug/${slug}`);
                const article = response.data.data;
                setBlog({
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
                });
                document.title = `${article.metaTitle || article.title} - Gốm Nâu`;
            } catch (error) {
                console.error("Lỗi fetch blog detail:", error);
                setBlog(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [slug]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Đã sao chép đường dẫn bài viết!');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf7f4]">
                <div className="w-12 h-12 border-4 border-[#b5624a] border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-[#888] font-light uppercase tracking-[2px] text-[12px]">Đang tải trang tạp chí...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#faf7f4] text-center">
                <h2 className="text-[32px] font-display text-[#1a1a1a] mb-4">Không tìm thấy bài viết</h2>
                <button onClick={() => navigate('/blog')} className="text-[#b5624a] hover:underline uppercase text-[12px] tracking-[2px] font-bold">
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
        <main className="bg-[#faf7f4] min-h-screen pb-24">
            
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
            <div className="relative w-full h-[65vh] min-h-[500px] overflow-hidden flex items-end">
                <img 
                    src={blog.thumbnailUrl} 
                    alt={blog.title} 
                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-[10s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 pb-20 text-center">
                    <div className="mb-6">
                        <Link to="/blog/category/nghe-thuat" className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-[#f5ebe0] text-[11px] font-bold uppercase tracking-[3px] rounded-full hover:bg-white hover:text-[#b5624a] transition-all">
                            {blog.category}
                        </Link>
                    </div>
                    <h1 className="text-[38px] md:text-[56px] lg:text-[64px] font-display leading-[1.1] text-white drop-shadow-lg mb-8 mx-auto">
                        {blog.title}
                    </h1>
                    <div className="flex items-center justify-center gap-8 text-[12px] text-white/80 uppercase tracking-[2px] font-medium">
                        <span className="flex items-center gap-2"><FiUser size={16} className="text-[#b5624a]" /> {blog.author}</span>
                        <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                        <span className="flex items-center gap-2"><FiClock size={16} className="text-[#b5624a]" /> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
            </div>

            {/* ── BREADCRUMB & TOOLBAR ── */}
            <div className="bg-white border-b border-[#eee] sticky top-[68px] z-40 shadow-sm">
                <div className="max-w-[900px] mx-auto px-6 py-4 flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/blog')}
                        className="flex items-center gap-2 text-[#888] hover:text-[#b5624a] transition-colors text-[12px] uppercase tracking-[1.5px] font-bold"
                    >
                        <FiChevronLeft size={16} /> Tạp chí
                    </button>

                    <div className="flex gap-4">
                        <button className="text-[#888] hover:text-[#b5624a] transition-colors" title="Lưu bài viết"><FiBookmark size={20} /></button>
                        <button onClick={handleCopyLink} className="text-[#888] hover:text-[#b5624a] transition-colors" title="Chia sẻ"><FiShare2 size={20} /></button>
                    </div>
                </div>
            </div>

            {/* ── ARTICLE CONTENT CONTAINER ── */}
            <article className="max-w-[760px] mx-auto px-6 pt-20 pb-16">
                
                {/* Excerpt Summary */}
                <p className="text-[20px] md:text-[24px] font-display text-[#b5624a] leading-[1.6] mb-16 text-center italic px-4">
                    "{blog.excerpt}"
                </p>

                {/* Content Body */}
                <div className="prose prose-lg md:prose-xl max-w-none 
                                prose-headings:font-display prose-headings:text-[#1a1a1a] prose-headings:font-normal
                                prose-h2:text-[32px] prose-h2:mt-16 prose-h2:mb-8 prose-h2:relative prose-h2:inline-block
                                prose-p:text-[#444] prose-p:leading-[2] prose-p:text-[17px] prose-p:mb-8 prose-p:font-light
                                prose-blockquote:border-none prose-blockquote:pl-0 prose-blockquote:relative prose-blockquote:py-8 prose-blockquote:my-16
                                prose-blockquote:text-[24px] prose-blockquote:italic prose-blockquote:text-[#1a1a1a] prose-blockquote:font-display prose-blockquote:text-center
                                prose-img:rounded-sm prose-img:w-full prose-img:my-16
                                prose-figcaption:text-center prose-figcaption:text-[14px] prose-figcaption:text-[#888] prose-figcaption:italic
                                prose-a:text-[#b5624a] prose-a:no-underline hover:prose-a:underline">
                    
                    {/* Custom styling applied globally via standard CSS classes below + tailwind typography plugin */}
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
                <div className="mt-20 pt-10 border-t border-[#ddd] flex flex-col items-center gap-8">
                    <div className="flex flex-wrap justify-center gap-3">
                        {blog.tags?.map((tag, idx) => (
                            <Link 
                                key={idx} 
                                to={`/blog/tag/${tag.toLowerCase()}`}
                                className="px-5 py-2 bg-white text-[#888] text-[12px] font-bold uppercase tracking-[1.5px] rounded-full hover:border-[#b5624a] hover:text-[#b5624a] transition-all border border-[#eee]"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <button className="w-12 h-12 rounded-full bg-white border border-[#eee] flex items-center justify-center text-[#555] hover:bg-[#3b5998] hover:text-white hover:border-[#3b5998] transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                            <FiFacebook size={18} />
                        </button>
                        <button className="w-12 h-12 rounded-full bg-white border border-[#eee] flex items-center justify-center text-[#555] hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                            <FiTwitter size={18} />
                        </button>
                        <button onClick={handleCopyLink} className="w-12 h-12 rounded-full bg-white border border-[#eee] flex items-center justify-center text-[#555] hover:bg-[#b5624a] hover:text-white hover:border-[#b5624a] transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                            <FiLink size={18} />
                        </button>
                    </div>
                </div>
            </article>

            {/* ── AUTHOR BOX ── */}
            <div className="max-w-[760px] mx-auto px-6 mb-20">
                <div className="bg-white p-10 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left border border-[#eee] shadow-sm">
                    <div className="w-24 h-24 rounded-full overflow-hidden shrink-0">
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt={blog.author} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-[2px] text-[#b5624a] mb-2">Tác giả</h4>
                        <h3 className="text-[24px] font-display text-[#1a1a1a] mb-3">{blog.author}</h3>
                        <p className="text-[#555] text-[15px] font-light leading-[1.8] max-w-[500px]">
                            Là một người yêu gốm và nghệ thuật thủ công, Hương Trà dành nhiều năm khám phá vẻ đẹp bình dị của các làng nghề truyền thống Việt Nam. Cô luôn tin rằng mỗi món đồ gốm đều có linh hồn riêng.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── RELATED ARTICLES ── */}
            <div className="bg-white py-20 border-t border-[#eee]">
                <div className="max-w-[1200px] mx-auto px-6">
                    <h2 className="text-[28px] font-display text-[#1a1a1a] mb-10 text-center">Đọc Tiếp</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Fake Data for Related Articles */}
                        {[
                            { title: 'Câu Chuyện Đằng Sau "Gốm Nâu"', img: 'https://images.unsplash.com/photo-1565193566173-6a0d0d860d5b?q=80&w=800&auto=format&fit=crop', cat: 'Thương hiệu' },
                            { title: 'Xu Hướng Trang Trí Nội Thất Cùng Gốm Mộc', img: 'https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?q=80&w=800&auto=format&fit=crop', cat: 'Thiết kế' },
                            { title: 'Cách Bảo Quản Gốm Sứ Trong Nhà', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop', cat: 'Đời sống' },
                        ].map((item, i) => (
                            <Link to={`/blog/related-${i}`} key={i} className="group block">
                                <div className="rounded-xl overflow-hidden mb-5 h-[240px]">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#b5624a] mb-2 block">{item.cat}</span>
                                <h3 className="text-[20px] font-display text-[#1a1a1a] group-hover:text-[#b5624a] transition-colors leading-[1.4]">{item.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </main>
    );
}
