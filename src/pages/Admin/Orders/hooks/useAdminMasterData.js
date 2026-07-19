import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import api from '@/services/api';

export const useAdminMasterData = (params, options = {}) => {
  return useQuery({
    queryKey: ['admin', 'masterdata', params],
    queryFn: async () => {
      const res = await api.get('/master-data', { params });
      return z.object({ items: z.array(z.any()).catch([]), totalCount: z.number().catch(0), totalPages: z.number().catch(1) }).passthrough().parse({
        items: Array.isArray(res) ? res : (res?.data || res?.items || []),
        totalCount: res?.totalCount || 0,
        totalPages: res?.totalPages || 1
      });
    },
    ...QUERY_CONFIGS.MODERATE,
    ...options
  });
};

export const useAdminGeneralCodes = (masterCode, options = {}) => {
  return useQuery({
    queryKey: ['admin', 'generalcodes', masterCode],
    queryFn: async () => {
      const res = await api.get(`/master-data/${masterCode}/generals`);
      return res?.data || res || [];
    },
    enabled: !!masterCode,
    ...QUERY_CONFIGS.MODERATE,
    ...options
  });
};
