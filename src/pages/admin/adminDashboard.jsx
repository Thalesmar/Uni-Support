// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { API_URL } from "../../api.js";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch(`${API_URL}/admin/stats`, { credentials: "include" }),
          fetch(`${API_URL}/admin/users`, { credentials: "include" }),
        ]);

        if (statsRes.ok && usersRes.ok) {
          const statsData = await statsRes.json();
          const usersData = await usersRes.json();
          setStats(statsData.stats);
          setUsers(usersData.users);
        }
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading)
    return <div className="loading-screen">Loading Admin Panel...</div>;

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Management Panel</h1>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">Total Users: {stats.totalUsers}</div>
          <div className="stat-card">Total Tickets: {stats.totalTickets}</div>
          <div className="stat-card">Open Tickets: {stats.openTickets}</div>
          <div className="stat-card">Resolved: {stats.resolvedTickets}</div>
        </div>
      )}

      <h2>User Directory</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
