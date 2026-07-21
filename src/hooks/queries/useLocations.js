import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIGS } from '@/constants/queryConfigs';
import { checkoutApi } from '@/pages/Customer/Checkout/api/checkoutApi';

export const useProvinces = (isNewStructure = false, options = {}) => {
  return useQuery({
    queryKey: ['locations', 'provinces', isNewStructure],
    queryFn: async () => {
      const res = await checkoutApi.getProvinces(isNewStructure);
      return res?.data || res || [];
    },
    ...QUERY_CONFIGS.STATIC,
    ...options
  });
};

export const useDistricts = (provinceCode, options = {}) => {
  return useQuery({
    queryKey: ['locations', 'districts', provinceCode],
    queryFn: async () => {
      if (!provinceCode) return [];
      const res = await checkoutApi.getDistricts(provinceCode);
      return res?.data || res || [];
    },
    enabled: !!provinceCode,
    ...QUERY_CONFIGS.STATIC,
    ...options
  });
};

export const useWards = (parentCode, isNewStructure = false, options = {}) => {
  return useQuery({
    queryKey: ['locations', 'wards', parentCode, isNewStructure],
    queryFn: async () => {
      if (!parentCode) return [];
      const res = await checkoutApi.getWards(parentCode, isNewStructure);
      return res?.data || res || [];
    },
    enabled: !!parentCode,
    ...QUERY_CONFIGS.STATIC,
    ...options
  });
};
