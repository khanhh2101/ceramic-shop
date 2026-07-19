import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import { sharedApi } from '@/services/sharedApi';
import { homeApi } from '@/pages/Customer/Home/api/homeApi';
import store from '@/store';
import { syncCartWithProducts } from '@/store/slices/cartSlice';
import { z } from 'zod';

const HomeDataSchema = z.object({
  bestSellers: z.array(z.any()).catch([]),
  newProducts: z.array(z.any()).catch([]),
  homeBlocks: z.record(z.any()).catch({})
});

export const useHomeData = (options = {}) => {
  return useQuery({
    queryKey: ['home', 'data'],
    queryFn: async () => {
      const [bestRes, newRes, homeRes] = await Promise.all([
          homeApi.getBestSellers(8),
          sharedApi.getProducts({ limit: 8, sort: 'newest' }),
          homeApi.getHomeContent()
      ]);

      const extractData = (res) => {
          if (!res) return [];
          if (Array.isArray(res)) return res;
          return res.items || res.data || [];
      };

      const bestSellersData = extractData(bestRes);
      const newProductsData = extractData(newRes);
      
      const allProducts = [...bestSellersData, ...newProductsData];
      if (allProducts.length > 0) {
          store.dispatch(syncCartWithProducts(allProducts));
      }

      const blockMap = {};
      const blocks = extractData(homeRes);
      blocks.forEach(b => {
          try {
              blockMap[b.blockKey] = { ...b, data: JSON.parse(b.dataJson) };
          } catch {
              blockMap[b.blockKey] = { ...b, data: {} };
          }
      });

      return HomeDataSchema.parse({
          bestSellers: bestSellersData,
          newProducts: newProductsData.length > 0 ? newProductsData : bestSellersData.slice(0, 4),
          homeBlocks: blockMap
      });
    },
    ...QUERY_CONFIGS.HIGH,
    ...options
  });
};

const SettingsSchema = z.record(z.any()).catch({});

export const useSettings = (options = {}) => {
  return useQuery({
    queryKey: ['settings', 'home'],
    queryFn: async () => {
      const res = await homeApi.getHomeContent();
      const data = res?.data || res?.items || res || [];
      const blockMap = {};
      data.forEach(b => {
          try {
              blockMap[b.blockKey] = { ...JSON.parse(b.dataJson), isVisible: b.isVisible };
          } catch (e) {
              blockMap[b.blockKey] = { isVisible: b.isVisible };
          }
      });
      return SettingsSchema.parse(blockMap);
    },
    ...QUERY_CONFIGS.STATIC,
    ...options
  });
};

export const useTimeline = (options = {}) => {
  return useQuery({
    queryKey: ['settings', 'timeline'],
    queryFn: async () => {
      const res = await homeApi.getTimeline();
      return Array.isArray(res) ? res : (res?.data || res?.items || []);
    },
    ...QUERY_CONFIGS.STATIC,
    ...options
  });
};

export const useGlobalSettings = (options = {}) => {
  return useQuery({
    queryKey: ['settings', 'global'],
    queryFn: async () => {
      const { settingsService } = await import('@/services/index');
      const res = await settingsService.getPublic();
      const items = Array.isArray(res?.data) ? res.data : res?.items || res || [];
      const map = {};
      items.forEach(item => {
        map[item.key] = item.value;
      });
      return map;
    },
    ...QUERY_CONFIGS.STATIC,
    ...options
  });
};
