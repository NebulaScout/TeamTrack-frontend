import { useQuery } from "@tanstack/react-query";
import { teamAPI } from "../services/teamAPI";
import {
  mapTeamStatsFromAPI,
  mapTeamMembersFromAPI,
} from "../utils/teamMapper";

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
