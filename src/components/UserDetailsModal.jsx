import { useEffect, useMemo } from "react";
import { FiX } from "react-icons/fi";
import modalStyles from "@/styles/modals.module.css";
import Loader from "@/components/ui/Loader";
import { useAdminUser } from "@/utils/queries/useAdminUsers";
import { getRoleClass } from "@/utils/roleClass";
import { getStatusClass } from "@/utils/statusClass";

const formatLongDate = (dateString) => {
  if (!dateString) return "--";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default function UserDetailsModal({ isOpen, onClose, userId }) {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useAdminUser(userId, {
    enabled: isOpen && !!userId,
  });

  const registrationDate = useMemo(
    () => formatLongDate(user?.registeredOn),
    [user?.registeredOn],
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`${modalStyles.modalOverlay} ${modalStyles.userDetailsOverlay}`}
      onClick={onClose}
    >
      <div
        className={modalStyles.userDetailsModal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-details-title"
      >
        <div className={modalStyles.userDetailsHeader}>
          <div>
            <h2 id="user-details-title">User Details</h2>
            <p>View user information and activity</p>
          </div>

          <button
            className={modalStyles.userDetailsCloseBtn}
            onClick={onClose}
            aria-label="Close user details"
          >
            <FiX />
          </button>
        </div>

        {isLoading && (
          <div className={modalStyles.userDetailsState}>
            <Loader />
          </div>
        )}

        {isError && (
          <div className={modalStyles.userDetailsState}>
            <p className={modalStyles.errorMessage}>
              {error?.message || "Failed to load user details."}
            </p>
          </div>
        )}

        {!isLoading && !isError && user && (
          <div className={modalStyles.userDetailsContent}>
            <div className={modalStyles.userDetailsIdentity}>
              <img
                src={user.avatar || "/vite.svg"}
                alt={user.username}
                className={modalStyles.userDetailsAvatar}
              />

              <div className={modalStyles.userDetailsIdentityText}>
                <h3>{user.username}</h3>
                <p>{user.email}</p>

                <div className={modalStyles.userDetailsBadges}>
                  <span
                    className={`${modalStyles.roleBadge} ${getRoleClass(user.role)}`}
                  >
                    {user.role}
                  </span>
                  <span
                    className={`${modalStyles.statusBadge} ${getStatusClass(user.status)}`}
                  >
                    {user.status}
                  </span>
                </div>
              </div>
            </div>

            <div className={modalStyles.userDetailsStatsGrid}>
              <div className={modalStyles.userDetailsStatCard}>
                <span className={modalStyles.userDetailsStatLabel}>
                  Assigned Projects
                </span>
                <strong className={modalStyles.userDetailsStatValue}>
                  {user.projectCount}
                </strong>
              </div>

              <div className={modalStyles.userDetailsStatCard}>
                <span className={modalStyles.userDetailsStatLabel}>
                  Assigned Tasks
                </span>
                <strong className={modalStyles.userDetailsStatValue}>
                  {user.taskCount}
                </strong>
              </div>
            </div>

            <div className={modalStyles.userDetailsMeta}>
              <span className={modalStyles.userDetailsMetaLabel}>
                Registration Date
              </span>
              <span className={modalStyles.userDetailsMetaValue}>
                {registrationDate}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
