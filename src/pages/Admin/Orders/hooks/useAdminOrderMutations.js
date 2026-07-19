import { z } from 'zod';

const MutationResponseSchema = z.any(); // Mutation responses are flexible

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminOrderApi } from '@/pages/Admin/Orders/api/adminOrderApi';

export const useUpdateAdminOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, reason }) => MutationResponseSchema.parse(await adminOrderApi.updateStatus(id), status, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
  });
};
