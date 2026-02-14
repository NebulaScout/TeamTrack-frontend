import user1 from "@/assets/person1_male.jpg";
import user2 from "@/assets/person2_female.jpg";
import user3 from "@/assets/person3_male.jpg";
import user4 from "@/assets/person4_female.jpg";
import user5 from "@/assets/person5_male.jpg";
import user6 from "@/assets/person6_female.jpg";
import user7 from "@/assets/person7_male.jpg";
import user8 from "@/assets/person8_female.jpg";

export const statsData = [
  {
    title: "Total Tasks",
    value: "148",
    change: "+12% vs last week",
    positive: true,
    iconType: "blue",
  },
  {
    title: "Completed",
    value: "86",
    change: "+8% vs last week",
    positive: true,
    iconType: "green",
  },
  {
    title: "In Progress",
    value: "42",
    change: "null",
    positive: true,
    iconType: "yellow",
  },
  {
    title: "Overdue",
    value: "42",
    change: "-2% vs last week",
    positive: false,
    iconType: "red",
  },
];

export const projectProgressData = [
  { name: "Website Redesign", progress: 75, color: "Blue" },
  { name: "mobile App", progress: 45, color: "Green" },
  { name: "API Integration", progress: 90, color: "Red" },
];

export const recentActivityData = [
  {
    user: "Sarah Ferna",
    action: "completed task",
    task: "Update homepage design",
    time: "2 min ago",
    type: "completed",
    avatar: user1,
  },

  {
    user: "Mike Johnson",
    action: "commented on",
    task: "API Integration task",
    time: "15 min ago",
    type: "comment",
    avatar: user2,
  },

  {
    user: "Ann Onywao",
    action: "joined project",
    task: "Mobile App Redesign",
    time: "1 hour ago",
    type: "joined",
    avatar: user3,
  },

  {
    user: "Alex Anderson",
    action: "updated task",
    task: "Database Migration",
    time: "2 hours ago",
    type: "updated",
    avatar: user4,
  },
];

export const upcomingDeadlinesData = [
  {
    title: "Homepage Redesign",
    fullTitle: "Homepage Redesign",
    project: "Website Refresh",
    priority: "High",
    date: "Today",
    avatar: user5,
  },

  {
    title: "API Documentation",
    fullTitle: "API Documentation",
    project: "Suppliers Portal",
    priority: "Medium",
    date: "Tomorrow",
    avatar: user6,
  },

  {
    title: "User Testing",
    fullTitle: "User Testing",
    project: "Mobile App",
    priority: "Low",
    date: "Jan 20",
    avatar: user7,
  },

  {
    title: "Security Audit",
    fullTitle: "Security Audit",
    project: "Infrastructure",
    priority: "Low",
    date: "Jan 22",
    avatar: "",
  },
];

export const mockNotificationsData = [
  {
    id: 1,
    type: "task",
    title: "New task assigned",
    message: "Sarah assigned you to 'Update homepage design'",
    time: "2 min ago",
    isRead: false,
  },
];

export const mockProjectsData = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of the company website with new branding",
    progress: 75,
    tasksCompleted: 24,
    totalTasks: 35,
    dueDate: "2025-01025",
    status: "Active",
    priority: "High",
    teamMembers: [
      { name: "Sarah Ferna", avatar: user1 },
      { name: "Mike Johnson", avatar: user2 },
      { name: "Ann Onywao", avatar: user3 },
      //   { name: "Alex Anderson", avatar: user4 },
    ],
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Native iOS and Android app for customer engagement",
    progress: 45,
    tasksCompleted: 16,
    totalTasks: 36,
    dueDate: "2025-02-15",
    status: "Active",
    priority: "High",
    teamMembers: [
      { name: "Alex Anderson", avatar: user4 },
      { name: "John Smith", avatar: user5 },
    ],
  },
];

export const mockTasksData = [
  {
    id: 1,
    title: "Implement user authentication",
    description: "Set up JWT authentication with refresh tokens",
    project: "Mobile App",
    status: "To Do",
    priority: "High",
    dueDate: "2026-01-20",
    assignee: { name: "Sarah Ferna", avatar: user1 },
  },
  {
    id: 2,
    title: "Database schema optimization",
    description: "Optimize database queries and indexes",
    project: "API Integration",
    status: "To Do",
    priority: "Medium",
    dueDate: "2026-01-22",
    assignee: { name: "Mike Johnson", avatar: user2 },
  },
  {
    id: 3,
    title: "Design homepage hero section",
    description: "Create modern hero section with animations",
    project: "Website Redesign",
    status: "In Progress",
    priority: "High",
    dueDate: "2026-01-19",
    assignee: { name: "Ann Onywao", avatar: user3 },
  },
  {
    id: 4,
    title: "Mobile responsive fixes",
    description: "Fix responsive issues on mobile devices",
    project: "Website Redesign",
    status: "In Progress",
    priority: "Low",
    dueDate: "2026-01-23",
    assignee: { name: "Alex Anderson", avatar: user4 },
  },
];

