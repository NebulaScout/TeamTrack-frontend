import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiUserPlus, FiX } from "react-icons/fi";
import modalStyles from "@/styles/modals.module.css";
import Loader from "@/components/ui/Loader";
import { useGetUsers } from "@/utils/queries/useManageUsers";
import {
  useAdminProject,
  useAddAdminProjectMember,
  useUpdateAdminProjectMemberRole,
  useRemoveAdminProjectMember,
} from "@/utils/queries/useAdminProjects";

const ROLE_OPTIONS = [
  { value: "PROJECT_MANAGER", label: "Project Manager" },
  { value: "DEVELOPER", label: "Developer" },
  { value: "GUEST", label: "Guest" },
  // { value: "DESIGNER", label: "Designer" },
  // { value: "QA", label: "QA" },
  { value: "ADMIN", label: "Admin" },
];

const toDisplayName = (user) => {
  const full = `${user?.firstName} ${user?.lastName}`;
  return full || user?.username || "Unknown User";
};

const toRoleApi = (role) =>
  String(role ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

const toRoleLabel = (role) => {
  const normalized = toRoleApi(role);
  return (
    ROLE_OPTIONS.find((item) => item.value === normalized)?.label ||
    String(role ?? "Member")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (ch) => ch.toUpperCase())
  );
};

