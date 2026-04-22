import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamAPI } from "@/services/teamAPI";
import {
  mapTeamStatsFromAPI,
  mapTeamMembersFromAPI,
} from "../mappers/teamMapper";

// Query keys for caching and invalidation
export const teamKeys = {
  all: ["team"],
  stats: (projectId) => [...teamKeys.all, "stats", projectId],
  members: (projectId) => [...teamKeys.all, "members", projectId],
};

export const projectMemberKeys = {
  all: ["members"],
  project: (projectId) => [...projectMemberKeys.all, "project", projectId],
};

export const useGetTeamStats = (projectId, options = {}) => {
  return useQuery({
    queryKey: teamKeys.stats(projectId),
    queryFn: async () => {
      const data = await teamAPI.getStats(projectId);
      return mapTeamStatsFromAPI(data);
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetTeamMembers = (projectId, options = {}) => {
  return useQuery({
    queryKey: teamKeys.members(projectId),
    queryFn: async () => {
      const data = await teamAPI.getMembers(projectId);
      return mapTeamMembersFromAPI(data);
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useInviteTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, inviteData }) =>
      teamAPI.inviteTeamMember(projectId, inviteData),
    onSuccess: async (_, { projectId }) => {
      const normalizedProjectId = Number(projectId);
      const hasNumericProjectId = Number.isFinite(normalizedProjectId);

      // Invalidate with the original id and normalized numeric id
      // because form selects can provide string ids.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: teamKeys.members(projectId),
        }),
        queryClient.invalidateQueries({ queryKey: teamKeys.stats(projectId) }),
        ...(hasNumericProjectId
          ? [
              queryClient.invalidateQueries({
                queryKey: teamKeys.members(normalizedProjectId),
              }),
              queryClient.invalidateQueries({
                queryKey: teamKeys.stats(normalizedProjectId),
              }),
              queryClient.invalidateQueries({
                queryKey: projectMemberKeys.project(normalizedProjectId),
              }),
            ]
          : []),
        queryClient.invalidateQueries({ queryKey: teamKeys.all }),
      ]);
    },
  });
};

export const useGetProjectMembers = (projectId, options = {}) => {
  return useQuery({
    queryKey: projectMemberKeys.project(projectId),
    queryFn: async () => {
      const data = await teamAPI.getMembers(projectId);
      return mapTeamMembersFromAPI(data);
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};
