// Map team stats from API format to frontend format
export const mapTeamStatsFromAPI = (apiStats) => ({
  totalMembers: apiStats.total_members,
  onlineMembers: apiStats.online_members,
  developers: apiStats.developers,
  adminMembers: apiStats.admins,
});

// Map single team member from API format to frontend format
export const mapTeamMemberFromAPI = (apiMember) => ({
  id: apiMember.id,
  username: apiMember.username,
  email: apiMember.email,
  firstName: apiMember.first_name,
  lastName: apiMember.last_name,
  avatar: apiMember.avatar,
  role: apiMember.role,
  isOnline: apiMember.is_online,
  taskCount: apiMember.task_count,
});

// Map array of team members
export const mapTeamMembersFromAPI = (apiMembers) =>
  apiMembers.map(mapTeamMemberFromAPI);

export const mapTeamInviteToAPI = (inviteData) => ({
  username: inviteData.username,
  email: inviteData.email,
  role: inviteData.role,
});
