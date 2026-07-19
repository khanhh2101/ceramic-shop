import { z } from 'zod';

const MutationResponseSchema = z.any(); // Mutation responses are flexible

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useCreateAdminBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => MutationResponseSchema.parse(await api.post('/blogs'), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] })
  });
};

export const useUpdateAdminBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => MutationResponseSchema.parse(await api.put(`/blogs/${id}`), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] })
  });
};

export const useDeleteAdminBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => MutationResponseSchema.parse(await api.delete(`/blogs/${id}`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] })
  });
};
