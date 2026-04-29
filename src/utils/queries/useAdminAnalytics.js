import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "@/services/adminAPI";
import { mapAdminAnalyticsFromAPI } from "@/utils/mappers/adminMapper";

export const adminAnalyticsKeys = {
  all: ["adminAnalytics"],
  detail: () => adminAnalyticsKeys.all.concat("detail"),
};

export const useAdminAnalytics = (options = {}) =>
  useQuery({
    queryKey: adminAnalyticsKeys.detail(),
    queryFn: async () => {
      const data = await adminAPI.getAnalytics();
      return mapAdminAnalyticsFromAPI(data);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
