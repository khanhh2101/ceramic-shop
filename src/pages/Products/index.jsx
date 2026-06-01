import './ProductsStyle.css';

function Products() {
    return (
        <div className="admin-section" id="admin-products">
            <div className="admin-table-wrap">
                <div className="admin-table-header">
                    <h3>Quản lý sản phẩm</h3>
                    <button
                        className="btn btn-dark btn-sm"
                        //   onClick="showAddProductModal()"
                    >
                        + Thêm sản phẩm
                    </button>
                </div>
                <input
                    placeholder="🔍 Tìm kiếm sản phẩm..."
                    style={{
                        padding: '10px 16px',
                        border: '1px solid var(--border)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        width: '300px',
                        marginBottom: '16px',
                        outline: 'none',
                    }}

                    // onInput="searchAdminProducts(this.value)"
                />
                <table className="admin-table" id="adminProductsTable"></table>
            </div>
        </div>
    );
}

export default Products;
