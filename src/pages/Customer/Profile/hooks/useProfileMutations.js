import { z } from 'zod';

const MutationResponseSchema = z.any(); // Mutation responses are flexible

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => MutationResponseSchema.parse(await api.put('/users/profile'), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', 'profile'] })
  });
};
