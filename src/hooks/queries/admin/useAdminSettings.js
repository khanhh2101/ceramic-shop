import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import { adminSettingsApi } from '@/pages/Admin/Settings/api/adminSettingsApi';

export const useAdminSiteSettings = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'settings', 'site'],
    queryFn: async () => {
      const res = await adminSettingsApi.getSiteSettings();
      return Array.isArray(res) ? res : (res?.data || res?.items || []);
    },
    ...QUERY_CONFIGS.STATIC,
    ...options
  });
};

export const useAdminHomeBlocks = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'settings', 'homeBlocks'],
    queryFn: async () => {
      const res = await adminSettingsApi.getHomeBlocks();
      return Array.isArray(res) ? res : (res?.data || res?.items || []);
    },
    ...QUERY_CONFIGS.MODERATE,
    ...options
  });
};

export const useAdminTimeline = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'settings', 'timeline'],
    queryFn: async () => {
      const res = await adminSettingsApi.getTimeline();
      return Array.isArray(res) ? res : (res?.data || res?.items || []);
    },
    ...QUERY_CONFIGS.STATIC,
    ...options
  });
};

export const useAdminEmailTemplates = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'settings', 'emailTemplates'],
    queryFn: async () => {
      const res = await adminSettingsApi.getEmailTemplates();
      return Array.isArray(res) ? res : (res?.data || res?.items || []);
    },
    ...QUERY_CONFIGS.STATIC,
    ...options
  });
};
