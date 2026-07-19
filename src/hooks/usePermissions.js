import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';

/**
 * Hook fetch danh sách quyền (permissions) của User đang đăng nhập.
 * Cache thời gian dài vì ít khi đổi (ví dụ: 5 phút).
 */
export const usePermissions = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['user-permissions'],
    queryFn: async () => {
      const response = await api.get('/users/me/permissions');
      return response?.data?.data || [];
    },
    enabled: isAuthenticated, // Chỉ fetch khi đã đăng nhập
    staleTime: 5 * 60 * 1000, // 5 phút
    cacheTime: 10 * 60 * 1000,
  });

  return {
    permissions: data || [],
    isLoading,
    isError,
    // Hàm tiện ích để check nhanh
    hasPermission: (code) => {
      if (!data) return false;
      return data.includes(code);
    }
  };
};
