import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksAPI } from "@/services/tasksAPI";
import { mapTaskDetailsFromAPI, mapTasksFromAPI } from "@/utils/taskMapper";

// query keys for better cache management
export const tasksKeys = {
  all: ["tasks"],
  lists: () => [...tasksKeys.all, "list"],
  list: (filters) => [...tasksKeys.lists(), { filters }],
  details: () => [...tasksKeys.all, "detail"],
  detail: (id) => [...tasksKeys.details(), id],
};

export const useGetTasks = (options = {}) => {
  return useQuery({
    queryKey: tasksKeys.list(),
    queryFn: async () => {
      const data = await tasksAPI.getAll();
      return mapTasksFromAPI(data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache retention
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetTask = (id) => {
  return useQuery({
    queryKey: tasksKeys.detail(id),
    queryFn: async () => {
      const data = await tasksAPI.getById(id);
      return mapTaskDetailsFromAPI(data);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, taskData }) =>
      tasksAPI.create(projectId, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() }); // refetch tasks
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, taskData }) => tasksAPI.update(id, taskData),
    onSuccess: (data, { id }) => {
      // refetch specific task and tasks list
      queryClient.invalidateQueries({ queryKey: tasksKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
    },
  });
};

export const usePatchTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, taskData }) => tasksAPI.patch(id, taskData),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => tasksAPI.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
      queryClient.removeQueries({ queryKey: tasksKeys.detail(id) });
    },
  });
};
