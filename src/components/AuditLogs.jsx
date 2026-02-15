import React, { useState } from "react";
import {
  FiUsers,
  FiCheckSquare,
  FiClock,
  FiSearch,
  FiFilter,
  FiChevronDown,
} from "react-icons/fi";
import adminStyles from "@/styles/admin.module.css";
import { mockAuditLogs } from "@/utils/mockData";

export default function AuditLogs() {
  const [auditSearch, setAuditSearch] = useState("");
  const [auditProjectFilter, setAuditProjectFilter] = useState("all");
  const [auditUserFilter, setAuditUserFilter] = useState("all");
  const [auditChangeFilter, setAuditChangeFilter] = useState("all");

  const getFilteredAuditLogs = () => {
    return mockAuditLogs.filter((log) => {
      const matchesSearch =
        log.task.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.project.toLowerCase().includes(auditSearch.toLowerCase());
      const matchesProject =
        auditProjectFilter === "all" || log.project === auditProjectFilter;
      const matchesUser =
        auditUserFilter === "all" || log.user.name === auditUserFilter;
      const matchesChange =
        auditChangeFilter === "all" || log.type === auditChangeFilter;
      return matchesSearch && matchesProject && matchesUser && matchesChange;
    });
  };

  const getAuditIcon = (type) => {
    switch (type) {
      case "status":
        return <FiCheckSquare />;
      case "priority":
        return <FiClock />;
      case "assignment":
        return <FiUsers />;
      case "duedate":
        return <FiClock />;
      case "created":
        return <FiCheckSquare />;
      default:
        return <FiCheckSquare />;
    }
  };

  return (
    <div className={adminStyles.tabSection}>
      {/* Search and Filters */}
      <div className={adminStyles.tableControls}>
        <div className={adminStyles.searchBox}>
          <FiSearch className={adminStyles.searchIcon} />
          <input
            type="text"
            placeholder="Search tasks or projects..."
            value={auditSearch}
            onChange={(e) => setAuditSearch(e.target.value)}
            className={adminStyles.searchInput}
          />
        </div>
        <div className={adminStyles.filterGroup}>
          <div className={adminStyles.filterDropdown}>
            <FiFilter className={adminStyles.filterIcon} />
            <select
              value={auditProjectFilter}
              onChange={(e) => setAuditProjectFilter(e.target.value)}
              className={adminStyles.filterSelect}
            >
              <option value="all">All Projects</option>
              <option value="Website Redesign">Website Redesign</option>
              <option value="Mobile App Development">
                Mobile App Development
              </option>
              <option value="Marketing Campaign">Marketing Campaign</option>
              <option value="API Integration">API Integration</option>
            </select>
            <FiChevronDown className={adminStyles.dropdownIcon} />
          </div>
          <div className={adminStyles.filterDropdown}>
            <select
              value={auditUserFilter}
              onChange={(e) => setAuditUserFilter(e.target.value)}
              className={adminStyles.filterSelect}
            >
              <option value="all">All Users</option>
              <option value="John Doe">John Doe</option>
              <option value="Sarah Wilson">Sarah Wilson</option>
              <option value="Mike Johnson">Mike Johnson</option>
              <option value="Emily Davis">Emily Davis</option>
            </select>
            <FiChevronDown className={adminStyles.dropdownIcon} />
          </div>
          <div className={adminStyles.filterDropdown}>
            <select
              value={auditChangeFilter}
              onChange={(e) => setAuditChangeFilter(e.target.value)}
              className={adminStyles.filterSelect}
            >
              <option value="all">All Changes</option>
              <option value="status">Status Changes</option>
              <option value="priority">Priority Changes</option>
              <option value="assignment">Assignments</option>
              <option value="duedate">Due Date Changes</option>
              <option value="created">Task Created</option>
            </select>
            <FiChevronDown className={adminStyles.dropdownIcon} />
          </div>
        </div>
      </div>

      {/* Task History */}
      <div className={adminStyles.auditSection}>
        <h3 className={adminStyles.sectionTitle}>Task History</h3>
        <div className={adminStyles.auditList}>
          {getFilteredAuditLogs().map((log) => (
            <div key={log.id} className={adminStyles.auditItem}>
              <img
                src={log.user.avatar}
                alt={log.user.name}
                className={adminStyles.auditAvatar}
              />
              <div className={adminStyles.auditContent}>
                <div className={adminStyles.auditMain}>
                  <span className={adminStyles.auditUserName}>
                    {log.user.name}
                  </span>
                  <span className={adminStyles.auditAction}>{log.action}</span>
                  <span className={adminStyles.auditTask}>{log.task}</span>
                </div>
                <div className={adminStyles.auditMeta}>
                  <span className={adminStyles.auditProject}>
                    {log.project}
                  </span>
                  <span className={adminStyles.auditDot}>·</span>
                  <span className={adminStyles.auditDate}>{log.date}</span>
                </div>
                {log.type === "status" && (
                  <div className={adminStyles.auditChanges}>
                    <span className={adminStyles.changeFrom}>{log.from}</span>
                    <span className={adminStyles.changeArrow}>→</span>
                    <span className={adminStyles.changeTo}>{log.to}</span>
                  </div>
                )}
                {log.type === "priority" && (
                  <div className={adminStyles.auditChanges}>
                    <span className={adminStyles.changeFrom}>{log.from}</span>
                    <span className={adminStyles.changeArrow}>→</span>
                    <span className={adminStyles.changeTo}>{log.to}</span>
                  </div>
                )}
                {log.type === "duedate" && (
                  <div className={adminStyles.auditChanges}>
                    <span className={adminStyles.changeDateFrom}>
                      {log.from}
                    </span>
                    <span className={adminStyles.changeArrow}>→</span>
                    <span className={adminStyles.changeDateTo}>{log.to}</span>
                  </div>
                )}
                {log.type === "assignment" && (
                  <div className={adminStyles.auditChanges}>
                    <span className={adminStyles.assignedLabel}>
                      Assigned to
                    </span>
                    <span className={adminStyles.assignedUser}>
                      {log.assignedTo}
                    </span>
                  </div>
                )}
              </div>
              <div className={adminStyles.auditIcon}>
                {getAuditIcon(log.type)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
