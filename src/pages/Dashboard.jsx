import { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { MdOutlineTaskAlt } from "react-icons/md";
// import { FiCheckSquare } from "react-icons/fi";
import SideBar from "@/components/SideBar";
import ProjectProgress from "@/components/ProjectProgress";
import RecentActivity from "@/components/RecentActivity";
import StatCard from "@/components/StatCard";
import UpcomingDeadlines from "@/components/UpcomingDeadlines";
import Header from "@/components/Header";
import styles from "@/styles/dashboard.module.css";
import Loader from "@/components/ui/Loader";
// import { statsData } from "@/utils/mockData";
import { dashboardAPI } from "@/services/dashboardAPI";
import { mapDashboardFromAPI } from "@/utils/mappers/dashboardMapper";
import { useAuth } from "@/contexts/AuthProvider";

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Convert this to useQuery
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardAPI.getAll();
        const mappedData = mapDashboardFromAPI(data);
        setDashboardData(mappedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <SideBar />
        <main className={styles.mainContent}>
          <Loader />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardContainer}>
        <SideBar />
        <main className={styles.mainContent}>
          <Header
            title="Dashboard"
            pageIntro="Welcome back, ${user.username}"
          />
          <div className={styles.errorMessage}>{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <SideBar />

      <main className={styles.mainContent}>
        <Header
          title="Dashboard"
          pageIntro={`Welcome back, ${user.username}`}
        />

        <div className={styles.statsGrid}>
          {dashboardData.stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.leftColumn}>
            <ProjectProgress data={dashboardData.projectProgress} />
            <RecentActivity data={dashboardData.recentActivity} />
          </div>
          <UpcomingDeadlines data={dashboardData.upcomingDeadlines} />
        </div>
      </main>
    </div>
  );
}
