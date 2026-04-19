import React, { useState, useEffect, useRef } from "react";
import {
  FiAlertCircle,
  FiClock,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiMoreHorizontal,
  FiEye,
  FiEdit2,
  FiUserPlus,
  FiCheckCircle,
  FiTrash2,
} from "react-icons/fi";
import { MdOutlineAssignmentInd } from "react-icons/md";
import adminStyles from "@/styles/admin.module.css";
import { getStatusClass } from "@/utils/statusClass";
import { getPriorityClass } from "@/utils/priorityClass";
import Loader from "@/components/ui/Loader";
import AssignTaskUserModal from "@/components/AssignTaskUserModal";
import TaskDetailsSheet from "@/components/TaskDetailsSheet";
import {
  useAdminTasks,
  useDeleteAdminTask,
} from "@/utils/queries/useAdminTasks";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import TaskModal from "./TaskModal";
// import { useAuth } from "@/contexts/AuthProvider";

export default function TaskManagement() {
  const [tasksSearch, setTasksSearch] = useState("");
  const [tasksStatusFilter, setTasksStatusFilter] = useState("all");
  const [tasksPriorityFilter, setTasksPriorityFilter] = useState("all");

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Floating menu state
  const [openMenuFor, setOpenMenuFor] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const triggerRefs = useRef(new Map());

  // const { user } = useAuth();

  // const role = String(user?.role ?? "")
  //   .trim()
  //   .toUpperCase();
  // const canAddTask = role !== "GUEST";
  // const canManageTaskActions = role !== "GUEST";

  const { data, isLoading, isError, error } = useAdminTasks();
  const { mutateAsync: deleteAdminTask, isPending: isDeletingTask } =
    useDeleteAdminTask();

  const tasks = data?.tasks ?? [];
  const stats = data?.stats ?? { overdueCount: 0, unassignedCount: 0 };

  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(tasksSearch.toLowerCase()) ||
        task.project.toLowerCase().includes(tasksSearch.toLowerCase());

      const matchesStatus =
        tasksStatusFilter === "all" || task.status === tasksStatusFilter;

      const matchesPriority =
        tasksPriorityFilter === "all" ||
        task.priority.toLowerCase() === tasksPriorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  };

  const getOverdueTasksCount = () =>
    stats.overdueCount ?? tasks.filter((task) => task.isOverdue).length;

  const getUnassignedTasksCount = () =>
    stats.unassignedCount ?? tasks.filter((task) => !task.assignee).length;

  const openTaskMenu = (e, taskId) => {
    e.stopPropagation();

    if (openMenuFor === taskId) {
      setOpenMenuFor(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 220;
    const menuHeightEstimate = 280;
    const viewportPadding = 12;

    const left = Math.max(
      viewportPadding,
      Math.min(
        rect.right - menuWidth,
        window.innerWidth - menuWidth - viewportPadding,
      ),
    );

    let top = rect.bottom + 8;
    if (top + menuHeightEstimate > window.innerHeight - viewportPadding) {
      top = Math.max(viewportPadding, rect.top - menuHeightEstimate - 8);
    }

    setMenuPosition({ top, left });
    setOpenMenuFor(taskId);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTask?.id) return;

    try {
      await deleteAdminTask(selectedTask.id);
      setShowDeleteModal(false);
      setShowDetailsSheet(false);
      setShowAssignModal(false);
      setSelectedTask(null);
      setOpenMenuFor(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleTaskAction = async (action, task) => {
    if (action === "assign-user") {
      setSelectedTask(task);
      setShowAssignModal(true);
      setOpenMenuFor(null);
      return;
    }

    if (action === "edit-task") {
      setSelectedTask(task);
      setShowEditModal(true);
    }

    if (action === "view-details") {
      setSelectedTask(task);
      setShowDetailsSheet(true);
      setOpenMenuFor(null);
      return;
    }

    if (action === "mark-done") {
      console.log("Mark as done:", task);
    }

    if (action === "delete-task") {
      setSelectedTask(task);
      setShowDeleteModal(true);
      setOpenMenuFor(null);
      return;
    }

    setOpenMenuFor(null);
  };

  useEffect(() => {
    if (!openMenuFor) return;

    const closeMenu = () => setOpenMenuFor(null);

    const handleOutsideClick = (e) => {
      const trigger = triggerRefs.current.get(openMenuFor);
      const clickedMenu = menuRef.current && menuRef.current.contains(e.target);
      const clickedTrigger = trigger && trigger.contains(e.target);

      if (!clickedMenu && !clickedTrigger) closeMenu();
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") closeMenu();
    };

    const handleViewportChange = () => closeMenu();

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEsc);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [openMenuFor]);

  if (isLoading) {
    return (
      <div className={adminStyles.tabSection}>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={adminStyles.tabSection}>
        <div className={adminStyles.errorMessage}>
          {error?.message || "Failed to load admin tasks."}
        </div>
      </div>
    );
  }

  return (
    <div className={adminStyles.tabSection}>
      {/* Stats Cards */}
      <div className={adminStyles.statsRow}>
        <div className={adminStyles.statsCard}>
          <div className={adminStyles.statsHeader}>
            <span className={adminStyles.statsTitle}>Overdue Tasks</span>
            <FiAlertCircle className={adminStyles.statsIconRed} />
          </div>
          <div className={adminStyles.statsValue + " " + adminStyles.textRed}>
            {getOverdueTasksCount()}
          </div>
          <span className={adminStyles.statsSubtext}>tasks past due date</span>
        </div>
        <div className={adminStyles.statsCard}>
          <div className={adminStyles.statsHeader}>
            <span className={adminStyles.statsTitle}>Unassigned Tasks</span>
            <MdOutlineAssignmentInd className={adminStyles.statsIconOrange} />
          </div>
          <div
            className={adminStyles.statsValue + " " + adminStyles.textOrange}
          >
            {getUnassignedTasksCount()}
          </div>
          <span className={adminStyles.statsSubtext}>
            tasks without assignee
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={adminStyles.tableControls}>
        <div className={adminStyles.searchBox}>
          <FiSearch className={adminStyles.searchIcon} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={tasksSearch}
            onChange={(e) => setTasksSearch(e.target.value)}
            className={adminStyles.searchInput}
          />
        </div>
        <div className={adminStyles.filterGroup}>
          <div className={adminStyles.filterDropdown}>
            <FiFilter className={adminStyles.filterIcon} />
            <select
              value={tasksStatusFilter}
              onChange={(e) => setTasksStatusFilter(e.target.value)}
              className={adminStyles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Done">Done</option>
            </select>
            <FiChevronDown className={adminStyles.dropdownIcon} />
          </div>
          <div className={adminStyles.filterDropdown}>
            <select
              value={tasksPriorityFilter}
              onChange={(e) => setTasksPriorityFilter(e.target.value)}
              className={adminStyles.filterSelect}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <FiChevronDown className={adminStyles.dropdownIcon} />
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className={adminStyles.tableContainer}>
        <table className={adminStyles.dataTable}>
          <thead>
            <tr>
              <th style={{ width: "40px" }}></th>
              <th>Task</th>
              <th>Project</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredTasks().map((task) => (
              <tr key={task.id}>
                <td>
                  <div className={adminStyles.taskCheckbox}>
                    <div className={adminStyles.checkCircle}></div>
                  </div>
                </td>
                <td>
                  <span className={adminStyles.taskName}>{task.title}</span>
                </td>
                <td>
                  <span className={adminStyles.projectLabel}>
                    {task.project}
                  </span>
                </td>
                <td>
                  {task.assignee ? (
                    <div className={adminStyles.assigneeCell}>
                      <img
                        src={task.assignee.avatar || "/vite.svg"}
                        alt={task.assignee.name}
                        className={adminStyles.tableAvatar}
                      />
                      <span>{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className={adminStyles.unassignedText}>
                      Unassigned
                    </span>
                  )}
                </td>
                <td>
                  <span
                    className={`${adminStyles.statusBadge} ${getStatusClass(task.status)}`}
                  >
                    {task.status.replace("_", " ").toUpperCase()}
                  </span>
                </td>
                <td>
                  <span
                    className={`${adminStyles.priorityBadge} ${getPriorityClass(task.priority)}`}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span
                    className={task.isOverdue ? adminStyles.overdueDueDate : ""}
                  >
                    {task.isOverdue && (
                      <FiClock className={adminStyles.overdueIcon} />
                    )}
                    {task.dueDate}
                  </span>
                </td>
                <td className={adminStyles.actionsCell}>
                  <button
                    className={adminStyles.actionBtn}
                    aria-label={`Open actions for ${task.title}`}
                    aria-haspopup="menu"
                    aria-expanded={openMenuFor === task.id}
                    onClick={(e) => openTaskMenu(e, task.id)}
                    ref={(el) => {
                      if (el) triggerRefs.current.set(task.id, el);
                      else triggerRefs.current.delete(task.id);
                    }}
                  >
                    <FiMoreHorizontal />
                  </button>

                  {openMenuFor === task.id && (
                    <div
                      ref={menuRef}
                      className={adminStyles.userFloatingMenu}
                      style={{
                        top: menuPosition.top,
                        left: menuPosition.left,
                      }}
                      role="menu"
                    >
                      <div className={adminStyles.userFloatingMenuTitle}>
                        Actions
                      </div>

                      <button
                        className={adminStyles.userFloatingMenuItem}
                        onClick={() => handleTaskAction("view-details", task)}
                        role="menuitem"
                      >
                        <FiEye className={adminStyles.userFloatingMenuIcon} />
                        View Details
                      </button>

                      <button
                        className={adminStyles.userFloatingMenuItem}
                        onClick={() => handleTaskAction("edit-task", task)}
                        role="menuitem"
                      >
                        <FiEdit2 className={adminStyles.userFloatingMenuIcon} />
                        Edit Task
                      </button>

                      <button
                        className={adminStyles.userFloatingMenuItem}
                        onClick={() => handleTaskAction("assign-user", task)}
                        role="menuitem"
                      >
                        <FiUserPlus
                          className={adminStyles.userFloatingMenuIcon}
                        />
                        Assign User
                      </button>

                      <button
                        className={adminStyles.userFloatingMenuItem}
                        onClick={() => handleTaskAction("mark-done", task)}
                        role="menuitem"
                      >
                        <FiCheckCircle
                          className={adminStyles.userFloatingMenuIcon}
                        />
                        Mark as Done
                      </button>

                      <div className={adminStyles.userFloatingMenuSeparator} />

                      <button
                        className={`${adminStyles.userFloatingMenuItem} ${adminStyles.projectFloatingMenuItemDanger}`}
                        onClick={() => handleTaskAction("delete-task", task)}
                        role="menuitem"
                        disabled={isDeletingTask}
                      >
                        <FiTrash2
                          className={adminStyles.userFloatingMenuIcon}
                        />
                        Delete Task
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showDetailsSheet && (
          <TaskDetailsSheet
            taskId={selectedTask?.id}
            isOpen={showDetailsSheet}
            onClose={() => {
              setShowDetailsSheet(false);
              setSelectedTask(null);
            }}
            onEdit={(task) => {
              setShowDetailsSheet(false);
              setSelectedTask(task);
              setShowEditModal(true);
            }}
            onDelete={(task) => {
              handleTaskAction("delete-task", task);
            }}
          />
        )}

        {showEditModal && (
          <TaskModal
            // ref={createModalRef}
            setShowModal={setShowEditModal}
            taskToEdit={selectedTask}
          />
        )}

        {showAssignModal && (
          <AssignTaskUserModal
            isOpen={showAssignModal}
            onClose={() => {
              setShowAssignModal(false);
              setSelectedTask(null);
            }}
            task={selectedTask}
          />
        )}

        {showDeleteModal && (
          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            itemName={selectedTask?.title}
            itemType="Task"
            isDeleting={isDeletingTask}
          />
        )}
      </div>
    </div>
  );
}
