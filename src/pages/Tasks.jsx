import { useState, useRef } from "react";
import { FiSearch, FiPlus, FiMoreHorizontal, FiFilter } from "react-icons/fi";
import { FaRegCalendar } from "react-icons/fa6";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import styles from "@/styles/dashboard.module.css";
import taskStyles from "@/styles/tasks.module.css";
import { formatDate } from "@/utils/formatDate";
import TaskModal from "@/components/TaskModal";
import { getPriorityClass } from "@/utils/priorityClass";
import { getTaskStatusClass, getStatusDotClass } from "@/utils/statusClass";
import Loader from "@/components/ui/Loader";
import { useDeleteTask, useGetTasks } from "@/hooks/useTasks";
import { useCloseOnOutsideClick } from "@/hooks/useHandleClicks";
import { DropdownMenu } from "@/components/DropdownMenu";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import TaskDetailsSheet from "@/components/TaskDetailsSheet";
import "@/App.css";

export default function Tasks() {
  const [activeView, setActiveView] = useState("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  // const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const deleteModalRef = useRef(null);
  const createModalRef = useRef(null);
  const dropdownModalRef = useRef(null);
  // const TaskDetailsSheetRef = useRef(null);

  // const dropdownTriggerRef = useRef(null);

  const { data: tasks = [], isLoading, isError, refetch } = useGetTasks();

  // console.log("Tasks: ", tasks);
  const {
    mutateAsync: deleteTask,
    isPending: isDeleting,
    // error: deleteError,
  } = useDeleteTask();
  // Filter tasks based on search query
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project?.projectName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Filter tasks based on search query
  // const filteredTasks = tasks.filter(
  //   (task) =>
  //     task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     (task.project &&
  //       task.project.toLowerCase().includes(searchQuery.toLowerCase())),
  // );

  // Group tasks by status for Kanban view
  const tasksByStatus = {
    "To Do": filteredTasks.filter((task) => task.status === "To Do"),
    "In Progress": filteredTasks.filter(
      (task) => task.status === "In Progress",
    ),
    "In Review": filteredTasks.filter((task) => task.status === "In Review"),
    Done: filteredTasks.filter((task) => task.status === "Done"),
  };

  const toggleDropdown = (e, taskId) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === taskId ? null : taskId);
    console.log("Toggle DropdownMenu: ", activeDropdown);
  };

  const handleEdit = (e, task) => {
    e.stopPropagation();
    setActiveDropdown(null);
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleTaskClick = (task) => {
    // console.log("Task on click: ", task);
    setSelectedTask(task);
    // console.log("Selected task id: ", selectedTask?.id);
    setShowDetailsSheet(true);
    // console.log("Show details called");
  };

  const handleDelete = async () => {
    setActiveDropdown(null);

    try {
      await deleteTask({ id: selectedTask?.id });
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete project: ", error);
    }
  };

  useCloseOnOutsideClick([deleteModalRef], () => setShowDeleteModal(false));
  useCloseOnOutsideClick([createModalRef], () => setShowModal(false));
  useCloseOnOutsideClick([dropdownModalRef], () => setActiveDropdown(null));
  // useCloseOnOutsideClick([TaskDetailsSheetRef], () =>
  //   setShowDetailsSheet(false),
  // );

  return (
    <div className={styles.dashboardContainer}>
      <SideBar />
      <main className={styles.mainContent}>
        <Header title="Tasks" pageIntro="Manage and track your tasks" />

        {/* Tasks Content */}
        <div className={taskStyles.tasksContainer}>
          {/* Search, Tabs & Actions */}
          <div className={taskStyles.tasksHeader}>
            <div className={taskStyles.searchBox}>
              <FiSearch className={taskStyles.searchIcon} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={taskStyles.headerActions}>
              <div className={taskStyles.tabs}>
                <button
                  className={`${taskStyles.tab} ${activeView === "kanban" && taskStyles.tabActive}`}
                  onClick={() => setActiveView("kanban")}
                >
                  Kanban
                </button>
                <button
                  className={`${taskStyles.tab} ${activeView === "list" && taskStyles.tabActive}`}
                  onClick={() => setActiveView("list")}
                >
                  List
                </button>
              </div>

              <button className={taskStyles.btnFilter}>
                <FiFilter />
              </button>

              <button
                className={taskStyles.btnAddTask}
                onClick={() => {
                  setSelectedTask(null);
                  setShowModal(true);
                }}
              >
                <FiPlus />
                Add Task
              </button>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div>
              {/* <Loader /> */}
              <p>Loading tasks...</p>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="errorState">
              <p>Failed to load tasks. Please try again.</p>
              <button onClick={() => refetch()}>Retry</button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && filteredTasks.length === 0 && (
            <div className="emptyState">
              <p>No tasks found.</p>
            </div>
          )}

          {/* Kanban View */}
          {activeView === "kanban" && (
            <div className={taskStyles.kanbanBoard}>
              {/* ? Check this out */}
              {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                <div key={status} className={taskStyles.kanbanColumn}>
                  <div className={taskStyles.columnHeader}>
                    <div className={taskStyles.columnTitle}>
                      <span
                        className={`${taskStyles.statusDot} ${getStatusDotClass(status)}`}
                      />
                      {status}
                      <span className={taskStyles.taskCount}>
                        {statusTasks.length}
                      </span>
                    </div>
                  </div>

                  <div className={taskStyles.tasksList}>
                    {statusTasks.map((task) => (
                      <div
                        key={task.id}
                        className={taskStyles.taskCard}
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className={taskStyles.taskCardHeader}>
                          <h4 className={taskStyles.taskTitle}>{task.title}</h4>
                          <button
                            onMouseDown={(e) => e.stopPropagation()}
                            className={taskStyles.btnMore}
                            onClick={(e) => {
                              toggleDropdown(e, task.id);
                            }}
                          >
                            <FiMoreHorizontal />
                          </button>
                          {activeDropdown === task.id && (
                            <DropdownMenu
                              ref={dropdownModalRef}
                              item={task}
                              onEdit={handleEdit}
                              onDelete={(task) => {
                                setSelectedTask(task);
                                setShowDeleteModal(true);
                              }}
                            />
                          )}
                        </div>

                        <p className={taskStyles.taskProject}>
                          {task.project.projectName}
                        </p>

                        <div className={taskStyles.taskFooter}>
                          {/* <div className={taskStyles.taskAssignee}>
                            {task.assignee?.avatar && (
                              <img
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                              />
                            )}
                          </div> */}

                          <span
                            className={`${taskStyles.priorityBadge} ${getPriorityClass(task.priority)}`}
                          >
                            {task.priority}
                          </span>

                          <div className={taskStyles.taskDueDate}>
                            <FaRegCalendar />
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {activeView === "list" && (
            <div className={taskStyles.listView}>
              <div className={taskStyles.listHeader}>
                <span>Task</span>
                {/* <span>Assignee</span> */}
                <span>Status</span>
                <span>Priority</span>
                <span>Due Date</span>
                <span></span>
              </div>

              {filteredTasks.map((task) => (
                <div key={task.id} className={taskStyles.listItem}>
                  <div className={taskStyles.listTaskInfo}>
                    <span className={taskStyles.listTaskTitle}>
                      {task.title}
                    </span>
                    <span className={taskStyles.listTaskProject}>
                      {task.project.projectName}
                    </span>
                  </div>

                  {/* TODO: Remove this */}
                  {/* <div className={taskStyles.listAssignee}>
                    {task.assignee?.avatar && (
                      <img
                        src={task.assignee?.avatar}
                        alt={task.assignee?.name}
                      />
                    )}
                    <span>{task.assignee?.name || "John Doe"}</span>
                  </div> */}

                  <span
                    className={`${taskStyles.statusBadge} ${getTaskStatusClass(task.status)}`}
                  >
                    {task.status}
                  </span>

                  <span
                    className={`${taskStyles.priorityBadge} ${getPriorityClass(task.priority)}`}
                  >
                    {task.priority}
                  </span>

                  <span className={taskStyles.listDueDate}>
                    {formatDate(task.dueDate)}
                  </span>

                  <div className={taskStyles.listActions}>
                    <button
                      className={taskStyles.btnMore}

                      // onClick={(e) => toggleDropdown(e, task.id)}
                    >
                      <FiMoreHorizontal />
                    </button>

                    {activeDropdown === task.id && (
                      <DropdownMenu
                        ref={dropdownModalRef}
                        item={task}
                        onEdit={handleEdit}
                        onDelete={(task) => {
                          setSelectedTask(task);
                          setShowDeleteModal(true);
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Task Modal */}
        {showModal && (
          <TaskModal
            ref={createModalRef}
            setShowModal={setShowModal}
            taskToEdit={selectedTask}
          />
        )}

        {/* Delete task modal */}
        {showDeleteModal && (
          <ConfirmDeleteModal
            ref={deleteModalRef}
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            itemName={selectedTask?.title}
            isDeleting={isDeleting}
          />
        )}

        {showDetailsSheet && (
          <TaskDetailsSheet
            // ref={TaskDetailsSheetRef}
            taskId={selectedTask?.id}
            isOpen={showDetailsSheet}
            onClose={() => {
              setShowDetailsSheet(false);
              setSelectedTask(null);
            }}
            onEdit={(task) => {
              setShowDetailsSheet(false);
              setSelectedTask(task);
              setShowModal(true);
            }}
            onDelete={(task) => {
              setShowDetailsSheet(false);
              setSelectedTask(task);
              setShowDeleteModal(true);
            }}
          />
        )}
      </main>
    </div>
  );
}
