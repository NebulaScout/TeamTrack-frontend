import React, { useEffect, useMemo, useState } from "react";
import {
  FiUsers,
  FiCheckSquare,
  FiClock,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiEdit3,
  FiFileText,
} from "react-icons/fi";
import adminStyles from "@/styles/admin.module.css";
import Loader from "@/components/ui/Loader";
import { useAdminAuditLogs } from "@/utils/queries/useAdminAuditLogs";

const CHANGE_FILTER_OPTIONS = [
  { value: "all", label: "All Changes" },
  { value: "status", label: "Status Changes" },
  { value: "priority", label: "Priority Changes" },
  { value: "assigned_to", label: "Assignments" },
  { value: "due_date", label: "Due Date Changes" },
  { value: "title", label: "Title Changes" },
  { value: "description", label: "Description Changes" },
];

export default function AuditLogs() {
  const [auditSearch, setAuditSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [auditProjectFilter, setAuditProjectFilter] = useState("all");
  const [auditUserFilter, setAuditUserFilter] = useState("all");
  const [auditChangeFilter, setAuditChangeFilter] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(auditSearch.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [auditSearch]);

  const queryFilters = useMemo(() => {
    return {
      search: debouncedSearch,
      project: auditProjectFilter,
      user: auditUserFilter,
      change_type: auditChangeFilter,
      limit: 50,
    };
  }, [debouncedSearch, auditProjectFilter, auditUserFilter, auditChangeFilter]);

  const { data, isLoading, isError, error } = useAdminAuditLogs(queryFilters);
  const logs = data?.logs ?? [];
  const totalCount = data?.totalCount ?? 0;

  const projectOptions = useMemo(() => {
    const seen = new Set();
    const options = [];

    for (const log of logs) {
      if (!log.projectId || seen.has(log.projectId)) continue;
      seen.add(log.projectId);
      options.push({ id: log.projectId, name: log.project });
    }

    return options.sort((a, b) => a.name.localeCompare(b.name));
  }, [logs]);

  const userOptions = useMemo(() => {
    const seen = new Set();
    const options = [];

    for (const log of logs) {
      if (!log.user?.id || seen.has(log.user.id)) continue;
      seen.add(log.user.id);
      options.push({ id: log.user.id, name: log.user.name });
    }

    return options.sort((a, b) => a.name.localeCompare(b.name));
  }, [logs]);

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
      case "title":
        return <FiEdit3 />;
      case "description":
        return <FiFileText />;
      default:
        return <FiCheckSquare />;
    }
  };

  if (isLoading) {
    return (
      <div className={adminStyles.tabSection}>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={adminStyles.tabSection}>
        <div className={adminStyles.errorMessage}>
          {error?.message || "Failed to load audit logs."}
        </div>
      </div>
    );
  }

  return (
    <div className={adminStyles.tabSection}>
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
              {projectOptions.map((project) => (
                <option key={project.id} value={String(project.id)}>
                  {project.name}
                </option>
              ))}
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
              {userOptions.map((user) => (
                <option key={user.id} value={String(user.id)}>
                  {user.name}
                </option>
              ))}
            </select>
            <FiChevronDown className={adminStyles.dropdownIcon} />
          </div>

          <div className={adminStyles.filterDropdown}>
            <select
              value={auditChangeFilter}
              onChange={(e) => setAuditChangeFilter(e.target.value)}
              className={adminStyles.filterSelect}
            >
              {CHANGE_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FiChevronDown className={adminStyles.dropdownIcon} />
          </div>
        </div>
      </div>

      <div className={adminStyles.auditSection}>
        <h3 className={adminStyles.sectionTitle}>
          Task History ({totalCount})
        </h3>

        <div className={adminStyles.auditList}>
          {logs.length === 0 ? (
            <div className={adminStyles.auditItem}>
              <div className={adminStyles.auditContent}>
                <div className={adminStyles.auditMeta}>
                  <span className={adminStyles.auditDate}>
                    No audit logs found for the selected filters.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className={adminStyles.auditItem}>
                <img
                  src={log.user?.avatar} // || "/vite.svg"
                  alt={log.user?.name || "User"}
                  className={adminStyles.auditAvatar}
                  onError={(e) => {
                    e.currentTarget.src = "/vite.svg";
                  }}
                />

                <div className={adminStyles.auditContent}>
                  <div className={adminStyles.auditMain}>
                    <span className={adminStyles.auditUserName}>
                      {log.user?.name || "Unknown User"}
                    </span>
                    <span className={adminStyles.auditAction}>
                      {log.action}
                    </span>
                    <span className={adminStyles.auditTask}>{log.task}</span>
                  </div>

                  <div className={adminStyles.auditMeta}>
                    <span className={adminStyles.auditProject}>
                      {log.project}
                    </span>
                    <span className={adminStyles.auditDot}>·</span>
                    <span className={adminStyles.auditDate}>{log.date}</span>
                  </div>

                  {log.type === "assignment" && (
                    <div className={adminStyles.auditChanges}>
                      <span className={adminStyles.assignedLabel}>
                        Assigned to
                      </span>
                      <span className={adminStyles.assignedUser}>
                        {log.assignedTo || "N/A"}
                      </span>
                    </div>
                  )}

                  {log.type !== "assignment" &&
                    (log.from !== "N/A" || log.to !== "N/A") && (
                      <div className={adminStyles.auditChanges}>
                        <span className={adminStyles.changeFrom}>
                          {log.from}
                        </span>
                        <span className={adminStyles.changeArrow}>→</span>
                        <span className={adminStyles.changeTo}>{log.to}</span>
                      </div>
                    )}
                </div>

                <div className={adminStyles.auditIcon}>
                  {getAuditIcon(log.type)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
