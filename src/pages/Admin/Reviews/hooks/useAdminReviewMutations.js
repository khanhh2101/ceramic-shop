import { z } from 'zod';

const MutationResponseSchema = z.any(); // Mutation responses are flexible

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useDeleteAdminReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => MutationResponseSchema.parse(await api.delete(`/reviews/${id}`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
  });
};

export const useToggleAdminReviewStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isApproved }) => MutationResponseSchema.parse(await api.put(`/reviews/${id}/approve`), { isApproved }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
  });
};
