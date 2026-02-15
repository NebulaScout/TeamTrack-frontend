import React, { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiMoreHorizontal,
} from "react-icons/fi";
import adminStyles from "@/styles/admin.module.css";
import { mockUsers } from "@/utils/mockData";
import { getStatusClass } from "@/utils/statusClass";
import { getRoleClass } from "@/utils/roleClass";

export default function UserManagement() {
  const [usersSearch, setUsersSearch] = useState("");
  const [usersRoleFilter, setUsersRoleFilter] = useState("all");
  const [usersStatusFilter, setUsersStatusFilter] = useState("all");

  const getFilteredUsers = () => {
    return mockUsers.filter((user) => {
      const matchSearch =
        user.username.toLowerCase().includes(usersSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(usersSearch.toLowerCase());
      const matchesRole =
        usersRoleFilter === "all" || user.role === usersRoleFilter;
      const matchesStatus =
        usersStatusFilter === "all" || user.status === usersStatusFilter;

      return matchSearch && matchesRole && matchesStatus;
    });
  };

  return (
    <div className={adminStyles.tabSections}>
      {/* Search & Filter */}
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
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
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

      {/* Users Table */}
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
            {getFilteredUsers().map((user) => (
              <tr key={user.id}>
                <td>
                  <div className={adminStyles.userCell}>
                    <img
                      src={user.avatar}
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
                <td>{user.registered}</td>
                <td>{user.projects}</td>
                <td>{user.tasks}</td>
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
