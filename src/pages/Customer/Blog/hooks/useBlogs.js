import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import api from '@/services/api';
import { z } from 'zod';

const BlogListSchema = z.object({
  items: z.array(z.any()).catch([]),
  totalCount: z.number().catch(0),
  totalPages: z.number().catch(1)
});

const BlogDetailSchema = z.object({}).passthrough().catch({});

export const useBlogs = (params, options = {}) => {
  return useQuery({
    queryKey: ['blogs', params],
    queryFn: async () => {
      const res = await api.get('/blogs', { params });
      return BlogListSchema.parse({
        items: Array.isArray(res?.data) ? res.data : (res?.items || []),
        totalCount: res?.totalCount || 0,
        totalPages: res?.totalPages || 1
      });
    },
    ...QUERY_CONFIGS.MODERATE,
    ...options
  });
};

export const useBlogDetails = (slug, options = {}) => {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await api.get(`/blogs/slug/${slug}`);
      const data = res?.data || res;
      return BlogDetailSchema.parse(data || {});
    },
    enabled: !!slug,
    ...QUERY_CONFIGS.MODERATE,
    ...options
  });
};
