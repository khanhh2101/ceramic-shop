import AdminSideBar from '@/components/Layout/components/AdminSidebar';

function AdminOnly({ children }) {
    return (
        <div>
            <AdminSideBar />
            <div className="container">
                <div className="content">{children}</div>
            </div>
        </div>
    );
}

export default AdminOnly;
