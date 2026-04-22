import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import modalStyles from "@/styles/modals.module.css";
import {
  useCreateProject,
  useUpdateProject,
} from "@/utils/queries/useProjects";
import { mapProjectToAPI } from "@/utils/mappers/projectMapper";

const projectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Project name must be at least 3 characters long")
      .max(100, "Project name is too long")
      .refine((val) => !/^\d+$/.test(val), {
        message: "Project name cannot consist of only numbers",
      }),
    description: z
      .string()
      .trim()
      .max(800, "Description is too long")
      .optional(),
    status: z.string().min(1, "Please select a status"),
    priority: z.string().min(1, "Please select a priority"),
    startDate: z.string(),
    dueDate: z.string(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.dueDate) {
        return new Date(data.dueDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      path: ["dueDate"],
      message: "Due date must be after the start date",
    },
  );

const normalizeProjectStatusValue = (status) => {
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, " ");

  if (
    normalized === "active" ||
    normalized === "in progress" ||
    normalized === "inprogress"
  ) {
    return "in progress";
  }

  if (normalized === "on hold" || normalized === "onhold") {
    return "on hold";
  }

  if (normalized === "completed") {
    return "completed";
  }

  if (normalized === "planning") {
    return "planning";
  }

  return "";
};

const normalizeProjectPriorityValue = (priority) => {
  const normalized = String(priority ?? "")
    .trim()
    .toLowerCase();
  if (
    normalized === "low" ||
    normalized === "medium" ||
    normalized === "high"
  ) {
    return normalized;
  }
  return "";
};

const normalizeDateInputValue = (value) => {
  if (!value) return "";

  const stringValue = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
    return stringValue;
  }

  const date = new Date(stringValue);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const getProjectFormDefaults = (projectToEdit) => ({
  name: projectToEdit?.name || "",
  description: projectToEdit?.description || "",
  status: normalizeProjectStatusValue(projectToEdit?.status),
  priority: normalizeProjectPriorityValue(projectToEdit?.priority),
  startDate: normalizeDateInputValue(projectToEdit?.startDate),
  dueDate: normalizeDateInputValue(
    projectToEdit?.dueDate || projectToEdit?.endDate,
  ),
});

export default function ProjectModal({
  setShowModal,
  onProjectSaved,
  projectToEdit = null,
  onUpdateProject,
}) {
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: getProjectFormDefaults(projectToEdit),
  });

  useEffect(() => {
    reset(getProjectFormDefaults(projectToEdit));
  }, [projectToEdit, reset]);

  const { mutateAsync: createProjectMutation, isPending } = useCreateProject();

  const { mutateAsync: updateProjectMutation, isPending: isUpdating } =
    useUpdateProject();

  // Determine whether we're in edit mode
  const isEditMode = !!projectToEdit;
  console.log("Project Modal:", projectToEdit);

  const onSubmit = async (data) => {
    clearErrors("root");

    try {
      if (isEditMode) {
        const projectId =
          projectToEdit?.id ?? projectToEdit?.projectId ?? projectToEdit?._id;

        if (!projectId) {
          throw new Error("Missing project ID for update");
        }

        const payload = mapProjectToAPI({
          ...data,
          projectProgress: projectToEdit?.progress,
        });

        if (typeof onUpdateProject === "function") {
          await onUpdateProject(projectId, payload);
        } else {
          await updateProjectMutation({
            id: projectId,
            data: payload,
          });
        }
      } else {
        await createProjectMutation(mapProjectToAPI(data));
      }

      onProjectSaved();
      setShowModal(false);
    } catch (error) {
      const message =
        error?.response?.data?.messages ||
        error?.response?.data?.detail ||
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        `Failed to ${isEditMode ? "update" : "create"} project. Please try again.`;
      setError("root", { message });
    }
  };

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

        {errors.root?.message && (
          <div className={modalStyles.errorMessage}>{errors.root.message}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={modalStyles.formGroup}>
            <label>Project Name</label>
            <input
              type="text"
              placeholder="Enter project name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name?.message && (
              <p className={modalStyles.fieldError}>{errors.name.message}</p>
            )}
          </div>

          <div className={modalStyles.formGroup}>
            <label>Description</label>
            <textarea
              placeholder="Describe the project goals and scope"
              aria-invalid={!!errors.description}
              {...register("description")}
              rows={4}
            />
            {errors.description?.message && (
              <p className={modalStyles.fieldError}>
                {errors.description.message}
              </p>
            )}
            <span className={modalStyles.helpText}>
              Optional brief description of the project
            </span>
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formGroup}>
              <label>Status</label>
              <select aria-invalid={!!errors.status} {...register("status")}>
                <option value="">Select</option>
                {/* active or in progress */}
                <option value="in progress">In Progress</option>{" "}
                <option value="on hold">on Hold</option>
                <option value="completed">Completed</option>
              </select>
              {errors.status?.message && (
                <p className={modalStyles.fieldError}>
                  {errors.status.message}
                </p>
              )}
            </div>

            <div className={modalStyles.formGroup}>
              <label>Priority</label>
              <select
                aria-invalid={!!errors.priority}
                {...register("priority")}
              >
                <option value="">Select</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority?.message && (
                <p className={modalStyles.fieldError}>
                  {errors?.priority?.message}
                </p>
              )}
            </div>
          </div>

          <div className={modalStyles.formGroup}>
            <label>Start Date (mm/dd/yyyy)</label>
            <input
              type="date"
              aria-invalid={!!errors.startDate}
              {...register("startDate")}
            />
            {errors.startDate?.message && (
              <p className={modalStyles.fieldError}>
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div className={modalStyles.formGroup}>
            <label>Due Date (mm/dd/yyyy)</label>
            <input
              type="date"
              aria-invalid={!!errors.dueDate}
              {...register("dueDate")}
            />
            {errors.dueDate?.message && (
              <p className={modalStyles.fieldError}>{errors.dueDate.message}</p>
            )}
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
