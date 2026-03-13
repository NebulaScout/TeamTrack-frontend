import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/services/adminAPI";
import {
  mapAdminProjectDetailsFromAPI,
  mapAdminProjectsFromAPI,
} from "@/utils/adminMapper";

export const adminProjectsKeys = {
  all: ["adminProjects"],
  lists: () => [...adminProjectsKeys.all, "list"],
  list: (filters) => [...adminProjectsKeys.lists(), { filters }],
  details: () => [...adminProjectsKeys.all, "detail"],
  detail: (id) => [...adminProjectsKeys.details(), id],
};

export const useAdminProjects = (options = {}) => {
  return useQuery({
    queryKey: adminProjectsKeys.list(),
    queryFn: async () => {
      const data = await adminAPI.getProjects();
      return mapAdminProjectsFromAPI(data);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useAdminProject = (id, options = {}) => {
  return useQuery({
    queryKey: adminProjectsKeys.detail(id),
    queryFn: async () => {
      const data = await adminAPI.getProjectById(id);
      return mapAdminProjectDetailsFromAPI(data);
    },
    enabled: !!id && (options.enabled ?? true),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useRemoveAdminProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, memberId }) =>
      adminAPI.removeTeamMember(projectId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminProjectsKeys.detail(variables.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: adminProjectsKeys.lists(),
      });
    },
  });
};
