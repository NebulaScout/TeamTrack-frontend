import React from "react";
import styles from "@/styles/dashboard.module.css";
import { HiOutlineArrowTrendingUp } from "react-icons/hi2";
import { FiCheckSquare } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

// import { statsData } from '@/utils/mockData'

export default function StatCard({ title, value, change, positive, iconType }) {
  const iconClass = {
    blue: styles.statIconBlue,
    green: styles.statIconGreen,
    yellow: styles.statIconYellow,
    red: styles.statIconRed,
  }[iconType];

  const icon = {
    blue: <FiCheckSquare />,
    green: <HiOutlineArrowTrendingUp />,
    yellow: <FaRegClock />,
    red: <MdErrorOutline />,
  }[iconType];

  return (
    <div className={styles.statCard}>
      <div className={styles.statInfo}>
        <h3>{title}</h3>
        <p className={styles.statNumber}> {value}</p>
        {change && (
          <span
            className={`${styles.statChange} ${!positive ? styles.negative : ""}`}
          >
            {change}
          </span>
        )}
      </div>
      <div className={`${styles.statIcon} ${iconClass}`}>{icon}</div>
    </div>
  );
}
