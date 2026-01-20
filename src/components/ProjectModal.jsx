import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import modalStyles from "@/styles/modals.module.css";

export default function ProjectModal({ setShowModal, projects, setProjects }) {
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "Active",
    priority: "High",
    dueDate: "",
  });

  const handleCreateProject = (e) => {
    e.preventDefault();

    const project = {
      id: projects.length + 1,
      name: newProject.name,
      description: newProject.description,
      progress: 0,
      tasksCompleted: 0,
      totalTasks: 0,
      dueDate: newProject.dueDate,
      status: newProject.status,
      priority: newProject.priority,
      teamMembers: [],
    };

    setProjects([...projects, project]);
    setNewProject({
      name: "",
      description: "",
      status: "Active",
      priority: "High",
      dueDate: "",
    });
    setShowModal(false);
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
            >
              Cancel
            </button>

            <button type="submit" className={modalStyles.btnCreate}>
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
