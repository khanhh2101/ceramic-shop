import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { shopApi } from './api/shopApi';
import { sharedApi } from '@/services/sharedApi';
import ShopSidebar from './components/ShopSidebar';
import ProductGrid from './components/ProductGrid';

export default function Shop() {
    const [searchParams] = useSearchParams();

    // Data states
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [masterTags, setMasterTags] = useState([]);
    const [masterColors, setMasterColors] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [sortOption, setSortOption] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    // Fetch master data on mount
    useEffect(() => {
        sharedApi.getCategories().then((res) => setCategories(res?.data || res || [])).catch(() => {});
        sharedApi.getMasterDataGenerals(100).then((res) => setMasterColors(res?.data || res || [])).catch(() => {});
        sharedApi.getMasterDataGenerals(200).then((res) => setMasterTags(res?.data || res || [])).catch(() => {});
    }, []);

    // Fetch products whenever filters/search changes
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.append('page', currentPage);
                params.append('pageSize', pageSize);
                params.append('sortBy', sortOption);

                const search = searchParams.get('search');
                if (search) params.append('search', search);

                if (selectedCategories.length > 0) {
                    params.append('categoryId', selectedCategories[0]);
                }
                
                // Price filter
                if (selectedPrices.includes('0 - 100.000')) {
                    params.append('minPrice', 0);
                    params.append('maxPrice', 100000);
                } else if (selectedPrices.includes('100.000 - 200.000')) {
                    params.append('minPrice', 100000);
                    params.append('maxPrice', 200000);
                } else if (selectedPrices.includes('200.000 - 9.999.999')) {
                    params.append('minPrice', 200000);
                    params.append('maxPrice', 9999999);
                }
                
                // Tags & Colors
                selectedTags.forEach(t => params.append('tags', t));
                selectedColors.forEach(c => params.append('colors', c));

                const res = await shopApi.getProducts(params);
                setProducts(res?.data || []);
                setTotalCount(res?.totalCount || 0);
            } catch (err) {
                console.error('Failed to fetch products', err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams, selectedCategories, selectedPrices, selectedColors, selectedTags, sortOption, currentPage]);

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
