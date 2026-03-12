import React from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FiMessageSquare } from "react-icons/fi";
import { CgUserAdd } from "react-icons/cg";
import { FaRegEdit } from "react-icons/fa";

// import { recentActivityData } from "@/utils/mockData";
import styles from "@/styles/dashboard.module.css";

export default function RecentActivity({ data = [] }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case "completed":
        return (
          <span className={`${styles.activityIcon} ${styles.completed}`}>
            <FaRegCircleCheck />
          </span>
        );
      case "comment":
        return (
          <span className={`${styles.activityIcon} ${styles.comment}`}>
            <FiMessageSquare />
          </span>
        );
      case "joined":
        return (
          <span className={`${styles.activityIcon} ${styles.joined}`}>
            <CgUserAdd />
          </span>
        );
      case "updated":
        return (
          <span className={styles.activityIcon}>
            <FaRegEdit />
          </span>
        );
      default:
        return null;
    }
  };

  if (data.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recent Activity</h2>
        </div>
        <div className={styles.activityList}>
          <p className={styles.emptyMessage}>No recent activity</p>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Recent Activity</h2>
      </div>

      <div className={styles.activityList}>
        {data.map((activity) => (
          <div key={activity.id} className={styles.activityItem}>
            <div className={styles.activityAvatar}>
              {activity.avatar ? (
                <img src={activity.avatar} alt={activity.user} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {activity.user.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>
                <strong>{activity.user}</strong>
                <span> {activity.action} </span>
                <a href="#">{activity.task}</a>
              </p>
              <p className={styles.activityTime}>{activity.time}</p>
            </div>
            {getActivityIcon(activity.type)}
          </div>
        ))}
      </div>
    </div>
  );
}
