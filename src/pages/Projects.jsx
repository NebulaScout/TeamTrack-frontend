import React, { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiMoreHorizontal } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa";
import { FaRegCalendar } from "react-icons/fa6";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import styles from "@/styles/dashboard.module.css";
import projectStyles from "@/styles/projects.module.css";
import { formatDate } from "@/utils/formatDate";
import ProjectModal from "@/components/ProjectModal";
import { mapProjectsFromAPIs } from "@/utils/projectMapper";
import { projectsAPI } from "@/services/projectsAPI";

export default function Projects() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch projects from API
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await projectsAPI.getAll();
      setProjects(mapProjectsFromAPIs(data));
    } catch (err) {
      console.log("Failed to fetch projects: ", err);
      setError("Failed to load projects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects((prev) => [...prev, newProject]);
  };

  // Filter projects based on the active tab or the searched item
  const filteredProjects = projects.filter((project) => {
    const selectedTab =
      activeTab === "all" ||
      (activeTab === "active" && project.status === "Active") ||
      (activeTab === "completed" && project.status === "Completed");

    const searchedProject = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return selectedTab && searchedProject;
  });

  console.log(filteredProjects);
  return (
    <div className={styles.dashboardContainer}>
      <SideBar />
      <main className={styles.mainContent}>
        <Header
          title="Projects"
          pageIntro="Manage and track all your team projects"
        />

        {/* Projects Content */}
        <div className={projectStyles.projectsContainer}>
          {/* Search, Tabs & Actions */}
          <div className={projectStyles.projectsHeader}>
            <div className={projectStyles.searchBox}>
              <FiSearch className={projectStyles.searchIcon} />
              <input
                type="text"
                placeholder="Search project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={projectStyles.headerActions}>
              <div className={projectStyles.tabs}>
                <button
                  className={`${projectStyles.tab} ${activeTab === "all" && projectStyles.tabActive}`}
                  onClick={() => setActiveTab("all")}
                >
                  {" "}
                  All
                </button>
                <button
                  className={`${projectStyles.tab} ${activeTab === "active" && projectStyles.tabActive}`}
                  onClick={() => setActiveTab("active")}
                >
                  {" "}
                  Active
                </button>
                <button
                  className={`${projectStyles.tab} ${activeTab === "completed" && projectStyles.tabActive}`}
                  onClick={() => setActiveTab("completed")}
                >
                  {" "}
                  Completed
                </button>
              </div>
              <button
                className={projectStyles.btnNewProject}
                onClick={() => setShowModal(true)}
              >
                <FiPlus />
                New Project
              </button>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className={projectStyles.loadingState}>
              <p>Loading projects...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className={projectStyles.errorState}>
              <p>{error}</p>
              <button onClick={fetchProjects}>Retry</button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && filteredProjects.length === 0 && (
            <div className={projectStyles.emptyState}>
              <p>No projects found.</p>
            </div>
          )}

          {/* Projects Grid */}
          {!isLoading && !error && filteredProjects.length > 0 && (
            <div className={projectStyles.projectsGrid}>
              {filteredProjects.map((project) => (
                <div key={project.id} className={projectStyles.projectCard}>
                  <div className={projectStyles.projectCardHeader}>
                    <h3 className={projectStyles.projectName}>
                      {project.name}
                    </h3>
                    <button className={projectStyles.btnMore}>
                      <FiMoreHorizontal />
                    </button>
                  </div>

                  <p className={projectStyles.projectDescription}>
                    {project.description}
                  </p>

                  <div className={projectStyles.progressSection}>
                    <div className={projectStyles.progressHeader}>
                      <span className={projectStyles.progressLabel}>
                        Progress
                      </span>
                      <span className={projectStyles.progressPercentage}>
                        {project.progress}%
                      </span>
                    </div>

                    <div className={projectStyles.progressBar}>
                      <div
                        className={`{projectStyles.progressFill} ${
                          project.status === "Completed"
                            ? projectStyles.progressGreen
                            : projectStyles.progressBlue
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className={projectStyles.projectMeta}>
                    <div className={projectStyles.metaItem}>
                      <FaRegClock />
                      <span>
                        {project.tasksCompleted}/{project.totalTasks}
                      </span>
                    </div>

                    <div className={projectStyles.metaItem}>
                      <FaRegCalendar />
                      <span>{formatDate(project.dueDate)}</span>
                    </div>
                  </div>

                  <div className={projectStyles.projectFooter}>
                    <div className={projectStyles.teamAvatars}>
                      {project.teamMembers.slice(0, 3).map((member, index) => (
                        <div
                          key={index}
                          className={projectStyles.avatar}
                          style={{ zIndex: 3 - index }}
                        >
                          <img src={member.avatar} alt={member.name} />
                        </div>
                      ))}

                      {project.teamMembers.length > 3 && (
                        <div className={projectStyles.moreAvatars}>
                          +{project.teamMembers.length - 3}
                        </div>
                      )}
                    </div>

                    <span
                      className={`${projectStyles.statusBadge} ${project.status === "Completed" ? projectStyles.statusCompleted : projectStyles.statusActive}`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create project modal */}
        {showModal && (
          <ProjectModal
            setShowModal={setShowModal}
            onProjectCreated={handleProjectCreated}
          />
        )}
      </main>
    </div>
  );
}
