import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import emailTemplateService from '../services/emailTemplateService';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils';

export const useEmailTemplates = () => {
  return useQuery({
    queryKey: ['emailTemplates'],
    queryFn: async () => {
      const response = await emailTemplateService.getTemplates();
      return response;
    },
  });
};

export const useEmailTemplate = (id) => {
  return useQuery({
    queryKey: ['emailTemplate', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await emailTemplateService.getTemplateById(id);
      return response;
    },
    enabled: !!id,
  });
};

export const useUpdateEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => emailTemplateService.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success('Cập nhật mẫu email thành công');
    },
    onError: (error) => {
      /* toast handled by api */
    },
  });
};
