import './AdminStyle.css';

function Admin() {
    return (
        <div className="admin-content">
            {/* {/*  DASHBOARD --> */}
            <div className="admin-section" id="admin-dashboard">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Doanh thu tháng này</div>
                        <div className="stat-value">$24,580</div>
                        <div className="stat-change">
                            ↑ 12.5% so với tháng trước
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Đơn hàng mới</div>
                        <div className="stat-value">148</div>
                        <div className="stat-change">
                            ↑ 8.2% so với tháng trước
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Khách hàng mới</div>
                        <div className="stat-value">96</div>
                        <div className="stat-change">
                            ↑ 5.1% so với tháng trước
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Sản phẩm đã bán</div>
                        <div className="stat-value">342</div>
                        <div className="stat-change down">
                            ↓ 2.3% so với tháng trước
                        </div>
                    </div>
                </div>

                <div className="chart-row">
                    <div className="chart-card">
                        <h3>Doanh thu theo tháng</h3>
                        <canvas id="revenueChart" height="80"></canvas>
                    </div>
                    <div className="chart-card">
                        <h3>Sản phẩm theo danh mục</h3>
                        <canvas id="categoryChart" height="160"></canvas>
                    </div>
                </div>

                <div className="admin-table-wrap">
                    <div className="admin-table-header">
                        <h3>Đơn hàng gần đây</h3>
                        <button
                            className="btn btn-dark btn-sm"
                            // onClick={adminNav('orders', null)}
                        >
                            Xem tất cả
                        </button>
                    </div>
                    <table className="admin-table" id="recentOrders"></table>
                </div>
            </div>
        </div>
    );
}
export default Admin;
