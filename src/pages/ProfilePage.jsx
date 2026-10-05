// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMail, FiUser, FiShield } from "react-icons/fi";
import { BsFillMortarboardFill } from "react-icons/bs";
import { API_URL, apiFetch } from "../api";
import "../Components/Auth.css";

const ProfilePage = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(currentUser);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await apiFetch(`${API_URL}/profile`);
        const data = await response.json();
        if (response.ok && data.user) {
          setProfile(data.user);
        } else {
          setErrorMessage(data?.message || "Could not load profile");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setErrorMessage("Network error. Could not load profile.");
      }
    };

    loadProfile();
  }, []);

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  const display = profile || currentUser;

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-container">
        <Link to="/tickets" className="auth-back-nav">
          <FiArrowLeft className="auth-back-icon" />
          <span>Back to Help Desk</span>
        </Link>

        <div className="auth-card-box">
          <div className="auth-brand-header">
            <div className="auth-logo-badge">
              <BsFillMortarboardFill className="auth-logo-icon" />
            </div>
            <h1 className="auth-title">Your Profile</h1>
            <p className="auth-subtitle">Account details from the University IT portal</p>
          </div>

          {errorMessage && <p className="auth-error-message">{errorMessage}</p>}

          <div className="profile-details">
            <p className="profile-row">
              <FiUser />
              <span>
                <strong>Username:</strong> {display?.username || "—"}
              </span>
            </p>
            <p className="profile-row">
              <FiMail />
              <span>
                <strong>Email:</strong> {display?.email || "—"}
              </span>
            </p>
            <p className="profile-row">
              <FiShield />
              <span>
                <strong>Role:</strong> {display?.role || "user"}
              </span>
            </p>
          </div>

          <button type="button" className="auth-submit-btn" onClick={handleLogoutClick}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;