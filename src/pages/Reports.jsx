import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import {
  weeklyTaskData,
  taskStatusData,
  productivityData,
  teamWorkloadData,
} from "@/utils/mockData";
import styles from "../styles/dashboard.module.css";
import reportStyles from "@/styles/reports.module.css";

export default function Reports() {
  return (
    <div className={styles.dashboardContainer}>
      <SideBar />
      <main className={styles.mainContent}>
        <Header
          title="Reports & Analytics"
          pageIntro="Track your team's performance and productivity"
        />

        <div className={reportStyles.reportsContainer}>
          {/* Top Row - Weekly Task Completion & Task Status Distribution */}
          <div className={reportStyles.chartsRow}>
            {/* Weekly Task Completion Chart */}
            <div className={reportStyles.chartCard}>
              <h3 className={reportStyles.chartTitle}>
                Weekly Task Completion
              </h3>
              <div className={reportStyles.chartWrapper}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyTaskData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar
                      dataKey="completed"
                      fill="#22c55e"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="remaining"
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Task Status Distribution Chart */}
            <div className={reportStyles.chartCard}>
              <h3 className={reportStyles.chartTitle}>
                Task Status Distribution
              </h3>
              <div className={reportStyles.chartWrapper}>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className={reportStyles.pieLabels}>
                  {taskStatusData.map((item, index) => (
                    <div key={index} className={reportStyles.pieLabel}>
                      <span
                        className={reportStyles.pieLabelDot}
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span style={{ color: item.color }}>
                        {item.name} {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Productivity Trend & Team Workload */}
          <div className={reportStyles.chartsRow}>
            {/* Productivity Trend Chart */}
            <div className={reportStyles.chartCard}>
              <h3 className={reportStyles.chartTitle}>Productivity Trend</h3>
              <div className={reportStyles.chartWrapper}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tasks"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: "#22c55e", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Team Workload Distribution Chart */}
            <div className={reportStyles.chartCard}>
              <h3 className={reportStyles.chartTitle}>
                Team Workload Distribution
              </h3>
              <div className={reportStyles.chartWrapper}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={teamWorkloadData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      width={60}
                    />
                    <Tooltip />
                    <Bar dataKey="tasks" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
