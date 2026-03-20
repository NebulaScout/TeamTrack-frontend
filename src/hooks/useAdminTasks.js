import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/services/adminAPI";
import { mapAdminTasksFromAPI } from "@/utils/adminMapper";

export const adminTasksKeys = {
  all: ["adminTasks"],
  lists: () => [...adminTasksKeys.all, "list"],
  list: (filters) => [...adminTasksKeys.lists(), { filters }],
};

export const useAdminTasks = (options = {}) => {
  return useQuery({
    queryKey: adminTasksKeys.list(),
    queryFn: async () => {
      const data = await adminAPI.getTasks();
      return mapAdminTasksFromAPI(data);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const usePatchAdminTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminAPI.patchTask(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminTasksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminTasksKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["adminTask", id] });
    },
  });
};

export const useDeleteAdminTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminAPI.deleteTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: adminTasksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminTasksKeys.list() });
      queryClient.removeQueries({ queryKey: ["adminTask", id] });
    },
  });
};
