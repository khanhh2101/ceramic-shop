/**
 * Hàm định dạng tiền tệ sang chuẩn Việt Nam Đồng (VND)
 * @param {number} amount - Số tiền cần định dạng
 * @returns {string} Chuỗi tiền tệ đã định dạng (VD: 1.000.000 ₫)
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(amount || 0);
};

/**
 * Hàm định dạng ngày tháng sang chuẩn Việt Nam
 * @param {string|Date} dateString - Chuỗi ngày tháng hoặc object Date
 * @param {object} options - Tuỳ chọn thêm cho Intl.DateTimeFormat
 * @returns {string} Chuỗi ngày tháng đã định dạng
 */
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', options);
};

/**
 * Hàm định dạng ngày tháng kèm thời gian (giờ:phút) sang chuẩn Việt Nam
 * @param {string|Date} dateString - Chuỗi ngày tháng hoặc object Date
 * @returns {string} Chuỗi ngày giờ đã định dạng
 */
export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
