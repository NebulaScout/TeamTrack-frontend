import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/services/adminAPI";
import {
  mapAdminProjectDetailsFromAPI,
  mapAdminProjectsFromAPI,
} from "@/utils/mappers/adminMapper";
import { teamKeys, projectMemberKeys } from "@/utils/queries/useTeam";

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

export const useUpdateAdminProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminAPI.updateProject(id, data),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: adminProjectsKeys.detail(variables.id),
      });
      await queryClient.invalidateQueries({
        queryKey: adminProjectsKeys.lists(),
      });
    },
  });
};

export const useRemoveAdminProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, memberId }) =>
      adminAPI.removeTeamMember(projectId, memberId),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminProjectsKeys.detail(variables.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: adminProjectsKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: teamKeys.members(variables.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: teamKeys.stats(variables.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: projectMemberKeys.project(variables.projectId),
        }),
      ]);
    },
  });
};

export const useDeleteAdminProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminAPI.deleteProject(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: adminProjectsKeys.lists(),
      });
      queryClient.removeQueries({
        queryKey: adminProjectsKeys.detail(id),
      });
    },
  });
};

export const useAddAdminProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }) =>
      adminAPI.addProjectMember(projectId, data),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminProjectsKeys.detail(variables.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: adminProjectsKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: teamKeys.members(variables.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: teamKeys.stats(variables.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: projectMemberKeys.project(variables.projectId),
        }),
      ]);
    },
  });
};

export const useUpdateAdminProjectMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, memberId, data }) =>
      adminAPI.updateProjectMember(projectId, memberId, data),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminProjectsKeys.detail(variables.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: adminProjectsKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: teamKeys.members(variables.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: teamKeys.stats(variables.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: projectMemberKeys.project(variables.projectId),
        }),
      ]);
    },
  });
};
