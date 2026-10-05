// src/pages/SignupPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiShield, FiArrowRight, FiArrowLeft, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { BsFillMortarboardFill } from "react-icons/bs";
import { API_URL, apiFetch } from "../api";
import "../Components/Auth.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    agreeTerms: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setErrorMessage(data?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Register request failed:", err);
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
            <h1 className="auth-title">Create an Account</h1>
            <p className="auth-subtitle">Join the University IT portal to submit and track requests</p>
          </div>

          {errorMessage && (
            <div className="auth-alert-error">
              <FiAlertCircle />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert-success">
              <FiCheckCircle />
              <span>{successMessage}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="username">Username</label>
              <div className="auth-input-wrapper">
                <FiUser className="auth-field-icon" />
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="e.g. jdoe24"
                  value={formData.username}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">University Email Address</label>
              <div className="auth-input-wrapper">
                <FiMail className="auth-field-icon" />
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
              <label className="auth-label" htmlFor="password">Password</label>
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

            <div className="auth-field">
              <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="auth-input-wrapper">
                <FiShield className="auth-field-icon" />
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="auth-options">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="auth-checkbox"
                  required
                />
                <span>I agree to the terms</span>
              </label>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              <span>{loading ? "Creating Account..." : "Register Account"}</span>
              <FiArrowRight className="auth-btn-icon" />
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-switch-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;