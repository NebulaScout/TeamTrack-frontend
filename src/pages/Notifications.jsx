import React, { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiCheck } from "react-icons/fi";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import styles from "@/styles/dashboard.module.css";
import notificationStyles from "@/styles/notifications.module.css";
import {
  useGetNotifications,
  useReadAllNotifications,
  useReadNotification,
} from "@/utils/queries/useNotifications";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);

  const {
    data: apiNotifications = [],
    isLoading,
    isError,
    refetch,
  } = useGetNotifications();

  const { mutateAsync: readAllNotifications, isPending: isReadingAll } =
    useReadAllNotifications();

  const { mutateAsync: readNotification } = useReadNotification();

  useEffect(() => {
    setNotifications(apiNotifications);
  }, [apiNotifications]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((notification) => !notification.isRead)
      : notifications;

  const markAllAsRead = async () => {
    try {
      await readAllNotifications(true);
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  const markNotificationAsRead = async (notification) => {
    if (notification.isRead) return;

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id
          ? { ...item, isRead: true, readAt: new Date().toISOString() }
          : item,
      ),
    );

    try {
      await readNotification({ id: notification.id, isRead: true });
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      refetch();
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <SideBar />
      <main className={styles.mainContent}>
        <Header
          title="Notifications"
          pageIntro={`You have ${unreadCount} unread notifications`}
          unreadNotifications={unreadCount}
        />

        <div className={notificationStyles.notificationsContainer}>
          <div className={notificationStyles.notificationsHeader}>
            <div className={notificationStyles.tabs}>
              <button
                className={`${notificationStyles.tab} ${activeTab === "all" && notificationStyles.tabActive}`}
                onClick={() => setActiveTab("all")}
              >
                All
              </button>
              <button
                className={`${notificationStyles.tab} ${activeTab === "unread" && notificationStyles.tabActive}`}
                onClick={() => setActiveTab("unread")}
              >
                Unread
              </button>
            </div>
            <button
              className={notificationStyles.btnMarkAllRead}
              onClick={markAllAsRead}
              disabled={isReadingAll}
            >
              <FiCheck />
              Mark all as read
            </button>
          </div>

          <div className={notificationStyles.notificationsList}>
            {isLoading && (
              <div className={notificationStyles.emptyState}>
                <p>Loading notifications...</p>
              </div>
            )}

            {isError && (
              <div className={notificationStyles.emptyState}>
                <p>Failed to load notifications.</p>
                <button onClick={() => refetch()}>Retry</button>
              </div>
            )}

            {!isLoading && !isError && filteredNotifications.length === 0 ? (
              <div className={notificationStyles.emptyState}>
                <div className={notificationStyles.emptyStateIcon}>
                  <IoNotificationsOutline />
                </div>
                <h3>No notifications</h3>
                <p>You're all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${notificationStyles.notificationsItem} ${!notification.isRead && notificationStyles.unread}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => markNotificationAsRead(notification)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      markNotificationAsRead(notification);
                    }
                  }}
                >
                  <div className={notificationStyles.notificationsContent}>
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className={notificationStyles.notificationsTime}>
                      {notification.time}
                    </span>
                  </div>
                  {!notification.isRead && (
                    <span
                      className={notificationStyles.unreadDot}
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
