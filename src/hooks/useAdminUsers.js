import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/services/adminAPI";
import {
  mapAdminUserDetailsFromAPI,
  mapAdminUsersFromAPI,
} from "@/utils/adminMapper";

export const adminUsersKeys = {
  all: ["adminUsers"],
  lists: () => [...adminUsersKeys.all, "list"],
  list: (filters) => [...adminUsersKeys.lists(), { filters }],
  details: () => [...adminUsersKeys.all, "detail"],
  detail: (id) => [...adminUsersKeys.details(), id],
};

export const useAdminUsers = (options = {}) => {
  return useQuery({
    queryKey: adminUsersKeys.list(),
    queryFn: async () => {
      const data = await adminAPI.getUsers();
      return mapAdminUsersFromAPI(data);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useAdminUser = (id, options = {}) => {
  return useQuery({
    queryKey: adminUsersKeys.detail(id),
    queryFn: async () => {
      const data = await adminAPI.getUserById(id);
      return mapAdminUserDetailsFromAPI(data);
    },
    enabled: !!id && (options.enabled ?? true),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const usePatchAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminAPI.patchUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.lists() });
    },
  });
};
