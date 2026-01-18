import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FiCheckSquare } from "react-icons/fi";
import { FaChevronLeft } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";
import { LuFolderKanban } from "react-icons/lu";
import { FaRegCalendar } from "react-icons/fa6";
import { RiTeamLine } from "react-icons/ri";
import { VscGraph } from "react-icons/vsc";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";

import styles from "@/styles/dashboard.module.css";
import user9 from "@/assets/person9_current_user.jpg";

const navItems = [
  { path: "/", label: "Dashboard", icon: <LuLayoutDashboard /> },
  { path: "/projects", label: "Projects", icon: <LuFolderKanban /> },
  { path: "/tasks", label: "Tasks", icon: <FiCheckSquare /> },
  { path: "/Calendar", label: "Calendar", icon: <FaRegCalendar /> },
  { path: "/team", label: "Team", icon: <RiTeamLine /> },
  {
    path: "/notifications",
    label: "Notifications",
    icon: <IoNotificationsOutline />,
  },
  { path: "/reports", label: "reports", icon: <VscGraph /> },
];

export default function SideBar() {
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <FiCheckSquare />
          </div>
          <span>Team Track</span>
        </div>
        <button className={styles.btnCollapse}>
          <FaChevronLeft />
        </button>
      </div>

      <nav className={styles.sidebarNav}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""} `}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <Link
          to="/settings"
          className={`${styles.navItem} ${location.pathname === "/settings" && styles.navItemActive}`}
        >
          <span className={styles.navIcon}>
            <IoSettingsOutline />
          </span>
          Settings
        </Link>

        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>
            <img src={user9} alt="John Doe" />
          </div>

          <div className={styles.userInfo}>
            <p className={styles.userName}> John Doe</p>
            <p className={styles.userEmail}>doe@microsoft.com</p>
          </div>
          <button className={styles.btnLogout}>
            <FiLogOut />
          </button>
        </div>
      </div>
    </aside>
  );
}
