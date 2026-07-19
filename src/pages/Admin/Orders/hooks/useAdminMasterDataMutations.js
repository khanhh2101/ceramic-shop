import { z } from 'zod';

const MutationResponseSchema = z.any(); // Mutation responses are flexible

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useCreateAdminMasterData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => MutationResponseSchema.parse(await api.post('/master-data'), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'masterdata'] })
  });
};

export const useUpdateAdminMasterData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ masterCode, data }) => MutationResponseSchema.parse(await api.put(`/master-data/${masterCode}`), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'masterdata'] })
  });
};

export const useCreateAdminGeneralCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => MutationResponseSchema.parse(await api.post('/master-data/generals'), data),
    onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'generalcodes', variables.masterCode] });
        queryClient.invalidateQueries({ queryKey: ['masterData'] });
    }
  });
};

export const useDeleteAdminGeneralCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ masterCode, generalCode }) => MutationResponseSchema.parse(await api.delete(`/master-data/${masterCode}/generals/${generalCode}`)),
    onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'generalcodes', variables.masterCode] });
        queryClient.invalidateQueries({ queryKey: ['masterData'] });
    }
  });
};
