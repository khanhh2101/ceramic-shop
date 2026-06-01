import './StatisticsStyle.css';

function Statistics() {
    return (
        <div className="admin-section" id="admin-analytics">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Tổng doanh thu</div>
                    <div className="stat-value"></div>
                    <div className="stat-change"></div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Tổng đơn hàng</div>
                    <div className="stat-value"></div>
                    <div className="stat-change"></div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Tỷ lệ hoàn thành</div>
                    <div className="stat-value"></div>
                    <div className="stat-change"></div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Đánh giá TB</div>
                    <div className="stat-value"></div>
                    <div className="stat-change"></div>
                </div>
            </div>
            <div className="chart-row">
                <div className="chart-card">
                    <h3>Xu hướng doanh thu 12 tháng</h3>
                    <canvas id="analyticsChart" height="80"></canvas>
                </div>
                <div className="chart-card">
                    <h3>Top sản phẩm bán chạy</h3>
                    <canvas id="topProductsChart" height="160"></canvas>
                </div>
            </div>
        </div>
    );
}
export default Statistics;
