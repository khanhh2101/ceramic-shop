import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import { cartApi } from '@/services';
import { productService } from '@/services';
import { selectCartItems, syncCartWithProducts } from '@/store/slices/cartSlice';
import { z } from 'zod';

const CartResponseSchema = z.object({}).passthrough().catch({});
const ValidProductsSchema = z.array(z.any()).catch([]);

export const useCart = (options = {}) => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await cartApi.getCart();
      const data = res?.data || res;
      return CartResponseSchema.parse(data || {});
    },
    ...QUERY_CONFIGS.HIGH,
    ...options
  });
};

// Hook chạy ngầm để lấy thông tin mới nhất của CHÍNH CÁC SẢN PHẨM trong giỏ hàng
export const useCartValidator = (options = {}) => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();

  // Chỉ lấy danh sách ID sản phẩm không trùng lặp
  const productIds = [...new Set(cartItems.map(item => item.productId).filter(Boolean))];

  return useQuery({
    queryKey: ['cartValidator', productIds],
    queryFn: async () => {
      if (productIds.length === 0) return [];

      // Fetch tất cả sản phẩm đang có trong giỏ hàng
      const promises = productIds.map(id => productService.getById(id));
      const results = await Promise.all(promises);
      
      let validProducts = results.map(r => r?.data || r).filter(Boolean);
      validProducts = ValidProductsSchema.parse(validProducts);
      
      // Đồng bộ thông tin mới nhất (Giá, Tồn kho) vào Redux Cart
      if (validProducts.length > 0) {
        dispatch(syncCartWithProducts(validProducts));
      }
      
      return validProducts;
    },
    ...QUERY_CONFIGS.HIGH,
    enabled: productIds.length > 0,
    ...options
  });
};
