import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCategories, useColors, useTags } from '@/hooks/queries/useMasterData';
import { useProducts } from '@/hooks/queries/useProducts';
import ShopSidebar from './components/ShopSidebar';
import ProductGrid from './components/ProductGrid';

export default function Shop() {
    const [searchParams] = useSearchParams();

    // Master Data from React Query
    const { data: categories = [] } = useCategories();
    const { data: masterColors = [] } = useColors();
    const { data: masterTags = [] } = useTags();

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [sortOption, setSortOption] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    // Build params dynamically
    const queryParams = useMemo(() => {
        const p = {
            page: currentPage,
            pageSize,
            sortBy: sortOption,
        };
        const search = searchParams.get('search');
        if (search) p.search = search;
        
        if (selectedCategories.length > 0) {
            p.categoryId = selectedCategories[0];
        }

        if (selectedPrices.includes('0 - 100.000')) {
            p.minPrice = 0; p.maxPrice = 100000;
        } else if (selectedPrices.includes('100.000 - 200.000')) {
            p.minPrice = 100000; p.maxPrice = 200000;
        } else if (selectedPrices.includes('200.000 - 9.999.999')) {
            p.minPrice = 200000; p.maxPrice = 9999999;
        }

        if (selectedTags.length > 0) p.tags = selectedTags.join(',');
        if (selectedColors.length > 0) p.colors = selectedColors.join(',');

        return p;
    }, [searchParams, selectedCategories, selectedPrices, selectedColors, selectedTags, sortOption, currentPage]);

    // Fetch Products using React Query
    const { data: productsData, isLoading: loading } = useProducts(queryParams);
    const products = productsData?.items || [];
    const totalCount = productsData?.totalCount || 0;

    const toggleCategory = (id) => {
        setSelectedCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [id]);
        setCurrentPage(1);
    };

    const togglePrice = (value) => {
        setSelectedPrices((prev) => prev.includes(value) ? prev.filter((p) => p !== value) : [value]);
        setCurrentPage(1);
    };

    const toggleTag = (id) => {
        setSelectedTags((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
        setCurrentPage(1);
    };

    const toggleColor = (genCd) => {
        setSelectedColors((prev) => prev.includes(genCd) ? prev.filter((c) => c !== genCd) : [...prev, genCd]);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedPrices([]);
        setSelectedColors([]);
        setSelectedTags([]);
        setCurrentPage(1);
    };

    return (
        <div className="bg-white min-h-screen pb-24" id="page-shop">
            {/* ── Hero Banner ── */}
            <div className="relative h-[40vh] min-h-[300px] mb-12 flex items-center justify-center bg-[#faf7f4] overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2000&auto=format&fit=crop" 
                        alt="Cửa hàng Gốm Nâu"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
                <div className="relative z-10 text-center px-5 max-w-[800px] mx-auto text-white">
                    <h1 className="text-[36px] md:text-[48px] mb-4 font-display leading-[1.1]">
                        Bộ Sưu Tập Gốm
                    </h1>
                    <p className="text-[15px] md:text-[16px] font-light leading-[1.6] opacity-90 max-w-[500px] mx-auto">
                        Khám phá những tác phẩm thủ công tinh xảo, mang trọn tâm huyết của người nghệ nhân.
                    </p>
                </div>
            </div>
            
            <div className="max-w-[1400px] mx-auto px-5 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12">
                {/* ── Sidebar Filter ── */}
                <ShopSidebar
                    categories={categories}
                    masterColors={masterColors}
                    masterTags={masterTags}
                    selectedCategories={selectedCategories}
                    toggleCategory={toggleCategory}
                    selectedPrices={selectedPrices}
                    togglePrice={togglePrice}
                    selectedColors={selectedColors}
                    toggleColor={toggleColor}
                    selectedTags={selectedTags}
                    toggleTag={toggleTag}
                />

                {/* ── Main Content ── */}
                <ProductGrid
                    products={products}
                    loading={loading}
                    totalCount={totalCount}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageSize={pageSize}
                    clearFilters={clearFilters}
                />
            </div>
        </div>
    );
}
