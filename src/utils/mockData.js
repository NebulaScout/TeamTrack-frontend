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
