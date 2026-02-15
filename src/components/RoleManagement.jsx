import React, { useState } from "react";
import { FiPlus, FiEdit2, FiChevronDown, FiUsers } from "react-icons/fi";
import adminStyles from "@/styles/admin.module.css";
import { mockRoles, mockUsersForRoles } from "@/utils/mockData";
import { getRoleClass } from "@/utils/roleClass";

export default function RoleManagement() {
  const [usersRoles, setUsersRoles] = useState(
    mockUsersForRoles.reduce((acc, user) => {
      acc[user.id] = user.role;
      return acc;
    }, {}),
  );

  const handleRoleChange = (userId, newRole) => {
    setUsersRoles((prev) => ({
      ...prev,
      [userId]: newRole,
    }));
  };

  return (
    <div className={adminStyles.tabSections}>
      {/* Available Roles Section */}
      <div className={adminStyles.rolesSection}>
        <div className={adminStyles.rolesSectionHeader}>
          <div>
            <h3 className={adminStyles.rolesSectionTitle}>Available Roles</h3>
            <p className={adminStyles.rolesSectionSubtitle}>
              Manage roles and their permissions
            </p>
          </div>
          <button className={adminStyles.createRoleBtn}>
            <FiPlus /> Create Role
          </button>
        </div>

        <div className={adminStyles.rolesGrid}>
          {mockRoles.map((role) => (
            <div key={role.id} className={adminStyles.roleCard}>
              <div className={adminStyles.roleCardHeader}>
                <span
                  className={`${adminStyles.roleBadgeLarge} ${getRoleClass(role.name)}`}
                >
                  {role.name}
                </span>
                <button className={adminStyles.editRoleBtn}>
                  <FiEdit2 />
                </button>
              </div>
              <p className={adminStyles.roleDescription}>{role.description}</p>
              <div className={adminStyles.roleStats}>
                <span className={adminStyles.roleStat}>
                  <span className={adminStyles.roleStatIcon}>
                    <FiUsers />
                  </span>
                  {role.userCount} users
                </span>
                <span className={adminStyles.roleStat}>
                  {role.permissions} permissions
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Roles Section */}
      <div className={adminStyles.assignRolesSection}>
        <div className={adminStyles.assignRolesHeader}>
          <h3 className={adminStyles.rolesSectionTitle}>
            Assign Roles to Users
          </h3>
          <p className={adminStyles.rolesSectionSubtitle}>
            Change user roles quickly
          </p>
        </div>

        <div className={adminStyles.tableContainer}>
          <table className={adminStyles.dataTable}>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {mockUsersForRoles.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={adminStyles.userCell}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={adminStyles.tableAvatar}
                      />
                      <span className={adminStyles.userName}>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`${adminStyles.roleBadge} ${getRoleClass(usersRoles[user.id])}`}
                    >
                      {usersRoles[user.id]}
                    </span>
                  </td>
                  <td>
                    <div className={adminStyles.roleSelectWrapper}>
                      <select
                        value={usersRoles[user.id]}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className={adminStyles.roleSelect}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Moderator">Moderator</option>
                        <option value="User">User</option>
                      </select>
                      <FiChevronDown className={adminStyles.roleSelectIcon} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
