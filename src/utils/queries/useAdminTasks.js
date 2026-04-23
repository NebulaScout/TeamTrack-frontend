import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/services/adminAPI";
import { mapAdminTasksFromAPI } from "@/utils/mappers/adminMapper";
import { mapTaskDetailsFromAPI } from "@/utils/mappers/taskMapper";
import {
  mapCommentFromAPI,
  mapCommentsFromAPI,
} from "@/utils/mappers/commentsMapper";

export const adminTasksKeys = {
  all: ["adminTasks"],
  lists: () => [...adminTasksKeys.all, "list"],
  list: (filters) => [...adminTasksKeys.lists(), { filters }],
  details: () => [...adminTasksKeys.all, "detail"],
  detail: (id) => [...adminTasksKeys.details(), id],
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
      queryClient.invalidateQueries({ queryKey: adminTasksKeys.detail(id) });
    },
  });
};

export const useGetAdminTask = (id, options = {}) => {
  return useQuery({
    queryKey: adminTasksKeys.detail(id),
    queryFn: async () => {
      const data = await adminAPI.getTaskById(id);
      return mapTaskDetailsFromAPI(data);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useGetAdminTaskComments = (taskId, options = {}) => {
  return useQuery({
    queryKey: [...adminTasksKeys.detail(taskId), "comments"],
    queryFn: async () => {
      const data = await adminAPI.getTaskComments(taskId);
      if (Array.isArray(data)) return mapCommentsFromAPI(data);
      if (data && typeof data === "object") return [mapCommentFromAPI(data)];
      return [];
    },
    enabled: !!taskId && (options.enabled ?? true),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useUpdateAdminTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, taskData }) => adminAPI.updateTask(id, taskData),
    onSuccess: async (updatedTask, { id }) => {
      queryClient.setQueryData(
        adminTasksKeys.detail(id),
        mapTaskDetailsFromAPI(updatedTask),
      );

      await queryClient.invalidateQueries({
        queryKey: adminTasksKeys.detail(id),
      });
      await queryClient.invalidateQueries({ queryKey: adminTasksKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: adminTasksKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
      queryClient.removeQueries({ queryKey: adminTasksKeys.detail(id) });
    },
  });
};
