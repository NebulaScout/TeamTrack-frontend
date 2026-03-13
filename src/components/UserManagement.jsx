import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiMoreHorizontal,
  FiEye,
  FiEdit2,
  FiUserX,
  FiCheckCircle,
} from "react-icons/fi";
import adminStyles from "@/styles/admin.module.css";
import { getStatusClass } from "@/utils/statusClass";
import { getRoleClass } from "@/utils/roleClass";
import { useAdminUsers, usePatchAdminUser } from "@/hooks/useAdminUsers";
import { ROLE_MAP } from "@/utils/enumMappings";
import Loader from "@/components/ui/Loader";
import UserDetailsModal from "@/components/UserDetailsModal";

const ROLE_OPTIONS = Object.values(ROLE_MAP);
const ROLE_BY_LOWER = ROLE_OPTIONS.reduce((acc, role) => {
  acc[role.toLowerCase()] = role;
  return acc;
}, {});

const toApiRoleValue = (role) => {
  const normalized = String(role ?? "").toLowerCase();
  return ROLE_BY_LOWER[normalized] ?? ROLE_MAP.GUEST;
};

export default function UserManagement() {
  const [usersSearch, setUsersSearch] = useState("");
  const [usersRoleFilter, setUsersRoleFilter] = useState("all");
  const [usersStatusFilter, setUsersStatusFilter] = useState("all");

  const [openMenuFor, setOpenMenuFor] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [pendingUserId, setPendingUserId] = useState(null);

  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const menuRef = useRef(null);
  const triggerRefs = useRef(new Map());

  const { data: users = [], isLoading, isError, error } = useAdminUsers();
  const { mutateAsync: patchAdminUser, isPending: isPatchingUser } =
    usePatchAdminUser();

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.username.toLowerCase().includes(usersSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(usersSearch.toLowerCase());

      const matchesRole =
        usersRoleFilter === "all" || user.role === usersRoleFilter;

      const matchesStatus =
        usersStatusFilter === "all" || user.status === usersStatusFilter;

      return matchSearch && matchesRole && matchesStatus;
    });
  }, [users, usersSearch, usersRoleFilter, usersStatusFilter]);

  const openUserMenu = (e, userId) => {
    e.stopPropagation();

    if (openMenuFor === userId) {
      setOpenMenuFor(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 220;
    const viewportPadding = 12;

    const left = Math.max(
      viewportPadding,
      Math.min(
        rect.right - menuWidth,
        window.innerWidth - menuWidth - viewportPadding,
      ),
    );

    setMenuPosition({
      top: rect.bottom + 8,
      left,
    });

    setOpenMenuFor(userId);
  };

  const patchUserFromMenu = async (user, nextRole, nextIsActive) => {
    setPendingUserId(user.id);

    try {
      await patchAdminUser({
        id: user.id,
        data: {
          role: nextRole ?? toApiRoleValue(user.role),
          is_active:
            typeof nextIsActive === "boolean"
              ? nextIsActive
              : user.status === "active",
        },
      });
      setOpenMenuFor(null);
    } catch (err) {
      console.error("Failed to update user:", err);
    } finally {
      setPendingUserId(null);
    }
  };

  const handleUserAction = async (action, user) => {
    if (action === "view-details") {
      setOpenMenuFor(null);
      setSelectedUserId(user.id);
      setIsUserDetailsOpen(true);
      return;
    }

    if (action === "edit-user") {
      setOpenMenuFor(null);
      console.log("Edit user:", user);
      return;
    }

    if (action === "set-admin") {
      await patchUserFromMenu(user, ROLE_MAP.ADMIN, user.status === "active");
      return;
    }

    if (action === "set-project-manager") {
      await patchUserFromMenu(
        user,
        ROLE_MAP.PROJECT_MANAGER,
        user.status === "active",
      );
      return;
    }

    if (action === "set-developer") {
      await patchUserFromMenu(
        user,
        ROLE_MAP.DEVELOPER,
        user.status === "active",
      );
      return;
    }

    if (action === "set-guest") {
      await patchUserFromMenu(user, ROLE_MAP.GUEST, user.status === "active");
      return;
    }

    if (action === "toggle-active") {
      const shouldActivate = user.status !== "active";
      await patchUserFromMenu(user, toApiRoleValue(user.role), shouldActivate);
    }
  };

  const closeUserDetailsModal = () => {
    setIsUserDetailsOpen(false);
    setSelectedUserId(null);
  };

  useEffect(() => {
    if (!openMenuFor) return;

    const closeMenu = () => setOpenMenuFor(null);

    const handleOutsideClick = (e) => {
      const trigger = triggerRefs.current.get(openMenuFor);
      const clickedMenu = menuRef.current && menuRef.current.contains(e.target);
      const clickedTrigger = trigger && trigger.contains(e.target);

      if (!clickedMenu && !clickedTrigger) {
        closeMenu();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") closeMenu();
    };

    const handleViewportChange = () => closeMenu();

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEsc);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [openMenuFor]);

  if (isLoading) {
    return (
      <div className={adminStyles.tabSections}>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={adminStyles.tabSections}>
        <div className={adminStyles.errorMessage}>
          {error?.message || "Failed to load users."}
        </div>
      </div>
    );
  }

  return (
    <div className={adminStyles.tabSections}>
      <div className={adminStyles.tableControls}>
        <div className={adminStyles.searchBox}>
          <FiSearch className={adminStyles.searchIcon} />
          <input
            type="text"
            placeholder="Search users..."
            value={usersSearch}
            onChange={(e) => setUsersSearch(e.target.value)}
            className={adminStyles.searchInput}
          />
        </div>

        <div className={adminStyles.filterGroup}>
          <div className={adminStyles.filterDropdown}>
            <FiFilter className={adminStyles.filterIcon} />
            <select
              value={usersRoleFilter}
              onChange={(e) => setUsersRoleFilter(e.target.value)}
              className={adminStyles.filterSelect}
            >
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="project manager">Project Manager</option>
              <option value="developer">Developer</option>
              <option value="guest">Guest</option>
            </select>
            <FiChevronDown className={adminStyles.dropdownIcon} />
          </div>

          <div className={adminStyles.filterDropdown}>
            <select
              value={usersStatusFilter}
              onChange={(e) => setUsersStatusFilter(e.target.value)}
              className={adminStyles.filterSelect}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <FiChevronDown className={adminStyles.dropdownIcon} />
          </div>
        </div>
      </div>

      <div className={adminStyles.tableContainer}>
        <table className={adminStyles.dataTable}>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Registered on</th>
              <th>Projects</th>
              <th>Tasks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => {
              const isThisUserPending =
                isPatchingUser && pendingUserId === user.id;
              const isActive = user.status === "active";

              return (
                <tr key={user.id}>
                  <td>
                    <div className={adminStyles.userCell}>
                      <img
                        src={user.avatar || "/vite.svg"}
                        alt={user.username}
                        className={adminStyles.tableAvatar}
                      />
                      <div className={adminStyles.userInfo}>
                        <span className={adminStyles.userName}>
                          {user.username}
                        </span>
                        <span className={adminStyles.userEmail}>
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`${adminStyles.roleBadge} ${getRoleClass(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`${adminStyles.statusBadge} ${getStatusClass(user.status)}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>{user.registered || "--"}</td>
                  <td>{user.projects}</td>
                  <td>{user.tasks}</td>

                  <td className={adminStyles.actionsCell}>
                    <button
                      className={adminStyles.actionBtn}
                      aria-label={`Open actions for ${user.username}`}
                      aria-haspopup="menu"
                      aria-expanded={openMenuFor === user.id}
                      onClick={(e) => openUserMenu(e, user.id)}
                      ref={(el) => {
                        if (el) triggerRefs.current.set(user.id, el);
                        else triggerRefs.current.delete(user.id);
                      }}
                    >
                      <FiMoreHorizontal />
                    </button>

                    {openMenuFor === user.id && (
                      <div
                        ref={menuRef}
                        className={adminStyles.userFloatingMenu}
                        style={{
                          top: menuPosition.top,
                          left: menuPosition.left,
                        }}
                        role="menu"
                      >
                        <div className={adminStyles.userFloatingMenuTitle}>
                          Actions
                        </div>

                        <button
                          className={adminStyles.userFloatingMenuItem}
                          onClick={() => handleUserAction("view-details", user)}
                          role="menuitem"
                          disabled={isThisUserPending}
                        >
                          <FiEye className={adminStyles.userFloatingMenuIcon} />
                          View Details
                        </button>

                        <button
                          className={adminStyles.userFloatingMenuItem}
                          onClick={() => handleUserAction("edit-user", user)}
                          role="menuitem"
                          disabled={isThisUserPending}
                        >
                          <FiEdit2
                            className={adminStyles.userFloatingMenuIcon}
                          />
                          Edit User
                        </button>

                        <div
                          className={adminStyles.userFloatingMenuSeparator}
                        />

                        <button
                          className={adminStyles.userFloatingMenuItem}
                          onClick={() => handleUserAction("set-admin", user)}
                          role="menuitem"
                          disabled={isThisUserPending}
                        >
                          Set as Admin
                        </button>

                        <button
                          className={adminStyles.userFloatingMenuItem}
                          onClick={() =>
                            handleUserAction("set-project-manager", user)
                          }
                          role="menuitem"
                          disabled={isThisUserPending}
                        >
                          Set as Project Manager
                        </button>

                        <button
                          className={adminStyles.userFloatingMenuItem}
                          onClick={() =>
                            handleUserAction("set-developer", user)
                          }
                          role="menuitem"
                          disabled={isThisUserPending}
                        >
                          Set as Developer
                        </button>

                        <button
                          className={adminStyles.userFloatingMenuItem}
                          onClick={() => handleUserAction("set-guest", user)}
                          role="menuitem"
                          disabled={isThisUserPending}
                        >
                          Set as Guest
                        </button>

                        <div
                          className={adminStyles.userFloatingMenuSeparator}
                        />

                        <button
                          className={`${adminStyles.userFloatingMenuItem} ${adminStyles.userFloatingMenuItemDanger}`}
                          onClick={() =>
                            handleUserAction("toggle-active", user)
                          }
                          role="menuitem"
                          disabled={isThisUserPending}
                        >
                          {isActive ? (
                            <>
                              <FiUserX
                                className={adminStyles.userFloatingMenuIcon}
                              />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <FiCheckCircle
                                className={adminStyles.userFloatingMenuIcon}
                              />
                              Activate
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className={adminStyles.emptyState}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {isUserDetailsOpen && (
          <UserDetailsModal
            isOpen={isUserDetailsOpen}
            onClose={closeUserDetailsModal}
            userId={selectedUserId}
          />
        )}
      </div>
    </div>
  );
}
