import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

/**
 * Component chặn hiển thị UI nếu User không có quyền tương ứng.
 * @param {string|string[]} require - Mã quyền cần thiết (VD: 'Products.Create').
 *        Nếu là mảng, User chỉ cần có 1 trong các quyền (hoặc đổi logic tuỳ ý).
 * @param {React.ReactNode} fallback - UI hiển thị thay thế nếu không có quyền (Mặc định: null).
 * @param {React.ReactNode} children - UI hiển thị khi có quyền.
 */
export const PermissionGuard = ({ require, fallback = null, children }) => {
  const { hasPermission, isLoading } = usePermissions();

  if (isLoading) {
    // Có thể return null hoặc skeleton nhỏ trong lúc chờ check quyền
    return null;
  }

  const isAllowed = Array.isArray(require)
    ? require.some((code) => hasPermission(code))
    : hasPermission(require);

  if (!isAllowed) {
    return fallback;
  }

  return <>{children}</>;
};

export default PermissionGuard;
