import React, { useState } from "react";
import {
  FiPlus,
  FiAlertCircle,
  FiUsers,
  FiFolder,
  FiCheckSquare,
  FiBarChart2,
  FiClock,
  FiMessageSquare,
  FiShield,
  FiUserPlus,
} from "react-icons/fi";
import { HiOutlineLightningBolt } from "react-icons/hi";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import styles from "@/styles/dashboard.module.css";
import adminStyles from "@/styles/admin.module.css";
import {
  mockOverdueTasks,
  mockRecentActivity,
  mockUnassignedTasks,
} from "@/utils/mockData";
import QuickActionsTab from "@/components/QuickActions";
import UserManagement from "@/components/UserManagement";
import ProjectsManagement from "@/components/ProjectsManagement";
import TaskManagement from "@/components/TaskManagement";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("quickActions");
  //   const [overdueTasks, setOverdueTasks] = useState(mockOverdueTasks);
  //   const [unassignedTasks, setUnassignedTasks] = useState(mockUnassignedTasks);
  //   const [recentActivity, setRecentActivity] = useState(mockRecentActivity);

  const tabs = [
    {
      id: "quickActions",
      label: "Quick Actions",
      icon: HiOutlineLightningBolt,
    },
    { id: "users", label: "Users", icon: FiUsers },
    { id: "projects", label: "Projects", icon: FiFolder },
    { id: "tasks", label: "Tasks", icon: FiCheckSquare },
    { id: "analytics", label: "Analytics", icon: FiBarChart2 },
    { id: "auditLogs", label: "Audit Logs", icon: FiClock },
    { id: "comments", label: "Comments", icon: FiMessageSquare },
    { id: "roles", label: "Roles", icon: FiShield },
  ];

  const renderPlaceholderTab = (tabName) => (
    <div className={adminStyles.placeholderTab}>
      <h3> {tabName} </h3>
      <p>This sections is under development...</p>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "quickActions":
        return <QuickActionsTab />;
      case "users":
        return <UserManagement />;
      case "projects":
        return <ProjectsManagement />;
      case "tasks":
        return <TaskManagement />;
      case "analytics":
        return renderPlaceholderTab("Analytics Dashboard");
      case "auditLogs":
        return renderPlaceholderTab("Audit Logs");
      case "comments":
        return renderPlaceholderTab("Comments Moderation");
      case "roles":
        return renderPlaceholderTab("Role Management");
      default:
        return <QuickActionsTab />;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <SideBar />
      <main className={styles.mainContent}>
        <Header
          title="Admin Dashboard"
          pageIntro="Manage users, projects, tasks and system settings"
          unreadNotifications={3}
        />

        <div className={adminStyles.adminContainer}>
          {/* Tab Navigation */}
          <div className={adminStyles.tabsNav}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`${adminStyles.tabBtn} ${activeTab === tab.id && adminStyles.tabBtnActive}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className={adminStyles.tabIcon} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className={adminStyles.tabContent}>{renderActiveTab()}</div>
        </div>
      </main>
    </div>
  );
}
