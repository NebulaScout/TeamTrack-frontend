import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiMoreHorizontal,
  FiEye,
  FiEdit2,
  FiUsers,
  FiTrash2,
} from "react-icons/fi";
import adminStyles from "@/styles/admin.module.css";
import { getStatusClass } from "@/utils/statusClass";
import Loader from "@/components/ui/Loader";
import {
  useAdminProjects,
  useDeleteAdminProject,
} from "@/utils/queries/useAdminProjects";
import AdminProjectDetailsModal from "@/components/AdminProjectDetailsModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import ManageProjectMembersModal from "@/components/ManageProjectMembersModal ";
import ProjectModal from "./ProjectModal";

export default function ProjectsManagement() {
  const [projectsSearch, setProjectsSearch] = useState("");
  const [projectsStatusFilter, setProjectsStatusFilter] = useState("all");

  const [openMenuFor, setOpenMenuFor] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const [openEditProjectModal, setOpenEditProjectModal] = useState(false);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [selectedProjectForMembers, setSelectedProjectForMembers] =
    useState(null);

  const menuRef = useRef(null);
  const triggerRefs = useRef(new Map());

  const { data: projects = [], isLoading, isError, error } = useAdminProjects();
  const { mutateAsync: deleteAdminProject, isPending: isDeletingProject } =
    useDeleteAdminProject();

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = (project?.name || "")
        .toLowerCase()
        .includes(projectsSearch.toLowerCase());

      const matchesStatus =
        projectsStatusFilter === "all" ||
        project.status === projectsStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, projectsSearch, projectsStatusFilter]);

  const openProjectMenu = (e, projectId) => {
    e.stopPropagation();

    if (openMenuFor === projectId) {
      setOpenMenuFor(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 220;
    const viewportPadding = 12;

    const left = Math.max(
      viewportPadding,
      Math.min(
        rect.right - menuWidth,
        window.innerWidth - menuWidth - viewportPadding,
      ),
    );

    setMenuPosition({
      top: rect.bottom + 8,
      left,
    });

    setOpenMenuFor(projectId);
  };

  const handleProjectAction = (action, project) => {
    // Replace these with your real modal/navigation handlers.
    if (action === "view-details") {
      setOpenMenuFor(null);
      setSelectedProjectId(project.id);
      setIsProjectDetailsOpen(true);
      return;
    }

    if (action === "edit-project") {
      setOpenEditProjectModal(true);
      setSelectedProject(project);
    }

    if (action === "delete-project") {
      setSelectedProject(project);
      setShowDeleteModal(true);
      setOpenMenuFor(null);
      return;
    }

    if (action === "manage-members") {
      setSelectedProjectForMembers(project);
      setIsManageMembersOpen(true);
      setOpenMenuFor(null);
      return;
    }

    setOpenMenuFor(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProject?.id) return;

    try {
      await deleteAdminProject(selectedProject.id);
      setShowDeleteModal(false);
      setSelectedProject(null);
      setOpenMenuFor(null);
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const closeProjectDetailsModal = () => {
    setIsProjectDetailsOpen(false);
    setSelectedProjectId(null);
  };

  const handleProjectSaved = () => {
    setOpenEditProjectModal(false);
  };

  useEffect(() => {
    if (!openMenuFor) return;

    const closeMenu = () => setOpenMenuFor(null);

    const handleOutsideClick = (e) => {
      const trigger = triggerRefs.current.get(openMenuFor);
      const clickedMenu = menuRef.current && menuRef.current.contains(e.target);
      const clickedTrigger = trigger && trigger.contains(e.target);

      if (!clickedMenu && !clickedTrigger) {
        closeMenu();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") closeMenu();
    };

    const handleViewportChange = () => closeMenu();

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEsc);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [openMenuFor]);

  if (isLoading) {
    return (
      <div className={adminStyles.tabSection}>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={adminStyles.tabSection}>
        <div className={adminStyles.errorMessage}>
          {error?.message || "Failed to load projects."}
        </div>
      </div>
    );
  }

  return (
    <div className={adminStyles.tabSection}>
      <div className={adminStyles.tableControls}>
        <div className={adminStyles.searchBox}>
          <FiSearch className={adminStyles.searchIcon} />
          <input
            type="text"
            placeholder="Search projects..."
            value={projectsSearch}
            onChange={(e) => setProjectsSearch(e.target.value)}
            className={adminStyles.searchInput}
          />
        </div>

        <div className={adminStyles.filterGroup}>
          <div className={adminStyles.filterDropdown}>
            <FiFilter className={adminStyles.filterIcon} />
            <select
              value={projectsStatusFilter}
              onChange={(e) => setProjectsStatusFilter(e.target.value)}
              className={adminStyles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on hold">On Hold</option>
              <option value="planning">Planning</option>
            </select>
            <FiChevronDown className={adminStyles.dropdownIcon} />
          </div>

          <button className={adminStyles.newProjectBtn}>
            <FiPlus /> New Project
          </button>
        </div>
      </div>

      <div className={adminStyles.tableContainer}>
        <table className={adminStyles.dataTable}>
          <thead>
            <tr>
              <th>Project</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Created</th>
              <th>Members</th>
              <th>Tasks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id}>
                <td>
                  <span className={adminStyles.projectName}>
                    {project.name}
                  </span>
                </td>

                <td>
                  <div className={adminStyles.ownerCell}>
                    <img
                      src={project?.owner?.avatar || "/vite.svg"}
                      alt={project?.owner?.name || "Owner"}
                      className={adminStyles.tableAvatar}
                    />
                    <span>{project?.owner?.name || "Unknown Owner"}</span>
                  </div>
                </td>

                <td>
                  <span
                    className={`${adminStyles.statusBadge} ${getStatusClass(project.status)}`}
                  >
                    {project.status}
                  </span>
                </td>

                <td>{project.created || "--"}</td>

                <td>
                  <div className={adminStyles.membersCell}>
                    {project?.members?.slice(0, 3).map((avatar, idx) => (
                      <img
                        key={`${project.id}-${idx}`}
                        src={avatar || "/vite.svg"}
                        alt="Member"
                        className={adminStyles.memberAvatar}
                        style={{ marginLeft: idx > 0 ? "-8px" : "0" }}
                      />
                    ))}
                  </div>
                </td>

                <td>
                  <span className={adminStyles.taskProgress}>
                    {project.tasksCompleted}/{project.totalTasks}
                  </span>
                </td>

                <td className={adminStyles.actionsCell}>
                  <button
                    className={adminStyles.actionBtn}
                    aria-label={`Open actions for ${project.name}`}
                    aria-haspopup="menu"
                    aria-expanded={openMenuFor === project.id}
                    onClick={(e) => openProjectMenu(e, project.id)}
                    ref={(el) => {
                      if (el) triggerRefs.current.set(project.id, el);
                      else triggerRefs.current.delete(project.id);
                    }}
                  >
                    <FiMoreHorizontal />
                  </button>

                  {openMenuFor === project.id && (
                    <div
                      ref={menuRef}
                      className={adminStyles.userFloatingMenu}
                      style={{
                        top: menuPosition.top,
                        left: menuPosition.left,
                      }}
                      role="menu"
                    >
                      <div className={adminStyles.userFloatingMenuTitle}>
                        Actions
                      </div>

                      <button
                        className={adminStyles.userFloatingMenuItem}
                        onClick={() =>
                          handleProjectAction("view-details", project)
                        }
                        role="menuitem"
                      >
                        <FiEye className={adminStyles.userFloatingMenuIcon} />
                        View Details
                      </button>

                      <button
                        className={adminStyles.userFloatingMenuItem}
                        onClick={() =>
                          handleProjectAction("edit-project", project)
                        }
                        role="menuitem"
                      >
                        <FiEdit2 className={adminStyles.userFloatingMenuIcon} />
                        Edit Project
                      </button>

                      <button
                        className={adminStyles.userFloatingMenuItem}
                        onClick={() =>
                          handleProjectAction("manage-members", project)
                        }
                        role="menuitem"
                      >
                        <FiUsers className={adminStyles.userFloatingMenuIcon} />
                        Manage Members
                      </button>

                      <div className={adminStyles.userFloatingMenuSeparator} />

                      <button
                        className={`${adminStyles.userFloatingMenuItem} ${adminStyles.projectFloatingMenuItemDanger}`}
                        onClick={() =>
                          handleProjectAction("delete-project", project)
                        }
                        role="menuitem"
                      >
                        <FiTrash2
                          className={adminStyles.userFloatingMenuIcon}
                        />
                        Delete Project
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={7} className={adminStyles.emptyState}>
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {isProjectDetailsOpen && (
          <AdminProjectDetailsModal
            isOpen={isProjectDetailsOpen}
            onClose={closeProjectDetailsModal}
            projectId={selectedProjectId}
          />
        )}

        {showDeleteModal && (
          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            onClose={() => {
              if (isDeletingProject) return;
              setShowDeleteModal(false);
              setSelectedProject(null);
            }}
            onConfirm={handleConfirmDelete}
            itemName={selectedProject?.name}
            itemType="Project"
            isDeleting={isDeletingProject}
          />
        )}

        {isManageMembersOpen && (
          <ManageProjectMembersModal
            isOpen={isManageMembersOpen}
            onClose={() => {
              setIsManageMembersOpen(false);
              setSelectedProjectForMembers(null);
            }}
            projectId={selectedProjectForMembers?.id}
            projectName={selectedProjectForMembers?.name}
          />
        )}

        {openEditProjectModal && (
          <ProjectModal
            // ref={createModalRef}
            setShowModal={setOpenEditProjectModal}
            onProjectSaved={handleProjectSaved}
            projectToEdit={selectedProject}
          />
        )}
      </div>
    </div>
  );
}