export const mockProjectsList = [
  "Website Redesign",
  "Mobile App",
  "API Integration",
  "Documentation Portal",
  "Security Audit",
];

export const mockTeamMembers = [
  { name: "Sarah Ferna", avatar: user1 },
  { name: "Mike Johnson", avatar: user2 },
  { name: "Ann Onywao", avatar: user3 },
  { name: "Alex Anderson", avatar: user4 },
  { name: "John Smith", avatar: user5 },
  { name: "Emily Davis", avatar: user6 },
  { name: "Robert Brown", avatar: user7 },
  { name: "Lisa Wilson", avatar: user8 },
];

export const initialEvents = [
  {
    id: 1,
    title: "Homepage Redesign",
    date: "2025-01-17",
    type: "task",
    priority: "High",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    description: "",
  },
  {
    id: 2,
    title: "API Documentation",
    date: "2025-01-18",
    type: "task",
    priority: "Medium",
    startTime: "02:00 PM",
    endTime: "03:00 PM",
    description: "",
  },
  {
    id: 3,
    title: "Team Meeting",
    date: "2025-01-18",
    type: "meeting",
    priority: "Medium",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    description: "",
  },
];

export const mockTeamData = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    department: "Design",
    role: "Admin",
    tasks: 12,
    avatar: user1,
    isOnline: true,
  },
  {
    id: 2,
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    department: "Engineering",
    role: "Member",
    tasks: 8,
    avatar: user2,
    isOnline: true,
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    department: "Product",
    role: "Member",
    tasks: 15,
    avatar: user3,
    isOnline: false,
  },
];

// Weekly Task Completion
export const weeklyTaskData = [
  { day: "Mon", completed: 12, remaining: 3 },
  { day: "Tue", completed: 18, remaining: 4 },
  { day: "Wed", completed: 15, remaining: 6 },
  { day: "Thu", completed: 21, remaining: 3 },
  { day: "Fri", completed: 16, remaining: 5 },
  { day: "Sat", completed: 8, remaining: 2 },
  { day: "Sun", completed: 5, remaining: 2 },
];

// Task Status Distribution
export const taskStatusData = [
  { name: "Completed", value: 58, color: "#22c55e" },
  { name: "In Progress", value: 28, color: "#3b82f6" },
  { name: "To Do", value: 9, color: "#6b7280" },
  { name: "Overdue", value: 5, color: "#ef4444" },
];

// Productivity Trend
export const productivityData = [
  { week: "Week 1", tasks: 45, efficiency: 78 },
  { week: "Week 2", tasks: 52, efficiency: 82 },
  { week: "Week 3", tasks: 48, efficiency: 75 },
  { week: "Week 4", tasks: 58, efficiency: 85 },
];

// Team Workload Distribution
export const teamWorkloadData = [
  { name: "Sarah", tasks: 12 },
  { name: "Mike", tasks: 9 },
  { name: "Emily", tasks: 15 },
  { name: "Alex", tasks: 8 },
  { name: "Jessica", tasks: 11 },
  { name: "David", tasks: 6 },
];

export const mockOverdueTasks = [
  {
    id: 1,
    title: "Design homepage wireframe",
    project: "Website Manager",
    dueDate: "1/15/2024",
    assigee: {
      name: "John Doe",
      avatar: user2,
    },
  },
  {
    id: 2,
    title: "Database optimization",
    project: "API Integration",
    dueDate: "1/18/2024",
    assigee: null,
  },
  {
    id: 3,
    title: "Fix login bug",
    project: "Mobile App Development",
    dueDate: "1/19/2024",
    assigee: {
      name: "Sarah Chen",
      avatar: user1,
    },
  },
];

export const mockUnassignedTasks = [
  {
    id: 1,
    title: "Create marketing materials",
    project: "Marketing Campaign",
    priority: "Medium",
  },
  {
    id: 2,
    title: "Database optimization",
    project: "API Integration",
    priority: "High",
  },
  {
    id: 3,
    title: "Write user documentation",
    project: "Website Redesign",
    priority: "Low",
  },
];

export const mockRecentActivity = [
  {
    id: 1,
    action: "New user registered by",
    user: "Alex Chen",
    time: "2 hours ago",
  },
  {
    id: 2,
    action: "New user registered by",
    user: "Emily Davis",
    time: "4 hours ago",
  },
];
