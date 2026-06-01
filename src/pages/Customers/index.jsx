import './CustomersStyle.css';

function Customers() {
    return (
        <div className="admin-section" id="admin-customers">
            <div className="admin-table-wrap">
                <div className="admin-table-header">
                    <h3>Khách hàng</h3>
                    <span
                        style={{ fontSize: '13px', color: 'var(--text-light)' }}
                    >
                        Tổng: <strong>256</strong> khách hàng
                    </span>
                </div>
                <table className="admin-table" id="adminCustomersTable"></table>
            </div>
        </div>
    );
}
export default Customers;
