// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Header";
import MainTicketContent from "./Components/MainContent";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./Components/protectedRoute";
import { useEffect, useState } from "react";
import { API_URL } from "./api";
import AdminRoute from "./pages/admin/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import "./App.css";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // Restore session when app loads
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await fetch(`${API_URL}/profile`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user) setCurrentUser(data.user);
        }
      } catch (err) {
        console.error("Could not restore session:", err);
      } finally {
        setIsInitializing(false);
      }
    };

    restoreSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setCurrentUser(null);
      setTickets([]);
    }
  };

  if (isInitializing) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header
        ticketsCount={tickets.length}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={<LoginPage onAuthSuccess={(user) => setCurrentUser(user)} />}
        />
        <Route path="/register" element={<SignupPage />} />

        {/* Protected User Routes */}
        <Route
          path="/tickets"
          element={
            <ProtectedRoute
              user={currentUser}
              fallback={<Navigate to="/login" replace />}
            >
              <MainTicketContent
                tickets={tickets}
                setTickets={setTickets}
                currentUser={currentUser}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              user={currentUser}
              fallback={<Navigate to="/login" replace />}
            >
              <ProfilePage currentUser={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Dedicated Admin Routes */}
        <Route element={<AdminRoute user={currentUser} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Default fallback route */}
        <Route path="*" element={<Navigate to="/tickets" replace />} />
      </Routes>
    </div>
  );
};

export default App;
