import React from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import styles from "@/styles/modals.module.css";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = "Project",
  isDeleting = false,
  title,
  confirmText = "Delete",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  const resolvedType = String(itemType || "Item");
  const modalTitle = title || `Delete ${resolvedType}`;
  const safeName = itemName || `this ${resolvedType.toLowerCase()}`;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>

        <div className={styles.iconWrapper}>
          <FiAlertTriangle className={styles.warningIcon} />
        </div>

        <h2 className={styles.modalTitle}>{modalTitle}</h2>

        <p className={styles.modalMessage}>
          Are you sure you want to delete <strong>{safeName}</strong>? This
          action cannot be undone.
        </p>

        <div className={styles.modalActions}>
          <button
            className={styles.btnCancel}
            onClick={onClose}
            disabled={isDeleting}
          >
            {cancelText}
          </button>
          <button
            className={styles.btnDelete}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
