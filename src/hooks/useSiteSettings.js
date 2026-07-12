import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

/**
 * Hook để lấy SiteSettings chung cho toàn hệ thống (Header, Footer, Contact...)
 * Tự động cache 5 phút theo config của React Query.
 */
export function useSiteSettings() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['siteSettings'],
        queryFn: async () => {
            const res = await api.get('/settings');
            return res || {};
        },
        staleTime: 1000 * 60 * 5, // Cache 5 minutes
    });

    return {
        settings: data || {},
        isLoading,
        error
    };
}
