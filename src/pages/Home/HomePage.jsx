import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiStar } from 'react-icons/fi';
import { productService, settingsService } from '../../services';
import api from '../../services/api';
import ProductCard from '../../components/product/ProductCard';

// ── Home Page ─────────────────────────────────────────────────────────────────
// Trang chủ với: Hero banner, USPs, Bestsellers, Blog mới nhất, CTA.

export default function HomePage() {
  // Lấy bestsellers
  const { data: bestsellers } = useQuery({
    queryKey: ['bestsellers'],
    queryFn: () => productService.getBestsellers(8).then((r) => r.data.data),
  });

  // Lấy blog mới nhất
  const { data: latestBlogs } = useQuery({
    queryKey: ['latestBlogs'],
    queryFn: () => api.get('/articles').then((r) => {
      const data = r.data.data;
      if (Array.isArray(data)) {
        return data.slice(0, 3);
      }
      return [];
    }),
  });

  return (
    <div className="animate-fade-in">
      {/* ── Hero Section ── */}
      <HeroSection />

      {/* ── USP Row ── */}
      <UspSection />

      {/* ── Bestsellers ── */}
      {bestsellers && bestsellers.length > 0 && (
        <section className="py-16 bg-cream-50">
          <div className="page-container">
            <SectionHeader
              title="Sản phẩm bán chạy"
              subtitle="Những sản phẩm được yêu thích nhất của Gốm Nâu"
              link={{ to: '/shop', label: 'Xem tất cả' }}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {bestsellers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Banner giữa trang ── */}
      <MidBannerSection />

      {/* ── Blog mới nhất ── */}
      {latestBlogs && latestBlogs.length > 0 && (
        <section className="py-16">
          <div className="page-container">
            <SectionHeader
              title="Bài viết mới nhất"
              subtitle="Khám phá kiến thức về gốm sứ và không gian sống"
              link={{ to: '/blog', label: 'Xem tất cả blog' }}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestBlogs.map((b) => (
                <BlogCard key={b.id} blog={b} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Subscribe ── */}
      <NewsletterSection />
    </div>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br
                        from-cream-100 via-cream-50 to-white overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-100 opacity-40 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-clay-100 opacity-30 blur-3xl" />

      <div className="page-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
          {/* Text */}
          <div className="animate-slide-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700
                           text-sm font-medium mb-6">
              ✨ Gốm sứ thủ công cao cấp
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900
                          leading-tight mb-6">
              Vẻ đẹp{' '}
              <span className="text-gradient">tinh tế</span>
              <br />
              từ đất nung
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Mỗi sản phẩm gốm là một tác phẩm nghệ thuật, được tạo ra bằng tay
              bởi các nghệ nhân lành nghề. Mang vẻ đẹp tự nhiên vào không gian sống của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="btn-primary">
                Khám phá cửa hàng
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="btn-outline">
                Về chúng tôi
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-gray-200">
              {[
                { value: '500+', label: 'Sản phẩm' },
                { value: '2000+', label: 'Khách hàng' },
                { value: '4.9', label: 'Đánh giá', icon: <FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" /> },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center gap-1">
                    {stat.icon}
                    <span className="font-display font-bold text-2xl text-gray-900">{stat.value}</span>
                  </div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cream-200 to-clay-100" />
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"
                alt="Gốm sứ thủ công cao cấp"
                className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl"
              />
              {/* Floating badges */}
              <div className="absolute -bottom-4 -left-4 z-20 bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-base">✓</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Thủ công 100%</p>
                    <p className="text-xs text-gray-500">Nghệ nhân Việt Nam</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── USP Section ──────────────────────────────────────────────────────────────
function UspSection() {
  const usps = [
    { icon: <FiTruck />, title: 'Miễn phí vận chuyển', desc: 'Đơn từ 500.000₫' },
    { icon: <FiShield />, title: 'Bảo hành chính hãng', desc: '1 năm đối với lỗi sản xuất' },
    { icon: <FiRefreshCw />, title: 'Đổi trả dễ dàng', desc: 'Trong vòng 30 ngày' },
    { icon: <FiStar />, title: 'Chất lượng cao cấp', desc: 'Kiểm định trước khi giao' },
  ];

  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="page-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {usps.map((usp) => (
            <div key={usp.title} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50
                                            transition-colors duration-200">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center
                             text-primary-600 flex-shrink-0">
                {usp.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{usp.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{usp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Mid Banner ───────────────────────────────────────────────────────────────
function MidBannerSection() {
  return (
    <section className="py-16">
      <div className="page-container">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-clay-700 to-primary-700
                       relative min-h-[280px] flex items-center">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=60"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 px-8 py-12 max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Bộ sưu tập Thu Đông 2025
            </h2>
            <p className="text-white/80 mb-6">
              Những gam màu ấm áp, phong cách tối giản — hoàn hảo cho mùa đông.
            </p>
            <Link to="/shop?tag=thu-dong" className="btn-primary bg-white text-primary-700 hover:bg-cream-50">
              Khám phá ngay
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Blog Card ────────────────────────────────────────────────────────────────
function BlogCard({ blog }) {
  return (
    <Link to={`/blog/${blog.slug}`} className="group block rounded-2xl overflow-hidden
                                               bg-white shadow-card hover:shadow-card-hover
                                               transition-all duration-300">
      <div className="aspect-video overflow-hidden">
        <img
          src={blog.thumbnailUrl || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400'}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {blog.tags?.slice(0, 1).map((tag) => (
            <span key={tag} className="badge bg-primary-50 text-primary-700">{tag}</span>
          ))}
          <span className="text-xs text-gray-400">{blog.authorName}</span>
        </div>
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600
                      transition-colors duration-200 mb-2">
          {blog.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{blog.summary}</p>
      </div>
    </Link>
  );
}

// ── Newsletter Section ───────────────────────────────────────────────────────
function NewsletterSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="page-container text-center max-w-xl mx-auto">
        <h2 className="section-title mb-3">Đăng ký nhận tin</h2>
        <p className="text-gray-500 mb-8">
          Nhận thông báo về sản phẩm mới, khuyến mãi và mẹo trang trí nhà cửa.
        </p>
        <form className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Nhập email của bạn..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary px-6 flex-shrink-0">
            Đăng ký
          </button>
        </form>
      </div>
    </section>
  );
}

// ── Section Header helper ────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, link }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {link && (
        <Link
          to={link.to}
          className="flex items-center gap-1 text-sm font-medium text-primary-600
                     hover:text-primary-700 transition-colors flex-shrink-0"
        >
          {link.label}
          <FiArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
