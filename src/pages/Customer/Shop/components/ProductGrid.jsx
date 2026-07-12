import ProductCard from '@/components/common/ProductCard';

export default function ProductGrid({
    products,
    loading,
    totalCount,
    sortOption,
    setSortOption,
    currentPage,
    setCurrentPage,
    pageSize,
    clearFilters
}) {
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <span className="text-[var(--text-light)] text-[13px] font-display">
                    Hiển thị {loading ? '...' : totalCount} sản phẩm
                </span>
                <select
                    className="py-2 px-4 border border-[var(--border)] bg-white text-[13px] text-[var(--text)] cursor-pointer outline-none focus:border-[#c4a882] font-display"
                    value={sortOption}
                    onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
                >
                    <option value="newest">Mới nhất</option>
                    <option value="price-asc">Giá: Thấp → Cao</option>
                    <option value="price-desc">Giá: Cao → Thấp</option>
                    <option value="bestseller">Bán chạy nhất</option>
                    <option value="rating">Đánh giá cao</option>
                </select>
            </div>

            {/* Grid sản phẩm */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    // Skeleton loader
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="opacity-40">
                            <div className="bg-[#f0f0f0] rounded-sm h-[200px] mb-2.5" />
                            <div className="bg-[#f0f0f0] h-3 my-2 rounded-sm" />
                            <div className="bg-[#f0f0f0] h-3.5 rounded-sm w-1/2" />
                        </div>
                    ))
                ) : products.length === 0 ? (
                    <div className="col-span-full text-center py-16 text-[#aaa]">
                        <p className="font-display">Không tìm thấy sản phẩm nào.</p>
                        <button
                            className="mt-4 bg-[#1a1a1a] text-white py-2 px-6 rounded-sm text-[13px] cursor-pointer hover:bg-[#444] transition-colors"
                            onClick={clearFilters}
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                ) : (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 py-8 mt-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`w-9 h-9 border border-[#ddd] flex items-center justify-center text-[13px] rounded-sm cursor-pointer transition-colors duration-200 font-display ${
                                p === currentPage ? 'bg-[#b5624a] text-white border-[#b5624a]' : 'bg-transparent text-[#1a1a1a] hover:bg-[#f5f5f5]'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
