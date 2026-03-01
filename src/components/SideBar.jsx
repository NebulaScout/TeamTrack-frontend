import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FiCheckSquare, FiShield } from "react-icons/fi";
import { FaChevronLeft } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";
import { LuFolderKanban } from "react-icons/lu";
import { FaRegCalendar } from "react-icons/fa6";
import { RiTeamLine } from "react-icons/ri";
import { VscGraph } from "react-icons/vsc";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthProvider";

import styles from "@/styles/dashboard.module.css";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: <LuLayoutDashboard /> },
  { path: "/projects", label: "Projects", icon: <LuFolderKanban /> },
  { path: "/tasks", label: "My Tasks", icon: <FiCheckSquare /> },
  { path: "/Calendar", label: "Calendar", icon: <FaRegCalendar /> },
  { path: "/team", label: "Team", icon: <RiTeamLine /> },
  {
    path: "/notifications",
    label: "Notifications",
    icon: <IoNotificationsOutline />,
  },
  { path: "/reports", label: "Reports", icon: <VscGraph /> },
  { path: "/admin/dashboard", label: "Admin", icon: <FiShield /> },
];

export default function SideBar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  // TODO: Add role in sidebar
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
            <img src={user.avatar} alt={`${user.username}'s avatar`} />
          </div>

          <div className={styles.userInfo}>
            <p className={styles.userName}> {user.username} </p>
            <p className={styles.userEmail}> {user.email} </p>
          </div>
          <button
            className={styles.btnLogout}
            onClick={async () => await logout()}
          >
            <FiLogOut />
          </button>
        </div>
      </div>
    </aside>
  );
}
