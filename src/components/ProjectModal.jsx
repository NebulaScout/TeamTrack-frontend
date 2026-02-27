import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import modalStyles from "@/styles/modals.module.css";
import { useCreateProject, useUpdateProject } from "@/hooks/useProjects";
import { mapProjectToAPI } from "@/utils/projectMapper";

export default function ProjectModal({
  setShowModal,
  onProjectSaved,
  projectToEdit = null,
}) {
  const [newProject, setNewProject] = useState({
    name: projectToEdit?.name || "",
    description: projectToEdit?.description || "",
    status: projectToEdit?.status || "",
    priority: projectToEdit?.priority || "",
    startDate: projectToEdit?.startDate || "",
    dueDate: projectToEdit?.dueDate || "",
  });

  const {
    mutateAsync: createProjectMutation,
    isPending,
    error,
  } = useCreateProject();

  const handleSubmit = async (projectData) => {
    try {
      await createProjectMutation(mapProjectToAPI(projectData));
      onProjectSaved();
      setShowModal(false);
    } catch (error) {
      console.error("Failed to create project: ", error);
    }
  };

  const {
    mutateAsync: updateProjectMutation,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateProject();

  const handleUpdate = async (id, projectData) => {
    try {
      await updateProjectMutation({ id, data: mapProjectToAPI(projectData) });
      onProjectSaved();
      setShowModal(false);
    } catch (error) {
      console.error("Failed to update project: ", error);
    }
  };

  // Determine whtther we're in edit mode
  const isEditMode = !!projectToEdit;

  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modal}>
        <div className={modalStyles.modalHeader}>
          <h2>{isEditMode ? "Edit Project" : "Create New Project"}</h2>
          <button
            className={modalStyles.btnClose}
            onClick={() => setShowModal(false)}
          >
            <FiX />
          </button>
        </div>

        {(error || updateError) && (
          <div className={modalStyles.errorMessage}>{error || updateError}</div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isEditMode) {
              handleUpdate(projectToEdit.id, newProject);
            } else {
              handleSubmit(newProject);
            }
          }}
        >
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
                <option value="">Select</option>
                <option value="Active">Active</option>
                <option value="On hold">on Hold</option>
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
                <option value="">Select</option>
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
              disabled={isPending}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={modalStyles.btnCreate}
              disabled={isPending || isUpdating}
            >
              {isPending || isUpdating
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Project"
                  : "Create Project"}{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
