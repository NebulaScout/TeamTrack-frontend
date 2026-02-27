import React from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import styles from "@/styles/modals.module.css";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  projectName,
  isDeleting = false,
}) {
  if (!isOpen) return null;

  // make this a hook
  //   const handleOverlayClick = (e) => {
  //     if (e.target === e.currentTarget) {
  //       onClose();
  //     }
  //   };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>

        <div className={styles.iconWrapper}>
          <FiAlertTriangle className={styles.warningIcon} />
        </div>

        <h2 className={styles.modalTitle}>Delete Project</h2>

        <p className={styles.modalMessage}>
          Are you sure you want to delete <strong>{projectName}</strong>? This
          action cannot be undone.
        </p>

        <div className={styles.modalActions}>
          <button
            className={styles.btnCancel}
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className={styles.btnDelete}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
