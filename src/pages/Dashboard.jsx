import React from "react";
import { Link, useLocation } from "react-router-dom";
import { VscGraph } from "react-icons/vsc";
import { LuLayoutDashboard } from "react-icons/lu";
import { LuFolderKanban } from "react-icons/lu";
import { MdOutlineTaskAlt } from "react-icons/md";
import { FaRegCalendar } from "react-icons/fa6";
import { RiTeamLine } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FiCheckSquare } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { HiOutlineArrowTrendingUp } from "react-icons/hi2";

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

export default function Dashboard() {
  return <div>Dashboard</div>;
}
