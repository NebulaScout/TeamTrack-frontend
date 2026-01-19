import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiCheck, FiSearch } from "react-icons/fi";
import SideBar from "@/components/SideBar";
import { mockNotificationsData } from "@/utils/mockData";
import Header from "@/components/Header";
import styles from "@/styles/dashboard.module.css";
import notificationStyles from "@/styles/notifications.module.css";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState(mockNotificationsData);

  // Count unread notifications
  const unreadCount = Object.values(notifications).filter(
    (notification) => !notification.isRead,
  ).length;

  // Show unread notifications when a user filters the page, otherwise show all
  let filteredNotifications =
    activeTab === "unread"
      ? Object.values(notifications).filter(
          (notification) => !notification.isRead,
        )
      : notifications;

  const markAllAsRead = () => {
    setNotifications((notification) => ({
      ...notification,
      isRead: true,
    }));
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

        {/* Notifications Content */}
        <div className={notificationStyles.notificationsContainer}>
          {/* Tabs & Actions */}
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
            >
              <FiCheck />
              Mark all as read
            </button>
          </div>

          {/* Notifications List */}
          <div className={notificationStyles.notificationsList}>
            {filteredNotifications.length === 0 ? (
              <div className={notificationStyles.emptyState}>
                <div className={notificationStyles.emptyStateIcon}>
                  <IoNotificationsOutline />
                </div>
                <h3>No notifications</h3>
                <p>You're all caught up!</p>
              </div>
            ) : (
              Object.values(filteredNotifications).map((notification) => (
                <div
                  key={notification.id}
                  className={`${notificationStyles.notificationsItem} ${!notification.isRead && notificationStyles.unread}`}
                >
                  <div className={notificationStyles.notificationsContent}>
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className={notificationStyles.notificationsTime}>
                      {notification.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
