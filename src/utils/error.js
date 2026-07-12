/**
 * Trích xuất thông báo lỗi từ error object của Axios hoặc Error thông thường
 * @param {Error} error - Lỗi bắt được từ try-catch
 * @param {string} defaultMessage - Thông báo mặc định nếu không tìm thấy chi tiết lỗi
 * @returns {string} Thông báo lỗi phù hợp cho người dùng
 */
export const getErrorMessage = (error, defaultMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.') => {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    
    if (error?.response?.data?.title) {
        return error.response.title; // Cho một số chuẩn trả về của .NET
    }

    if (error?.message) {
        return error.message;
    }

    return defaultMessage;
};
