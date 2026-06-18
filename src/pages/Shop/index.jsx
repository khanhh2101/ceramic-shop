import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopStyle.css';

function Shop() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:23828/api/v1/categories')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Chuyển đổi phản hồi sang JSON
            })
            .then((result) => {
                if (result.success) {
                    const data = result.data;
                    setCategories(data);
                }
            })
            .catch((ms) => {
                console.error('Lỗi gọi API:', ms);
            });
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(
                'http://localhost:23828/api/v1/products?sort=newest&page=0&size=20',
            );
            const result = await response.json();
            setProducts(result.data.content);
        } catch (error) {
            console.error(error);
        }
    };

    const priceRanges = [
        {
            value: '0 - 100.000',
            label: '0 - 100.000 VND',
        },

        {
            value: '100.000 - 200.000',
            label: '100.000 - 200.000 VND',
        },
        {
            value: '200.000 - 9.999.999',
            label: '200.000 - 9.999.999 VND',
        },
    ];

    const colors = [
        {
            color: '#fafafaff',
            title: 'White',
        },
        {
            color: '#6b4c3b',
            title: 'Brown',
        },
        {
            color: '#b5624a',
            title: 'Brick red',
        },
        {
            color: '#000000ff',
            title: 'Black',
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
                                    value={item.id}
                                    type="checkbox"
                                    // checked={selectedCategories.includes(cat)}
                                    // onChange={() => toggleCategory(cat)}
                                    className="cat-filter"
                                />
                                {item.name}
                            </div>
                        ))}
                    </div>

                    {/* Giá */}
                    <div className="filter-group">
                        <h3>Price</h3>
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
                        <h3>Color</h3>
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
                        <span className="shop-count">
                            Hiển thị {products.length} sản phẩm
                        </span>
                        <select
                            className="shop-sort"
                            // value={sortOption}
                            // onChange={handleSort}
                        >
                            <option value="name">Sort By: Name A-Z</option>
                            <option value="price-asc">
                                Price: Low to Hight
                            </option>
                            <option value="price-desc">
                                Price: Hight to Low
                            </option>
                            <option value="new">Newest</option>
                        </select>
                    </div>

                    {/* Grid sản phẩm */}
                    <div className="product-list" id="productList">
                        {/* Sau này sẽ render danh sách sản phẩm ở đây */}
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="product-card"
                                onClick={() =>
                                    navigate(`/Details/${product.id}`)
                                }
                            >
                                <img
                                    src={product.primaryImageUrl}
                                    alt={product.name}
                                    width="200"
                                />
                                <h3>{product.name}</h3>
                                <p>
                                    {product.price.toLocaleString('vi-VN')} VNĐ
                                </p>
                                <p>{product.categoryName}</p>
                            </div>
                        ))}
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
