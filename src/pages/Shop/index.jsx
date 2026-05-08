import './ShopStyle.css';

function Shop() {
    const categories = [
        {
            id: 1,
            value: 'Dinnerware',
            label: 'Dinnerware',
        },
        {
            id: 2,
            value: 'Ceramic',
            label: 'Ceramic',
        },
        {
            id: 3,
            value: 'Furniture',
            label: 'Furniture',
        },
        {
            id: 4,
            value: 'Decor Art',
            label: 'Decor Art',
        },
        {
            id: 5,
            value: 'Gifts sets',
            label: 'Gifts sets',
        },
    ];

    const priceRanges = [
        {
            value: '0-50',
            label: '$0 - $50',
        },
        {
            value: '50-100',
            label: '$50 - $100',
        },
        {
            value: '100-200',
            label: '$100 - $200',
        },
        {
            value: '200-9999',
            label: ' Trên $200',
        },
    ];

    const colors = [
        {
            color: '#f5f0ea',
            title: 'Kem',
        },
        {
            color: '#c4a882',
            title: 'Vàng đất',
        },
        {
            color: '#6b4c3b',
            title: 'Nâu',
        },
        {
            color: '#b5624a',
            title: 'Đỏ gạch',
        },
        {
            color: '#7ba3b2',
            title: 'Xanh',
        },
        {
            color: '#8b9d77',
            title: 'Xanh lá',
        },
    ];

    return (
        <div className="page" id="page-shop">
            <div className="shop-layout">
                {/* Sidebar Filter */}
                <div className="shop-sidebar">
                    {/* Danh mục */}
                    <div className="filter-group">
                        <h3>Danh mục</h3>
                        {categories.map((item) => (
                            <div key={item.id} className="filter-item">
                                <input
                                    value={item.value}
                                    type="checkbox"
                                    // checked={selectedCategories.includes(cat)}
                                    // onChange={() => toggleCategory(cat)}
                                    className="cat-filter"
                                />
                                {item.label}
                            </div>
                        ))}
                    </div>

                    {/* Giá */}
                    <div className="filter-group">
                        <h3>Giá</h3>
                        {priceRanges.map(({ value, label }, index) => (
                            <div key={index} className="filter-item">
                                <input
                                    value={value}
                                    type="checkbox"
                                    // checked={selectedPrices.includes(value)}
                                    // onChange={() => togglePrice(value)}
                                    className="price-filter"
                                />
                                {label}
                            </div>
                        ))}
                    </div>

                    {/* Màu sắc */}
                    <div className="filter-group">
                        <h3>Màu sắc</h3>
                        <div className="color-swatches">
                            {colors.map(({ color, title }, index) => (
                                <div
                                    key={index}
                                    className="color-swatch"
                                    // className={`color-swatch ${selectedColors.includes(name) ? 'active' : ''}`}
                                    style={{ background: color }}
                                    title={title}
                                    // onClick={() => toggleColor(name)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="shop-main">
                    <div className="shop-header">
                        <span className="shop-count">Hiển thị 0 sản phẩm</span>
                        <select
                            className="shop-sort"
                            // value={sortOption}
                            // onChange={handleSort}
                        >
                            <option value="name">Sắp xếp: Tên A-Z</option>
                            <option value="price-asc">Giá tăng dần</option>
                            <option value="price-desc">Giá giảm dần</option>
                            <option value="new">Mới nhất</option>
                        </select>
                    </div>

                    {/* Grid sản phẩm */}
                    <div className="product-grid" id="shopGrid">
                        {/* Sau này sẽ render danh sách sản phẩm ở đây */}
                        <p
                            style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                padding: '40px',
                            }}
                        >
                            Đang tải sản phẩm...
                        </p>
                    </div>

                    {/* Phân trang */}
                    <div className="pagination" id="shopPagination">
                        {/* Phân trang sẽ được thêm sau */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Shop;
