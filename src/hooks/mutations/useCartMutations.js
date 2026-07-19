import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/services';
import toast from 'react-hot-toast';

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      return await cartApi.addToCart(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, colorId, quantity }) => {
      return await cartApi.updateItemQuantity(productId, colorId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi cập nhật số lượng');
    }
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, colorId }) => {
      return await cartApi.removeItem(productId, colorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Đã xoá sản phẩm khỏi giỏ hàng');
    }
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      return await cartApi.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};
