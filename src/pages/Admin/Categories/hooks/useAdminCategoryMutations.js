import { z } from 'zod';

const MutationResponseSchema = z.any(); // Mutation responses are flexible

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useCreateAdminCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => MutationResponseSchema.parse(await api.post('/categories'), data),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useUpdateAdminCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => MutationResponseSchema.parse(await api.put(`/categories/${id}`), data),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useDeleteAdminCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => MutationResponseSchema.parse(await api.delete(`/categories/${id}`)),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};
