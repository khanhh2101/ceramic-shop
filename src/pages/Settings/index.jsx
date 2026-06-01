import './SettingsStyle.css';

function Settings() {
    return (
        <div className="admin-section" id="admin-settings">
            <div className="admin-form-wrap">
                <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>
                    Cài đặt cửa hàng
                </h3>
                <div className="admin-form-grid">
                    <div className="form-group">
                        <label>Tên cửa hàng</label>
                        <input value="Ceramic Shop" />
                    </div>
                    <div className="form-group">
                        <label>Email liên hệ</label>
                        <input value="info@ceramicshop.vn" />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input value="+84 28 1234 5678" />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ</label>
                        <input value="Bát Tràng, Gia Lâm, Hà Nội" />
                    </div>
                    <div className="form-group">
                        <label>Đơn vị tiền tệ</label>
                        <select
                            style={{
                                padding: '12px 16px',
                                border: '1px solid var(--border)',
                                fontFamily: 'var(--font-body)',
                            }}
                        >
                            <option>USD ($)</option>
                            <option>VND (₫)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Phí vận chuyển mặc định</label>
                        <input value="0" type="number" />
                    </div>
                </div>
                <button
                    className="btn btn-dark"
                    // onclick={() => {showToast('Đã lưu cài đặt!')}
                >
                    LƯU CÀI ĐẶT
                </button>
            </div>
        </div>
    );
}
export default Settings;
