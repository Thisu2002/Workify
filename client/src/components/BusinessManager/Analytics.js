import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import "../../styles/Analytics.css";

const BusinessManagerAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("http://localhost:5000/manager/analytics");
        setAnalyticsData(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analyticsData) return <p>Loading analytics...</p>;

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  return (
    <div className="grid">
      {/* Users by role */}
      <div className="chart-card">
        <h3>Users by Role</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData.users}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#1E3A8A" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Company registrations over time */}
      <div className="chart-card">
        <h3>Company Registrations Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.companies.map(d => ({ month: monthLabels[d._id - 1], count: d.count }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="count" stroke="#10B981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Subscription Plan Usage */}
      <div className="chart-card">
        <h3>Subscription Plans (Active Companies)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie dataKey="companies" nameKey="_id" data={analyticsData.plans} cx="50%" cy="50%" outerRadius={100} label>
              {analyticsData.plans.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={["#1E3A8A", "#10B981", "#F59E0B", "#EF4444"][i % 4]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Job Posts Trend */}
      <div className="chart-card">
        <h3>Job Posts Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.jobs.map(d => ({ month: monthLabels[d._id - 1], jobs: d.jobsPosted }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="jobs" stroke="#3B82F6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Mentor Verification Trends */}
      <div className="chart-card">
        <h3>Mentor Verifications</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData.mentorVerifications.map(d => ({
            month: monthLabels[d._id - 1],
            accepted: d.accepted,
            pending: d.pending
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="accepted" fill="#10B981" />
            <Bar dataKey="pending" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Registration Requests */}
      <div className="chart-card">
        <h3>Company Registration Requests</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.registrationRequests.map(d => ({
            month: monthLabels[d._id - 1],
            total: d.total,
            accepted: d.accepted
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="total" stroke="#1E3A8A" />
            <Line dataKey="accepted" stroke="#10B981" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BusinessManagerAnalytics;
