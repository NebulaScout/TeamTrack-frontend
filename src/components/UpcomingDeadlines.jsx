import React from "react";
import { FaRegCalendar } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
// import { upcomingDeadlinesData } from "@/utils/mockData";
import styles from "@/styles/dashboard.module.css";

export default function UpcomingDeadlines({ data = [] }) {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return styles.priorityHigh;
      case "Medium":
        return styles.priorityMedium;
      case "Low":
        return styles.priorityLow;
      default:
        return "";
    }
  };

  if (data.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Upcoming Deadlines</h2>
          <button className={styles.cardAction}>
            <FaRegCalendar />
          </button>
        </div>
        <div className={styles.deadlinesList}>
          <p className={styles.emptyMessage}>No upcoming deadlines</p>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Upcoming Deadlines</h2>
        <button className={styles.cardAction}>
          <FaRegCalendar />
        </button>
      </div>

      <div className={styles.deadlinesList}>
        {data.map((deadline) => (
          <div key={deadline.id} className={styles.deadlineItem}>
            <div className={styles.deadlineAvatar}>
              {deadline.avatar ? (
                <img src={deadline.avatar} alt={deadline.title} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {deadline.title.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className={styles.deadlineInfo}>
              <p className={styles.deadlineTitle} title={deadline.fullTitle}>
                {deadline.title}
              </p>
              <p className={styles.deadlineProject}>{deadline.project}</p>
            </div>
            <div className={styles.deadlineMeta}>
              <span
                className={`${styles.priorityBadge} ${getPriorityClass(deadline.priority)}`}
              >
                {deadline.priority}
              </span>
              <span className={styles.deadlineDate}>
                <span>
                  <FaRegClock />
                </span>
                {deadline.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
