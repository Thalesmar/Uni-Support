// src/Components/Header.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsFillMortarboardFill } from "react-icons/bs";
import { HiOutlineTicket } from "react-icons/hi2";
import { IoSearchOutline, IoNotificationsOutline } from "react-icons/io5";
import { FiChevronDown, FiMenu, FiX, FiLogIn, FiUserPlus, FiHome, FiUser, FiLogOut } from "react-icons/fi";
import { useState } from "react";
import "./Styles.css";

const Header = ({ ticketsCount = 0, currentUser = null, onLogout = () => {} }) => {
  const [userDropdown, setUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const handleLogoutClick = () => {
    setUserDropdown(false);
    setMobileMenuOpen(false);
    onLogout();
    navigate("/login");
  };

  return (
    <>
      <header className="header-container">
        {/* Brand */}
        <Link to="/tickets" className="header-brand clickable">
          <div className="header-logo-container">
            <BsFillMortarboardFill className="header-logo" />
          </div>
          <div className="header-titles">
            <h1 className="header-heading">IT Support Desk</h1>
          </div>
          <div className="header-separator"></div>
          <p className="header-subheading">University IT Support Ticket Tracker</p>
        </Link>

        {/* Right side for desktop / tablets */}
        <div className="header-right-side">
          <Link to="/tickets" className="tickets-counter-pill">
            <HiOutlineTicket className="active-ticket-icon" />
            <span className="tickets-counter-text">
              <strong>{ticketsCount}</strong> active tickets
            </span>
          </Link>

          <button className="header-icon-btn" aria-label="Search tickets">
            <IoSearchOutline className="header-action-icon" />
          </button>

          <button className="header-icon-btn notification-btn" aria-label="Notifications">
            <IoNotificationsOutline className="header-action-icon" />
            <span className="notification-dot"></span>
          </button>

          {/* Quick Auth navigation */}
          <nav>
            {!currentUser ? (
              <div className="header-auth-buttons">
                <Link
                  to="/login"
                  className={`header-auth-btn ${currentPath === "/login" ? "active" : ""}`}
                >
                  <FiLogIn />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className={`header-auth-btn primary ${currentPath === "/register" ? "active" : ""}`}
                >
                  <FiUserPlus />
                  <span>Register</span>
                </Link>
              </div>
            ) : (
              <div className="header-user-wrapper">
                <button
                  className="header-user-section"
                  onClick={() => setUserDropdown((prev) => !prev)}
                >
                  <div className="user-profile">
                    <span>{currentUser?.username?.[0]?.toUpperCase() || "U"}</span>
                  </div>
                  <div className="user-info-column">
                    <span className="username">{currentUser?.username || "User"}</span>
                    <span className={`user-role ${currentUser?.role === "admin" ? "admin" : "user"}`}>
                      {currentUser?.role || "user"}
                    </span>
                  </div>
                  <FiChevronDown className={`user-chevron ${userDropdown ? "rotated" : ""}`} />
                </button>

                {userDropdown && (
                  <div className="more-user-options open">
                    <nav className="user-options">
                      <ul>
                        <li>
                          <Link to="/tickets" onClick={() => setUserDropdown(false)}>Ticket Desk</Link>
                        </li>
                        <li>
                          <Link to="/profile" onClick={() => setUserDropdown(false)}>Profile</Link>
                        </li>
                        <li className="logout-option" onClick={handleLogoutClick}>
                          Sign Out
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            )}
          </nav>

          <button
            className="hamburger-btn"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-nav-header">
              <div className="mobile-brand">
                <BsFillMortarboardFill className="mobile-logo" />
                <span className="mobile-title">IT Support Desk</span>
              </div>
              <button
                className="mobile-close-btn"
                aria-label="Close navigation menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiX />
              </button>
            </div>

            <nav id="mobile-navigation" className="mobile-nav-links">
              <Link
                to="/tickets"
                className={`mobile-nav-item ${currentPath === "/tickets" ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiHome className="mobile-nav-icon" />
                <span>Ticket Desk</span>
              </Link>

              {!currentUser ? (
                <>
                  <Link
                    to="/login"
                    className={`mobile-nav-item ${currentPath === "/login" ? "active" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiLogIn className="mobile-nav-icon" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className={`mobile-nav-item ${currentPath === "/register" ? "active" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUserPlus className="mobile-nav-icon" />
                    <span>Register</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className={`mobile-nav-item ${currentPath === "/profile" ? "active" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUser className="mobile-nav-icon" />
                    <span>Profile</span>
                  </Link>
                  <button className="mobile-nav-item logout-option" onClick={handleLogoutClick}>
                    <FiLogOut className="mobile-nav-icon" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;