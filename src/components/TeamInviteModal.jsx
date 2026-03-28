import { FiMail, FiUsers, FiUser, FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import modalStyles from "@/styles/modals.module.css";
import { useProjects } from "@/utils/queries/useProjects";
import { useInviteTeamMember } from "@/utils/queries/useTeam";
import { useGetUsers } from "@/utils/queries/useManageUsers";

import { mapTeamInviteToAPI } from "@/utils/teamMapper";

const inviteSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .max(50, "Username is too long")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens",
    ),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(254, "Email address is too long"),
  role: z.string().min(1, "Please select a role"),
  project: z.string().min(1, "Please select a project"),
});

export default function TeamInviteModal({ setShowInviteModal }) {
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "",
      project: "",
    },
  });

  const { data: projects = [], isPending: isFetchingProjects } = useProjects();
  const { data: users = [], isPending: isFetchingUsers } = useGetUsers();
  const { mutateAsync: inviteTeamMember } = useInviteTeamMember();

  const handleUserSelect = (userId) => {
    if (!userId) {
      // Clear fields if "Manual Entry" is selected
      setValue("username", "");
      setValue("email", "");
      return;
    }

    const selectedUser = users.find((user) => user.id === parseInt(userId));
    if (selectedUser) {
      setValue("username", selectedUser.username);
      setValue("email", selectedUser.email);
      clearErrors(["username", "email"]);
    }
  };

  const onSubmit = async (data) => {
    clearErrors("root");

    const apiPayload = mapTeamInviteToAPI(data);

    try {
      await inviteTeamMember({
        projectId: data.project,
        inviteData: apiPayload,
      });
      setShowInviteModal(false);
    } catch (error) {
      const message =
        error?.response?.data?.messages ||
        error?.response?.data?.detail ||
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to send invitation. Please try again.";
      setError("root", { message });
    }
  };

  return (
    <div
      className={modalStyles.modalOverlay}
      onClick={() => setShowInviteModal(false)}
    >
      <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={modalStyles.modalHeader}>
          <div className={modalStyles.modalTitleWrapper}>
            <FiUsers className={modalStyles.modalTitleIcon} />
            <div>
              <h2>Invite Team Member</h2>
              <p className={modalStyles.modalSubtitle}>
                Send an invitation to collaborate on your projects.
              </p>
            </div>
          </div>
          <button
            className={modalStyles.btnClose}
            onClick={() => setShowInviteModal(false)}
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <div className={modalStyles.errorMessage}>
              {errors.root.message}
            </div>
          )}

          <div className={modalStyles.formGroup}>
            <label>Select User</label>
            <select
              onChange={(e) => handleUserSelect(e.target.value)}
              disabled={isFetchingUsers || isSubmitting}
            >
              <option value="">Manual Entry</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
            <small
              style={{
                color: "#888",
                fontSize: "0.85rem",
                marginTop: "0.25rem",
              }}
            >
              Select a user to auto-fill their details, or use manual entry
            </small>
          </div>

          <div className={modalStyles.formGroup}>
            <label>Username</label>
            <div className={modalStyles.emailInputWrapper}>
              <FiUser className={modalStyles.inputIcon} />
              <input
                type="text"
                placeholder="johndoe"
                aria-invalid={!!errors.username}
                // disabled={true}
                {...register("username")}
                className={errors.username ? modalStyles.inputError : ""}
              />
            </div>
            {errors.username && (
              <span className={modalStyles.fieldError}>
                {errors.username.message}
              </span>
            )}
          </div>

          <div className={modalStyles.formGroup}>
            <label>Email Address</label>
            <div className={modalStyles.emailInputWrapper}>
              <FiMail className={modalStyles.inputIcon} />
              <input
                type="email"
                placeholder="example@company.com"
                aria-invalid={!!errors.email}
                // disabled={true}
                {...register("email")}
                className={errors.email ? modalStyles.inputError : ""}
              />
            </div>
            {errors.email && (
              <span className={modalStyles.fieldError}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formGroup}>
              <label>Role</label>
              <select
                aria-invalid={!!errors.role}
                {...register("role")}
                className={errors.role ? modalStyles.inputError : ""}
                disabled={isSubmitting}
              >
                <option value="">Select role</option>
                <option value="Developer">Developer</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Admin">Admin</option>
                <option value="Guest">Guest</option>
              </select>
              {errors.role && (
                <span className={modalStyles.fieldError}>
                  {errors.role.message}
                </span>
              )}
            </div>

            <div className={modalStyles.formGroup}>
              <label>Project</label>
              <select
                aria-invalid={!!errors.project}
                {...register("project")}
                className={errors.project ? modalStyles.inputError : ""}
                disabled={isSubmitting || isFetchingProjects}
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {errors.project && (
                <span className={modalStyles.fieldError}>
                  {errors.project.message}
                </span>
              )}
            </div>
          </div>

          <div className={modalStyles.modalActions}>
            <button
              type="button"
              className={modalStyles.btnCancel}
              onClick={() => setShowInviteModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={modalStyles.btnCreate}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
