import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsAPI } from "@/services/notificationsAPI";
import {
  mapNotificationsFromAPI,
  mapNotificationFromAPI,
} from "@/utils/mappers/notificationMapper";

export const notificationsKeys = {
  all: ["notifications"],
  lists: () => notificationsKeys.all.concat("list"),
  list: (filters = {}) => notificationsKeys.lists().concat(filters),
  details: () => notificationsKeys.all.concat("detail"),
  detail: (id) => notificationsKeys.details().concat(id),
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

export const useGetNotification = (id, options = {}) => {
  return useQuery({
    queryKey: notificationsKeys.detail(id),
    queryFn: async () => {
      const data = await notificationsAPI.getById(id);
      return mapNotificationFromAPI(data);
    },
    enabled: !!id,
    staleTime: 60 * 1000,
    ...options,
  });
};

export const useReadAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isRead = true) => notificationsAPI.readAll(isRead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
    },
  });
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isRead = true }) =>
      notificationsAPI.markAsRead(id, isRead),
    onMutate: async ({ id, isRead = true }) => {
      await queryClient.cancelQueries({ queryKey: notificationsKeys.lists() });

      const previousLists = queryClient.getQueriesData({
        queryKey: notificationsKeys.lists(),
      });

      const previousDetail = queryClient.getQueryData(
        notificationsKeys.detail(id),
      );

      queryClient.setQueriesData(
        { queryKey: notificationsKeys.lists() },
        (oldData) => {
          if (!Array.isArray(oldData)) return oldData;
          return oldData.map((notification) =>
            notification.id === id
              ? {
                  ...notification,
                  isRead,
                  readAt: isRead ? new Date().toISOString() : "",
                }
              : notification,
          );
        },
      );

      queryClient.setQueryData(notificationsKeys.detail(id), (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          isRead,
          readAt: isRead ? new Date().toISOString() : "",
        };
      });

      return { previousLists, previousDetail };
    },
    onError: (_error, { id }, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }

      if (context?.previousDetail) {
        queryClient.setQueryData(
          notificationsKeys.detail(id),
          context.previousDetail,
        );
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
    },
  });
};
