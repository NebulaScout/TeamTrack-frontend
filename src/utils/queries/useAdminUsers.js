import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/services/adminAPI";
import {
  mapAdminUserDetailsFromAPI,
  mapAdminUsersFromAPI,
} from "@/utils/mappers/adminMapper";

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
    mutationFn: async ({ id, data }) => {
      console.log("Patch admin data:", data);
      // Important: return/await so mutateAsync resolves after the network request completes
      return await adminAPI.patchUser(id, data);
    },
    onSuccess: (_updatedUser, { id }) => {
      // Refresh users table
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.lists() });

      // Refresh details modal if open for same user
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.detail(id) });
    },
  });
};
