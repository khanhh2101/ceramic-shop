import { useMutation } from '@tanstack/react-query';
import marketingService from '../services/marketingService';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils';

export const useSendMassEmail = () => {
  return useMutation({
    mutationFn: (data) => marketingService.sendMassEmail(data),
    onSuccess: (data) => {
      toast.success(data?.data || 'Gửi chiến dịch email thành công!');
    },
    onError: (error) => {
      /* toast handled by api */
    },
  });
};
