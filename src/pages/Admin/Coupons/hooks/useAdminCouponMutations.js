import { z } from 'zod';

const MutationResponseSchema = z.any(); // Mutation responses are flexible

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useCreateAdminCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => MutationResponseSchema.parse(await api.post('/coupons/admin'), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
  });
};

export const useUpdateAdminCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => MutationResponseSchema.parse(await api.put(`/coupons/admin/${id}`), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
  });
};

export const useDeleteAdminCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => MutationResponseSchema.parse(await api.delete(`/coupons/admin/${id}`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
  });
};
