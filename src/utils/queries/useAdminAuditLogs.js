import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "@/services/adminAPI";
import { mapAdminAuditLogsFromAPI } from "@/utils/mappers/adminMapper";

export const adminAuditLogsKeys = {
  all: ["adminAuditLogs"],
  lists: () => adminAuditLogsKeys.all.concat("list"),
  list: (filters = {}) => adminAuditLogsKeys.lists().concat(filters),
};

export const useAdminAuditLogs = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: adminAuditLogsKeys.list(filters),
    queryFn: async () => {
      const data = await adminAPI.getAuditLogs(filters);
      return mapAdminAuditLogsFromAPI(data);
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};
