import React from "react";
import styles from "@/styles/dashboard.module.css";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { useUnreadNotificationsCount } from "@/utils/queries/useNotifications";

export default function Header({ title, pageIntro, unreadNotifications }) {
  const { unreadCount } = useUnreadNotificationsCount();

  const badgeCount =
    typeof unreadNotifications === "number" ? unreadNotifications : unreadCount;

  return (
    <header className={styles.header}>
      <div className={styles.headerTitle}>
        <h1>{title}</h1>
        <p>{pageIntro}</p>
      </div>
      <div className={styles.headerActions}>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>
            <FiSearch />
          </span>
          <input type="text" placeholder="Search..." />
        </div>
        <button className={styles.btnNotifications}>
          <IoNotificationsOutline />
          {badgeCount > 0 && (
            <span className={styles.notificationsBadge}>{badgeCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}
