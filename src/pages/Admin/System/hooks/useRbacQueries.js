import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rbacService } from '@/services/rbacApi';
import toast from 'react-hot-toast';

export const useGroups = () => {
  return useQuery({
    queryKey: ['rbac', 'groups'],
    queryFn: async () => {
      const res = await rbacService.getGroups();
      return res?.data || res || [];
    }
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rbacService.createGroup,
    onSuccess: () => {
      toast.success('Thêm nhóm thành công');
      queryClient.invalidateQueries({ queryKey: ['rbac', 'groups'] });
    }
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => rbacService.updateGroup(id, data),
    onSuccess: () => {
      toast.success('Cập nhật nhóm thành công');
      queryClient.invalidateQueries({ queryKey: ['rbac', 'groups'] });
    }
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rbacService.deleteGroup,
    onSuccess: () => {
      toast.success('Xoá nhóm thành công');
      queryClient.invalidateQueries({ queryKey: ['rbac', 'groups'] });
    }
  });
};

export const useAssignRolesToGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => rbacService.assignRolesToGroup(id, data),
    onSuccess: () => {
      toast.success('Cập nhật quyền cho nhóm thành công');
      queryClient.invalidateQueries({ queryKey: ['rbac', 'groups'] });
    }
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: ['rbac', 'roles'],
    queryFn: async () => {
      const res = await rbacService.getRoles();
      return res?.data || res || [];
    }
  });
};

export const usePermissions = () => {
  return useQuery({
    queryKey: ['rbac', 'permissions'],
    queryFn: async () => {
      const res = await rbacService.getPermissions();
      return res?.data || res || [];
    }
  });
};

export const useRolePermissions = (roleId) => {
  return useQuery({
    queryKey: ['rbac', 'rolePermissions', roleId],
    queryFn: async () => {
      const res = await rbacService.getRolePermissions(roleId);
      return res?.data || res || [];
    },
    enabled: !!roleId
  });
};

export const useAssignPermissionsToRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, data }) => rbacService.assignPermissionsToRole(roleId, data),
    onSuccess: (_, variables) => {
      toast.success('Đã cập nhật quyền thành công');
      queryClient.invalidateQueries({ queryKey: ['rbac', 'rolePermissions', variables.roleId] });
      // Invalidate both my permissions and my menu because changes might affect current user
      queryClient.invalidateQueries({ queryKey: ['auth', 'permissions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'myMenu'] });
    }
  });
};
