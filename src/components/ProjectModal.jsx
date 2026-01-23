import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { projectsAPI } from "@/services/projectsAPI";
import { mapProjectsFromAPI } from "@/utils/projectMapper";
import modalStyles from "@/styles/modals.module.css";
// import { formatDate } from "@/utils/formatDate";

export default function ProjectModal({ setShowModal, onProjectCreated }) {
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    startDate: "",
    dueDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const createdProject = await projectsAPI.create(newProject);

      const transformedProject = mapProjectsFromAPI(createdProject);
      onProjectCreated(transformedProject);
      setShowModal(false);
    } catch (err) {
      console.log("Failed to create project: ", err);
      setError(
        err.response?.data?.message ||
          "Failed to create project please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modal}>
        <div className={modalStyles.modalHeader}>
          <h2>Create New Project</h2>
          <button
            className={modalStyles.btnClose}
            onClick={() => setShowModal(false)}
          >
            <FiX />
          </button>
        </div>

        {error && <div className={modalStyles.errorMessage}>{error}</div>}

        <form onSubmit={handleCreateProject}>
          <div className={modalStyles.formGroup}>
            <label>Project Name</label>
            <input
              type="text"
              placeholder="Enter project name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              required
            />
          </div>

          <div className={modalStyles.formGroup}>
            <label>Description</label>
            <textarea
              placeholder="Describe the project goals and scope"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  description: e.target.value,
                })
              }
              rows={4}
            />
            <span className={modalStyles.helpText}>
              Optional brief description of the project
            </span>
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formGroup}>
              <label>Status</label>
              <select
                value={newProject.status}
                onChange={(e) =>
                  setNewProject({ ...newProject, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className={modalStyles.formGroup}>
              <label>Priority</label>
              <select
                value={newProject.priority}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    priority: e.target.value,
                  })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className={modalStyles.formGroup}>
            <label>Start Date</label>
            <input
              type="date"
              value={newProject.startDate}
              onChange={(e) =>
                setNewProject({ ...newProject, startDate: e.target.value })
              }
            />
          </div>

          <div className={modalStyles.formGroup}>
            <label>Due Date</label>
            <input
              type="date"
              value={newProject.dueDate}
              onChange={(e) =>
                setNewProject({ ...newProject, dueDate: e.target.value })
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
              {isSubmitting ? "Creating project..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
