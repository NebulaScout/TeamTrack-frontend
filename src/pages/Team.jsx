import React, { useState } from "react";
import {
  FiPlus,
  FiMail,
  FiMoreHorizontal,
  FiUsers,
  FiUserCheck,
} from "react-icons/fi";
import { TbShield } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import { mockTeamData } from "@/utils/mockData";
import styles from "../styles/dashboard.module.css";
import teamStyles from "@/styles/team.module.css";
import TeamInviteModal from "@/components/TeamInviteModal";

export default function Team() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const filteredMembers = mockTeamData.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalMembers = mockTeamData.length;
  const onlineMembers = mockTeamData.filter((member) => member.isOnline).length;
  const adminMembers = mockTeamData.filter(
    (member) => member.role === "Admin",
  ).length;

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
              <IoSearch className={teamStyles.searchIcon} />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                <span className={teamStyles.statValue}>{totalMembers}</span>
                <span className={teamStyles.statLabel}>Total Members</span>
              </div>
            </div>
            <div className={teamStyles.statCard}>
              <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
                <FiUserCheck />
              </div>
              <div className={teamStyles.statInfo}>
                <span className={teamStyles.statValue}>{onlineMembers}</span>
                <span className={teamStyles.statLabel}>Online Now</span>
              </div>
            </div>
            <div className={teamStyles.statCard}>
              <div
                className={`${teamStyles.statIcon} ${teamStyles.statIconYellow}`}
              >
                <TbShield size={30} />
              </div>
              <div className={teamStyles.statInfo}>
                <span className={teamStyles.statValue}>{adminMembers}</span>
                <span className={teamStyles.statLabel}>Admins</span>
              </div>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className={teamStyles.membersGrid}>
            {filteredMembers.map((member) => (
              <div key={member.id} className={teamStyles.memberCard}>
                <div className={teamStyles.memberCardHeader}>
                  <div className={teamStyles.memberAvatarWrapper}>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className={teamStyles.memberAvatar}
                    />
                    <span
                      className={`${teamStyles.onlineIndicator} ${member.isOnline ? teamStyles.online : teamStyles.offline}`}
                    ></span>
                  </div>
                  <button className={teamStyles.btnMore}>
                    <FiMoreHorizontal />
                  </button>
                </div>
                <div className={teamStyles.memberInfo}>
                  <h3 className={teamStyles.memberName}>{member.name}</h3>
                  <p className={teamStyles.memberDepartment}>
                    {member.department}
                  </p>
                </div>
                <div className={teamStyles.memberEmail}>
                  <FiMail />
                  <span>{member.email}</span>
                </div>
                <div className={teamStyles.memberFooter}>
                  <span
                    className={`${teamStyles.roleBadge} ${member.role === "Admin" ? teamStyles.roleAdmin : teamStyles.roleMember}`}
                  >
                    {member.role}
                  </span>
                  <span className={teamStyles.taskCount}>
                    {member.tasks} tasks
                  </span>
                </div>
              </div>
            ))}
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
