import React, { useState } from "react";
import {
  FiSearch,
  FiMessageSquare,
  FiAlertTriangle,
  FiMoreHorizontal,
} from "react-icons/fi";
import adminStyles from "@/styles/admin.module.css";
import { mockComments } from "@/utils/mockData";

export default function CommentsModeration() {
  const [searchQuery, setSearchQuery] = useState("");

  const totalComments = mockComments.length;
  const flaggedComments = mockComments.filter(
    (comment) => comment.isFlagged,
  ).length;
  const todaysComments = mockComments.filter((comment) => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    return comment?.time?.includes("Today") || comment?.date === today;
  }).length;

  const filteredComments = mockComments.filter(
    (comment) =>
      comment.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.project.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={adminStyles.tabSections}>
      {/* Stats Row */}
      <div className={adminStyles.commentsStatsRow}>
        <div className={adminStyles.commentStatCard}>
          <div className={adminStyles.commentStatHeader}>
            <span className={adminStyles.commentStatTitle}>Total Comments</span>
            <FiMessageSquare className={adminStyles.commentStatIcon} />
          </div>
          <span className={adminStyles.commentStatValue}>{totalComments}</span>
        </div>

        <div className={adminStyles.commentStatCard}>
          <div className={adminStyles.commentStatHeader}>
            <span className={adminStyles.commentStatTitle}>
              Flagged Comments
            </span>
            <FiAlertTriangle className={adminStyles.commentStatIconWarning} />
          </div>
          <span className={adminStyles.commentStatValueWarning}>
            {flaggedComments}
          </span>
        </div>

        <div className={adminStyles.commentStatCard}>
          <div className={adminStyles.commentStatHeader}>
            <span className={adminStyles.commentStatTitle}>
              Today's Comments
            </span>
            <FiMessageSquare className={adminStyles.commentStatIcon} />
          </div>
          <span className={adminStyles.commentStatValue}>{todaysComments}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className={adminStyles.searchBox}>
        <FiSearch className={adminStyles.searchIcon} />
        <input
          type="text"
          placeholder="Search comments, users, or tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={adminStyles.searchInput}
        />
      </div>

      {/* Comments Table */}
      <div className={adminStyles.tableContainer}>
        <table className={adminStyles.dataTable}>
          <thead>
            <tr>
              <th>Author</th>
              <th>Comment</th>
              <th>Task</th>
              <th>Project</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComments.map((comment) => (
              <tr key={comment.id}>
                <td>
                  <div className={adminStyles.userCell}>
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className={adminStyles.tableAvatar}
                    />
                    <span className={adminStyles.userName}>
                      {comment.author.name}
                    </span>
                  </div>
                </td>
                <td>
                  <div className={adminStyles.commentCell}>
                    {comment.isFlagged && (
                      <FiAlertTriangle
                        className={adminStyles.flaggedIcon}
                        title="Flagged comment"
                      />
                    )}
                    <span className={adminStyles.commentText}>
                      {comment.content}
                    </span>
                  </div>
                </td>
                <td>
                  <span className={adminStyles.taskLink}>{comment.task}</span>
                </td>
                <td>
                  <span className={adminStyles.projectBadge}>
                    {comment.project}
                  </span>
                </td>
                <td>{comment.date}</td>
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
