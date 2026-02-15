import React, { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiMoreHorizontal,
} from "react-icons/fi";
import adminStyles from "@/styles/admin.module.css";
import { mockAdminProjects } from "@/utils/mockData";
import { getStatusClass } from "@/utils/statusClass";

export default function ProjectsManagement() {
  const [projectsSearch, setProjectsSearch] = useState("");
  const [projectsStatusFilter, setProjectsStatusFilter] = useState("all");

  const getFilteredProjects = () => {
    return mockAdminProjects.filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(projectsSearch.toLowerCase());
      const matchesStatus =
        projectsStatusFilter === "all" ||
        project.status === projectsStatusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  return (
    <div className={adminStyles.tabSection}>
      {/* Search and Filters */}
      <div className={adminStyles.tableControls}>
        <div className={adminStyles.searchBox}>
          <FiSearch className={adminStyles.searchIcon} />
          <input
            type="text"
            placeholder="Search projects..."
            value={projectsSearch}
            onChange={(e) => setProjectsSearch(e.target.value)}
            className={adminStyles.searchInput}
          />
        </div>
        <div className={adminStyles.filterGroup}>
          <div className={adminStyles.filterDropdown}>
            <FiFilter className={adminStyles.filterIcon} />
            <select
              value={projectsStatusFilter}
              onChange={(e) => setProjectsStatusFilter(e.target.value)}
              className={adminStyles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on hold">On Hold</option>
              <option value="planning">Planning</option>
            </select>
            <FiChevronDown className={adminStyles.dropdownIcon} />
          </div>
          <button className={adminStyles.newProjectBtn}>
            <FiPlus /> New Project
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className={adminStyles.tableContainer}>
        <table className={adminStyles.dataTable}>
          <thead>
            <tr>
              <th>Project</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Created</th>
              <th>Members</th>
              <th>Tasks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredProjects().map((project) => (
              <tr key={project.id}>
                <td>
                  <span className={adminStyles.projectName}>
                    {project.name}
                  </span>
                </td>
                <td>
                  <div className={adminStyles.ownerCell}>
                    <img
                      src={project?.owner?.avatar}
                      alt={project?.owner?.name}
                      className={adminStyles.tableAvatar}
                    />
                    <span>{project?.owner?.name}</span>
                  </div>
                </td>
                <td>
                  <span
                    className={`${adminStyles.statusBadge} ${getStatusClass(project.status)}`}
                  >
                    {project.status}
                  </span>
                </td>
                <td>{project.created}</td>
                <td>
                  <div className={adminStyles.membersCell}>
                    {project?.members?.slice(0, 3).map((avatar, idx) => (
                      <img
                        key={idx}
                        src={avatar}
                        alt="Member"
                        className={adminStyles.memberAvatar}
                        style={{ marginLeft: idx > 0 ? "-8px" : "0" }}
                      />
                    ))}
                  </div>
                </td>
                <td>
                  <span className={adminStyles.taskProgress}>
                    {project.tasksCompleted}/{project.totalTasks}
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
