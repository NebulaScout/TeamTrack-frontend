import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiMail,
  FiMoreHorizontal,
  FiUsers,
  FiUserCheck,
} from "react-icons/fi";
import { FaCodeBranch } from "react-icons/fa";
import { TbShield } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
// import { mockTeamData } from "@/utils/mockData";
import { useGetTeamStats, useGetTeamMembers } from "@/hooks/useTeam";
import { useProjects } from "@/hooks/useProjects";
import styles from "../styles/dashboard.module.css";
import teamStyles from "@/styles/team.module.css";
import TeamInviteModal from "@/components/TeamInviteModal";
import Loader from "@/components/ui/Loader";

export default function Team() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Fetch all projects for the dropdown
  const { data: projects, isLoading: projectsLoading } = useProjects();

  // Set default project when projects load
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // Fetch team stats and members for selected project
  const { data: stats, isLoading: statsLoading } =
    useGetTeamStats(selectedProjectId);
  const { data: members, isLoading: membersLoading } =
    useGetTeamMembers(selectedProjectId);

  const filteredMembers =
    members?.filter(
      (member) =>
        member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.lastName?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const isLoading = projectsLoading || statsLoading || membersLoading;

  if (isLoading) {
    return (
      <div className={styles.dashboardContainer}>
        <SideBar />
        <main className={styles.mainContent}>
          <Loader />
        </main>
      </div>
    );
  }

  // const totalMembers = mockTeamData.length;
  // const onlineMembers = mockTeamData.filter((member) => member.isOnline).length;
  // const adminMembers = mockTeamData.filter(
  //   (member) => member.role === "Admin",
  // ).length;

  return (
    <div className={styles.dashboardContainer}>
      <SideBar />
      <main className={styles.mainContent}>
        <Header
          title="Team"
          pageIntro="Manage your team members and permissions"
        />

        {/* Team Section */}
        <div className={teamStyles.teamContainer}>
          <div className={teamStyles.teamHeader}>
            <div className={teamStyles.searchBox}>
              {/* Project Selector */}
              <select
                className={teamStyles.projectSelector}
                value={selectedProjectId || ""}
                onChange={(e) => setSelectedProjectId(Number(e.target.value))}
              >
                {projects?.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <div className={teamStyles.searchBox}>
                <IoSearch className={teamStyles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <button
              className={teamStyles.btnInvite}
              onClick={() => setShowInviteModal(true)}
            >
              <FiPlus /> Invite Member
            </button>
          </div>

          {/* Stats Cards */}
          <div className={teamStyles.statsGrid}>
            <div className={teamStyles.statCard}>
              <div
                className={`${teamStyles.statIcon} ${teamStyles.statIconBlue}`}
              >
                <FiUsers />
              </div>
              <div className={teamStyles.statInfo}>
                <span className={teamStyles.statValue}>
                  {stats?.totalMembers || 0}
                </span>
                <span className={teamStyles.statLabel}>Total Members</span>
              </div>
            </div>
            {/* <div className={teamStyles.statCard}>
              <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
                <FiUserCheck />
              </div> */}
            {/* <div className={teamStyles.statInfo}>
                <span className={teamStyles.statValue}>
                  {stats?.onlineMembers || 0}
                </span>
                <span className={teamStyles.statLabel}>Online Now</span>
              </div> */}

            <div className={teamStyles.statCard}>
              <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
                <FaCodeBranch />
              </div>{" "}
              <div className={teamStyles.statInfo}>
                <span className={teamStyles.statValue}>
                  {stats?.developers || 0}
                </span>
                <span className={teamStyles.statLabel}>Developers</span>
              </div>
            </div>
            <div className={teamStyles.statCard}>
              <div
                className={`${teamStyles.statIcon} ${teamStyles.statIconYellow}`}
              >
                <TbShield size={30} />
              </div>
              <div className={teamStyles.statInfo}>
                <span className={teamStyles.statValue}>
                  {stats?.adminMembers || 0}
                </span>
                <span className={teamStyles.statLabel}>Admins</span>
              </div>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className={teamStyles.membersGrid}>
            {filteredMembers.length === 0 ? (
              <p>No team members found</p>
            ) : (
              filteredMembers.map((member) => (
                <div key={member.id} className={teamStyles.memberCard}>
                  <div className={teamStyles.memberCardHeader}>
                    <div className={teamStyles.memberAvatarWrapper}>
                      <img
                        src={member.avatar || "/default-avatar.png"}
                        alt={member.username}
                        className={teamStyles.memberAvatar}
                      />
                      <span
                        className={`${teamStyles.onlineIndicator} ${
                          member.isOnline
                            ? teamStyles.online
                            : teamStyles.offline
                        }`}
                      ></span>
                    </div>
                    <button className={teamStyles.btnMore}>
                      <FiMoreHorizontal />
                    </button>
                  </div>
                  <div className={teamStyles.memberInfo}>
                    <h3 className={teamStyles.memberName}>
                      {member.firstName && member.lastName
                        ? `${member.firstName} ${member.lastName}`
                        : member.username}
                    </h3>
                    <p className={teamStyles.memberDepartment}>{member.role}</p>
                  </div>
                  <div className={teamStyles.memberEmail}>
                    <FiMail />
                    <span>{member.email}</span>
                  </div>
                  <div className={teamStyles.memberFooter}>
                    <span
                      className={`${teamStyles.roleBadge} ${
                        member.role === "Admin"
                          ? teamStyles.roleAdmin
                          : teamStyles.roleMember
                      }`}
                    >
                      {member.role}
                    </span>
                    <span className={teamStyles.taskCount}>
                      {member.taskCount} tasks
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Invite Member Modal */}
          {showInviteModal && (
            <TeamInviteModal setShowInviteModal={setShowInviteModal} />
          )}
        </div>
      </main>
    </div>
  );
}
