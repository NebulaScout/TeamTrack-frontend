import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import modalStyles from "@/styles/modals.module.css";
import { useGetTeamMembers } from "@/hooks/useTeam";
import { usePatchAdminTask } from "@/hooks/useAdminTasks";
import { STATUS_TO_API, PRIORITY_TO_API } from "@/utils/enumMappings";

// const STATUS_TO_API = {
//   open: "TO_DO",
//   in_progress: "IN_PROGRESS",
//   done: "DONE",
// };

// const PRIORITY_TO_API = {
//   low: "LOW",
//   medium: "MEDIUM",
//   high: "HIGH",
// };

const toApiStatus = (status) =>
  STATUS_TO_API[
    String(status ?? "")
      .trim()
      .toLowerCase()
  ] || "TO_DO";

const toApiPriority = (priority) =>
  PRIORITY_TO_API[
    String(priority ?? "")
      .trim()
      .toLowerCase()
  ] || "LOW";

const getMemberDisplayName = (member) => {
  const full = `${member?.firstName ?? ""} ${member?.lastName ?? ""}`.trim();
  return full || member?.username || "Unknown User";
};

const isAssignableRole = (role) => {
  const normalized = String(role ?? "")
    .trim()
    .toUpperCase();
  return ["DEVELOPER", "PROJECT_MANAGER", "ADMIN"].includes(normalized);
};

export default function AssignTaskUserModal({ isOpen, onClose, task }) {
  const [search, setSearch] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const projectId = task?.projectId ?? null;

  const { data: teamMembers = [], isLoading: isLoadingMembers } =
    useGetTeamMembers(projectId, { enabled: isOpen && !!projectId });

  const { mutateAsync: patchAdminTask, isPending: isAssigning } =
    usePatchAdminTask();

  useEffect(() => {
    if (!isOpen) return;
    setSearch("");
    setSelectedMemberId(task?.assignee?.id ?? null);
  }, [isOpen, task?.id, task?.assignee?.id]);

  useEffect(() => {
    if (!isOpen) return;

    const onEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  const assignableMembers = useMemo(
    () => teamMembers.filter((m) => isAssignableRole(m.role)),
    [teamMembers],
  );

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return assignableMembers;

    return assignableMembers.filter((member) => {
      const name = getMemberDisplayName(member).toLowerCase();
      const username = String(member?.username ?? "").toLowerCase();
      const email = String(member?.email ?? "").toLowerCase();
      return name.includes(q) || username.includes(q) || email.includes(q);
    });
  }, [assignableMembers, search]);

  const handleAssign = async () => {
    if (!task?.id || !selectedMemberId) return;

    await patchAdminTask({
      id: task.id,
      data: {
        status: toApiStatus(task.status),
        priority: toApiPriority(task.priority),
        assigned_to: Number(selectedMemberId),
      },
    });

    onClose();
  };

  const handleUnassign = async () => {
    if (!task?.id) return;

    await patchAdminTask({
      id: task.id,
      data: {
        status: toApiStatus(task.status),
        priority: toApiPriority(task.priority),
        assigned_to: 0,
      },
    });

    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div className={modalStyles.modalOverlay} onClick={onClose}>
      <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={modalStyles.modalHeader}>
          <div>
            <h2>Assign User</h2>
            <p className={modalStyles.modalSubtitle}>
              Select a project member to assign to "{task.title}"
            </p>
          </div>
          <button
            className={modalStyles.btnClose}
            onClick={onClose}
            disabled={isAssigning}
          >
            <FiX />
          </button>
        </div>

        <div className={modalStyles.assignSearchBox}>
          <FiSearch className={modalStyles.assignSearchIcon} />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={isAssigning || isLoadingMembers}
          />
        </div>

        <div className={modalStyles.assignMembersList}>
          {isLoadingMembers && (
            <div className={modalStyles.assignEmptyState}>
              Loading members...
            </div>
          )}

          {!isLoadingMembers && filteredMembers.length === 0 && (
            <div className={modalStyles.assignEmptyState}>
              No matching project members found.
            </div>
          )}

          {!isLoadingMembers &&
            filteredMembers.map((member) => {
              const displayName = getMemberDisplayName(member);
              const selected = Number(selectedMemberId) === Number(member.id);

              return (
                <button
                  type="button"
                  key={member.id}
                  className={`${modalStyles.assignMemberRow} ${selected ? modalStyles.assignMemberRowActive : ""}`}
                  onClick={() => setSelectedMemberId(member.id)}
                  disabled={isAssigning}
                >
                  <img
                    src={member.avatar || "/vite.svg"}
                    alt={displayName}
                    className={modalStyles.assignMemberAvatar}
                  />
                  <div className={modalStyles.assignMemberText}>
                    <span className={modalStyles.assignMemberName}>
                      {displayName}
                    </span>
                    <span className={modalStyles.assignMemberMeta}>
                      @{member.username}
                    </span>
                  </div>
                </button>
              );
            })}
        </div>

        <div className={modalStyles.modalActions}>
          <button
            type="button"
            className={modalStyles.btnCancel}
            onClick={onClose}
            disabled={isAssigning}
          >
            Cancel
          </button>

          <button
            type="button"
            className={modalStyles.btnCancel}
            onClick={handleUnassign}
            disabled={isAssigning}
          >
            Unassign
          </button>

          <button
            type="button"
            className={modalStyles.btnCreate}
            onClick={handleAssign}
            disabled={isAssigning || !selectedMemberId}
          >
            {isAssigning ? "Assigning..." : "Assign User"}
          </button>
        </div>
      </div>
    </div>
  );
}
