import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveTabId } from '@/store/slices/tabsSlice';
import { useLocation } from 'react-router-dom';

/**
 * Hook tự động gọi lại hàm refetch() (ví dụ của RTK Query hoặc React Query)
 * mỗi khi người dùng click quay trở lại Tab này, giúp cập nhật dữ liệu mới nhất.
 * 
 * @param {Function} refetchFn - Hàm refetch dữ liệu
 * @param {string} tabId - ID của tab (Mặc định sẽ lấy URL hiện tại)
 */
export default function useAutoRefetch(refetchFn, tabId = null) {
  const activeTabId = useSelector(selectActiveTabId);
  const location = useLocation();
  const id = tabId || location.pathname;
  
  const prevActiveTabIdRef = useRef(activeTabId);

  useEffect(() => {
    // Chỉ trigger khi Tab hiện tại VỪA TRỞ THÀNH "Active" (Chuyển từ tab khác sang tab này)
    if (activeTabId === id && prevActiveTabIdRef.current !== id) {
      if (typeof refetchFn === 'function') {
        refetchFn();
      }
    }
    prevActiveTabIdRef.current = activeTabId;
  }, [activeTabId, id, refetchFn]);
}
