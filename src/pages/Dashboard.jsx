import React from "react";
// import { Link, useLocation } from "react-router-dom";
import { MdOutlineTaskAlt } from "react-icons/md";
import { FiCheckSquare } from "react-icons/fi";
import SideBar from "@/components/SideBar";
import ProjectProgress from "@/components/ProjectProgress";
import RecentActivity from "@/components/RecentActivity";
import StatCard from "@/components/StatCard";
import UpcomingDeadlines from "@/components/UpcomingDeadlines";
import Header from "@/components/Header";
import styles from "@/styles/dashboard.module.css";
import { statsData } from "@/utils/mockData";

export default function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <SideBar />

      <main className={styles.mainContent}>
        <Header title="Dashboard" pageIntro="Welcome back, John!" />

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
