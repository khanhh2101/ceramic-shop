import './AdminTopbarStyle.css';

function AdminTopbar(props) {
    return (
        <div className="admin-topbar">
            <h2 id="adminPageTitle">{props.title}</h2>
            <div className="admin-user">
                <span>{props.username}</span>
                <div className="avatar">A</div>
            </div>
        </div>
    );
}

export default AdminTopbar;
