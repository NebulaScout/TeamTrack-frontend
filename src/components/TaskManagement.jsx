import React, { useState } from "react";
import {
  FiPlus,
  FiAlertCircle,
  FiUsers,
  FiFolder,
  FiCheckSquare,
  FiBarChart2,
  FiClock,
  FiMessageSquare,
  FiShield,
  FiUserPlus,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiMoreHorizontal,
} from "react-icons/fi";
import { MdOutlineAssignmentInd } from "react-icons/md";
import adminStyles from "@/styles/admin.module.css";
import { mockAdminTasks } from "@/utils/mockData";
import { getStatusClass } from "@/utils/statusClass";
import { getPriorityClass } from "@/utils/priorityClass";

export default function TaskManagement() {
  const [tasksSearch, setTasksSearch] = useState("");
  const [tasksStatusFilter, setTasksStatusFilter] = useState("all");
  const [tasksPriorityFilter, setTasksPriorityFilter] = useState("all");

  const getFilteredTasks = () => {
    return mockAdminTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(tasksSearch.toLowerCase()) ||
        task.project.toLowerCase().includes(tasksSearch.toLowerCase());
      const matchesStatus =
        tasksStatusFilter === "all" || task.status === tasksStatusFilter;
      const matchesPriority =
        tasksPriorityFilter === "all" ||
        task.priority.toLowerCase() === tasksPriorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  };

  const getOverdueTasksCount = () =>
    mockAdminTasks.filter((task) => task.isOverdue).length;
  const getUnassignedTasksCount = () =>
    mockAdminTasks.filter((task) => !task.assignee).length;
  return (
    <div className={adminStyles.tabSection}>
      {/* Stats Cards */}
      <div className={adminStyles.statsRow}>
        <div className={adminStyles.statsCard}>
          <div className={adminStyles.statsHeader}>
            <span className={adminStyles.statsTitle}>Overdue Tasks</span>
            <FiAlertCircle className={adminStyles.statsIconRed} />
          </div>
          <div className={adminStyles.statsValue + " " + adminStyles.textRed}>
            {getOverdueTasksCount()}
          </div>
          <span className={adminStyles.statsSubtext}>tasks past due date</span>
        </div>
        <div className={adminStyles.statsCard}>
          <div className={adminStyles.statsHeader}>
            <span className={adminStyles.statsTitle}>Unassigned Tasks</span>
            <MdOutlineAssignmentInd className={adminStyles.statsIconOrange} />
          </div>
          <div
            className={adminStyles.statsValue + " " + adminStyles.textOrange}
          >
            {getUnassignedTasksCount()}
          </div>
          <span className={adminStyles.statsSubtext}>
            tasks without assignee
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={adminStyles.tableControls}>
        <div className={adminStyles.searchBox}>
          <FiSearch className={adminStyles.searchIcon} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={tasksSearch}
            onChange={(e) => setTasksSearch(e.target.value)}
            className={adminStyles.searchInput}
          />
        </div>
        <div className={adminStyles.filterGroup}>
          <div className={adminStyles.filterDropdown}>
            <FiFilter className={adminStyles.filterIcon} />
            <select
              value={tasksStatusFilter}
              onChange={(e) => setTasksStatusFilter(e.target.value)}
              className={adminStyles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <FiChevronDown className={adminStyles.dropdownIcon} />
          </div>
          <div className={adminStyles.filterDropdown}>
            <select
              value={tasksPriorityFilter}
              onChange={(e) => setTasksPriorityFilter(e.target.value)}
              className={adminStyles.filterSelect}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <FiChevronDown className={adminStyles.dropdownIcon} />
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className={adminStyles.tableContainer}>
        <table className={adminStyles.dataTable}>
          <thead>
            <tr>
              <th style={{ width: "40px" }}></th>
              <th>Task</th>
              <th>Project</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredTasks().map((task) => (
              <tr key={task.id}>
                <td>
                  <div className={adminStyles.taskCheckbox}>
                    <div className={adminStyles.checkCircle}></div>
                  </div>
                </td>
                <td>
                  <span className={adminStyles.taskName}>{task.title}</span>
                </td>
                <td>
                  <span className={adminStyles.projectLabel}>
                    {task.project}
                  </span>
                </td>
                <td>
                  {task.assignee ? (
                    <div className={adminStyles.assigneeCell}>
                      <img
                        src={task.assignee.avatar}
                        alt={task.assignee.name}
                        className={adminStyles.tableAvatar}
                      />
                      <span>{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className={adminStyles.unassignedText}>
                      Unassigned
                    </span>
                  )}
                </td>
                <td>
                  <span
                    className={`${adminStyles.statusBadge} ${getStatusClass(task.status)}`}
                  >
                    {task.status.replace("_", " ").toUpperCase()}
                  </span>
                </td>
                <td>
                  <span
                    className={`${adminStyles.priorityBadge} ${getPriorityClass(task.priority)}`}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span
                    className={task.isOverdue ? adminStyles.overdueDueDate : ""}
                  >
                    {task.isOverdue && (
                      <FiClock className={adminStyles.overdueIcon} />
                    )}
                    {task.dueDate}
                  </span>
                </td>
                <td>
                  <button className={adminStyles.actionBtn}>
                    <FiMoreHorizontal />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
