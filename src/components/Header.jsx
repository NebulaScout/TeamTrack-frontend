import React from "react";
import styles from "@/styles/dashboard.module.css";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";

export default function Header({ title, pageIntro, unreadNotifications }) {
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
          {unreadNotifications > 0 && (
            <span className={styles.notificationsBadge}>
              {unreadNotifications}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
