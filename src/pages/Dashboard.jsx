import React from "react";
// import { Link, useLocation } from "react-router-dom";
import { MdOutlineTaskAlt } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { FiCheckSquare } from "react-icons/fi";
import SideBar from "@/components/SideBar";
import ProjectProgress from "@/components/ProjectProgress";
import RecentActivity from "@/components/RecentActivity";
import StatCard from "@/components/StatCard";
import UpcomingDeadlines from "@/components/UpcomingDeadlines";
import { IoNotificationsOutline } from "react-icons/io5";

import styles from "@/styles/dashboard.module.css";
import { statsData } from "@/utils/mockData";

export default function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <SideBar />

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>Dashboard</h1>
            <p>Welcome back, John!</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.searchBar}>
              <span className={styles.searchIcon}>
                <IoSearch />
              </span>
              <input type="text" placeholder="Search..." />
            </div>
            <button className={styles.btnNotifications}>
              <IoNotificationsOutline />
              <span className={styles.notificationsBadge}>3</span>
            </button>
          </div>
        </header>

        <div className={styles.statsGrid}>
          {statsData.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.leftColumn}>
            <ProjectProgress />
            <RecentActivity />
          </div>
          <UpcomingDeadlines />
        </div>
      </main>
    </div>
  );
}
