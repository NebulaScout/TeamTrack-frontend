import React, { useState } from "react";
import {
  FiUsers,
  FiFolder,
  FiCheckSquare,
  FiBarChart2,
  FiClock,
  FiMessageSquare,
  FiShield,
} from "react-icons/fi";
import { HiOutlineLightningBolt } from "react-icons/hi";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import styles from "@/styles/dashboard.module.css";
import adminStyles from "@/styles/admin.module.css";

import QuickActionsTab from "@/components/QuickActions";
import UserManagement from "@/components/UserManagement";
import ProjectsManagement from "@/components/ProjectsManagement";
import TaskManagement from "@/components/TaskManagement";
import AuditLogs from "@/components/AuditLogs";
import Analytics from "@/components/Analytcis";
import CommentsModeration from "@/components/CommentsModeration";
import RoleManagement from "@/components/RoleManagement";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("quickActions");

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
        return <Analytics />;
      case "auditLogs":
        return <AuditLogs />;
      case "comments":
        return <CommentsModeration />;
      case "roles":
        return <RoleManagement />;
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
