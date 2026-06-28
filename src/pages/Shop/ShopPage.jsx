import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiFilter, FiX, FiChevronDown, FiSliders } from 'react-icons/fi';
import { productService, categoryService } from '../../services';
import ProductCard from '../../components/product/ProductCard';
import Pagination from '../../components/common/Pagination';

// ── Shop Page ─────────────────────────────────────────────────────────────────
// Trang cửa hàng với filter sidebar + danh sách sản phẩm dạng grid.
// Filter: danh mục, khoảng giá, sắp xếp, tìm kiếm.
// URL sync: filter được lưu vào URL params để chia sẻ và lịch sử.

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá thấp → cao' },
  { value: 'price-desc', label: 'Giá cao → thấp' },
  { value: 'bestseller', label: 'Bán chạy nhất' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  // Lấy filter từ URL
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  // Local state cho filter inputs (chỉ sync khi Submit)
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1'); // Reset về trang 1 khi filter
    setSearchParams(next);
  };

  // Lấy danh mục
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll().then((r) => r.data.data),
  });

  // Lấy sản phẩm
  const { data, isLoading } = useQuery({
    queryKey: ['products', { page, search, categoryId, sortBy, minPrice, maxPrice }],
    queryFn: () =>
      productService
        .getProducts({ page, pageSize: 12, search, categoryId, sortBy, minPrice, maxPrice })
        .then((r) => r.data),
    keepPreviousData: true,
  });

  const products = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / 12);

  // Xóa tất cả filter
  const clearFilters = () => {
    setSearchParams({ page: '1' });
    setLocalMin('');
    setLocalMax('');
  };

  const hasFilter = search || categoryId || minPrice || maxPrice;

  return (
    <div className="page-container py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Cửa hàng</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLoading ? 'Đang tải...' : `${totalCount} sản phẩm`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => updateParam('sortBy', e.target.value)}
            className="input-field py-2 w-auto"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="lg:hidden btn-outline btn-sm flex items-center gap-2"
          >
            <FiSliders className="w-4 h-4" />
            Lọc
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* ── Filter Sidebar ── */}
        <aside
          className={`
            ${filterOpen ? 'block' : 'hidden'} lg:block
            w-full lg:w-64 flex-shrink-0
          `}
        >
          <div className="bg-white rounded-2xl p-5 shadow-card space-y-6 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
              {hasFilter && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <FiX className="w-3 h-3" />
                  Xóa bộ lọc
                </button>
              )}
            </div>

            {/* Tìm kiếm */}
            <div>
              <label className="input-label">Tìm kiếm</label>
              <input
                type="text"
                defaultValue={search}
                placeholder="Tên sản phẩm..."
                className="input-field"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') updateParam('search', e.target.value);
                }}
                onBlur={(e) => updateParam('search', e.target.value)}
              />
            </div>

            {/* Danh mục */}
            <div>
              <label className="input-label">Danh mục</label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={!categoryId}
                    onChange={() => updateParam('categoryId', '')}
                    className="text-primary-600"
                  />
                  <span className="text-sm text-gray-700">Tất cả</span>
                </label>
                {categories?.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={categoryId === String(cat.id)}
                      onChange={() => updateParam('categoryId', String(cat.id))}
                      className="text-primary-600"
                    />
                    <span className="text-sm text-gray-700">
                      {cat.name}
                      <span className="text-xs text-gray-400 ml-1">({cat.productCount})</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Khoảng giá */}
            <div>
              <label className="input-label">Khoảng giá (₫)</label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  placeholder="Từ"
                  className="input-field py-2 text-sm"
                />
                <span className="text-gray-400">–</span>
                <input
                  type="number"
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  placeholder="Đến"
                  className="input-field py-2 text-sm"
                />
              </div>
              <button
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  if (localMin) next.set('minPrice', localMin); else next.delete('minPrice');
                  if (localMax) next.set('maxPrice', localMax); else next.delete('maxPrice');
                  next.set('page', '1');
                  setSearchParams(next);
                }}
                className="btn-primary btn-sm w-full mt-3"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </aside>

        {/* ── Product Grid ── */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Không tìm thấy sản phẩm nào.</p>
              <button onClick={clearFilters} className="btn-outline btn-sm mt-4">
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => updateParam('page', String(p))}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-card">
      <div className="skeleton aspect-product" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-4 rounded w-3/4" />
        <div className="skeleton h-4 rounded w-1/2" />
      </div>
    </div>
  );
}
