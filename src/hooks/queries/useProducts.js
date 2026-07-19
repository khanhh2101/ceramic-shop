import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services';
import api from '@/services/api';
import store from '@/store';
import { syncCartWithProducts } from '@/store/slices/cartSlice';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import { z } from 'zod';

const ProductListSchema = z.object({
  items: z.array(z.any()).catch([]),
  totalCount: z.number().catch(0),
  totalPages: z.number().catch(1)
});

const ProductArraySchema = z.array(z.any()).catch([]);
const ProductDetailSchema = z.object({}).passthrough().catch({});

export const useProducts = (params, options = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const res = await productService.getProducts(params);
      const result = ProductListSchema.parse({
        items: Array.isArray(res?.data) ? res.data : (res?.items || []),
        totalCount: res?.totalCount || 0,
        totalPages: res?.totalPages || 1,
      });
      store.dispatch(syncCartWithProducts(result.items));
      return result;
    },
    ...QUERY_CONFIGS.HIGH,
    ...options
  });
};

export const useProductDetails = (slug, options = {}) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const isNumeric = /^\d+$/.test(slug);
      const endpoint = isNumeric ? `/products/${slug}` : `/products/slug/${slug}`;
      const res = await api.get(endpoint);
      const data = ProductDetailSchema.parse(res?.data || res || {});
      if (data && Object.keys(data).length > 0) store.dispatch(syncCartWithProducts([data]));
      return data;
    },
    enabled: !!slug,
    ...QUERY_CONFIGS.CRITICAL,
    ...options
  });
};

export const useSimilarProducts = (productId, options = {}) => {
  return useQuery({
    queryKey: ['products', 'similar', productId],
    queryFn: async () => {
      const res = await productService.getSimilar(productId);
      return ProductArraySchema.parse(Array.isArray(res?.data) ? res.data : (res?.items || []));
    },
    enabled: !!productId,
    ...QUERY_CONFIGS.HIGH,
    ...options
  });
};

const ReviewStatsSchema = z.object({
  items: z.array(z.any()).catch([]),
  averageRating: z.number().catch(0),
  totalCount: z.number().catch(0)
});

export const useProductReviews = (productId, options = {}) => {
  return useQuery({
    queryKey: ['products', 'reviews', productId],
    queryFn: async () => {
      const res = await productService.getReviews(productId);
      return ReviewStatsSchema.parse({
        items: Array.isArray(res?.data) ? res.data : (res?.items || []),
        averageRating: res?.averageRating || 0,
        totalCount: res?.totalCount || 0,
      });
    },
    enabled: !!productId,
    ...options
  });
};

export const useBestsellers = (count = 8, options = {}) => {
  return useQuery({
    queryKey: ['products', 'bestsellers', count],
    queryFn: async () => {
      const res = await productService.getBestsellers(count);
      return ProductArraySchema.parse(Array.isArray(res?.data) ? res.data : (res?.items || []));
    },
    ...options
  });
};
