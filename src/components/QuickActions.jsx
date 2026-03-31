import React, { useState, useEffect } from "react";
import adminStyles from "@/styles/admin.module.css";
import {
  FiAlertCircle,
  FiFolder,
  FiCheckSquare,
  FiUserPlus,
} from "react-icons/fi";
import { MdOutlineAssignmentInd } from "react-icons/md";

import { getPriorityClass } from "@/utils/priorityClass";
import { adminAPI } from "@/services/adminAPI";
import { mapAdminQuickActionsFromAPI } from "@/utils/mappers/adminMapper";
import Loader from "@/components/ui/Loader";
import TaskModal from "@/components/TaskModal";
import ProjectModal from "./ProjectModal";
import TeamInviteModal from "./TeamInviteModal";
import AssignTaskUserModal from "./AssignTaskUserModal";
// import { useGetTask } from "@/hooks/useTasks";

export default function QuickActionsTab() {
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [unassignedTasks, setUnassignedTasks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // task modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  // const [taskToEdit, setTaskToEdit] = useState(null);
  // const [fetchingTask, setFetchingTask] = useState(false);

  // TODO: replace with useQuery
  useEffect(() => {
    const fetchQuickActionsData = async () => {
      try {
        setLoading(true);
        const data = await adminAPI.getQuickActions();
        const mappedData = mapAdminQuickActionsFromAPI(data);

        setOverdueTasks(mappedData.overdueTasks);
        setUnassignedTasks(mappedData.unassignedTasks);
        setRecentActivity(mappedData.recentActivity);
        setError(null);
      } catch (err) {
        console.error("Error fetching admin quick actions data:", err);
        setError("Failed to load quick actions data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuickActionsData();
  }, []);

  const quickActionCards = [
    { id: "newProject", label: "New Project", icon: FiFolder },
    { id: "inviteUser", label: "Invite User", icon: FiUserPlus },
    {
      id: "overdueTasks",
      label: "Overdue Tasks",
      icon: FiAlertCircle,
      badge: overdueTasks?.length,
    },
    {
      id: "unassigned",
      label: "Unassigned",
      icon: MdOutlineAssignmentInd,
      badge: unassignedTasks?.length,
    },
  ];

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

  const handleTaskAssignment = (task) => {
    console.log("Assign task: ", task);
    setSelectedTask(task);
    setShowAssignModal(true);
  };

  const handleQuickActionClick = (cardId) => {
    switch (cardId) {
      case "newProject":
        setShowProjectModal(true);
        break;
      case "inviteUser":
        setShowInviteModal(true);
        break;
      default:
        break;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={adminStyles.quickActionsContent}>
        <Loader />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={adminStyles.quickActionsContent}>
        <div className={adminStyles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <div className={adminStyles.quickActionsContent}>
      {/* Quick Action Cards */}
      <div className={adminStyles.actionCardsGrid}>
        {quickActionCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              className={adminStyles.actionCard}
              onClick={() => handleQuickActionClick(card.id)}
            >
              <div className={adminStyles.actionCardIcon}>
                <Icon className={`${getActionCard(card.id)}`} />
              </div>
              <span className={adminStyles.actionCardLabel}>{card.label}</span>
              {card.badge !== undefined && (
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
                {overdueTasks?.length}
              </span>
            </div>
            <p className={adminStyles.taskCardSubtitle}>
              Tasks that need immediate attention
            </p>
          </div>
          <div className={adminStyles.taskList}>
            {overdueTasks?.length > 0 ? (
              overdueTasks.map((task) => (
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
              ))
            ) : (
              <p className={adminStyles.emptyState}>No overdue tasks</p>
            )}
          </div>
        </div>

        {/* Unassigned Tasks */}
        <div className={adminStyles.taskCard}>
          <div className={adminStyles.taskCardHeader}>
            <div className={adminStyles.taskCardTitle}>
              <MdOutlineAssignmentInd className={adminStyles.iconOrange} />
              <h3>Unassigned Tasks</h3>
              <span className={adminStyles.countBadgeBlue}>
                {unassignedTasks?.length}
              </span>
            </div>
            <p className={adminStyles.taskCardSubtitle}>
              Tasks waiting for assignment
            </p>
          </div>
          <div className={adminStyles.taskList}>
            {unassignedTasks?.length > 0 ? (
              unassignedTasks.map((task) => (
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
                      onClick={() => handleTaskAssignment(task)}
                    >
                      Assign
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className={adminStyles.emptyState}>No unassigned tasks</p>
            )}
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
          {recentActivity?.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className={adminStyles.activityItem}>
                <span className={adminStyles.activityDot}></span>
                <span className={adminStyles.activityText}>
                  {activity.action}{" "}
                  <span className={adminStyles.activityUser}>
                    {activity.user}
                  </span>
                </span>
                <span className={adminStyles.activityTime}>
                  {activity.time}
                </span>
              </div>
            ))
          ) : (
            <p className={adminStyles.emptyState}>No recent activity</p>
          )}
        </div>
      </div>

      {showAssignModal && (
        <AssignTaskUserModal
          isOpen={showAssignModal}
          task={selectedTask}
          onClose={() => setShowAssignModal(false)}
        />
      )}

      {showProjectModal && (
        <ProjectModal
          setShowModal={setShowProjectModal}
          onProjectSaved={() => {}}
        />
      )}

      {showInviteModal && (
        <TeamInviteModal setShowInviteModal={setShowInviteModal} />
      )}
    </div>
  );
}
