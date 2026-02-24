// Transform backend project data to frontend format

export function mapProjectsFromAPI(apiProject) {
  const tasks = apiProject.project_tasks || [];
  const completedTasks = tasks.filter(
    (task) => task.status === "DONE" || task.status === "Completed",
  ).length;

  //   Calculate progress based on completed tasks
  const progress =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Determine project status based on dates or progress
  const isCompleted = progress === 100;
  // eslint-disable-next-line no-unused-vars
  const isPastDue = new Date(apiProject.end_date) < new Date();

  return {
    id: apiProject.id,
    name: apiProject.project_name,
    description: apiProject.description,
    progress,
    tasksCompleted: completedTasks,
    totalTasks: tasks.length,
    dueDate: apiProject.end_date,
    startDate: apiProject.start_date,
    status: isCompleted ? "Completed" : "Active",
    createdBy: apiProject.created_by,
    createdAt: apiProject.created_at,
    teamMembers: (apiProject.members || []).map((member) => ({
      id: member.id,
      role: member.role,
      username: member.username,
      avatar: member.avatar || null,
    })),
    tasks: tasks,
  };
}

// Transform multiple projects
export function mapProjectsFromAPIs(apiProjects) {
  return apiProjects.map(mapProjectsFromAPI);
}
