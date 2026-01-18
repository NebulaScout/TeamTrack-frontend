import React from "react";
import styles from "@/styles/dashboard.module.css";
import { projectProgressData } from "@/utils/mockData";

export default function ProjectProgress() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Project Progress</h2>
      </div>
      <div className={styles.progressList}>
        {projectProgressData.map((project) => (
          <div key={project.name} className={styles.progressItem}>
            <div className={styles.progressHeader}>
              <span className={styles.progressName}>{project.name}</span>
              <span className={styles.progressPercentage}>
                {project.progress}%
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${styles[`progress{project.color}`]}`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
