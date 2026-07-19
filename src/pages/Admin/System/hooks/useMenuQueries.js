import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '@/services/menuApi';
import toast from 'react-hot-toast';

export const useAdminMenus = () => {
  return useQuery({
    queryKey: ['admin', 'menus'],
    queryFn: async () => {
      const res = await menuService.getAll();
      return res?.data || res || [];
    }
  });
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: menuService.create,
    onSuccess: () => {
      toast.success('Thêm menu thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'menus'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'myMenu'] });
    }
  });
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => menuService.update(id, data),
    onSuccess: () => {
      toast.success('Cập nhật menu thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'menus'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'myMenu'] });
    }
  });
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: menuService.delete,
    onSuccess: () => {
      toast.success('Xóa menu thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'menus'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'myMenu'] });
    }
  });
};
