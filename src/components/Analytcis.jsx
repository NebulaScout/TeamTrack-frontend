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
  Legend,
} from "recharts";
import adminStyles from "@/styles/admin.module.css";
import {
  analyticsStats,
  tasksByStatus,
  tasksByPriority,
  weeklyTaskProgress,
  mostActiveUsers,
  usersWithMostAssignments,
  projectsByTeamSize,
} from "@/utils/mockData";

export default function Analytics() {
  return (
    <div className={adminStyles.analyticsContent}>
      {/* Stats Cards */}
      <div className={adminStyles.analyticsStatsGrid}>
        {analyticsStats.map((stat, index) => (
          <div key={index} className={adminStyles.analyticsStatCard}>
            <span className={adminStyles.statTitle}>{stat.title}</span>
            <span
              className={`${adminStyles.statValue} ${stat.title === "Completion Rate" ? adminStyles.statValueGreen : ""}`}
            >
              {stat.value}
            </span>
            <span
              className={`${adminStyles.statChange} ${stat.positive ? adminStyles.statChangePositive : adminStyles.statChangeNegative}`}
            >
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Charts Row - Donut Charts */}
      <div className={adminStyles.analyticsChartsRow}>
        {/* Tasks by Status */}
        <div className={adminStyles.analyticsChartCard}>
          <h3 className={adminStyles.chartTitle}>Tasks by Status</h3>
          <div className={adminStyles.chartContent}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={tasksByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {tasksByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className={adminStyles.chartLegend}>
              {tasksByStatus.map((item, index) => (
                <div key={index} className={adminStyles.legendItem}>
                  <span
                    className={adminStyles.legendDot}
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span style={{ color: item.color }}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks by Priority */}
        <div className={adminStyles.analyticsChartCard}>
          <h3 className={adminStyles.chartTitle}>Tasks by Priority</h3>
          <div className={adminStyles.chartContent}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={tasksByPriority}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {tasksByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className={adminStyles.chartLegend}>
              {tasksByPriority.map((item, index) => (
                <div key={index} className={adminStyles.legendItem}>
                  <span
                    className={adminStyles.legendDot}
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span style={{ color: item.color }}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Task Progress */}
      <div className={adminStyles.analyticsChartCardFull}>
        <h3 className={adminStyles.chartTitle}>Weekly Task Progress</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyTaskProgress}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="week" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="completed"
              name="Completed"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pending"
              name="Pending"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Users Row */}
      <div className={adminStyles.analyticsChartsRow}>
        {/* Most Active Users */}
        <div className={adminStyles.analyticsChartCard}>
          <h3 className={adminStyles.chartTitle}>Most Active Users</h3>
          <div className={adminStyles.usersList}>
            {mostActiveUsers.map((user, index) => (
              <div key={user.id} className={adminStyles.userListItem}>
                <span className={adminStyles.userRank}>{index + 1}</span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className={adminStyles.userListAvatar}
                />
                <div className={adminStyles.userListInfo}>
                  <span className={adminStyles.userListName}>{user.name}</span>
                  <span className={adminStyles.userListMeta}>
                    {user.created} created · {user.completed} completed
                  </span>
                </div>
                <div className={adminStyles.userListScore}>
                  <span className={adminStyles.scoreValue}>
                    {user.completed}
                  </span>
                  <span className={adminStyles.scoreLabel}>completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users with Most Assignments */}
        <div className={adminStyles.analyticsChartCard}>
          <h3 className={adminStyles.chartTitle}>
            Users with Most Assignments
          </h3>
          <div className={adminStyles.usersList}>
            {usersWithMostAssignments.map((user, index) => (
              <div key={user.id} className={adminStyles.userListItem}>
                <span className={adminStyles.userRank}>{index + 1}</span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className={adminStyles.userListAvatar}
                />
                <div className={adminStyles.userListInfo}>
                  <span className={adminStyles.userListName}>{user.name}</span>
                  <div className={adminStyles.progressBarContainer}>
                    <div
                      className={adminStyles.progressBar}
                      style={{ width: `${(user.tasks / 15) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className={adminStyles.userListScore}>
                  <span className={adminStyles.maxTasks}>{user.tasks}</span>
                  <span className={adminStyles.scoreLabel}>tasks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects by Team Size */}
      <div className={adminStyles.analyticsChartCardFull}>
        <h3 className={adminStyles.chartTitle}>Projects by Team Size</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={projectsByTeamSize} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip />
            <Bar dataKey="members" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
