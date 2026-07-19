import { useQuery } from '@tanstack/react-query';
import { sharedApi } from '@/services/sharedApi';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import { z } from 'zod';

const MasterDataArraySchema = z.array(z.any()).catch([]);

export const useCategories = (options = {}) => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await sharedApi.getCategories();
      return MasterDataArraySchema.parse(res?.data || res || []);
    },
    ...QUERY_CONFIGS.STATIC,
    ...options
  });
};

export const useColors = (options = {}) => {
  return useQuery({
    queryKey: ['masterData', 'colors'],
    queryFn: async () => {
      const res = await sharedApi.getMasterDataGenerals(100);
      return MasterDataArraySchema.parse(res?.data || res || []);
    },
    ...QUERY_CONFIGS.STATIC,
    ...options
  });
};

export const useTags = (options = {}) => {
  return useQuery({
    queryKey: ['masterData', 'tags'],
    queryFn: async () => {
      const res = await sharedApi.getMasterDataGenerals(200);
      return MasterDataArraySchema.parse(res?.data || res || []);
    },
    ...QUERY_CONFIGS.STATIC,
    ...options
  });
};
