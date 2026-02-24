import React from "react";
import { FiX, FiCheckCircle, FiClock } from "react-icons/fi";
import { FaRegCalendar, FaFlag } from "react-icons/fa6";
import { RiTeamLine } from "react-icons/ri";
import { formatDate } from "@/utils/formatDate";
import { getPriorityClass } from "@/utils/priorityClass";
import modalStyles from "@/styles/modals.module.css";
import projectStyles from "@/styles/projects.module.css";

export default function ProjectDetailsModal({ project, setShowModal }) {
  if (!project) return null;

  const pendingTasks = project.totalTasks - project.tasksCompleted;

  //   Generate initials from username or name
  const getInitials = (member) => {
    const name = member.username || member.name || "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    //   .slice(0, 2);
  };

  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modal}>
        {/* Header */}
        <div className={modalStyles.modalHeader}>
          <div className={modalStyles.projectDetailsHeader}>
            <div className={modalStyles.titleAndBtnClose}>
              <h2>{project.name}</h2>
              <button
                className={modalStyles.btnClose}
                onClick={() => setShowModal(false)}
              >
                <FiX />
              </button>
            </div>
            <p className={modalStyles.projectDescription}>
              {project.description}
            </p>
          </div>
        </div>

        {/* Status & Priority Badges */}
        <div className={modalStyles.badgesRow}>
          <span
            className={`${projectStyles.statusBadge} ${
              project.status === "Completed"
                ? projectStyles.statusCompleted
                : projectStyles.statusActive
            }`}
          >
            {project.status}
          </span>
          <span
            className={`${modalStyles.priorityBadge} ${getPriorityClass(project.priority)}`}
          >
            <FaFlag />
            {project.priority || "Medium"} Priority
          </span>
        </div>

        {/* Progress Section */}
        <div className={modalStyles.progressSection}>
          <div className={modalStyles.progressHeader}>
            <span className={modalStyles.progressLabel}>Overall Progress</span>
            <span className={modalStyles.progressPercentage}>
              {project.progress}%
            </span>
          </div>
          <div className={modalStyles.progressBar}>
            <div
              className={`${modalStyles.progressFill} ${
                project.status === "Completed"
                  ? modalStyles.progressGreen
                  : modalStyles.progressBlue
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className={modalStyles.statsGrid}>
          <div className={modalStyles.statItem}>
            <div
              className={`${modalStyles.statIcon} ${modalStyles.statIconGreen}`}
            >
              <FiCheckCircle />
            </div>
            <div className={modalStyles.statContent}>
              <span className={modalStyles.statValue}>
                {project.tasksCompleted}
              </span>
              <span className={modalStyles.statLabel}>Completed</span>
            </div>
          </div>

          <div className={modalStyles.statItem}>
            <div
              className={`${modalStyles.statIcon} ${modalStyles.statIconYellow}`}
            >
              <FiClock />
            </div>
            <div className={modalStyles.statContent}>
              <span className={modalStyles.statValue}>{pendingTasks}</span>
              <span className={modalStyles.statLabel}>Pending</span>
            </div>
          </div>

          <div className={modalStyles.statItem}>
            <div
              className={`${modalStyles.statIcon} ${modalStyles.statIconBlue}`}
            >
              <FaRegCalendar />
            </div>
            <div className={modalStyles.statContent}>
              <span className={modalStyles.statValue}>
                {formatDate(project.dueDate)}
              </span>
              <span className={modalStyles.statLabel}>Due Date</span>
            </div>
          </div>

          <div className={modalStyles.statItem}>
            <div
              className={`${modalStyles.statIcon} ${modalStyles.statIconPurple}`}
            >
              <RiTeamLine />
            </div>
            <div className={modalStyles.statContent}>
              <span className={modalStyles.statValue}>
                {project.teamMembers?.length || 0}
              </span>
              <span className={modalStyles.statLabel}>Members</span>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className={modalStyles.teamSection}>
          <h3 className={modalStyles.teamSectionTitle}>Team Members</h3>
          <div className={modalStyles.teamAvatars}>
            {project.teamMembers?.map((member, index) => (
              <div
                key={member.id || index}
                className={modalStyles.avatarCircle}
                title={member.username || member.name}
              >
                {member.avatar ? (
                  <img src={member.avatar} alt={member.username} />
                ) : (
                  <span>{getInitials(member)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
