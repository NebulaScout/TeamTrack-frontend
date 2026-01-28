import React, { useCallback, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { tasksAPI } from "@/services/tasksAPI";
import { mapTaskToAPI } from "@/utils/taskMapper";
import { projectsAPI } from "@/services/projectsAPI";
import { mapProjectsFromAPIs } from "@/utils/projectMapper";
import { authAPI } from "@/services/authAPI";
import { mapUsersFromAPI } from "@/utils/userMapper";

import modalStyles from "@/styles/modals.module.css";

export default function TaskModal({ onTaskCreated, setShowModal }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  // const [projectError, setProjectError] = useState(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    project: "",
    assignee: "",
    status: "To Do",
    priority: "Medium",
    dueDate: "",
  });

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const availableProjects = await projectsAPI.getAll();
      setProjects(mapProjectsFromAPIs(availableProjects));
    } catch (err) {
      console.error("Failed to load projects: ", err);
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await authAPI.getAllUsers();
      setUsers(mapUsersFromAPI(data));
    } catch (err) {
      console.error("Unable to fetch available users: ", err);
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, [fetchProjects, fetchUsers]);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const apiPayload = mapTaskToAPI(newTask);
      const createdTask = await tasksAPI.create(apiPayload.project, apiPayload);

      // Notify parent component of the new task
      onTaskCreated(createdTask);

      // Reset form & close modal
      setNewTask({
        title: "",
        description: "",
        project: "",
        assignee: "",
        status: "To Do",
        priority: "Medium",
        dueDate: "",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create task: ", err);
      setError(
        err.response?.data?.message ||
          "Failed to create task. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modal}>
        <div className={modalStyles.modalHeader}>
          <h2>Create New Task</h2>
          <button
            className={modalStyles.btnClose}
            onClick={() => setShowModal(false)}
          >
            <FiX />
          </button>
        </div>

        {error && <div className={modalStyles.errorMessage}>{error}</div>}

        <form onSubmit={handleCreateTask}>
          <div className={modalStyles.formGroup}>
            <label>Task Title</label>
            <input
              type="text"
              placeholder="Enter task title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={modalStyles.formGroup}>
            <label>Description</label>
            <textarea
              placeholder="Describe what needs to be done..."
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* TODO: Add API endpoints for this */}
          <div className={modalStyles.formRow}>
            <div className={modalStyles.formGroup}>
              <label>Project</label>
              <select
                value={newTask.project}
                onChange={(e) =>
                  setNewTask({ ...newTask, project: e.target.value })
                }
                disabled={isSubmitting || isLoading}
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={modalStyles.formGroup}>
              <label>Assignee</label>
              <select
                value={newTask.assignee}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignee: e.target.value })
                }
              >
                <option value="">Select assignee</option>
                {users.map(
                  (user) =>
                    user.role === "Developer" && (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ),
                )}
              </select>
            </div>
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formGroup}>
              <label>Status</label>
              <select
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
                disabled={isSubmitting}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className={modalStyles.formGroup}>
              <label>Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
                disabled={isSubmitting}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className={modalStyles.formGroup}>
            <label>Due Date</label>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
            />
          </div>

          <div className={modalStyles.modalActions}>
            <button
              type="button"
              className={modalStyles.btnCancel}
              onClick={() => setShowModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={modalStyles.btnCreate}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
