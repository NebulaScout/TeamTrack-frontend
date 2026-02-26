import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsAPI } from "@/services/projectsAPI";
import { mapProjectsFromAPIs } from "@/utils/projectMapper";

// Query keys for better cache management
export const projectsKeys = {
  all: ["projects"],
  lists: () => [...projectsKeys.all, "list"],
  list: (filters) => [...projectsKeys.lists(), { filters }],
  details: () => [...projectsKeys.all, "detail"],
  detail: (id) => [...projectsKeys.details(), id],
};

// Main projects query hook
export const useProjects = (options = {}) => {
  return useQuery({
    queryKey: projectsKeys.list(),
    queryFn: async () => {
      const data = await projectsAPI.getAll();
      return mapProjectsFromAPIs(data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache retention
    refetchOnWindowFocus: false, // avoid unnecessary refetches
    ...options,
  });
};

// individual project query
export const useProject = (id) => {
  return useQuery({
    queryKey: projectsKeys.detail(id),
    queryFn: () => projectsAPI.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// create project mutation
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
    },
  });
};

// update project mutation
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => projectsAPI.update(id, data),
    onSuccess: (updateProject, { id }) => {
      // invalidate specific project and projects list
      queryClient.invalidateQueries({ queryKey: projectsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
    },
  });
};

// delete project mutation
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsAPI.delete,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
      queryClient.removeQueries({ queryKey: projectsKeys.detail(deletedId) });
    },
  });
};
