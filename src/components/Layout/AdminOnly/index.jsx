import AdminSidebar from '@/components/Layout/components/AdminSidebar';
import AdminTopbar from '@/components/Layout/components/AdminTopbar';

function AdminOnly({ children, title }) {
    return (
        <div>
            <div id="admin-panel">
                <AdminSidebar />
                <div className="admin-main">
                    <AdminTopbar title={title} />
                    <div className="admin-content">{children}</div>
                </div>
            </div>
        </div>
    );
}

export default AdminOnly;
