import React, { useEffect, useState } from "react";
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
import { MdOutlineAssignmentInd } from "react-icons/md";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import styles from "@/styles/dashboard.module.css";
import adminStyles from "@/styles/admin.module.css";
import {
  mockOverdueTasks,
  mockRecentActivity,
  mockUnassignedTasks,
} from "@/utils/mockData";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("quickActions");
  const [overdueTasks, setOverdueTasks] = useState(mockOverdueTasks);
  const [unassignedTasks, setUnassignedTasks] = useState(mockUnassignedTasks);
  const [recentActivity, setRecentActivity] = useState(mockRecentActivity);

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

  const quickActionCards = [
    { id: "newProject", label: "New Project", icon: FiFolder },
    { id: "inviteUser", label: "Invite User", icon: FiUserPlus },
    {
      id: "overdueTasks",
      label: "Overdue Tasks",
      icon: FiAlertCircle,
      badge: overdueTasks.length,
    },
    {
      id: "unassigned",
      label: "Unassigned",
      icon: MdOutlineAssignmentInd,
      badge: unassignedTasks.length,
    },
  ];

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return adminStyles.priorityHigh;
      case "Medium":
        return adminStyles.priorityMedium;
      case "Low":
        return adminStyles.priorityLow;
      default:
        return adminStyles.priorityMedium;
    }
  };

  const getActionCard = (card) => {
    switch (card) {
      case "newProject":
        return adminStyles.iconBlue;
      case "inviteUser":
        return adminStyles.iconGreen;
      case "overdueTasks":
        return adminStyles.iconRed;
      case "unassigned":
        return adminStyles.iconYellow;
      default:
        return "";
    }
  };

  const handleAssignedTask = (taskId) => {
    console.log("Assign task: ", taskId);
    // TODO: Implement assign task modal
  };

  const renderQuickActionsTab = () => (
    <div className={adminStyles.quickActionsContent}>
      {/* Quick Action Cards */}
      <div className={adminStyles.actionCardsGrid}>
        {quickActionCards.map((card) => {
          const Icon = card.icon;
          return (
            <button key={card.id} className={adminStyles.actionCard}>
              <div className={adminStyles.actionCardIcon}>
                <Icon className={`${getActionCard(card.id)}`} />
              </div>
              <span className={adminStyles.actionCardLabel}>{card.label}</span>
              {card.badge && (
                <span
                  className={`${adminStyles.actionCardBadge} ${card.id === "overdueTasks" ? adminStyles.badgeRed : adminStyles.badgeBlue}`}
                >
                  {card.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Overdue & Unassigned Tasks */}
      <div className={adminStyles.tasksGrid}>
        {/* Overdue Tasks */}
        <div className={adminStyles.taskCard}>
          <div className={adminStyles.taskHeader}>
            <div className={adminStyles.taskCardTitle}>
              <FiAlertCircle className={adminStyles.iconRed} />
              <h3>Overdue Tasks</h3>
              <span className={adminStyles.countBadgeRed}>
                {overdueTasks.length}
              </span>
            </div>
            <p className={adminStyles.taskCardSubtitle}>
              Tasks that need immediate attention
            </p>
          </div>
          <div className={adminStyles.taskList}>
            {overdueTasks.map((task) => (
              <div key={task.id} className={adminStyles.taskItem}>
                <div className={adminStyles.taskInfo}>
                  <h4 className={adminStyles.taskTitle}>{task.title}</h4>
                  <p className={adminStyles.taskMeta}>
                    {task.project} ·{" "}
                    <span className={adminStyles.dueDate}>
                      Due: {task.dueDate}
                    </span>
                  </p>
                </div>
                <div className={adminStyles.taskActions}>
                  {task.assigee ? (
                    <img
                      src={task.assigee.avatar}
                      alt={task.assigee.name}
                      className={adminStyles.assigneeAvatar}
                    />
                  ) : (
                    <span className={adminStyles.unassignedLabel}>
                      Unassigned
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unassigned Tasks */}
        <div className={adminStyles.taskCard}>
          <div className={adminStyles.taskCardHeader}>
            <div className={adminStyles.taskCardTitle}>
              <MdOutlineAssignmentInd className={adminStyles.iconOrange} />
              <h3>Unassigned Tasks</h3>
              <span className={adminStyles.countBadgeBlue}>
                {" "}
                {unassignedTasks.length}
              </span>
            </div>
            <p className={adminStyles.taskCardSubtitle}>
              Tasks waiting for assignement
            </p>
          </div>
          <div className={adminStyles.taskList}>
            {unassignedTasks.map((task) => (
              <div key={task.id} className={adminStyles.taskItem}>
                <div className={adminStyles.taskInfo}>
                  <h4 className={adminStyles.taskTitle}>{task.title}</h4>
                  <p className={adminStyles.taskMeta}>{task.project}</p>
                </div>
                <div className={adminStyles.taskActions}>
                  <span
                    className={`${adminStyles.priorityBadge} ${getPriorityClass(task.priority)}`}
                  >
                    {task.priority.toUpperCase()}
                  </span>

                  <button
                    className={adminStyles.btnAssign}
                    onClick={() => handleAssignedTask(task.id)}
                  >
                    Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={adminStyles.recentActivityCard}>
        <div className={adminStyles.taskCardHeader}>
          <div className={adminStyles.taskCardTitle}>
            <FiCheckSquare className={adminStyles.iconBlue} />
            <h3>Recent Activity</h3>
          </div>
          <p className={adminStyles.taskCardSubtitle}>
            Latest actions across the platform
          </p>
        </div>
        <div className={adminStyles.activityList}>
          {recentActivity.map((activity) => (
            <div key={activity.id} className={adminStyles.activityItem}>
              <span className={adminStyles.activityDot}></span>
              <span className={adminStyles.activityText}>
                {activity.action}{" "}
                <span className={adminStyles.activityUser}>
                  {activity.user}
                </span>
              </span>
              <span className={adminStyles.activityTime}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlaceholderTab = (tabName) => (
    <div className={adminStyles.placeholderTab}>
      <h3> {tabName} </h3>
      <p>This sections is under development...</p>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "quickActions":
        return renderQuickActionsTab();
      case "users":
        return renderPlaceholderTab("User Management");
      case "projects":
        return renderPlaceholderTab("Projects Management");
      case "tasks":
        return renderPlaceholderTab("Tasks Management");
      case "analytics":
        return renderPlaceholderTab("Analytics Dashboard");
      case "auditLogs":
        return renderPlaceholderTab("Audit Logs");
      case "comments":
        return renderPlaceholderTab("Comments Moderation");
      case "roles":
        return renderPlaceholderTab("Role Management");
      default:
        return renderQuickActionsTab();
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
