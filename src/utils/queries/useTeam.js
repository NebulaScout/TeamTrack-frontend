import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamAPI } from "../../services/teamAPI";
import { mapTeamStatsFromAPI, mapTeamMembersFromAPI } from "../teamMapper";

// Query keys for caching and invalidation
export const teamKeys = {
  all: ["team"],
  stats: (projectId) => [...teamKeys.all, "stats", projectId],
  members: (projectId) => [...teamKeys.all, "members", projectId],
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
    onSuccess: (_, { projectId }) => {
      // Invalidate team members and stats to refetch updated data
      queryClient.invalidateQueries({ queryKey: teamKeys.members(projectId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.stats(projectId) });
    },
  });
};
