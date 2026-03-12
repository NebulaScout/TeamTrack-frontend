import { useState, useRef, useEffect } from "react";
import {
  FiX,
  FiEdit2,
  FiTrash2,
  FiMessageSquare,
  FiSend,
  FiUser,
  FiCalendar,
  FiFolder,
  FiFlag,
  FiFileText,
} from "react-icons/fi";
import styles from "@/styles/tasks.module.css";
import { getPriorityClass } from "@/utils/priorityClass";
import { getTaskStatusClass } from "@/utils/statusClass";
import { formatDate } from "@/utils/formatDate";
import { useGetTask, useGetComments, useCreateComment } from "@/hooks/useTasks";

// TODO: Figure a way to fetch comments without having to reopen the sheet
export default function TaskDetailsSheet({
  taskId,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) {
  // console.log("Task id in Sheet: ", taskId);
  const { data: task } = useGetTask(taskId);
  const { data: comments, isLoading: commentsLoading } = useGetComments(taskId);
  console.log("Comments: ", comments);
  const createCommentMutation = useCreateComment();

  const [comment, setComment] = useState("");
  const sheetRef = useRef(null);
  const inputRef = useRef(null);

  // TODO: Change this to a hook
  // Close on escape key
  useEffect(() => {
    // console.log("IsOpen: ", isOpen);
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !taskId) return;

    try {
      await createCommentMutation.mutateAsync({
        taskId,
        content: comment.trim(),
      });
      setComment("");
      // focus back on input after successful comment
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to create comment: ", error);
      // TODO: Add toast notification
    }
  };

  //   Render mention text with highlighting
  const renderMessageWithMentions = (message) => {
    const mentionRegex = /@(\w+\s?\w*)/g;
    const parts = message.split(mentionRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span key={index} className={styles.mention}>
            @{part}
          </span>
        );
      }
      return part;
    });
  };

  // get user initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className={styles.sheetOverlay} onClick={handleOverlayClick}>
      <div
        ref={sheetRef}
        className={`${styles.detailsSheet} ${isOpen ? styles.sheetOpen : ""}`}
      >
        {/* Header */}
        <div className={styles.sheetHeader}>
          <h2 className={styles.sheetTitle}>Task Details</h2>
          <button className={styles.btnCloseSheet} onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div className={styles.sheetContent}>
          {/* Task Title & Badges */}
          <div className={styles.taskTitleSection}>
            <h3 className={styles.taskDetailTitle}>{task?.title}</h3>
            <div className={styles.taskBadges}>
              <span
                className={`${styles.statusBadge} ${getTaskStatusClass(task?.status)}`}
              >
                {task?.status}
              </span>
              <span
                className={`${styles.priorityBadgeLarge} ${getPriorityClass(task?.priority)}`}
              >
                <FiFlag />
                {task?.priority} Priority
              </span>
            </div>
          </div>

          {/* Description */}
          <div className={styles.detailSection}>
            <div className={styles.detailLabel}>
              <FiFileText />
              <span>Description</span>
            </div>
            <p className={styles.detailValue}>
              {task?.description || "No description provided."}
            </p>
          </div>

          {/* Assignee & Due Date Row */}
          <div className={styles.detailsRow}>
            <div className={styles.detailCard}>
              <div className={styles.detailCardLabel}>
                <FiUser />
                <span>Assignee</span>
              </div>
              <div className={styles.assigneeInfo}>
                {task?.assignee?.avatar ? (
                  <img
                    src={task?.assignee.avatar}
                    alt={task?.assignee.name}
                    className={styles.assigneeAvatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {getInitials(task?.assignee?.name || "Unassigned")}
                  </div>
                )}
                <span className={styles.assigneeName}>
                  {task?.assignee?.name || "Unassigned"}
                </span>
              </div>
            </div>

            <div className={styles.detailCard}>
              <div className={styles.detailCardLabel}>
                <FiCalendar />
                <span>Due Date</span>
              </div>
              <span className={styles.dueDateValue}>
                {formatDate(task?.dueDate) || "No due date"}
              </span>
            </div>
          </div>

          {/* Project */}
          <div className={styles.detailCardFull}>
            <div className={styles.detailCardLabel}>
              <FiFolder />
              <span>Project</span>
            </div>
            <span className={styles.projectValue}>
              {task?.project?.projectName || "No project"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className={styles.sheetActions}>
            <button className={styles.btnEditTask} onClick={() => onEdit(task)}>
              <FiEdit2 />
              Edit Task
            </button>
            <button
              className={styles.btnDeleteTask}
              onClick={() => onDelete(task)}
            >
              <FiTrash2 />
              Delete
            </button>
          </div>

          {/* Discussion Section */}
          <div className={styles.discussionSection}>
            <div className={styles.discussionHeader}>
              <FiMessageSquare />
              <span>Discussion ({comments?.length || 0})</span>
            </div>

            <div className={styles.discussionList}>
              {commentsLoading ? (
                <p className={styles.loadingText}>Loading comments...</p>
              ) : comments?.length > 0 ? (
                comments.map((item) => (
                  <div key={item.id} className={styles.discussionItem}>
                    {item.user?.avatar ? (
                      <img
                        src={item.user.avatar}
                        alt={item.user.name}
                        className={styles.discussionAvatar}
                      />
                    ) : (
                      <div className={styles.discussionAvatarPlaceholder}>
                        {getInitials(item.user?.name || "User")}
                      </div>
                    )}
                    <div className={styles.discussionContent}>
                      <div className={styles.discussionMeta}>
                        <span className={styles.discussionAuthor}>
                          {item.user?.name || "Unknown User"}
                        </span>
                        <span className={styles.discussionTime}>
                          {item.timestamp}
                        </span>
                      </div>
                      <p className={styles.discussionMessage}>
                        {renderMessageWithMentions(item.message)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>
                  No comments yet. Start the discussion!
                </p>
              )}
            </div>

            {/* Comment Input */}
            <form className={styles.commentForm} onSubmit={handleSubmitComment}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Add a comment... Use @name to mention"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className={styles.commentInput}
              />
              <button
                type="submit"
                className={styles.btnSendComment}
                disabled={!comment.trim() || createCommentMutation.isPending}
              >
                <FiSend />
              </button>
            </form>

            <span className={styles.mentionHint}>
              {createCommentMutation.isPending
                ? "Sending..."
                : "@ Mention with @name"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
