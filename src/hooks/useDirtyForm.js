import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTabDirty } from '@/store/slices/tabsSlice';
import { useLocation } from 'react-router-dom';

/**
 * Hook giúp bật cảnh báo mất dữ liệu khi người dùng cố tình đóng Tab hoặc tải lại trang (F5)
 * @param {boolean} isDirty - Trạng thái form đã bị thay đổi hay chưa
 * @param {string} tabId - ID của tab (Mặc định sẽ lấy URL hiện tại nếu không truyền)
 */
export default function useDirtyForm(isDirty, tabId = null) {
  const dispatch = useDispatch();
  const location = useLocation();
  const id = tabId || location.pathname;

  useEffect(() => {
    // Cập nhật trạng thái dirty vào Redux để AdminTabs biết
    dispatch(setTabDirty({ tabId: id, isDirty }));

    // Cảnh báo khi tải lại trang (F5) hoặc đóng hẳn Browser
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Bắt buộc đối với các trình duyệt nhân Chromium
      }
    };

    if (isDirty) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Nếu component unmount (ví dụ form gửi thành công và unmount), tự động xóa cờ dirty
      // Lưu ý: Trong kiến trúc ẩn Tab (display: none), component không unmount khi chuyển tab.
      if (!isDirty) {
        dispatch(setTabDirty({ tabId: id, isDirty: false }));
      }
    };
  }, [isDirty, id, dispatch]);
}