export default function ManageProjectMembersModal({
  isOpen,
  onClose,
  projectId,
  projectName,
}) {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("DEVELOPER");
  const [formError, setFormError] = useState("");
  const [removingMemberId, setRemovingMemberId] = useState(null);
  const [updatingRoleMemberId, setUpdatingRoleMemberId] = useState(null);
  console.log("ManageProjectMembersModal is open: ", isOpen);

  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
  } = useAdminProject(projectId, {
    enabled: isOpen && !!projectId,
  });

  const { data: users = [], isPending: isUsersLoading } = useGetUsers({
    enabled: isOpen,
  });

  const { mutateAsync: addMember, isPending: isAddingMember } =
    useAddAdminProjectMember();
  const { mutateAsync: updateRole, isPending: isUpdatingRole } =
    useUpdateAdminProjectMemberRole();
  const { mutateAsync: removeMember, isPending: isRemovingMember } =
    useRemoveAdminProjectMember();

  const members = project?.members ?? [];

  const memberIds = useMemo(
    () => new Set(members.map((member) => Number(member.id))),
    [members],
  );

  const availableUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users
      .filter((user) => !memberIds.has(Number(user.id)))
      .filter((user) => {
        if (!query) return true;
        const displayName = toDisplayName(user).toLowerCase();
        const username = String(user?.username ?? "").toLowerCase();
        const email = String(user?.email ?? "").toLowerCase();

        return (
          displayName.includes(query) ||
          username.includes(query) ||
          email.includes(query)
        );
      });
  }, [users, memberIds, search]);

  useEffect(() => {
    if (!isOpen) return;
    setSearch("");
    setSelectedUserId("");
    setSelectedRole("DEVELOPER");
    setFormError("");
  }, [isOpen, projectId]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  const handleAddMember = async () => {
    setFormError("");

    if (!projectId || !selectedUserId || !selectedRole) {
      setFormError("Please select both a user and role.");
      return;
    }

    try {
      await addMember({
        projectId,
        data: {
          user_id: Number(selectedUserId),
          role: selectedRole,
        },
      });

      setSelectedUserId("");
      setSearch("");
    } catch (err) {
      const message =
        err?.response?.data?.messages ||
        err?.response?.data?.detail ||
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "Failed to add member. Please try again.";
      setFormError(message);
    }
  };

  const handleRoleChange = async (memberId, roleValue) => {
    if (!projectId || !memberId || !roleValue) return;

    setUpdatingRoleMemberId(memberId);
    try {
      await updateRole({
        projectId,
        memberId,
        data: {
          role: roleValue,
        },
      });
    } catch (err) {
      const message =
        err?.response?.data?.messages ||
        err?.response?.data?.detail ||
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "Failed to update role.";
      setFormError(message);
    } finally {
      setUpdatingRoleMemberId(null);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!projectId || !memberId) return;

    setRemovingMemberId(memberId);
    try {
      await removeMember({ projectId, memberId });
    } catch (err) {
      const message =
        err?.response?.data?.messages ||
        err?.response?.data?.detail ||
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "Failed to remove member.";
      setFormError(message);
    } finally {
      setRemovingMemberId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={modalStyles.modalOverlay} onClick={onClose}>
      <div
        className={modalStyles.manageMembersModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modalStyles.modalHeader}>
          <div>
            <h2>Manage Members</h2>
            <p className={modalStyles.modalSubtitle}>
              Add or remove members from {projectName || "this project"}
            </p>
          </div>
          <button className={modalStyles.btnClose} onClick={onClose}>
            <FiX />
          </button>
        </div>

        {formError && (
          <div className={modalStyles.errorMessage}>{formError}</div>
        )}

        {(isProjectLoading || isUsersLoading) && (
          <div className={modalStyles.manageMembersLoading}>
            <Loader />
          </div>
        )}

        {isProjectError && (
          <div className={modalStyles.errorMessage}>
            {projectError?.message || "Failed to load members."}
          </div>
        )}

        {!isProjectLoading && !isProjectError && (
          <>
            <section className={modalStyles.manageMembersAddCard}>
              <div className={modalStyles.manageMembersAddTitle}>
                <FiUserPlus />
                <span>Add Member</span>
              </div>

              <div className={modalStyles.assignSearchBox}>
                <FiSearch className={modalStyles.assignSearchIcon} />
                <input
                  type="text"
                  value={search}
                  placeholder="Search users..."
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={isAddingMember}
                />
              </div>

              <div className={modalStyles.formRow}>
                <div className={modalStyles.formGroup}>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    disabled={isAddingMember}
                  >
                    <option value="">Select user</option>
                    {availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {toDisplayName(user)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={modalStyles.formGroup}>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    disabled={isAddingMember}
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className={modalStyles.manageMembersAddButton}
                  onClick={handleAddMember}
                  disabled={isAddingMember || !selectedUserId}
                  aria-label="Add member"
                >
                  <FiUserPlus />
                </button>
              </div>
            </section>

            <section className={modalStyles.manageMembersCurrentSection}>
              <h3>
                Current Members <span>{members.length}</span>
              </h3>

              {members.length === 0 && (
                <p className={modalStyles.assignEmptyState}>
                  No members assigned yet.
                </p>
              )}

              {members.length > 0 && (
                <div className={modalStyles.manageMembersList}>
                  {members.map((member) => {
                    const displayName =
                      member?.name || member?.username || "Unknown User";
                    const currentRoleValue = toRoleApi(member?.role);
                    const memberIsRemoving =
                      isRemovingMember && removingMemberId === member.id;
                    const memberIsUpdatingRole =
                      isUpdatingRole && updatingRoleMemberId === member.id;

                    return (
                      <div
                        key={member.id}
                        className={modalStyles.manageMembersItem}
                      >
                        <div className={modalStyles.manageMembersItemLeft}>
                          <img
                            src={member?.avatar || "/vite.svg"}
                            alt={displayName}
                            className={modalStyles.assignMemberAvatar}
                          />
                          <span className={modalStyles.manageMembersName}>
                            {displayName}
                          </span>
                        </div>

                        <div className={modalStyles.manageMembersItemActions}>
                          <select
                            className={modalStyles.manageMembersRoleSelect}
                            value={currentRoleValue}
                            onChange={(e) =>
                              handleRoleChange(member.id, e.target.value)
                            }
                            disabled={memberIsUpdatingRole || memberIsRemoving}
                          >
                            {ROLE_OPTIONS.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                            {!ROLE_OPTIONS.some(
                              (role) => role.value === currentRoleValue,
                            ) && (
                              <option value={currentRoleValue}>
                                {toRoleLabel(member?.role)}
                              </option>
                            )}
                          </select>

                          <button
                            type="button"
                            className={modalStyles.manageMembersRemoveBtn}
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={memberIsRemoving || memberIsUpdatingRole}
                            aria-label={`Remove ${displayName}`}
                          >
                            <FiX />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
