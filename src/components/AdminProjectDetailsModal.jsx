import { useEffect, useState } from "react";
import { FiX, FiUserMinus } from "react-icons/fi";
import modalStyles from "@/styles/modals.module.css";
import adminStyles from "@/styles/admin.module.css";
import Loader from "@/components/ui/Loader";
import {
  useAdminProject,
  useRemoveAdminProjectMember,
} from "@/utils/queries/useAdminProjects";
import { getStatusClass } from "@/utils/statusClass";

export default function AdminProjectDetailsModal({
  isOpen,
  onClose,
  projectId,
}) {
  const [removingMemberId, setRemovingMemberId] = useState(null);

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useAdminProject(projectId, {
    enabled: isOpen && !!projectId,
  });

  const { mutateAsync: removeMember, isPending: isRemovingMember } =
    useRemoveAdminProjectMember();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onRemoveMember = async (memberId) => {
    if (!memberId || !project?.id) return;

    setRemovingMemberId(memberId);
    try {
      await removeMember({ projectId: project.id, memberId });
    } catch (err) {
      console.error("Failed to remove member:", err);
    } finally {
      setRemovingMemberId(null);
    }
  };

  return (
    <div className={modalStyles.modalOverlay} onClick={onClose}>
      <div
        className={modalStyles.adminProjectDetailsModal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-details-title"
      >
        <div className={modalStyles.adminProjectDetailsHeader}>
          <div>
            <h2 id="project-details-title">Project Details</h2>
            <p>View project information and members</p>
          </div>

          <button
            className={modalStyles.adminProjectDetailsCloseBtn}
            onClick={onClose}
            aria-label="Close project details"
          >
            <FiX />
          </button>
        </div>

        {isLoading && (
          <div className={modalStyles.adminProjectDetailsState}>
            <Loader />
          </div>
        )}

        {isError && (
          <div className={modalStyles.adminProjectDetailsState}>
            <p className={modalStyles.errorMessage}>
              {error?.message || "Failed to load project details."}
            </p>
          </div>
        )}

        {!isLoading && !isError && project && (
          <div className={modalStyles.adminProjectDetailsContent}>
            <div className={modalStyles.adminProjectTopRow}>
              <div>
                <h3 className={modalStyles.adminProjectName}>{project.name}</h3>
                <p className={modalStyles.adminProjectMeta}>
                  Created on {project.created || "--"}
                </p>
              </div>

              <span
                className={`${adminStyles.statusBadge} ${getStatusClass(project.status)}`}
              >
                {project.status}
              </span>
            </div>

            <p className={modalStyles.adminProjectDescription}>
              {project.description || "No description provided."}
            </p>

            <div className={modalStyles.adminProjectStatsGrid}>
              <div className={modalStyles.adminProjectStatCard}>
                <span>Total Tasks</span>
                <strong>{project.totalTasks}</strong>
              </div>

              <div className={modalStyles.adminProjectStatCard}>
                <span>Completed</span>
                <strong className={modalStyles.adminProjectStatSuccess}>
                  {project.tasksCompleted}
                </strong>
              </div>
            </div>

            <div className={modalStyles.adminProjectMembersSection}>
              <h4>Team Members</h4>

              {project.members.length === 0 && (
                <p className={modalStyles.adminProjectEmptyMembers}>
                  No members assigned to this project yet.
                </p>
              )}

              {project.members.length > 0 && (
                <div className={modalStyles.adminProjectMembersList}>
                  {project.members.map((member) => {
                    const isThisMemberRemoving =
                      isRemovingMember && removingMemberId === member.id;

                    return (
                      <div
                        key={member.id}
                        className={modalStyles.adminProjectMemberItem}
                      >
                        <div className={modalStyles.adminProjectMemberInfo}>
                          <img
                            src={member.avatar || "/vite.svg"}
                            alt={member.name}
                            className={modalStyles.adminProjectMemberAvatar}
                          />

                          <div>
                            <p className={modalStyles.adminProjectMemberName}>
                              {member.name}
                            </p>
                            <p className={modalStyles.adminProjectMemberRole}>
                              {member.role}
                            </p>
                          </div>
                        </div>

                        <button
                          className={modalStyles.adminProjectRemoveBtn}
                          onClick={() => onRemoveMember(member.id)}
                          disabled={!member.id || isThisMemberRemoving}
                        >
                          <FiUserMinus />
                          {isThisMemberRemoving ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
