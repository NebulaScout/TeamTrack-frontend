import { useQuery } from "@tanstack/react-query";
import { notificationsAPI } from "@/services/notificationsAPI";
import { mapNotificationsFromAPI } from "@/utils/mappers/notificationMapper";

export const notificationsKeys = {
  all: ["notifications"],
  lists: () => notificationsKeys.all.concat("list"),
  list: (filters = {}) => notificationsKeys.lists().concat(filters),
};

export const useGetNotifications = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: notificationsKeys.list(filters),
    queryFn: async () => {
      const data = await notificationsAPI.getAll();
      return mapNotificationsFromAPI(data);
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};
