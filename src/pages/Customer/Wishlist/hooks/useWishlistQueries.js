import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import { wishlistApi } from '../api/wishlistApi';

export const useWishlistProducts = (wishlistIds, options = {}) => {
  return useQuery({
    queryKey: ['wishlist', 'products', wishlistIds],
    queryFn: async () => {
      if (!wishlistIds || wishlistIds.length === 0) {
        return [];
      }
      return await wishlistApi.getWishlistProducts(wishlistIds);
    },
    ...QUERY_CONFIGS.HIGH,
    ...options
  });
};
