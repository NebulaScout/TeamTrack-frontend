import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersAPI } from "@/services/usersAPI";
import { mapUsersFromAPI, mapUserFromAPI } from "@/utils/mappers/userMapper";

// query keys
export const usersKeys = {
  all: ["users"],
  lists: () => [...usersKeys.all, "list"],
  list: (filters) => [...usersKeys.lists(), { filters }],
  details: () => [...usersKeys.all, "detail"],
  detail: (id) => [...usersKeys.details(), id],
};

export const useGetUsers = (options = {}) => {
  return useQuery({
    queryKey: usersKeys.list(),
    queryFn: async () => {
      const data = await usersAPI.getAll();
      return mapUsersFromAPI(data);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetUser = (id) => {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: async () => {
      const data = await usersAPI.getById(id);
      return mapUserFromAPI(data);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => usersAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

// Partial update user (e.g. role or status toggle)
export const usePatchUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => usersAPI.patch(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => usersAPI.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.removeQueries({ queryKey: usersKeys.detail(id) });
    },
  });
};
