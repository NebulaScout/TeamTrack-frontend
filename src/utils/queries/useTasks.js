import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksAPI } from "@/services/tasksAPI";
import {
  mapTaskDetailsFromAPI,
  mapTasksFromAPI,
} from "@/utils/mappers/taskMapper";
import {
  mapCommentsFromAPI,
  mapCommentFromAPI,
} from "@/utils/mappers/commentsMapper";

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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tasksKeys.lists() }); // refetch tasks
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, taskData }) => tasksAPI.update(id, taskData),
    onSuccess: async (updatedTask, { id }) => {
      // immediate cache update for task details
      queryClient.setQueryData(
        tasksKeys.detail(id),
        mapTaskDetailsFromAPI(updatedTask),
      );

      // refetch specific task and tasks list
      await queryClient.invalidateQueries({ queryKey: tasksKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });

      // Also refresh admin task list (TaskModal is used from admin screen too)
      queryClient.invalidateQueries({ queryKey: ["adminTasks"] });
    },
  });
};

export const usePatchTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, taskData }) => tasksAPI.patch(id, taskData),
    onSuccess: async (data, { id }) => {
      await queryClient.invalidateQueries({ queryKey: tasksKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });

      queryClient.invalidateQueries({ queryKey: ["adminTasks"] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => tasksAPI.delete(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
      await queryClient.removeQueries({ queryKey: tasksKeys.detail(id) });

      queryClient.invalidateQueries({ queryKey: ["adminTasks"] });
    },
  });
};

// Get comments for a specific task
export const useGetComments = (taskId) => {
  console.log("Calling comments query");
  return useQuery({
    queryKey: [...tasksKeys.detail(taskId), "comments"],
    queryFn: async () => {
      const data = await tasksAPI.getComments(taskId);
      console.log("Comments in task query: ", data);
      if (data.length < 2) {
        return mapCommentFromAPI(data);
      }
      return mapCommentsFromAPI(data);
    },
    enabled: !!taskId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache retention
    refetchOnWindowFocus: false,
  });
};

// create a comment
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, content }) =>
      tasksAPI.createComment(taskId, { content }),
    onSuccess: async (data, { taskId }) => {
      // invalidate comments query to refetch
      await queryClient.invalidateQueries({
        queryKey: [...tasksKeys.detail(taskId), "comments"],
      });
      await queryClient.invalidateQueries({
        // refetch task details
        queryKey: [...tasksKeys.detail(taskId)],
      });
    },
  });
};
