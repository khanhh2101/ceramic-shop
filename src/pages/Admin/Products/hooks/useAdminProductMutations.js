import { z } from 'zod';

const MutationResponseSchema = z.any(); // Mutation responses are flexible

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductApi } from '@/pages/Admin/Products/api/adminProductApi';
import toast from 'react-hot-toast';

export const useCreateAdminProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => MutationResponseSchema.parse(await adminProductApi.createProduct(data)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
  });
};

export const useUpdateAdminProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => MutationResponseSchema.parse(await adminProductApi.updateProduct(id), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
  });
};

export const useDeleteAdminProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => MutationResponseSchema.parse(await adminProductApi.deleteProduct(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
  });
};

export const useToggleAdminProductStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => MutationResponseSchema.parse(await adminProductApi.toggleStatus(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
  });
};
