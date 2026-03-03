import { FiX } from "react-icons/fi";
import { mapTaskToAPI } from "@/utils/taskMapper";
import modalStyles from "@/styles/modals.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProjects } from "@/hooks/useProjects";
import { useGetUsers } from "@/hooks/useManageUsers";
import { useCreateTask } from "@/hooks/useTasks";

const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Task title must be at least 3 characters long")
    .max(100, "Task title is too long")
    .refine((val) => !/^\d+$/.test(val), {
      message: "Task title cannot consist of only numbers",
    }),
  description: z.string().trim().max(500, "Description is too long").optional(),
  project: z.string().min(1, "Please select a project"),
  assignee: z.string().optional(),
  status: z.string().min(1, "Please select a status"),
  priority: z.string().min(1, "Please select a priority"),
  dueDate: z.string(),
});

export default function TaskModal({ setShowModal }) {
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      project: "",
      assignee: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
    },
  });

  const { data: projects = [], isPending: isFetchingProjects } = useProjects();
  const { data: users = [], isPending: isFetchingUsers } = useGetUsers();

  console.log("Users retrived: ", users);

  const { mutate: createTask } = useCreateTask();

  const onSubmit = (data) => {
    clearErrors("root");

    const apiPayload = mapTaskToAPI(data);

    createTask.mutate(
      { projectId: apiPayload.project, taskData: apiPayload },
      {
        onSuccess: () => {
          setShowModal(false);
        },
        onError: (err) => {
          console.error("Failed to create task: ", err);
          const message =
            err?.response?.data?.messages ||
            err?.response?.data?.detail ||
            err?.response?.data?.error?.message ||
            err?.response?.data?.message ||
            "Failed to create task. Please try again.";
          setError("root", message);
        },
      },
    );
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

        {errors.root?.message && (
          <div className={modalStyles.errorMessage}>{errors.root.message}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={modalStyles.formGroup}>
            <label>Task Title</label>
            <input
              type="text"
              placeholder="Enter task title"
              aria-invalid={!!errors.title}
              {...register("title")}
              disabled={isSubmitting}
            />
            {errors.title?.message && (
              <p className={modalStyles.fieldError}>{errors.title.message}</p>
            )}
          </div>

          <div className={modalStyles.formGroup}>
            <label>Description</label>
            <textarea
              placeholder="Describe what needs to be done..."
              aria-invalid={!!errors.description}
              {...register("description")}
              rows={3}
              disabled={isSubmitting}
            />
            {errors.description?.message && (
              <p className={modalStyles.fieldError}>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* TODO: Add API endpoints for this */}
          <div className={modalStyles.formRow}>
            <div className={modalStyles.formGroup}>
              <label>Project</label>
              <select
                ria-invalid={!!errors.project}
                {...register("project")}
                disabled={isSubmitting}
              >
                {/* TODO: Add loading state for this */}
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {errors.project?.message && (
                <p className={modalStyles.fieldError}>
                  {errors.project.message}
                </p>
              )}
            </div>

            <div className={modalStyles.formGroup}>
              <label>Assignee</label>
              <select
                aria-invalid={!!errors.assignee}
                {...register("assignee")}
                disabled={isSubmitting}
              >
                {/* TODO: Add loading state */}
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
              {errors.assignee?.message && (
                <p className={modalStyles.fieldError}>
                  {errors.assignee.message}
                </p>
              )}
            </div>
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formGroup}>
              <label>Status</label>
              <select
                aria-invalid={!!errors.status}
                {...register("status")}
                disabled={isSubmitting}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Done">Done</option>
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
                disabled={isSubmitting}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.priority?.message && (
                <p className={modalStyles.fieldError}>
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          <div className={modalStyles.formGroup}>
            <label>Due Date</label>
            <input
              type="date"
              aria-invalid={!!errors.dueDate}
              {...register("dueDate")}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={modalStyles.btnCreate}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Task..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
