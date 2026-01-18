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

export const projectProgress = [
  { name: "Website Redesign", progress: 75, color: "Blue" },
  { name: "mobile App", progress: 45, color: "Green" },
  { name: "API Integration", progress: 90, color: "Red" },
];

export const recentActivity = [
  {
    user: "Sarah Ferna",
    action: "completed task",
    task: "Update homepage design",
    time: "2 min ago",
    type: "completed",
    avatar: "@/assets/person4_female.jpg",
  },

  {
    user: "Mike Johnson",
    action: "commented on",
    task: "API Integration task",
    time: "15 min ago",
    type: "comment",
    avatar: "@/assets/person1_male.jpg",
  },

  {
    user: "Ann Onywao",
    action: "joined project",
    task: "Mobile App Redesign",
    time: "1 hour ago",
    type: "joined",
    avatar: "@/assets/person2_female.jpg",
  },

  {
    user: "Alex Anderson",
    action: "updated task",
    task: "Database Migration",
    time: "2 hours ago",
    type: "updated",
    avatar: "@/assets/person3_male.jpg",
  },
];

export const upcomingDeadlines = [
  {
    title: "Homepage...",
    fullTitle: "Homepage Redesign",
    project: "Website Refresh",
    priority: "High",
    date: "Today",
    avatar: "@/assets/person5_male.jpg",
  },

  {
    title: "API D...",
    fullTitle: "API Documentation",
    project: "Suppliers Portal",
    priority: "Medium",
    date: "Tomorrow",
    avatar: "@/assets/person6_female.jpg",
  },

  {
    title: "User Tes...",
    fullTitle: "User Testing",
    project: "Mobile App",
    priority: "Low",
    date: "Jan 20",
    avatar: "@/assets/person7_male.jpg",
  },

  {
    title: "Security Au...",
    fullTitle: "Security Audit",
    project: "Infrastructure",
    priority: "Low",
    date: "Jan 22",
    avatar: "@/assets/person8_female.jpg",
  },
];
