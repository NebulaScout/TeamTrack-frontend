import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import projectStyles from "@/styles/projects.module.css";

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
    <div className={projectStyles.modalOverlay}>
      <div className={projectStyles.modal}>
        <div className={projectStyles.modalHeader}>
          <h2>Create New Project</h2>
          <button
            className={projectStyles.btnClose}
            onClick={() => setShowModal(false)}
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleCreateProject}>
          <div className={projectStyles.formGroup}>
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

          <div className={projectStyles.formGroup}>
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
            <span className={projectStyles.helpText}>
              Optional brief description of the project
            </span>
          </div>

          <div className={projectStyles.formRow}>
            <div className={projectStyles.formGroup}>
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

            <div className={projectStyles.formGroup}>
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

          <div className={projectStyles.formGroup}>
            <label>Due Date</label>
            <input
              type="date"
              value={newProject.dueDate}
              onChange={(e) =>
                setNewProject({ ...newProject, dueDate: e.target.value })
              }
            />
          </div>

          <div className={projectStyles.modalActions}>
            <button
              type="button"
              className={projectStyles.btnCancel}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button type="submit" className={projectStyles.btnCreate}>
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
