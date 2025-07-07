import React from "react";
import "../styles/Recruiter.css";

const stats = [
  {
    label: "ACTIVE JOBS",
    value: 15,
    sub: "+5 This Month",
    icon: "📋",
  },
  {
    label: "Applicants",
    value: 90,
    sub: "+30 This Month",
    icon: "👥",
  },
  {
    label: "Interviews",
    value: 12,
    sub: "Scheduled This Week",
    icon: "⏰",
  },
];

const RecruiterDashboard = () => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <img src="/logo192.png" alt="Workify Logo" />
          <h2>WORKIFY</h2>
        </div>
      </aside>
      <main className="main-content">
        <header className="dashboard-header">
          <div className="profile-section">
            <img
              className="profile-pic"
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Profile"
            />
            <div>
              <h1>
                Welcome <span className="highlight">Alex!</span>
              </h1>
              <p>HR Manager, WSO2</p>
            </div>
          </div>
          <div className="stats-cards">
            {stats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-sub">{stat.sub}</div>
              </div>
            ))}
          </div>
        </header>
        <section className="dashboard-gradient"></section>
      </main>
    </div>
  );
};

export default RecruiterDashboard;