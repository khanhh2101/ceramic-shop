import './SaleOrderStyle.css';

function SaleOrder() {
    return (
        <div
            className="admin-section"
            id="admin-orders"
            style={{ display: 'none' }}
        >
            <div className="admin-table-wrap">
                <div className="admin-table-header">
                    <h3>Quản lý đơn hàng</h3>
                    <select
                        style={{
                            padding: '8px 16px',
                            border: '1px solid var(--border)',
                            fontFamily: 'var(--font-body)',
                            fontSize: '13px',
                        }}
                        // onchange="filterOrders(this.value)"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="success">Hoàn thành</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="danger">Đã hủy</option>
                    </select>
                </div>
                <table className="admin-table" id="adminOrdersTable"></table>
            </div>
        </div>
    );
}
export default SaleOrder;
