import './BannerImageStyle.css';

function BannerImage() {
    return (
        <div className="admin-section" id="admin-banners">
            <div className="admin-form-wrap" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>
                    Tải lên banner/hình ảnh mới
                </h3>
                <div className="admin-form-grid">
                    <div className="form-group">
                        <label>Tên banner</label>
                        <input
                            placeholder="Ví dụ: Hero Banner Tết 2025"
                            id="bannerName"
                        />
                    </div>
                    <div className="form-group">
                        <label>Vị trí</label>
                        <select
                            style={{
                                padding: '12px 16px',
                                border: '1px solid var(--border)',
                                fontFamily: 'var(--font-body)',
                                fontSize: '14px',
                            }}
                            id="bannerPosition"
                        >
                            <option>Hero Banner</option>
                            <option>Promo Banner</option>
                            <option>Category Banner</option>
                            <option>Product Image</option>
                        </select>
                    </div>
                </div>
                <div
                    className="upload-area"
                    // onClick={document.getElementById('fileInput').click()}
                >
                    <div style={{ fontSize: '36px', marginBottom: '8px' }}>
                        📁
                    </div>
                    <p>Nhấp để chọn hình ảnh hoặc kéo thả vào đây</p>
                    <p style={{ fontSize: '11px', marginTop: '4px' }}>
                        PNG, JPG, WEBP — Tối đa 5MB
                    </p>
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: 'none' }}
                        accept="image/*"
                        // onChange={handleImageUpload(this)}
                    />
                </div>
                <button
                    className="btn btn-dark btn-sm"
                    style={{ marginTop: '16px' }}
                    // onClick={saveBanner()}
                >
                    LƯU BANNER
                </button>
            </div>
            <div className="admin-table-wrap">
                <div className="admin-table-header">
                    <h3>Thư viện hình ảnh</h3>
                </div>
                <div className="img-gallery" id="bannerGallery"></div>
            </div>
        </div>
    );
}
export default BannerImage;
