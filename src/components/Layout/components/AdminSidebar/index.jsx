import { useNavigate } from 'react-router-dom';
import './AdminSidebarStyle.css';

function AdminSidebar({}) {
    const navigate = useNavigate();
    return (
        <div id="admin-panel">
            <div className="admin-sidebar">
                <div className="admin-logo">
                    ⚬ <span>Ceramic Admin</span>
                </div>
                <div
                    className="admin-nav-item active"
                    onClick={() => navigate('dashboard')}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    Dashboard
                </div>
                <div
                    className="admin-nav-item"
                    onClick={() => navigate('products')}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                    Sản phẩm
                </div>
                <div
                    className="admin-nav-item"
                    onClick={() => navigate('orders')}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                    </svg>
                    Đơn hàng
                </div>
                <div
                    className="admin-nav-item"
                    onClick={() => navigate('banners')}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                    Banner & Hình ảnh
                </div>
                <div
                    className="admin-nav-item"
                    onClick={() => navigate('customers')}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Khách hàng
                </div>
                <div
                    className="admin-nav-item"
                    onClick={() => navigate('analytics')}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                    Thống kê
                </div>
                <div
                    className="admin-nav-item"
                    onClick={() => navigate('settings')}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.07 4.93l-1.41 1.41M12 2v2M4.93 4.93l1.41 1.41M2 12h2M4.93 19.07l1.41-1.41M12 20v2M19.07 19.07l-1.41-1.41M20 12h2" />
                    </svg>
                    Cài đặt
                </div>
                <div
                    className="admin-nav-item"
                    // onClick={hideAdmin()}
                    style={{
                        marginTop: 'auto',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        paddingTop: '16px',
                        marginTop: '32px',
                    }}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Về cửa hàng
                </div>
            </div>

            <div className="admin-main">
                <div className="admin-topbar">
                    <h2 id="adminPageTitle">Dashboard</h2>
                    <div className="admin-user">
                        <span>Admin</span>
                        <div className="avatar">A</div>
                    </div>
                </div>
                <div className="admin-content"></div>
            </div>
        </div>
    );
}

export default AdminSidebar;
