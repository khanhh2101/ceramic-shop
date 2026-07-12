import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const response = await api.get('/users', { params });
      // return the actual data array/object from standard API wrapper
      return response?.data || response;
    },
    // Optional: Keep previous data while fetching new to avoid loading flashes
    placeholderData: (previousData) => previousData,
  });
};
