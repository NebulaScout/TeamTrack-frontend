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
  FiTrash2,
  FiUserPlus,
  FiRefreshCw,
  FiSettings,
  FiLayers,
} from "react-icons/fi";
import adminStyles from "@/styles/admin.module.css";
import Loader from "@/components/ui/Loader";
import { useAdminAuditLogs } from "@/utils/queries/useAdminAuditLogs";

const ACTION_FILTER_OPTIONS = [
  { value: "all", label: "All Actions" },
  { value: "created", label: "Created" },
  { value: "updated", label: "Updated" },
  { value: "deleted", label: "Deleted" },
  { value: "registered", label: "Registered" },
];

export default function AuditLogs() {
  const [auditSearch, setAuditSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [auditProjectFilter, setAuditProjectFilter] = useState("all");
  const [auditUserFilter, setAuditUserFilter] = useState("all");
  const [auditModuleFilter, setAuditModuleFilter] = useState("all");
  const [auditActionFilter, setAuditActionFilter] = useState("all");

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
      module: auditModuleFilter,
      action: auditActionFilter,
      limit: 50,
    };
  }, [
    debouncedSearch,
    auditProjectFilter,
    auditUserFilter,
    auditModuleFilter,
    auditActionFilter,
  ]);

  const { data, isLoading, isError, error } = useAdminAuditLogs(queryFilters);
  const logs = data?.logs ?? [];
  const totalCount = data?.totalCount ?? 0;

  const projectOptions = useMemo(() => {
    const seen = new Set();
    const options = [];

    for (const log of logs) {
      if (!log.projectId || seen.has(log.projectId)) continue;
      seen.add(log.projectId);
      options.push({
        id: log.projectId,
        name: log.project || `Project ${log.projectId}`,
      });
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

  const moduleOptions = useMemo(() => {
    const seen = new Set();
    const options = [];

    for (const log of logs) {
      const value = String(log.module ?? "")
        .trim()
        .toLowerCase();
      if (!value || seen.has(value)) continue;
      seen.add(value);
      options.push({
        value,
        label: log.moduleLabel || value.replace(/_/g, " "),
      });
    }

    return options.sort((a, b) => a.label.localeCompare(b.label));
  }, [logs]);

  const getAuditIcon = (log) => {
    const actionType = String(log.actionType ?? "").toLowerCase();
    const action = String(log.action ?? "").toLowerCase();
    const module = String(log.module ?? "").toLowerCase();

    if (actionType.includes("delete") || action.includes("delete"))
      return <FiTrash2 />;
    if (actionType.includes("create") || action.includes("create"))
      return <FiEdit3 />;
    if (actionType.includes("register") || action.includes("register"))
      return <FiUserPlus />;
    if (actionType.includes("assign") || action.includes("assign"))
      return <FiUsers />;
    if (actionType.includes("update") || action.includes("update"))
      return <FiRefreshCw />;
    if (module === "system") return <FiSettings />;
    if (module === "task") return <FiCheckSquare />;
    if (module === "project") return <FiLayers />;

    return <FiClock />;
  };

  const getFallbackDescription = (log) => {
    const action = log.action || "performed action";
    const targetLabel = log.targetLabel || "System";
    return `${action} ${targetLabel}`;
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
            placeholder="Search actor, module, action, or target..."
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
              value={auditModuleFilter}
              onChange={(e) => setAuditModuleFilter(e.target.value)}
              className={adminStyles.filterSelect}
            >
              <option value="all">All Modules</option>
              {moduleOptions.map((module) => (
                <option key={module.value} value={module.value}>
                  {module.label}
                </option>
              ))}
            </select>
            <FiChevronDown className={adminStyles.dropdownIcon} />
          </div>

          <div className={adminStyles.filterDropdown}>
            <select
              value={auditActionFilter}
              onChange={(e) => setAuditActionFilter(e.target.value)}
              className={adminStyles.filterSelect}
            >
              {ACTION_FILTER_OPTIONS.map((option) => (
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
          System Audit Trail ({totalCount})
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
                  src={log.user?.avatar || "/vite.svg"}
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
                      {log.action || "performed action"}
                    </span>
                    <span className={adminStyles.auditTask}>
                      {log.targetLabel || log.targetTypeLabel || "System"}
                    </span>
                  </div>

                  <div className={adminStyles.auditMeta}>
                    <span className={adminStyles.auditProject}>
                      {log.moduleLabel || "System"}
                    </span>
                    <span className={adminStyles.auditDot}>·</span>
                    <span className={adminStyles.auditProject}>
                      {log.targetTypeLabel || "Target"}
                    </span>
                    {log.project ? (
                      <>
                        <span className={adminStyles.auditDot}>·</span>
                        <span className={adminStyles.auditProject}>
                          {log.project}
                        </span>
                      </>
                    ) : null}
                    <span className={adminStyles.auditDot}>·</span>
                    <span className={adminStyles.auditDate}>{log.date}</span>
                  </div>

                  <div className={adminStyles.auditMeta}>
                    <span className={adminStyles.auditDate}>
                      {log.description || getFallbackDescription(log)}
                    </span>
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

                <div className={adminStyles.auditIcon}>{getAuditIcon(log)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
