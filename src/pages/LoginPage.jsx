// src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { BsFillMortarboardFill } from "react-icons/bs";
import { API_URL, apiFetch } from "../api";
import "../Components/Auth.css";

const LoginPage = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await apiFetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        if (onAuthSuccess) onAuthSuccess(data.user);
        navigate("/tickets");
      } else {
        setErrorMessage(data?.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setErrorMessage("Network error. Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="auth-title">Sign In to Your Account</h1>
            <p className="auth-subtitle">Enter your academic credentials to manage your tickets</p>
          </div>

          {errorMessage && (
            <div className="auth-alert-error">
              <FiAlertCircle />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">
                University Email
              </label>
              <div className="auth-input-wrapper">
                <FiUser className="auth-field-icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="student@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <div className="auth-input-wrapper">
                <FiLock className="auth-field-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              <FiArrowRight className="auth-btn-icon" />
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="auth-switch-link">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;