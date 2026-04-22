import React from "react";
import styles from "@/styles/dashboard.module.css";

const getProgressColorClass = (progress = 0) => {
  if (progress >= 90) return "progressGreen";
  if (progress >= 70) return "progressBlue";
  if (progress >= 40) return "progressOrange";
  return "progressRed";
};

const normalizeProgress = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, n));
};

export default function ProjectProgress({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Project Progress</h2>
        </div>
        <div className={styles.progressList}>
          <p className={styles.emptyMessage}>No projects to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Project Progress</h2>
      </div>

      <div className={styles.progressList}>
        {data.map((project, index) => {
          const progress = normalizeProgress(project.progress);
          const colorClass = styles[getProgressColorClass(progress)];

          return (
            <div
              key={project.id ?? project.name ?? index}
              className={styles.progressItem}
            >
              <div className={styles.progressHeader}>
                <span className={styles.progressName}>{project.name}</span>
                <span className={styles.progressPercentage}>{progress}%</span>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${colorClass}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
