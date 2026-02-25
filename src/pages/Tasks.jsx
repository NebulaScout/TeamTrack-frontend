import React, { useCallback, useEffect, useState } from "react";
import { FiSearch, FiPlus, FiMoreHorizontal, FiFilter } from "react-icons/fi";
import { FaRegCalendar } from "react-icons/fa6";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import styles from "@/styles/dashboard.module.css";
import taskStyles from "@/styles/tasks.module.css";
import { formatDate } from "@/utils/formatDate";
import TaskModal from "@/components/TaskModal";
import { tasksAPI } from "@/services/tasksAPI";
import { mapTaskFromAPI, mapTasksFromAPI } from "@/utils/taskMapper";
import Loader from "@/components/ui/Loader";

export default function Tasks() {
  const [activeView, setActiveView] = useState("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // fetch tasks from API
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiTasks = await tasksAPI.getAll();
      const mappedTasks = mapTasksFromAPI(apiTasks);
      setTasks(mappedTasks);
    } catch (err) {
      console.log("Failed to fetch tasks: ", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle adding a new task
  const handleTaskCreated = (newTask) => {
    const mappedTask = mapTaskFromAPI(newTask);
    setTasks((prevTasks) => [...prevTasks, mappedTask]);
  };

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

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return taskStyles.priorityHigh;
      case "Medium":
        return taskStyles.priorityMedium;
      case "Low":
        return taskStyles.priorityLow;
      default:
        return taskStyles.priorityMedium;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "To Do":
        return taskStyles.statusTodo;
      case "In Progress":
        return taskStyles.statusInProgress;
      case "In Review":
        return taskStyles.statusInReview;
      case "Done":
        return taskStyles.statusDone;
      default:
        return taskStyles.statusTodo;
    }
  };

  const getStatusDotClass = (status) => {
    switch (status) {
      case "To Do":
        return taskStyles.dotTodo;
      case "In Progress":
        return taskStyles.dotInProgress;
      case "In Review":
        return taskStyles.dotInReview;
      case "Done":
        return taskStyles.dotDone;
      default:
        return taskStyles.dotTodo;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <SideBar />
      <main className={styles.mainContent}>
        <Header title="Tasks" pageIntro="Manage and track your team's tasks" />

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
                onClick={() => setShowModal(true)}
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
          {error && (
            <div className="errorState">
              <p>{error}</p>
              <button onClick={fetchTasks}>Retry</button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && filteredTasks.length === 0 && (
            <div className="emptyState">
              <p>No tasks found.</p>
            </div>
          )}

          {/* Kanban View */}
          {activeView === "kanban" && (
            <div className={taskStyles.kanbanBoard}>
              {/* ? Chec this out */}
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
                      <div key={task.id} className={taskStyles.taskCard}>
                        <div className={taskStyles.taskCardHeader}>
                          <h4 className={taskStyles.taskTitle}>{task.title}</h4>
                          <button className={taskStyles.btnMore}>
                            <FiMoreHorizontal />
                          </button>
                        </div>

                        <p className={taskStyles.taskProject}>{task.project}</p>

                        <div className={taskStyles.taskFooter}>
                          <div className={taskStyles.taskAssignee}>
                            {task.assignee?.avatar && (
                              <img
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                              />
                            )}
                          </div>

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
                <span>Assignee</span>
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
                      {task.project}
                    </span>
                  </div>

                  <div className={taskStyles.listAssignee}>
                    {task.assignee?.avatar && (
                      <img
                        src={task.assignee.avatar}
                        alt={task.assignee.name}
                      />
                    )}
                    <span>{task.assignee?.name}</span>
                  </div>

                  <span
                    className={`${taskStyles.statusBadge} ${getStatusClass(task.status)}`}
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
                    <button className={taskStyles.btnMore}>
                      <FiMoreHorizontal />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Task Modal */}
        {showModal && (
          <TaskModal
            onTaskCreated={handleTaskCreated}
            setShowModal={setShowModal}
          />
        )}
      </main>
    </div>
  );
}
